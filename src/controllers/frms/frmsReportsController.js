const HandleErrors = require('./../../utils/handleErrors')
const handleError = new HandleErrors()

const service =  require('./../../services/frms/FrmReportsService')

const frmsInitialReport = async (req, res) =>{    
    const body =  req.body
    const token =  req.headers.authorization

    const result =  await service.frmsInitialReport({token:token, ...body}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const frmsStatusReport = async (req, res) =>{    
    const body =  req.body
    const token =  req.headers.authorization

    const result =  await service.frmsStatusReport({token:token, ...body}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const frmsReport = async (req, res) =>{
    //handleError.setRes(res)    ???
    const body =  req.body
    const token =  req.headers.authorization

    const result =  await service.frmsReport({token:token, modelo: body.model, condicion:body.solicitud, option:body?.option}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
    
}
const frmsConsolidado = async (req, res) =>{
    //handleError.setRes(res)    ???
    const body =  req.body
    const token =  req.headers.authorization

    const result =  await service.frmsConsolidado({token:token, data:body}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
    
}
module.exports = {   
    frmsInitialReport, frmsStatusReport, 
    frmsReport,
    frmsConsolidado
}