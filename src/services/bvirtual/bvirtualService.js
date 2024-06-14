

const QUtils = require('./../../models/queries/Qutils')
const qUtil = new QUtils()


const FrmUtils = require('./../frms/FrmsUtils')
const frmUtil = new FrmUtils()

const recorreArbolPorFolder = async (folder, no_rama=0, datos)=>{
    if(folder != '-1' && datos.hashchild){
        datos.children = []
        qUtil.setWhere({folder_root:folder})        
        await qUtil.findTune()
        console.log("\n\n ejecuta query........\n\n")
        const result =  qUtil.getResults()
        if(result.length>0 ){
            for (const element of result) {
                const tmp = await recorreArbolPorFolder(element.folder_id, no_rama, element)
                datos.children.push(tmp)                
            }
            
        }
    }
    no_rama++
    return (datos)
}

const getDataFolders = async (dto, handleError) => {

    try {

        //o´regunta si rol es primal
        frmUtil.setToken(dto.token)
        const obj_rol = await frmUtil.getRoleSession()

        qUtil.setTableInstance('bv_folder')
        qUtil.setAttributes(['folder_id','name_folder', 'hashchild', 'folder_root'])

        //obtiene folder raiz
        qUtil.setWhere({folder_root:-1})
        qUtil.setOrder(['name_folder'])
        await qUtil.findTune()
        const result =  qUtil.getResults()
        let no_rama = 0
        const valores = []
        if(result.length>0){
            for (const element of result) {
                console.log("\n\n entrando cooooo:", element.folder_id)
                no_rama =  await recorreArbolPorFolder(element.folder_id,no_rama, element)
                console.log(":::nor rama", no_rama)
                valores.push(no_rama)
            }
        }

        

        return {
            ok: true,
            data: valores,        
            message: "Requerimiento Exitoso"
        }
    } catch (error) {
        console.log(error)
        console.log("\n\nerror::: EN SERVICES\n")
        handleError.setMessage("Error de sistema: BVIRTFOLDERSRV")
        handleError.setHttpError(error.message)
    };

}

const saveDataFolders = async (dto, handleError)=>{
    try {
        frmUtil.setToken(dto.token)
        const obj_rol = await frmUtil.getRoleSession()

        qUtil.setTableInstance('bv_folder')
        qUtil.setDataset(Object.assign(dto.data, obj_rol))

        await qUtil.create()

        //getDataFolders(dto, handleError)
        return {}

    } catch (error) {
        console.log("\n\nerror::: EN SERVICES SAVE\n")
        handleError.setMessage("Error de sistema: BVIRTSAVEFOLDERSRV")
        handleError.setHttpError(error.message)
    }
}


module.exports = {
    getDataFolders, saveDataFolders


}