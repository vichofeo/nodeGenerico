const HandleErrors = require('./../../utils/handleErrors')
const handleError = new HandleErrors()

const service =  require('./../../services/actividad/actividadService')
const servicePdfPrint =  require('../../services/actividad/actividadPDFPrintService')

const cronograma = async (req, res) => {
    handleError.setRes(res)
    const token = req.headers.authorization
    const modelo = req.body.modelo

    const result = []
    handleError.handleResponse(result)
}

const getDataModelN = async (req, res)=>{
    
    const modelo = req.params.modelo
    const token = req.headers.authorization

    const result = await service.getDataModelN({modelo:modelo, token:token},handleError)
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const getDataModel1 = async (req, res)=>{
    
    const idx =  req.params.idx
    const modelo = req.params.modelo
    const token = req.headers.authorization

    const result = await service.getDataModelNew({idx:idx, modelo:modelo, token:token}, handleError)
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
    
}

const getDataModelNew = async (req, res)=>{
    
    const idx='-1'
    const modelo = req.params.modelo
    const token = req.headers.authorization

    const result = await service.getDataModelNew({idx:idx, modelo:modelo, token:token, new:true},handleError)    
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const getDataCboxLigado = async (req, res) =>{    
    const modelo =  req.body.modelo
    const token =  req.headers.authorization

    const result =  await service.getDataCboxLigado({modelo:modelo, token:token, ...req.body}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

/**
 * crontrolador pa guardar cronograma fuera de  modelo
 * @param {*} req 
 * @param {*} res 
 */
const cronogramaSave = async (req, res) =>{        
    const token =  req.headers.authorization

    const result =  await service.cronogramaSave({ token:token, ...req.body}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}
 
const getProgramacion = async (req, res) =>{        
    const token =  req.headers.authorization

    const result =  await service.getProgramacion({ token:token }, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const getAllProg = async (req, res) =>{        
    const token =  req.headers.authorization    
    const result =  await service.getAllProg({ token:token, idx:'-1'}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const personaActividadSave= async (req, res)=>{
    const token =  req.headers.authorization    
    const result =  await service.personaActividadSave({ token:token, ...req.body}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const enviarMail= async (req, res)=>{
    const token =  req.headers.authorization    
    const result =  await service.enviarMail({ token:token, idx:'-1'}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}
const printCert= async (req, res)=>{
    const token =  req.headers.authorization    
    const result =  await servicePdfPrint.getValuesActWithXY({ token:token, ...req.body}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const sendCert= async (req, res)=>{
    const token =  req.headers.authorization        
    const result =  await servicePdfPrint.sendCertificadoMail({ token:token, ...req.body}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}



module.exports = {
    cronograma,
    
    getDataModel1, 
    getDataModelN, getDataModelNew, 
    getDataCboxLigado,
    cronogramaSave,

    getProgramacion, getAllProg,

    enviarMail, printCert, sendCert,
    
    personaActividadSave
}