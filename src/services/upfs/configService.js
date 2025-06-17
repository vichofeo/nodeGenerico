

const QUtils = require('./../../utils/queries/Qutils')
const qUtil = new QUtils()




const parametros = JSON.stringify(require('./parameters'))
const PARAMETROS = JSON.parse(parametros)

const pcboxs = JSON.stringify(require('./params_cboxs'))
const PCBOXS = JSON.parse(pcboxs)

const FrmUtils = require('./../frms/FrmsUtils')
const frmUtil = new FrmUtils()


const getEESS = async (dto, handleError) => {
    try {

        const Mimodelo = 'eess'
        dto.modelo =  Mimodelo
        //o´regunta si rol es primal
        frmUtil.setToken(dto.token)
        const obj_rol = await frmUtil.getRoleSession()

        dto.modelos = [dto.modelo]
        frmUtil.setParametros(PARAMETROS)
        await frmUtil.getDataParams(dto)
        const result = frmUtil.getResults()
        
        console.log("******************", result)

        return {
            ok: true,
            //data: result[Mimodelo].valores[Mimodelo].items.map(obj=>obj.value),            
            message: "Requerimiento Exitoso"
        }
    } catch (error) {
        console.log(error)
        console.log("\n\nerror::: EN SERVICES\n")
        handleError.setMessage("Error de sistema: GETEESSFARSRV")
        handleError.setHttpError(error.message)
    };

}

const getEESSsave = async (dto, handleError) => {
    try {
        frmUtil.setToken(dto.token)
        const obj_cnf =  frmUtil.getObjSession()
        const obj_mdf = frmUtil.getObjSessionForModify()
        delete obj_mdf.institucion_id

        await qUtil.startTransaction()
        //array de id con ind de eess
        const establecimientos =  dto.eess
        const tipo_file_id = dto.file_tipo_id
        //obtiene informacion q ya existe

        qUtil.setTableInstance('upf_file_institucion_cnf')
        qUtil.setAttributes(['institucion_id'])
        qUtil.setWhere({file_tipo_id: tipo_file_id})
        await qUtil.findTune()

        const existentes =  qUtil.getResults().map(obj=>obj.institucion_id)
        const interseccion = existentes.filter(v=>establecimientos.includes(v))
        const diferencia = existentes.filter(v=> !establecimientos.includes(v)) //para eliminar o cambiar de estado

        
        //inserta en lote
        if(establecimientos.length>0){
            const dataSet =  establecimientos.map(v=>({...obj_cnf, institucion_id:v, file_tipo_id: tipo_file_id}))
            qUtil.setTableInstance('upf_file_institucion_cnf')
            qUtil.setDataset(dataSet)
            await qUtil.createwLote()
        }
        

        //actualiza estado a Y los coincidentes
        if(interseccion.length>0){
            
            qUtil.setTableInstance('upf_file_institucion_cnf')
            qUtil.setDataset({...obj_mdf, activo:'Y'})
            qUtil.setWhere({institucion_id: interseccion, file_tipo_id: tipo_file_id})
            await qUtil.modify()
        }
        

        //obtiene ids utilizados en registro
        if(diferencia.length>0){
            console.log("diferencia::", diferencia)
            qUtil.setTableInstance('upf_registro')
            qUtil.setAttributes([[qUtil.distinctData('institucion_id') , 'idx']])
            qUtil.setWhere({file_tipo_id: tipo_file_id})
            await qUtil.findTune()
            
            const ids_reg =  qUtil.getResults().map(obj=>obj.idx)
            const dif_reg = diferencia.filter(v=>!ids_reg.includes(v))
            const int_reg = diferencia.filter(v=>ids_reg.includes(v))
            
            //elimina los q no tienen registro
            if(dif_reg.length>0){
                qUtil.setTableInstance('upf_file_institucion_cnf')
                qUtil.setWhere({institucion_id:dif_reg, file_tipo_id: tipo_file_id})
                await qUtil.deleting()
            }
            if(int_reg.length>0){
                qUtil.setTableInstance('upf_file_institucion_cnf')
                qUtil.setDataset({...obj_mdf, activo:'N'})
                qUtil.setWhere({institucion_id: int_reg, file_tipo_id: tipo_file_id})
                await qUtil.modify()
            }

        }
        
        await qUtil.commitTransaction()

        return {
            ok: true,                     
            message: "Requerimiento Exitoso"
        }
    } catch (error) {
        
        console.log(error)
        await qUtil.rollbackTransaction()
        console.log("\n\nerror::: EN SERVICES\n")
        handleError.setMessage("Error de sistema: SVFARMCNFSRV")
        handleError.setHttpError(error.message)
    };

}



module.exports = {
    getEESS,
    getEESSsave
 
}