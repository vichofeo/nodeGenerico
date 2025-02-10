const HandleErrors = require('./../../utils/handleErrors')
const handleError = new HandleErrors()

const service =  require('./../../services/aeb/aebReportTmpsService')

const tmpsInitialReport = async (req, res) =>{    
    const body =  req.body
    const token =  req.headers.authorization

    const result =  await service.tmpsInitialReport({token:token, ...body}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const tmpsStatus = async (req, res) =>{    
    const body =  req.body
    const token =  req.headers.authorization

    const result =  await service.tmpsStatus({token:token, ...body}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const tmpsReport = async (req, res) =>{
    //handleError.setRes(res)    ???
    const body =  req.body
    const token =  req.headers.authorization

    const result =  await service.tmpsReport({token:token, modelo: body.model, condicion:body.solicitud, option:body?.option}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
    
}

const tmpsReportSnis = async (req, res) =>{
    //handleError.setRes(res)    ???
    const body =  req.body
    const token =  req.headers.authorization

    const result =  await service.tmpsReportSnis({token:token}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
    
}

const tmpsDeletetSnis = async (req, res) =>{
    //handleError.setRes(res)    ???
    const body =  req.body
    const token =  req.headers.authorization

    const result =  await service.tmpsDeletetSnis({token:token, data: body}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
    
}

module.exports = {   
    tmpsInitialReport, tmpsStatus, 
    tmpsReport, 
    tmpsReportSnis, 
    tmpsDeletetSnis
}