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







module.exports = {getDataFolders, saveDataFolders


}