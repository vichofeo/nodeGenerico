const HandleErrors = require('../../utils/handleErrors')
const QUtils = require('./../../models/queries/Qutils')
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
        dto.modelos = [dto.modelo]
        frmUtil.setParametros(PARAMETROS)
        await frmUtil.getDataParams(dto)
        const result = frmUtil.getResults()

        return {
            ok: true,
            data: result,
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
        console.log("\n\n ?????????????????????????????????error en GetNew?????????????????????? \n\n");
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
 * Salva datos de para iniciar evaluacion
 * @param {*} dto 
 * @param {*} handleError 
 * @returns 
 */
const acrehabEvalSave = async (dto, handleError) => {

    try {
        // obtiene datos de session
        frmUtil.setToken(dto.token)
        const obj_cnf = frmUtil.getObjSession()

        //prepara datsos en formato
        const datos = dto.data
        
        const payload = Object.assign(obj_cnf, datos )

        //instancia tabla
        qUtil.setTableInstance('u_frm_evaluacion')
        //inicia transaccion
        await qUtil.startTransaction()

        //guarda datos
        qUtil.setDataset(payload)
        
        await qUtil.create()

        //termina transaccion
        await qUtil.commitTransaction()

        return {
            ok: true,
            data: payload,
            message: "Requerimiento Exitoso. Parametros Guardados"
        }

    } catch (error) {
        await qUtil.rollbackTransaction()
        console.log(error);
        handleError.setMessage("Error de sistema: UFRMEVALDATSAVESRV")
        handleError.setHttpError(error.message)
    };

}




module.exports = {
    getDataModelN,
    getDataModelNew,
    getDataCboxLigado, 
    acrehabEvalSave
}