const HandleErrors = require('./../../utils/handleErrors')
const handleError = new HandleErrors()

const service =  require('./../../services/aeb/aebLoaderService')


const initialData = async (req, res) =>{    
    const body =  req.body
    const token =  req.headers.authorization

    const result =  await service.initialData({token:token, ...body}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const statusTmps = async (req, res) =>{    
    const body =  req.body
    const token =  req.headers.authorization

    const result =  await service.statusTmps({token:token, ...body}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const vaciarTmps = async (req, res) =>{    
    const body =  req.body
    const token =  req.headers.authorization

    const result =  await service.vaciarTmps({token:token, ...body}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}
const xlsxLoad = async (req, res) =>{
    //handleError.setRes(res)    
    const body =  req.body
    const token =  req.headers.authorization

    const result =  await service.xlsxLoad({token:token, data: body}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const xlsxNormalize = async (req, res) =>{
    //handleError.setRes(res)    ???
    const body =  req.body
    const token =  req.headers.authorization

    const result =  await service.xlsxNormalize({token:token, data: body}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

module.exports = {
    
    initialData, statusTmps, vaciarTmps,
    xlsxLoad,
    xlsxNormalize
}