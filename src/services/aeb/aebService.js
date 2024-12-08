

const QUtils = require('./../../models/queries/Qutils')
const qUtil = new QUtils()




const parametros = JSON.stringify(require('./parameters'))
const PARAMETROS = JSON.parse(parametros)

const pcboxs = JSON.stringify(require('./params_cboxs'))
const PCBOXS = JSON.parse(pcboxs)

const FrmUtils = require('./../frms/FrmsUtils')
const frmUtil = new FrmUtils()


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
        console.log(error)
        console.log("\n\nerror::: EN SERVICES\n")
        handleError.setMessage("Error de sistema: UFAMDATNSRV")
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
        handleError.setMessage("Error de sistema: UFAMDATNEWSRV")
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
        handleError.setMessage("Error de sistema: UFAMDATCBOXSRV")
        handleError.setHttpError(error.message)
    };

}


module.exports = {
    getDataModelN,
    getDataModelNew,
    getDataCboxLigado,

}