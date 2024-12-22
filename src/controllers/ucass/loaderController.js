
const HandleErrors = require('../../utils/handleErrors.js')
const handleError = new HandleErrors()

const service =  require('../../services/ucass/loaderService.js')

//para iniciar parametros
const initialData = async (req, res) =>{    
    const body =  req.body
    const token =  req.headers.authorization

    const result =  await service.initialData({token:token, ...body}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

module.exports = {
    
    initialData
}