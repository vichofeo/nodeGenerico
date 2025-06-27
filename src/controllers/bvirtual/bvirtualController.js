const HandleErrors = require('./../../utils/handleErrors')
const handleError = new HandleErrors()

const service =  require('./../../services/bvirtual/bvirtualService')

const getDataFolders = async (req, res)=>{
        
    const token = req.headers.authorization

    const result = await service.getDataFolders({token:token},handleError)
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const saveDataFolders = async (req, res)=>{
        
    const token = req.headers.authorization

    const result = await service.saveDataFolders({token:token, data: req.body},handleError)
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const editDataFolders = async (req, res)=>{
        
    const token = req.headers.authorization

    const result = await service.editDataFolders({token:token, data: req.body},handleError)
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const deleteDataFolders = async (req, res)=>{
        
    const token = req.headers.authorization

    const data={idx: req.params.idx}
    const result = await service.deleteDataFolders({token:token, data },handleError)
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

//----------------FILES -------------
const searchFiles = async (req, res)=>{
        
    const token = req.headers.authorization

    const result = await service.searchFiles({token:token, ...req.body},handleError)
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const suggestFiles = async (req, res)=>{
        
    const token = req.headers.authorization

    const result = await service.suggestFiles({token:token, ...req.body},handleError)
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}
const getDataFiles = async (req, res)=>{
        
    const token = req.headers.authorization
    const idx =  req.params.idx

    const result = await service.getDataFiles({token:token, data:{folder_id: idx}},handleError)
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const uploadFile = async (req, res)=>{
        
    const token = req.headers.authorization
//console.log(req.file)
    const result = await service.uploadFile({token:token, data: req.body, file: req.file},handleError)
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const deleteFile = async (req, res)=>{
        
    const token = req.headers.authorization

    const result = await service.deleteFile({token:token, data: {idx:req.params.idx, folder_id:req.params.idy}},handleError)
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const getFile = async (req, res)=>{
        
    const token = req.headers.authorization
    const idx =  req.params.idx
    const body =  req.body

    const result = await service.getFile({token:token, idx: idx, ...body},handleError)
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const editFile = async (req, res)=>{
        
    const token = req.headers.authorization
//console.log(req.file)
    const result = await service.editFile({token:token, data: req.body},handleError)
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const getVacun = async (req, res)=>{
        
    const token = req.headers.authorization
    const idx =  req.params.idx
    const body =  req.body

    const result = await service.getVacun({token:token, idx: idx, ...body},handleError)
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

module.exports = {
    searchFiles, suggestFiles,
    getDataFolders, saveDataFolders, editDataFolders, deleteDataFolders,

    getDataFiles, uploadFile, deleteFile,
    getFile, editFile,
    getVacun
}