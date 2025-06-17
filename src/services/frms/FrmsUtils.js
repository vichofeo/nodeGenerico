const Qutils = require('../../utils/queries/Qutils')
//const tk = require('./../../services/utilService')
const handleToken =  require('./../../utils/handleToken')
const { v4: uuidv4 } = require('uuid');

module.exports = class FrmsUtils {
  #parametros
  #qUtils
  #uService
  #results
  #dataSession
  #_token
  #_groupIdsInstitucion
  constructor() {
    if (FrmsUtils.instance) return FrmsUtils.instance
    this.#qUtils = new Qutils()
    this.#uService = handleToken
    this.#results = null
    this.#dataSession = null
    this.#_token =  null
    this.#_groupIdsInstitucion= null

    FrmsUtils.instance = this
  }
  #getDataSession() {
    return this.#dataSession
  }
  setToken(token){
    this.#_token = token
  }
  #_getToken(){
    return this.#_token
  }
  #setDataSession(data) {
    this.#dataSession = data
  }
  setParametros(parametrosJson) {
    this.#parametros = parametrosJson
  }
  setGroupIdsInstitucion(groupIdsInstitucion=Array()){
    this.#_groupIdsInstitucion =  groupIdsInstitucion
  }
  //entrga de datos segun parametros por peticion de modelo
  getDataParams = async (dto) => {
    //try {
      this.setToken(dto.token)
    this.#setDataSession(this.#uService.filterHeaderTokenVerify(this.#_getToken()))
    const datos = this.#seteaObjWithDataSession()
    
    console.log('\n\ndata cnf............::', datos, "\n\n")
    
     
    //const tipo_institucion = institucion.tipo_institucion_id
    const idxLogin = datos.institucion_id

    let idx = null
    if (dto.idx) idx = dto.idx
    else idx = datos.institucion_id

    const modelos = dto.modelos //['institucion', dto.modelo, 'propietario', 'servicios_basicos', 'atencion', 'superficie', 'estructura', 'infraestructuran', 'mobiliarion', 'equipamienton', 'personaln']
    console.log('\n\nMODELOS............::', modelos, "\n\n")
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
        datosResult[this.#parametros[modelo].alias] = await this.#getDataParamN(modelo, idx, dto)
        //console.log("PASONNN*****",datosResult[this.#parametros[modelo].alias])
      }
    }

    this.#results = datosResult
    
  }
  async getKeySessionConditionLiteral(objModel, idx){
    return await this.#analizaKeyWhere(objModel, idx)
  }

  #analizaKeyWhere =  async (objModel, idx)=>{
    console.log("\n\n\n ************************ KEY::", objModel?.key ," ************************\n\n\n")
    let where = '1=1'
    if(objModel?.key?.length>0)
        where = `${objModel.key[0]} = '${idx}'`

    if(objModel.keySession){
      if(objModel.keySession.replaceKey) where = '1=1'
      //obtiene ids de instituciones
      
      const ids =  await  this.getGroupIdsInstitucion()
      if(ids.length>0) where += ` AND ${objModel.keySession.campo} IN ('${ids.join("','")}') `
    }
    return where
  }

  #getDataParamN = async (nameModeloFromParam, idx, dto) => {
    //tabla de datos
    const objModel = this.#parametros[nameModeloFromParam]
    //CONSTRUYE SENTENCIA SELECT
    console.log('\n\n\n*****************************************::::::::::::::DTO', dto)
    
    let campos = objModel.campos
    let from = objModel.table
    //let where = objModel.key.length > 0 ? `${objModel.key[0]} = '${idx}'` : '1=1 '
    let where = await this.#analizaKeyWhere(objModel, idx)
    console.log('\n\n\n::::::::::::::WHEREkeY', where)
    let groupOrder =  objModel.groupOrder ? objModel.groupOrder : '' 

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

    let query = `SELECT ${campos} FROM ${from} ${leftjoin} WHERE ${where} ${groupOrder}`

    //reemplaza query con variables de session si lo ubiera
    query =  this.#replaceStringByDataSession(query)
    query =  await this.#replaceStingByDataRoleSession(query)
    query =  this.#replaceStringByDataParamDoms(dto, objModel ,query)
    query =  this.#replaceTagWithPDomOrDtoValues(dto, objModel, query)
    query = query.replaceAll('$idx',idx)

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
    console.log("\n\n P1: ",nameModeloFromParam)
    this.#qUtils.setResetVars()
    //try {
    //tabla de datos
    const objModel = this.#parametros[nameModeloFromParam]
    let parametros = {}
    parametros.campos = Object.assign({}, objModel.campos)
    //pregunta si se trata de un modelo dual de datos
    let result = {}

    this.#qUtils.setTableInstance(objModel.table)
    //RUTINA  para datos asociados segun SEQUELIZE desdeorden de parametros
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
    parametros.exito = Object.keys(parametros.valores).length ? true : false //flag: exito si es datos edicion

    if(!parametros.exito){
      for (const key in parametros.campos) {
        parametros.valores[key] = ""
      }
    }

    console.log('\n\n P3: **** OBTENIENDO MOREdATA A VALORES')
    //OBTENIENDO MOREDATA SI EXISTE
    parametros = await this.#getMoreDataParam(parametros, objModel.moreData, idx)

    console.log(
      '\n\n P4: ************************ENTRANDO A REFERERE ***************************** \n' 
    )
    //obtiene referencias PARA LOS COMBOS Y OTROS
    parametros = await this.#getDataparamReferer(parametros, objModel.referer)
    console.log(
      '\n\n P5: **************************SALIENDO A REFERERE *****************************', 
    )
    //complementa referencia si existe el campo ilogic que contiene querys textuales q solo funcionan con el id instutucion logueado
    if (objModel.ilogic) {
      console.log('\n\n P6: !!!!!!!!!!!!EXISTE ILOGIC PRINCIPAL ****** ')
      for (const key in objModel.ilogic) {
        //reenplaz variables por valores de sesion o ya encontrados en valores y con la llve key de la raiz
        let queryIlogic = objModel.ilogic[key].replaceAll('$'+objModel.key[0], parametros.valores[objModel.key[0]])    
        //reemplaz variable idx con la variable proporcionada
        queryIlogic = queryIlogic.replaceAll('$idx',idx)    
        queryIlogic=  this.#replaceStringByDataSession(queryIlogic)
        //queryIlogic= this.#replaceStringForQIlogic(queryIlogic, parametros.valores)

        
        console.log('************** almacen ilogic', parametros.valores[key])
        const tempo = parametros.valores[key]
        this.#qUtils.setQuery(queryIlogic)
        await this.#qUtils.excuteSelect() //await sequelize.query(queryIlogic, { mapToModel: true, type: QueryTypes.SELECT, raw: false, });
        const result = this.#qUtils.getResults()
        parametros.valores[key] = {
          selected: (parametros.campos[key] &&  parametros.campos[key][6] &&  parametros.campos[key][6] =='M') ? 
                    this.#qUtils.searchSelectedInMultipleComboBox(result, parametros.exito ? tempo:[])          
                    :this.#qUtils.searchSelectedInDataComboBox(result, {value: tempo}),
                    
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
      const multiple = (parametros.campos[apropiacion] &&  parametros.campos[apropiacion][6] &&  parametros.campos[apropiacion][6] =='M') ? true:false //element.multiple
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
    //console.log('results:', this.#results)
    return this.#results
  }
  /**
   * metodo para obtener informacion de para comboDependencias
   * @param {*} dto 
   */
  makerDataComboDependency = async (dto) => {
    this.setToken(dto.token)
    
    this.#setDataSession(this.#uService.filterHeaderTokenVerify(this.#_getToken()))
    const datos = this.#seteaObjWithDataSession()

    console.log("\n *************COMBODEPENDENCY************** \n\n modelo:", dto.modelo, "-----------")

    const objParamModel = this.#parametros[dto.modelo]
    //console.log("\n *************************** ----------- OBJETO SELECT", objParamModel)
    const dataIn = dto.data
    let parametros = {}
    parametros.campos = objParamModel.campos
    parametros.valores = {}

    //recorre referer
    this.#qUtils.setResetVars()
    //let selected = dataIn ? { value: Object.values(dataIn)[0] } : { value: null }
    let selected = dataIn ? { value: dataIn[Object.keys(parametros.campos)[0]] } : { value: null }
    console.log("\n\n..............PRIMER SELECTED", selected, "///\n \n ")

    for (const referer of objParamModel.referer) {
      console.log("\n\n..............CON REFERER!!!!\n\n")
      //instancia campos
      this.#qUtils.setTableInstance(referer.ref)

      //atributos de seleccion forma {value, text} 
      const camposAux= JSON.parse(JSON.stringify(referer.campos))
      camposAux[1] = this.#qUtils.literal(camposAux[1])
      console.log("campos:::", camposAux)
      this.#qUtils.setAttributes(this.#qUtils.transAttribByComboBox(camposAux))
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

      referer.included ? this.#qUtils.setInclude(referer.included) : ''
      this.#qUtils.setWhere(where)
      //this.#qUtils.setOrder([referer.campos[1]])
      this.#qUtils.setOrder([camposAux[1]])
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

    //procesa si existe primal  Un solo query para combodependencia
    /**
     * ===================== SECCION DE QUERYS PRIMAL, UN SOLO QUERY PAARA TODOS LOS COMBOS =====================
     *                        **********************************************************
     */
    let CONDITION_PRIMAL = ""
    const swhere =  '$w$'
    if(objParamModel.primal){
      console.log("\n\n..............ENTRANDO A PRIMAL!!!!!///\n \n ")
      const sattrib = '$a$'
      const sAttribStatic = '$sa$'
      
      let queryPrimal = objParamModel.primal.query
      const equivalencia =  objParamModel.primal.equivalencia
      let primalCondition = []
      let pWhere=""
      //aplica mismo query a todos los campos declarado en equivalencia
      //for (const campo in objParamModel.campos) {
      for(const campo in equivalencia){

        //pregunta si existe la posicion 6 para combomultiple
        //const tempo = dataIn ? dataIn[campo] : {} 
        let swMultipleBoxLocal = (parametros.campos[campo] && parametros.campos[campo][6]) ? true: false
        let swWithInitialLocal = (parametros.campos[campo] && parametros.campos[campo][7]) ? false: true
        let tempo = dataIn[campo] ? dataIn[campo] : swMultipleBoxLocal?[]:'-1'//{}
        let tempSelectedIn = tempo
        if(swMultipleBoxLocal && Array.isArray(tempo)) tempo =  tempo.map(val=>({value:val}))
        
        
        const reemplazaAtributos = () =>{
            let query = ""
            if(queryPrimal.includes(sattrib)){
              let cadena=  `${equivalencia[campo][0]} as value, ${equivalencia[campo][1]} as text`
              query = queryPrimal.replaceAll(sattrib, cadena)
            }else if(queryPrimal.includes(sAttribStatic)){
              let cadena = ""
              if(swMultipleBoxLocal) cadena = ` UNNEST(ARRAY['${tempSelectedIn.join("', '")}']) as value`
              else cadena = ` '${tempSelectedIn}' as value`
              query = queryPrimal.replaceAll(sAttribStatic, cadena)
            }
            return query
          } 
        //const attributes = `${equivalencia[campo][0]} as value, ${equivalencia[campo][1]} as text` 
        //let query = queryPrimal.replaceAll(sattrib, attributes)
        let query = reemplazaAtributos()
        query = query.replaceAll(swhere, pWhere)
        //remplaza con variables de Entrada ej: $nameCampo
        query = query.replaceAll('$campoForeign', selected.value)                
        //reemplza variables de sesion enel query: $inst, $dni, etc
        query= this.#replaceStringByDataSession(query)
        //reeeplaza $keyseesion id de eess
        query = await this.#replaceKeysSessionInQILogic(query, objParamModel, '-1')


        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
        console.log("selectedINN:",tempSelectedIn)
        console.log("selected:",selected)
        console.log("DataIn:",dataIn),
        console.log("Keys Campos:",campo),
        console.log("Es Multiple:",swMultipleBoxLocal)
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")

        //ejecuta query
        this.#qUtils.setQuery(query)
        await this.#qUtils.excuteSelect()
        let result = this.#qUtils.getResults()
        if(result.length>0 &&  objParamModel.withInitial && swWithInitialLocal) result.unshift(this.#qUtils.getInitialOpCbox())
        
        //selected = this.#qUtils.searchSelectedInDataComboBox(result,{ value: tempo })
        selected = swMultipleBoxLocal ? 
                    this.#qUtils.searchSelectedInMultipleComboBox(result, tempo, swMultipleBoxLocal)          
                    :this.#qUtils.searchSelectedInDataComboBox(result, {value: tempo})
//**************************************************************************************************** */                    
        //construye condicion para la siguiente iteracion solo si es distinto de -1
        if( !swMultipleBoxLocal ){
          //console.log("\n\n PRIMAL NO multipleeee(", campo ,":", tempSelectedIn ,") SELECTED::",selected,"\n\n")
          if(selected.value != '-1'){
            primalCondition.push(`${equivalencia[campo][0]}='${selected.value}'`)
            pWhere = 'AND ' + primalCondition.join(' AND ') 
          }          
        }else{
          //console.log("\n************************campo:", campo,":",tempSelectedIn,"******************************\n PRIMAL MULTIPLE tempo:\n",tempo," SELECTED::\n",selected,"\n\n")
          //opciones para comboMultiple
          if(Array.isArray(selected) && selected.length>0){
            const idsMultiple = selected.map( obj=>obj.value)
            if( !idsMultiple.includes('-1')){
              primalCondition.push(`${equivalencia[campo][0]} IN ('${idsMultiple.join("', '")}')`)
              pWhere = 'AND ' + primalCondition.join(' AND ') 
            }
              
          }
        }
       
        //vacias datos
        parametros.valores[campo] = {
          selected: selected,
          items: result,          
        }

      }
      CONDITION_PRIMAL = pWhere
      //*****************VERIFICA SI SE TRATA DE DEVOLVER  DATOS PARA DATATABLE*/
      let sw_data_table=0
      if(objParamModel.primal.attributes && Array.isArray(objParamModel.primal.headers) && objParamModel.primal.headers.length>0){
        sw_data_table = 1
        //existe orden para sacara datos para table data
        let query = queryPrimal.replaceAll(swhere, CONDITION_PRIMAL)
        query = query.replaceAll(sattrib, objParamModel.primal.attributes)
        query = query.replaceAll(sAttribStatic, objParamModel.primal.attributes)
        //reemplza variables de sesion enel query: $inst, $dni, etc
        query= this.#replaceStringByDataSession(query)
        //remplaza con variables de Entrada ej: $nameCampo
        query = query.replaceAll('$campoForeign', selected.value)
        //reeeplaza $keyseesion id de eess
        query = await this.#replaceKeysSessionInQILogic(query, objParamModel, '-1')
        

        //ejecuta query
        this.#qUtils.setQuery(query)
        await this.#qUtils.excuteSelect()
        let result = this.#qUtils.getResults()        
        parametros.dataTable={items:result, headers:objParamModel.primal.headers}
      }
      //solo devuelve headers si existe
      if(Array.isArray(objParamModel.primal.headers) && objParamModel.primal.headers.length>0 && sw_data_table<=0) 
        parametros.headers=objParamModel.primal.headers
    }
    // ------------------------- 0 FIN PRIMAL 0------------------
    /**
     * -------------------- SECCION DE QUERIS ILOGICOS Q NO SIGUEN UN PATRON -------------------------
     *                      ***********************************************
     */
    if (objParamModel.ilogic) {
      let condicionMultiple=""
      for (const key in objParamModel.ilogic) {
        console.log('\n!!!!!!!!!!!!EXISTE  CBOXDEPENDENCY ILOGIC::!!!!!!! llave:', key,'\n\n')
        let swMultipleBoxLocal = (parametros.campos[key] && parametros.campos[key][6]) ? true: false
        let swWithInitialLocal = (parametros.campos[key] && parametros.campos[key][7]) ? false: true

        let queryIlogic = objParamModel.ilogic[key] 

        let tempo = dataIn[key] ? dataIn[key] : swMultipleBoxLocal?[]:{} 
        

        //console.log('\n\n********", ' ,dataIn, ' ,"****** almacen ilogic si existe seleccionado', tempo, "*****\n MULTIPLE: ", swMultipleBoxLocal ,"\n")
        if(!swMultipleBoxLocal){
          queryIlogic = queryIlogic.replaceAll('$campoForeign', selected.value)        
          queryIlogic= this.#replaceStringForQIlogic(queryIlogic, parametros.valores)
        }else{
          //realiza reemplazo de variable $iqw$ en conjunto con campo ilogicMultiple
          tempo = tempo.map(val=>({value: val}))
          const variableWhereIlogic = '$iqw$'
          //console.log('\n\n************** SELECTED CON MULTIPLE', selected, '\n\n')
          queryIlogic = queryIlogic.replaceAll(variableWhereIlogic, condicionMultiple)
          queryIlogic = queryIlogic.replaceAll('$campoForeign', selected.value)
        }
        queryIlogic=  this.#replaceStringByDataSession(queryIlogic)
        queryIlogic = await this.#replaceKeysSessionInQILogic(queryIlogic, objParamModel, '-1')
                
        //complementa condicion en caso q haya existido condicion PRIMAL
        queryIlogic = queryIlogic.replaceAll(swhere, CONDITION_PRIMAL)

        this.#qUtils.setQuery(queryIlogic)
        await this.#qUtils.excuteSelect()

        const result = this.#qUtils.getResults()
        //pregunta si va poner valor inicial -TODOS-
        if(result.length>0 &&  objParamModel.withInitial && parametros.campos[key] && swWithInitialLocal) result.unshift(this.#qUtils.getInitialOpCbox())

        //selected = this.#qUtils.searchSelectedInDataComboBox(result,{ value: tempo })
        selected = swMultipleBoxLocal ? 
                    this.#qUtils.searchSelectedInMultipleComboBox(result, tempo, swMultipleBoxLocal)          
                    :this.#qUtils.searchSelectedInDataComboBox(result, {value: tempo})
          //console.log('\n\n******ENTRADA:', tempo,'******** DEFAULT cobxDependency SELECTED', selected, '\n\n')
         //construye condicion si es multiple y existe ilogicMultiple
         if(swMultipleBoxLocal && objParamModel.ilogicMultiple){
          if(Array.isArray(selected) && selected.length>0){
            const idsMultiple = selected.map( obj=>obj.value)
            if( !idsMultiple.includes('-1'))
              condicionMultiple += ` AND ${objParamModel.ilogicMultiple[key]} IN ('${idsMultiple.join("', '")}')`
          }
         } 
        //alista valores de retorno  
        parametros.valores[key] = {
          selected: selected,
          items: result
        }
      }
    }

    
    this.#results = parametros // {[objParamModel.alias]:parametros}
  }

  #replaceStringByDataSession(stringSepararedByComa) {
    const vars = ['$app', '$inst', '$dni', '$usr']
    const d = this.#getDataSession()
    const equi = [d?.app, d?.inst, d?.dni, d?.usr, d?.rol, d?.primal]
    for (let i = 0; i < vars.length; i++) {
      stringSepararedByComa = stringSepararedByComa.replaceAll(vars[i], equi[i])
    }

    return stringSepararedByComa
  }
  async #replaceStingByDataRoleSession(stringNormal){
    const vars =['$rol', '$primal']
    const r =  await this.getRoleSession()
    const equi = [r?.rol, r?.primal]
    for (const i in vars) {
      stringNormal =  stringNormal.replaceAll(vars[i], equi[i])
    }
    return stringNormal
  }
  #replaceStringByDataParamDoms(paramDomsIn, objModel, query){
    const stringReplace = '$paramDoms'
    if(objModel.paramDoms && paramDomsIn.paramDoms && objModel.paramDoms.length>0 && paramDomsIn.paramDoms.length>0){
      let cadenaWhere = []
      for (const element of objModel.paramDoms) {
        cadenaWhere.push(`${element[0]}='${paramDomsIn.paramDoms[element[1]]}'`)
      }
      cadenaWhere = cadenaWhere.join(" AND ")
      query =  query.replaceAll(stringReplace, cadenaWhere)
    }else query =  query.replaceAll(stringReplace, " 1=1 ")
    return query
  }
  //tag remplacer sobre query Json para reporte
  //reemplaza valores q estan en mediode tags |pd-#-pd| ej: |pd-0-pd|
  #replaceTagWithPDomOrDtoValues(dto, objModel, query){
    const tagIniDom = '|pd-'
    const tagFinDom = '-pd|'
    const paramDomsIn = dto
    let queryAux =  query
    if(objModel.paramDoms && paramDomsIn.paramDoms && objModel.paramDoms.length>0 && paramDomsIn.paramDoms.length>0){
      queryAux =  queryAux.split(tagIniDom)
      if(queryAux.length>=1){
        for (const i in queryAux) {
          queryAux[i] =  queryAux[i].split(tagFinDom)
          if(queryAux[i].length>1){
            let contenido = queryAux[i][0]            
            if(contenido.length>=1){
              queryAux[i][0] = paramDomsIn.paramDoms[Number(contenido)]
            }
            queryAux[i] = queryAux[i].join("")
          }
        }
      }
      queryAux = queryAux.join("")
    }
return queryAux
  }
  #replaceStringForQIlogic(query, valores) {    
    
    for (const key in valores)   {
    //console.log("\n\n *********************************/REEEMPLAZO QLOGIC:::", valores,"\n\n")    
      query =  query.replaceAll('$'+key, valores[key].selected.value)}
    
    return query
  }
  async #replaceKeysSessionInQILogic(query, objModel, idx){
    console.log("\n\n\n  QUERY:::", query ," \n\n\n")
    if(objModel?.keySession){
      const condicionWhere =  await this.#analizaKeyWhere(objModel,idx)
      const varSession =  '$keySession'
      query =  query.replaceAll(varSession, condicionWhere)
    }
    return query
  }
  #seteaObjWithDataSession() {
    const obj = {}
    obj.institucion_id = this.#dataSession?.inst
    obj.dni_register = this.#dataSession?.dni
    obj.aplicacion_id = this.#dataSession?.app
    obj.tipo_institucion = this.#dataSession?.type
    obj.create_date = this.#qUtils.literal('CURRENT_TIMESTAMP') //new Date()

    obj.login =  this.#dataSession?.usr
    
    return obj
  }

  getObjSession(){
    //this.setToken(token)
    this.#setDataSession(this.#uService.filterHeaderTokenVerify(this.#_getToken()))
    return this.#seteaObjWithDataSession()
  }

  getObjSessionForModify(){
    const obj = this.getObjSession()
    delete obj.create_date
    obj.last_modify_date_time = this.#qUtils.literal('CURRENT_TIMESTAMP')//new Date()
    return obj
  }

  #getCondicionalTransform(condicional = Array) {
    let result = {}
    for (const element of condicional) {
      const aux = this.#replaceStringByDataSession(element).split(',')
      result = { ...result, [aux[0]]: aux[1] }
    }
    return result
  }

  //************************* GUARDADO */
  saveDataParams = async (dto) => {
    await this.#qUtils.startTransaction()
    try {

      //seta token
      this.setToken(dto.token)
      this.#setDataSession(this.#uService.filterHeaderTokenVerify(this.#_getToken()))
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
        if (dto.idx && dto.idx != '-1') {

          //ES EDICION
          //obj = Object.assign(data, this.#seteaObjWithDataSession(), complemento)
          if (data.aplicacion_id) obj = Object.assign(this.#seteaObjWithDataSession(), data, complemento)
          else obj = Object.assign(data, this.#seteaObjWithDataSession(), complemento)

          delete obj.create_date
          obj[idx_aux] = dto.idx
          obj.last_modify_date_time = this.#qUtils.literal('CURRENT_TIMESTAMP')//new Date()
          const wheres = { [idx_aux]: dto.idx }

          this.#qUtils.setDataset(obj)
          this.#qUtils.setWhere(wheres)
          await this.#qUtils.modify()
        } else {
          //es INSERCION
          if (Array.isArray(data)) obj = data
          else {
            if (data.aplicacion_id) obj = Object.assign(this.#seteaObjWithDataSession(), data, complemento)
            else obj = Object.assign(data, this.#seteaObjWithDataSession(), complemento)
          }
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
                let aux = Object.assign(complemento, this.#seteaObjWithDataSession())
                return { ...aux, ...oo }
              })

              this.#qUtils.setDataset(obj)
            } else {
              //insercion normal
              if (!objModel.noKeyAutomatic)
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
          obj.create_date = this.#qUtils.literal('CURRENT_TIMESTAMP')//new Date()
          const setData = data[more_data.apropiacion].map(dato => ({ ...obj, [more_data.apropiacion]: dato }))
          this.#qUtils.setDataset(setData)

          await this.#qUtils.createwLote()
          delete obj.create_date

          if (dto.idx) {
            obj.last_modify_date_time = this.#qUtils.literal('CURRENT_TIMESTAMP')//new Date()
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

  /**
   * Metodo: Obtiene configuracion del rol del usuario logueado
   * @returns {rol, name_rol, primal}
   */
 async getRoleSession(){
  const obj_cnf = this.getObjSession()
  this.#qUtils.setTableInstance('apu_credencial_rol')
  this.#qUtils.setAttributes(['role'])
  this.#qUtils.setWhere({login:obj_cnf.login})
  this.#qUtils.setInclude({
    association:'app_rolex', required: false,
    attributes:['role', 'name_role', 'primal']
  })
  await this.#qUtils.findTune()
  const result = this.#qUtils.getResults()
  return {
    rol: result[0].app_rolex.role,
    name_rol: result[0].app_rolex.name_role,
    primal: result[0].app_rolex.primal,
  }
 } 
 async getGroupIdsInstitucion() {
  /**if(this.#_groupIdsInstitucion && Array.isArray(this.#_groupIdsInstitucion))
    return this.#_groupIdsInstitucion
  else{
    await this.#__getGroupIdsInstitucion()
    return  this.#_groupIdsInstitucion
  }*/
    await this.#__getGroupIdsInstitucion()
    return  this.#_groupIdsInstitucion
 }
/**
 *getGroupIdsInstitucion 
 */
 #__getGroupIdsInstitucion = async() =>{
  try {
    const obj_cnf = this.getObjSession()
    const tipo_institucion =  obj_cnf.tipo_institucion
    //si tipo_insitucion ==EG, obtener ids de eess
    //si tipo_institucion == EESS, enviar id de institucion
    //si tipo_institucion == ASUSS verificar si es UNIDAD, DEPARTAMENTAL O REGIONAL
    //console.log("\n\n TIPO INSTITUCION::.", tipo_institucion)
    //console.log("\n\n DATOS SESION::.", obj_cnf)
    let results = []
    switch (tipo_institucion) {
      case 'EESS':
        results.push(obj_cnf.institucion_id)
        break;
    case 'EG':
      this.#qUtils.setTableInstance("ae_institucion")
      this.#qUtils.setAttributes(['institucion_id'])
      this.#qUtils.setWhere({institucion_root: obj_cnf.institucion_id})
      await this.#qUtils.findTune()
      results =  this.#qUtils.getResults().map(o=>o.institucion_id)
    break;
    case 'ASUSS':
      this.#qUtils.setTableInstance("ae_institucion")      
      await this.#qUtils.findID(obj_cnf.institucion_id)
      const r =  this.#qUtils.getResults()
      //pregunta si es ASUSS UNIDA
  if(r.es_unidad || r.institucion_root=='-1' ){
    //es asuss -> envia result nulo para mostrar todo
    results = []
  }else{
    
    let paso=true
    let ids = [obj_cnf.institucion_id]
    let root = [obj_cnf.institucion_id]
    while(paso){
      console.log("\n\n", "######EN TRANCE CON LA COSAS########", "\n\n")
      this.#qUtils.setTableInstance("ae_institucion")
      this.#qUtils.setAttributes(['institucion_id'])
      this.#qUtils.setWhere({es_unidad: false, tipo_institucion_id: 'ASUSS', parent_grp_id: root})
      await this.#qUtils.findTune()
      const r = this.#qUtils.getResults()      
      
      if(r.length<=0) paso=false
      else{
        root = r.map(o=>o.institucion_id)
        ids.push(...root)
      }
    }//end While

    //obtiene ID's de EESS por ids de while
    this.#qUtils.setTableInstance("ae_institucion")
    this.#qUtils.setAttributes(['institucion_id'])
    this.#qUtils.setWhere({tipo_institucion_id: 'EESS', parent_grp_id: ids})
    await this.#qUtils.findTune()
    results = this.#qUtils.getResults().map(o=>o.institucion_id)     
  }//end else
    
    break;
      default:
        results = ['vichofeoERROR']
        break;
    }

    //console.log("\n\n\n ************************************** INGRESO A LA OPCION DE IDS INSTRITIIOCN ***********************************\n\n\n")
    //console.log(results)
    //this.#results =  results
    this.setGroupIdsInstitucion(results)
    //console.log("\n\n\n ****************************************saliendo***************************** \n\n\n")
  } catch (error) {
    throw new Error("Falla en el proceso de obtencion de IDS")
  }
 }
}
