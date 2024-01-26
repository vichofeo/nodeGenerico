const Qutils = require("../../models/queries/Qutils")
const tk = require('./../../services/utilService')

module.exports = class FrmsUtils {
    #parametros
    #qUtils
    #uService
    #results
    #dataSession
    constructor() {
        if (FrmsUtils.instance)
            return FrmsUtils.instance
        this.#qUtils = new Qutils()
        this.#uService = tk
        this.#results = null
        this.#dataSession = null
        
        FrmsUtils.instance = this
    }
    #getDataSession(){
        return this.#dataSession
    }
    #setDataSession(data){
        this.#dataSession = data
    }
    setParametros(parametrosJson) {
        this.#parametros = parametrosJson
    }
    getDataParams = async (dto) => {
        //try {
            const datos = this.#uService.getCnfApp(dto.token)
             console.log("data cnf............", datos)
            this.#setDataSession(datos)
            
            //this.#qUtils.setTableInstance('ae_institucion')
            //const institucion = await this.#qUtils.findID(datos.inst)
            //const tipo_institucion = institucion.tipo_institucion_id
            const idxLogin = datos.inst

            let idx = null
            if (dto.idx)
                idx = dto.idx
            else idx = datos.inst

            const modelos = dto.modelos //['institucion', dto.modelo, 'propietario', 'servicios_basicos', 'atencion', 'superficie', 'estructura', 'infraestructuran', 'mobiliarion', 'equipamienton', 'personaln']
            //datos identificacions
            const datosResult = {}

            for (let i = 0; i < modelos.length; i++) {
                console.log("modelo::::::::", i, "--->", modelos[i])
                const modelo = modelos[i]

                if (this.#parametros[modelo].cardinalidad == '1') {
                    datosResult[this.#parametros[modelo].alias] = await this.#getDataparam1(modelo, idx)
                    //console.log("cardinadlidad 111:::::::::", datosResult[this.#parametros[modelo].alias])
                } else { //>-- FIN CARDINALIDAD ==1
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
        console.log("*****************************************::::::::::::::", objModel.referer.length)
        let campos = objModel.campos
        let from = objModel.table
        let where = `${objModel.key[0]} = '${idx}'`
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

        return { campos: objModel.camposView, valores: result, linked: objModel.linked }
    }
    #getDataparam1 = async (nameModeloFromParam, idx) => {
        //try {
            //tabla de datos
        const objModel = this.#parametros[nameModeloFromParam]
        let parametros = {}
        parametros.campos = Object.assign({}, objModel.campos)
        //pregunta si se trata de un modelo dual de datos
        let result = {}
        if (objModel.dual) {

            const tmp = objModel.dual//PARAMETROS[modelo].dual.split(',')
            const keys = objModel.keyDual
            let idxAux = idx
            for (const i in tmp) {
                const element = tmp[i]
                console.log("0000000000000000000000 DUAL ::=>", element, '1111111111111111 IDX==> ', idxAux)
                //alterna idx, el primer idx es de la tabla principal
                this.#qUtils.setTableInstance(element)
                await this.#qUtils.findID(idxAux)
                const aux = this.#qUtils.getResults()
                if (aux) {
                    idxAux = aux[keys[i]]
                    result = { ...result, ...aux }
                }
            }

        } else {
            this.#qUtils.setTableInstance(objModel.table)
            await this.#qUtils.findID(idx)
            const aux = this.#qUtils.getResults()
            if (aux)
                result = aux
        }

        parametros.valores = result
        parametros.exito = Object.keys(parametros.valores).length ? true : false

        console.log("$$$$$$$$$$$$$$$::::::: RESULtS", result)

        console.log("**************************ENTRANDO A REFERERE *****************************")
        //obtiene referencias PARA LOS COMBOS Y OTROS
        parametros = await this.#getDataparamReferer(parametros, objModel.referer)
        console.log("**************************SALIENDO A REFERERE *****************************")
        //complementa referencia si existe el campo ilogic que contiene querys textuales q solo funcionan con el id instutucion logueado
        if (objModel.ilogic) {
            for (const key in objModel.ilogic) {
                console.log("!!!!!!!!!!!!EXISTE ILOGIC!!!!!!! llave:", key)
                const queryIlogic = objModel.ilogic[key] //objModel.ilogic[key].replaceAll('idxLogin', idxLogin)
                console.log("************** almacen ilogic", parametros.valores[key])
                const tempo = parametros.valores[key]
                this.#qUtils.setQuery(queryIlogic)
                await this.#qUtils.excuteSelect()//await sequelize.query(queryIlogic, { mapToModel: true, type: QueryTypes.SELECT, raw: false, });
                const result = this.#qUtils.getResults()
                parametros.valores[key] = {
                    selected: this.#qUtils.searchSelectedInDataComboBox(result, { value: tempo }),
                    items: result,
                    dependency: false
                }
            }

        }
console.log("finnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",nameModeloFromParam) 
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
            const campos =  this.#qUtils.transAttribByComboBox(element.campos)
            const condicion =  element.condicion ? element.condicion : {}
            const condicional = element.condicional ? this.#getCondicionalTransform(element.condicional):{}
            const where = Object.assign(condicion, condicional)
            const aux = parametros.valores[apropiacion]
           

            //instanciando utilidades
            this.#qUtils.setTableInstance(tablaRef)
            this.#qUtils.setAttributes(campos)
            this.#qUtils.setWhere(where)
            this.#qUtils.setOrder([element.campos[element.campos.length - 1]])
            await this.#qUtils.findTune()
           const selected = this.#qUtils.searchSelectedForComboBox({ value: aux })
            parametros.valores[apropiacion] = {
                //s01: { value: aux },
                selected: selected,
                items: this.#qUtils.getResults(),
                dependency: false
            }
            
            //let dependency = false
            //element.linked
            
        }//fin for referer
        this.#qUtils.setResetVars()
        return parametros
    }
getResults(){
    console.log("results:",this.#results)
    return this.#results
}
    makerDataComboDependency= async (dto)=>{
        
            const datos = this.#uService.getCnfApp(dto.token)            
            this.#setDataSession(datos)
            

            const objParamModel =  this.#parametros[dto.modelo]
            const dataIn = dto.data
            let parametros =  {}
            parametros.campos =  objParamModel.campos
            parametros.valores = {}

            //recorre referer
            this.#qUtils.setResetVars()
            let selected = dataIn ? {value: Object.values(dataIn)[0]} :{value: null}
            //console.log("..............", selected)
            
            for (const referer of objParamModel.referer) {
                //instancia campos
                this.#qUtils.setTableInstance(referer.ref)
                this.#qUtils.setAttributes(this.#qUtils.transAttribByComboBox(referer.campos))
                let where = {}
                if(referer.condicion){                   
                    where = {...where, ...referer.condicion}                    
                }
                if(referer.condicional){
                    where = {...where, ...this.#getCondicionalTransform(referer.condicional)}                    
                }
                if(referer.campoForeign){
                    where = {...where, [referer.campoForeign]:selected.value}
                }
            
                this.#qUtils.setWhere(where)
                this.#qUtils.setOrder([referer.campos[1]])
                await this.#qUtils.findTune()
                selected= this.#qUtils.searchSelectedForComboBox({ value: dataIn? dataIn[referer.apropiacion]: null })
            
                parametros.valores[referer.apropiacion] = {
                    items: this.#qUtils.getResults(),
                    selected: selected
                }
                this.#qUtils.setResetVars()
            }//fin for referer
           
            this.#results = parametros// {[objParamModel.alias]:parametros}
            
            
    }

    #replaceStringByDataSession(stringSepararedByComa){
        
        const vars = ['$app','$inst','$dni','$usr']
        const d =  this.#getDataSession()
        const equi = [d.app, d.inst, d.dni, d.usr]
        for(let i=0; i<vars.length; i++){
        stringSepararedByComa = stringSepararedByComa.replaceAll(vars[i], equi[i])        
    }
    
    return stringSepararedByComa
    }
    #getCondicionalTransform(condicional=Array){
        let result = {}
        for(let i=0; i<condicional.length; i++){
            const aux =  this.#replaceStringByDataSession(condicional[i]).split(',')
            result =  {...result, [aux[0]]:aux[1]}
        }
        return result
    }
}