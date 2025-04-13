const HandleErrors = require('./../../utils/handleErrors')
const handleError = new HandleErrors()

const service =  require('./../../services/upfs/configService')

const getEESS = async (req, res)=>{
    
    
    const token = req.headers.authorization

    const result = await service.getEESS({token:token},handleError)
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const getEESSsave = async (req, res)=>{
        
    const token = req.headers.authorization

    const result = await service.getEESSsave(req.body,handleError)
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}



module.exports = {
    getEESS ,
    getEESSsave

    


}