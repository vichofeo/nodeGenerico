const HandleErrors = require('./../../utils/handleErrors')
const handleError = new HandleErrors()

const service =  require('./../../services/acrehab/acrehabService')

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

const acrehabEvalSave = async (req, res) =>{        
    const token =  req.headers.authorization

    const result =  await service.acrehabEvalSave({ token:token, ...req.body}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}




module.exports = {
    
    
    getDataModel1, 
    getDataModelN, getDataModelNew, 
    getDataCboxLigado,
    acrehabEvalSave, 


}