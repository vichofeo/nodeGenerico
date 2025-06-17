const HandleErrors = require('./../../utils/handleErrors')
const handleError = new HandleErrors()

const service =  require('./../../services/indicadores/indicadorService')

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
    const token = req.headers?.authorization

    const result = await service.getDataModelNew({idx:idx, modelo:modelo, token:token, new:true},handleError)    
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const getDataParaDomIdxModel = async (req, res)=>{
    const data = req.body
    const token = req.headers?.authorization
    const modelo =  req.body.model
    const paramDoms =  data?.paramDoms ?  data?.paramDoms : undefined
    const result = await service.getDataModelN({paramDoms, ...data, modelo:modelo, token:token},handleError)    
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
const getGroupedModels = async (req, res) =>{    
    const data =  req.body
    const token =  req.headers.authorization
    const result =  await service.getGroupedModels({...data, token:token, ...req.body}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}
const saveModel = async (req, res)=>{
    //const modelo = req.params.modelo
    const token =  req.headers.authorization  
    
    const result = await service.saveModel({token: token, ...req.body}, handleError)
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
  }


module.exports = {
    
    
    getDataModel1, 
    getDataModelN, getDataModelNew, getDataParaDomIdxModel,
    getDataCboxLigado, getGroupedModels,
    saveModel
} 