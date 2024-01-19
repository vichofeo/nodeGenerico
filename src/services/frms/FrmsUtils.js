const Qutils = require("../../models/queries/Qutils")
const tk = require('./../../services/utilService')

module.exports = class FrmsUtils {
    #parametros
    #qUtils
    #uService
    constructor() {
        if (FrmsUtils.instance)
            return FrmsUtils.instance
        this.#qUtils = new Qutils()
        this.#uService = tk
        FrmsUtils.instance = this
    }
    setParametros(parametrosJson) {
        this.#parametros = parametrosJson
    }
    getDataParams = async (dto) => {
        try {
            const datos = this.#uService.getCnfApp(dto.token)
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
                    console.log("PASO111:::::::::", datosResult[this.#parametros[modelo].alias])
                } else { //>-- FIN CARDINALIDAD ==1
                    //cardinalidad n
                    datosResult[this.#parametros[modelo].alias] = await this.#getDataParamN(modelo, idx)
                    console.log("PASONNN*****",datosResult[this.#parametros[modelo].alias])
                }
            }

            return {
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
        };

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
        console.log("**************************ENTRANDO A REFERERE *****************************")
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
            
            const tablaRef = element.ref
            const campoRef = element.camporef
            const campoForeign = element.camporefForeign
            const campoLink = element.campoLink ? element.campoLink : element.camporefForeign
            const alias = element.alias
            const condicion = element.condicion

            const tipoCampoHtml = parametros.campos[campoForeign][3].slice(0, 1)

            //const where = element.condicion ? { [alias]: condicion } : {}
            element.campoLink ? where[campoRef] = parametros.valores[campoLink] : ""

            console.log(":::: REFERERENCIANDO :", tablaRef, '--', element)
            this.#qUtils.setTableInstance(tablaRef)

            this.#qUtils.setAttributes(tipoCampoHtml == 'T' ? element.campos : this.#qUtils.transAttribByComboBox(element.campos))
            this.#qUtils.setWhere(tipoCampoHtml == 'T' ? { [campoRef]: parametros.valores[campoLink] ? parametros.valores[campoLink] : "-1" } : 
                                                            element.condicion ? { [alias]: condicion } : {})
            this.#qUtils.setOrder([element.campos[element.campos.length - 1]])

            console.log("******", campoForeign)
            console.log("***!!!!!!!", parametros.campos[campoForeign][3])
            //console.log("!!!!!!!!!!!!!!!!!!!", cnfData)


            let r = null
            let dependency = false
            if (element.linked) {//hace el link con la referencia de definicion en model segun cfn de parametros
                               
                this.#qUtils.setAliasInclude(element.linked.alias)
                this.#qUtils.setInclude(element.linked.ref)
                this.#qUtils.setAttributes(element.linked.campos)
                this.#qUtils.setWhere(null)
                //cnfData.order.push([sequelize.col(element.linked.alias+'.'+element.campos[element.campos.length - 1])])
                //delete cnfData.where
                await this.#qUtils.findData1toNFromReferer()
                r = this.#qUtils.getResults()
                dependency = element.linked.dependency
                
                this.#qUtils.setResetVars()
            } else{
                await this.#qUtils.findTune()
                r = this.#qUtils.getResults()
}
            console.log("////////////////////////////////////////////////////////////Parametors caja html", tipoCampoHtml)
            if (tipoCampoHtml == 'T') {
                parametros.valores[campoForeign] = r[0] ? r[0][element.campos] : ""
            } else {
                const aux = parametros.valores[campoForeign]
                if (dependency) console.log("aki es", dependency, "matis datis::::::::::::::::::::::::::::::::::::::::::", parametros.valores[dependency].selected.value)
                parametros.valores[campoForeign] = {
                    selected: dependency ? this.#qUtils.searchSelectedInDataComboBox(r[parametros.valores[dependency].selected.value], { value: aux }) : this.#qUtils.searchSelectedInDataComboBox(r, { value: aux }),
                    items: r,
                    dependency: dependency
                }

            }
        }//fin for referer
        return parametros
    }

    getDataComboDependency(dto){
        try {
            const datos = this.#uService.getCnfApp(dto.token)            
            const idxLogin = datos.inst

            const objParamModel =  this.#parametros[dto.modelo]
            let parametros =  {}
            parametros.campos =  objParamModel.campos


            //seteo de slected
            for (const referer of objParamModel.referer) {

            }
            
            //recorre referer
            this.#qUtils.setResetVars()
            for (const referer of objParamModel.referer) {
                //instancia campos
                this.#qUtils.setTableInstance(referer.ref)
                this.#qUtils.setAttributes(this.#qUtils.transAttribByComboBox(referer.campos))
                const where = []
                //referer.campoLink ? 
                
            }
            
        } catch (error) {
            console.log(error)
            return {
                ok: false,
                message: "Error de sistema: OBJFRMCBOXDEP",
                error: error.message
            }
        }
    }
}