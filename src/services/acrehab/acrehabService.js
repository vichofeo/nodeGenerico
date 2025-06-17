const { where } = require('sequelize')
const HandleErrors = require('../../utils/handleErrors')
const QUtils = require('./../../utils/queries/Qutils')
const qUtil = new QUtils()

const handleJwt = require('./../../utils/handleJwt')


const parametros = JSON.stringify(require('./parameters'))
const PARAMETROS = JSON.parse(parametros)

const pcboxs = JSON.stringify(require('./params_cboxs'))
const PCBOXS = JSON.parse(pcboxs)

const FrmUtils = require('./../frms/FrmsUtils')
const frmUtil = new FrmUtils()

const cronograma = async (dto, handleError) => {
    try {

    } catch (error) {
        console.log(error)
        handleError.setMessage("Error de sistema: CRODATSRV")
        handleError.setHttpError(error.message)
    };

}

const getDataModelN = async (dto, handleError) => {
    try {

        //o´regunta si rol es primal
        frmUtil.setToken(dto.token)
        const obj_rol = await frmUtil.getRoleSession()

        dto.modelos = [dto.modelo]
        frmUtil.setParametros(PARAMETROS)
        await frmUtil.getDataParams(dto)
        const result = frmUtil.getResults()
        


        return {
            ok: true,
            data: result,
            role: obj_rol,
            message: "Requerimiento Exitoso"
        }
    } catch (error) {
        //console.log(error)
        console.log("\n\nerror::: EN SERVICES\n")
        handleError.setMessage("Error de sistema: ACREHABDATNSRV")
        handleError.setHttpError(error.message)
    };

}

const getDataModelNew = async (dto, handleError) => {
    try {
        dto.modelos = [dto.modelo]
        frmUtil.setParametros(PARAMETROS)
        await frmUtil.getDataParams(dto)
        const result = frmUtil.getResults()

        if (dto.new) {
            for (const key in result) {
                for (const index in result[key].campos) {
                    if (!result[key].campos[index][1])
                        result[key].campos[index][1] = true
                }
            }
        }

        return {
            ok: true,
            data: result,
            message: "Requerimiento Exitoso. Parametros Obtenidos"
        }

    } catch (error) {
        console.log("\n\n ?????????????????????????????????error en GetNew ACRE-HAB?????????????????????? \n\n");
        console.log(error);
        handleError.setMessage("Error de sistema: CRODATNEWSRV")
        handleError.setHttpError(error.message)
    };

}

const getDataCboxLigado = async (dto, handleError) => {
    try {
        dto.modelos = [dto.modelo]
        frmUtil.setParametros(PCBOXS)
        await frmUtil.makerDataComboDependency(dto)
        const result = frmUtil.getResults()
        return {
            ok: true,
            data: result,
            message: "Requerimiento Exitoso. Parametros Obtenidos"
        }

    } catch (error) {
        console.log("\n\n ?????????????????????????????????********error en COMBOX LIGADO *******?????????????????????? \n\n");
        console.log(error);
        handleError.setMessage("Error de sistema: CRODATCBOXSRV")
        handleError.setHttpError(error.message)
    };

}

/**
 * Salva datos de configuracion de evaluacion para su posterior registro por parametro
 * @param {*} dto 
 * @param {*} handleError 
 * @returns 
 */
const acrehabEvalSave = async (dto, handleError) => {
//inicia transaccion
await qUtil.startTransaction()
    try {
        // obtiene datos de session
        frmUtil.setToken(dto.token)
        const obj_cnf = frmUtil.getObjSession()

        //prepara datsos en formato
        const datos = dto.data

        const payload = Object.assign(obj_cnf, datos)

        //instancia tabla
        qUtil.setTableInstance('u_frm_evaluacion')
        

        //guarda datos
        qUtil.setDataset(payload)
        await qUtil.create()
        const result = qUtil.getResults()

        //guarda evaluadores con las asignacin de formularios
        const evaluadores = []
        for (const element of datos.evaluadores){
            const eval_register =  {evaluacion_id: result.evaluacion_id, dni_evaluador:element.usr, frm_id: element.idx, ...frmUtil.getObjSession() }
            evaluadores.push(eval_register)
            
            //obtiene padre solo si el hijo es parametro 
            qUtil.setTableInstance('u_frm')
            qUtil.setAttributes(['frm_id'])
            qUtil.setWhere({ frm_id: element.idx, es_parametro:true })
            qUtil.setInclude({
                association: 'padre', required: false,
                attributes: ['frm_id'],
                where:{parametros: qUtil.notNull(), frm:datos.frm_id}
            })
            await qUtil.findTune()
            const r = qUtil.getResults()
            for (const e of r){
                evaluadores.push({...eval_register, frm_id: e.padre.frm_id, ...frmUtil.getObjSession()})
            }
            
        }
            
            
        //instancia tabla DE VALUACIONES
        //qUtil.setResetVars()
        qUtil.setTableInstance('u_frm_evaluadores')
        qUtil.setDataset(evaluadores)
        await qUtil.createwLote()

        console.log("\n\n\n, *****************************",evaluadores,"\n\n\n")
        //termina transaccion
        await qUtil.commitTransaction()

        return {
            ok: true,
            data: result,
            message: "Requerimiento Exitoso. Parametros Guardados"
        }

    } catch (error) {
        await qUtil.rollbackTransaction()
        console.log(error);
        handleError.setMessage("Error de sistema: UFRMEVALDATSAVESRV")
        handleError.setHttpError(error.message)
    };

}

const saveDataModel = async (dto, handleError) => {
    //inicia transaccion
    
    try {
        dto.modelos = [dto.modelo]
        console.log("\n\n\n---------------------------GUARDANDO... MODELO:", dto.modelo,"\n\n\n")
        frmUtil.setParametros(PARAMETROS)
        await frmUtil.saveDataParams(dto)
        const result = frmUtil.getResults()
    
        if(result)
        return {
          ok: true,     
          r:result, 
          message: 'Resultado exitoso. Parametros Guardados',
        }
        else return {
          ok: false,
          rr:result,       
          message: 'La Transaccion ha fallado. vuelva a intentarlo o comuniquese con su administrador',
        }
      } catch (error) {
        console.log(error)
        return {
          ok: false,
          message: 'Error de sistema: OBJSAVEFRMCNF',
          error: error.message,
        }
      }
    
    }


module.exports = {
    getDataModelN,
    getDataModelNew,
    getDataCboxLigado,
    acrehabEvalSave, saveDataModel
}