const { where } = require('sequelize');
const Qutils = require('../../models/queries/Qutils')
const tk = require('./../../services/utilService')
const { v4: uuidv4 } = require('uuid');
module.exports = class FrmsUtils {
  #parametros
  #qUtils
  #uService
  #results
  #dataSession
  constructor() {
    if (FrmsUtils.instance) return FrmsUtils.instance
    this.#qUtils = new Qutils()
    this.#uService = tk
    this.#results = null
    this.#dataSession = null

    FrmsUtils.instance = this
  }
  #getDataSession() {
    return this.#dataSession
  }
  #setDataSession(data) {
    this.#dataSession = data
  }
  setParametros(parametrosJson) {
    this.#parametros = parametrosJson
  }
  //entrga de datos segun parametros por peticion de modelo
  getDataParams = async (dto) => {
    //try {
    const datos = this.#uService.getCnfApp(dto.token)
    console.log('data cnf............', datos)
    this.#setDataSession(datos)

    //this.#qUtils.setTableInstance('ae_institucion')
    //const institucion = await this.#qUtils.findID(datos.inst)
    //const tipo_institucion = institucion.tipo_institucion_id
    const idxLogin = datos.inst

    let idx = null
    if (dto.idx) idx = dto.idx
    else idx = datos.inst

    const modelos = dto.modelos //['institucion', dto.modelo, 'propietario', 'servicios_basicos', 'atencion', 'superficie', 'estructura', 'infraestructuran', 'mobiliarion', 'equipamienton', 'personaln']
    //datos identificacions
    const datosResult = {}

    for (let i = 0; i < modelos.length; i++) {
      console.log('modelo::::::::', i, '--->', modelos[i])
      const modelo = modelos[i]

      if (this.#parametros[modelo].cardinalidad == '1') {
        datosResult[this.#parametros[modelo].alias] = await this.#getDataparam1(modelo, idx)
        //console.log("cardinadlidad 111:::::::::", datosResult[this.#parametros[modelo].alias])
      } else {
        //>-- FIN CARDINALIDAD ==1
        //cardinalidad n
        datosResult[this.#parametros[modelo].alias] = await this.#getDataParamN(modelo, idx)
        //console.log("PASONNN*****",datosResult[this.#parametros[modelo].alias])
      }
    }

    this.#results = datosResult
    /* return {
                ok: true,
                data: datosResult,
                //institucion: institucion,
                message: 'Resultado exitoso. Parametros obtenidos'
            }

            //realiza consulta
        } catch (error) {
            console.log(error)
            return {
                ok: false,
                message: "Error de sistema: OBJFRMUTILS",
                error: error.message
            }
        };*/
  }
  #getDataParamN = async (nameModeloFromParam, idx) => {
    //tabla de datos
    const objModel = this.#parametros[nameModeloFromParam]
    //CONSTRUYE SENTENCIA SELECT
    console.log(
      '*****************************************::::::::::::::',
      objModel.referer.length
    )
    let campos = objModel.campos
    let from = objModel.table
    let where = objModel.key.length>0 ? `${objModel.key[0]} = '${idx}'` : '1=1 '
    
    let leftjoin = ''
    for (let i = 0; i < objModel.referer.length; i++) {
      console.log(i)
      if (objModel.referer[i].tabla) {
        leftjoin = `${leftjoin} ,
                     ${objModel.referer[i].tabla}`
      } else {
        campos = ` ${campos} , ${objModel.referer[i].campos}`
        leftjoin = `${leftjoin} LEFT JOIN ${objModel.referer[i].ref} ON (${objModel.referer[i].camporef} = ${objModel.referer[i].camporefForeign})`
      }
    }
    
    if (objModel.precondicion && objModel.precondicion.length) {
      for (let i = 0; i < objModel.precondicion.length; i++)
        where = `${where} AND ${objModel.precondicion[i]}`
    }
    
    const query = `SELECT ${campos} FROM ${from} ${leftjoin} WHERE ${where}`

    
    this.#qUtils.setQuery(query)
    await this.#qUtils.excuteSelect()
    const result = this.#qUtils.getResults()

    return {
      campos: objModel.camposView,
      valores: result,
      linked: objModel.linked,
    }
  }
  #getDataparam1 = async (nameModeloFromParam, idx) => {
    this.#qUtils.setResetVars()
    //try {
    //tabla de datos
    const objModel = this.#parametros[nameModeloFromParam]
    let parametros = {}
    parametros.campos = Object.assign({}, objModel.campos)
    //pregunta si se trata de un modelo dual de datos
    let result = {}

    this.#qUtils.setTableInstance(objModel.table)
    if (objModel.included) {
      //obtiene datos con tabla incluida
      this.#qUtils.setWhere({ [objModel.key]: idx })
      this.#qUtils.setInclude({
        association: objModel.included.ref,
        attributes: objModel.included.campos,
        where: objModel.included.condicion
      })
      await this.#qUtils.findUnique()

    } else await this.#qUtils.findID(idx)
    const aux = this.#qUtils.getResults()
    if (aux) result = aux

    parametros.valores = result
    parametros.exito = Object.keys(parametros.valores).length ? true : false

    console.log('\n\n **** OBTENIENDO MOREdATA A VALORES')
    //OBTENIENDO MOREDATA SI EXISTE
    parametros = await this.#getMoreDataParam(parametros, objModel.moreData, idx)

    console.log(
      '**************************ENTRANDO A REFERERE *****************************'
    )
    //obtiene referencias PARA LOS COMBOS Y OTROS
    parametros = await this.#getDataparamReferer(parametros, objModel.referer)
    console.log(
      '**************************SALIENDO A REFERERE *****************************'
    )
    //complementa referencia si existe el campo ilogic que contiene querys textuales q solo funcionan con el id instutucion logueado
    if (objModel.ilogic) {
      for (const key in objModel.ilogic) {
        console.log('!!!!!!!!!!!!EXISTE ILOGIC!!!!!!! llave:', key)
        const queryIlogic = objModel.ilogic[key] //objModel.ilogic[key].replaceAll('idxLogin', idxLogin)
        console.log('************** almacen ilogic', parametros.valores[key])
        const tempo = parametros.valores[key]
        this.#qUtils.setQuery(queryIlogic)
        await this.#qUtils.excuteSelect() //await sequelize.query(queryIlogic, { mapToModel: true, type: QueryTypes.SELECT, raw: false, });
        const result = this.#qUtils.getResults()
        parametros.valores[key] = {
          selected: this.#qUtils.searchSelectedInDataComboBox(result, {
            value: tempo,
          }),
          items: result,
          dependency: false,
        }
      }
    }
    console.log(
      'finnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn',
      nameModeloFromParam
    )
    //datosResult[PARAMETROS[modelo].alias] = verificaParamEdicion(parametros, tipo_institucion, original[modelo].campos, dto.noverify)
    return parametros
    /*} catch (error) {
            console.log(error)
            return 0/0
        }*/
  }

  #getDataparamReferer = async (parametros, referer) => {
    //obtiene referencias PARA LOS COMBOS Y OTROS

    for (const element of referer) {
      this.#qUtils.setResetVars()
      const tablaRef = element.ref
      const apropiacion = element.apropiacion
      const multiple = element.multiple
      const campos = this.#qUtils.transAttribByComboBox(element.campos)
      const condicion = element.condicion ? element.condicion : {}
      const condicional = element.condicional
        ? this.#getCondicionalTransform(element.condicional)
        : {}
      const where = Object.assign(condicion, condicional)
      const aux = parametros.valores[apropiacion]

      //instanciando utilidades
      this.#qUtils.setTableInstance(tablaRef)
      this.#qUtils.setAttributes(campos)
      this.#qUtils.setWhere(where)
      this.#qUtils.setOrder([element.campos[element.campos.length - 1]])
      await this.#qUtils.findTune()
      const selected = multiple
        ? this.#qUtils.searchSelectedForMultipleComboBox(aux)
        : this.#qUtils.searchSelectedForComboBox({ value: aux })
      parametros.valores[apropiacion] = {
        s01: { value: aux },
        selected: selected,
        items: this.#qUtils.getResults(),
        dependency: false,
      }

      //let dependency = false
      //element.linked
    } //fin for referer
    this.#qUtils.setResetVars()
    return parametros
  }

  #getMoreDataParam = async (parametros, moreData, idx) => {
    //sete de variables
    this.#qUtils.setResetVars()
    for (const element of moreData) {
      const tablaRef = element.ref
      const apropiacion = element.apropiacion
      const campos = this.#qUtils.transAttribByComboBox(element.campos)
      const condicion = element.condicion ? element.condicion : {}
      const condicional = element.condicional
        ? this.#getCondicionalTransform(element.condicional)
        : {}
      let where = Object.assign(condicion, condicional)
      where = element.campoForeign
        ? { ...where, [element.campoForeign]: idx }
        : where

      //instanciando utilidades
      this.#qUtils.setTableInstance(tablaRef)
      this.#qUtils.setAttributes(campos)
      this.#qUtils.setWhere(where)
      await this.#qUtils.findTune()
      const items = this.#qUtils.getResults()
      parametros.valores[apropiacion] = items
      this.#qUtils.setResetVars()
    } //fin bucle moredata

    return parametros
  }

  getResults() {
    console.log('results:', this.#results)
    return this.#results
  }
  makerDataComboDependency = async (dto) => {
    const datos = this.#uService.getCnfApp(dto.token)
    this.#setDataSession(datos)

console.log("\n *************************** \n\n modelo:", dto.modelo, "-----------" ,this.#parametros)

    const objParamModel = this.#parametros[dto.modelo]
    const dataIn = dto.data
    let parametros = {}
    parametros.campos = objParamModel.campos
    parametros.valores = {}

    //recorre referer
    this.#qUtils.setResetVars()
    let selected = dataIn
      ? { value: Object.values(dataIn)[0] }
      : { value: null }
    //console.log("..............", selected)

    for (const referer of objParamModel.referer) {
      //instancia campos
      this.#qUtils.setTableInstance(referer.ref)
      this.#qUtils.setAttributes(
        this.#qUtils.transAttribByComboBox(referer.campos)
      )
      let where = {}
      if (referer.condicion) {
        where = { ...where, ...referer.condicion }
      }
      if (referer.condicional) {
        where = {
          ...where,
          ...this.#getCondicionalTransform(referer.condicional),
        }
      }
      if (referer.campoForeign) {
        where = { ...where, [referer.campoForeign]: selected.value }
      }

      this.#qUtils.setWhere(where)
      this.#qUtils.setOrder([referer.campos[1]])
      await this.#qUtils.findTune()
      selected = this.#qUtils.searchSelectedForComboBox({
        value: dataIn ? dataIn[referer.apropiacion] : null,
      })

      parametros.valores[referer.apropiacion] = {
        items: this.#qUtils.getResults(),
        selected: selected,
      }
      this.#qUtils.setResetVars()
    } //fin for referer

    this.#results = parametros // {[objParamModel.alias]:parametros}
  }

  #replaceStringByDataSession(stringSepararedByComa) {
    const vars = ['$app', '$inst', '$dni', '$usr']
    const d = this.#getDataSession()
    const equi = [d.app, d.inst, d.dni, d.usr]
    for (let i = 0; i < vars.length; i++) {
      stringSepararedByComa = stringSepararedByComa.replaceAll(vars[i], equi[i])
    }

    return stringSepararedByComa
  }
  #seteaObjWithDataSession() {
    const obj = {}
    obj.institucion_id = this.#dataSession.inst
    obj.dni_register = this.#dataSession.dni
    obj.aplicacion_id = this.#dataSession.app
    obj.create_date = new Date()
    return obj
  }
  #getCondicionalTransform(condicional = Array) {
    let result = {}
    for (let i = 0; i < condicional.length; i++) {
      const aux = this.#replaceStringByDataSession(condicional[i]).split(',')
      result = { ...result, [aux[0]]: aux[1] }
    }
    return result
  }

  //************************* GUARDADO */
  saveDataParams = async (dto) => {
    await this.#qUtils.startTransaction()
    try {

      this.#setDataSession(this.#uService.getCnfApp(dto.token))
      const modelos = dto.modelos
      const datos = dto.data
      const complemento = dto.complementos ? dto.complementos : {}

      this.#qUtils.setResetVars()

      for (const modelo of modelos) {
        const objModel = this.#parametros[modelo]

        const data = datos[objModel.alias]
        const idx_aux = objModel.key
        let obj = {}
        //setea objeto sql
        this.#qUtils.setTableInstance(objModel.table)
        if (dto.idx && dto.idx !='-1') {
                    
          //ES EDICION
          obj = Object.assign(data, this.#seteaObjWithDataSession(), complemento)
          delete obj.create_date
          obj[idx_aux] = dto.idx
          obj.last_modify_date_time = new Date()
          const wheres = { [idx_aux]: dto.idx }
          
          this.#qUtils.setDataset(obj)
          this.#qUtils.setWhere(wheres)
          await this.#qUtils.modify()
        } else {
          //es INSERCION
          obj = Array.isArray(data) ? data : Object.assign(data, this.#seteaObjWithDataSession(), complemento)

          //sitiene parametros en included 
          if (objModel.included) {
            if (Array.isArray(obj)) {
              //es un caso de autoreflexiva
              let temp = '-1'
              obj = obj.map((o, ii) => {

                o[idx_aux] = uuidv4()
                if (ii == 0) {
                  o[objModel.keyRoot] = temp
                  temp = o[idx_aux]
                } else o[objModel.keyRoot] = temp

                const objAux = Object.assign(o, this.#seteaObjWithDataSession(), complemento)
                if (objAux[objModel.included.ref])
                  objAux[objModel.included.ref] = objAux[objModel.included.ref].map(oo => (Object.assign(oo, complemento, { [idx_aux]: o[idx_aux], [objModel.included.key]: uuidv4() }, this.#seteaObjWithDataSession())))
                else objAux[objModel.included.ref] = []
                return objAux
              })

              this.#qUtils.setDataset(obj)

            } else {
              obj[idx_aux] = uuidv4()
              obj[objModel.included.ref] = obj[objModel.included.ref].map(o => (Object.assign(o, complemento, { [idx_aux]: obj[idx_aux], [objModel.included.key]: uuidv4() }, this.#seteaObjWithDataSession())))
              this.#qUtils.setDataset([obj])
            }
            this.#qUtils.setInclude(objModel.included.ref)
          } else {
            if (Array.isArray(obj)) {
              
              obj = obj.map(oo => {                
                let aux= Object.assign(complemento, this.#seteaObjWithDataSession())
                return {...aux, ...oo}
              })
              
              this.#qUtils.setDataset(obj)
            } else {
              //insercion normal
              obj[idx_aux] = uuidv4()
              this.#qUtils.setDataset([obj])
            }

          }
          //await this.#qUtils.create()
          await this.#qUtils.createwLote()
        }
        //recorre moreData

        for (const more_data of objModel.moreData) {
          this.#qUtils.setResetVars()
          this.#qUtils.setTableInstance(more_data.ref)
          obj.create_date = new Date()
          const setData = data[more_data.apropiacion].map(dato => ({ ...obj, [more_data.apropiacion]: dato }))
          this.#qUtils.setDataset(setData)

          await this.#qUtils.createwLote()
          delete obj.create_date

          if (dto.idx) {
            obj.last_modify_date_time = new Date()
            const opciones = data[more_data.apropiacion]
            delete obj[more_data.apropiacion]
            const wheres = { [idx_aux]: dto.idx }

            //incativa los q no estan
            this.#qUtils.setOpSelect('notin')
            this.#qUtils.setOpOptions(opciones)
            wheres[more_data.apropiacion] = this.#qUtils.getOpOptions()
            console.log("\n\n\n wl where es:", wheres)
            obj.activo = 'N'
            this.#qUtils.setWhere(wheres)
            this.#qUtils.setDataset(obj)
            await this.#qUtils.modify()

            this.#qUtils.setOpOptionsReset()
            this.#qUtils.setOpSelect('in')
            this.#qUtils.setOpOptions(opciones)
            wheres[more_data.apropiacion] = this.#qUtils.getOpOptions()
            obj.activo = 'Y'
            console.log("\n\n\n wl where es 2:", wheres)
            this.#qUtils.setWhere(wheres)
            this.#qUtils.setDataset(obj)
            await this.#qUtils.modify()

          }//fin if IDX         
        }//fin for more_data
        this.#qUtils.setResetVars()
      }//fin for modelos


      this.#results = true

      await this.#qUtils.commitTransaction()
    } catch (error) {
      console.log(error)
      await this.#qUtils.rollbackTransaction()

      this.#results = false
    }
  }
}
