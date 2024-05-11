const HandleErrors = require('./../../utils/handleErrors')
const handleError = new HandleErrors()

const service =  require('./../../services/acrehab/evaluacionService')

//para obtener el arbol de evaluacion
const getDataFrm = async (req, res)=>{    
    const idx =  req.params.idx    
    const token = req.headers.authorization

    const result = await service.getDataFrm({idx:idx, token:token}, handleError)
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
    
}
const getDataFrmView = async (req, res)=>{    
    const idx =  req.params.idx    
    const token = req.headers.authorization

    const result = await service.getDataFrmView({idx:idx, token:token}, handleError)
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
    
}

const getDataFrmSimplex = async(req, res)=>{
    const idx =  req.params.idx    
    const key =  req.params.key    
    const token = req.headers.authorization

    const result = await service.getDataFrmSimplex({idx:idx, token:token, codigo:key}, handleError)
    handleError.setResponse(result)
    
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const getDataFrmSimplexView = async(req, res)=>{
    const idx =  req.params.idx    
    const key =  req.params.key    
    const token = req.headers.authorization

    const result = await service.getDataFrmSimplexView({idx:idx, token:token, codigo:key}, handleError)
    handleError.setResponse(result)
    
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const evalSimplexSave = async (req, res) =>{        
    const token =  req.headers.authorization

    const result =  await service.evalSimplexSave({ token:token, ...req.body}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const getDataMonitorView = async (req, res)=>{    
    const idx =  req.params.idx    
    const token = req.headers.authorization

    const result = await service.getDataMonitorView({idx:idx, token:token}, handleError)
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
    
}

const getDataEvalView = async (req, res)=>{    
    const idx =  req.params.idx    
    const token = req.headers.authorization

    const result = await service.getDataEvalView({idx:idx, token:token}, handleError)
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
    
}

const getFrmView = async (req, res)=>{    
    const idx =  req.params.idx    
    const token = req.headers.authorization
    
    const result = await service.getFrmView({idx:idx, token:token}, handleError)
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
    
}

/**
 * seccion para plan de accion 
 */
const pacSave = async (req, res) =>{        
    const token =  req.headers.authorization

    const result =  await service.pacSave({ token:token, ...req.body}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}
const pacView = async (req, res)=>{    
    const idx =  req.params.idx    
    const token = req.headers.authorization

    const result = await service.pacView({idx:idx, token:token}, handleError)
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
    
}
const tpacSave = async (req, res) =>{        
    const token =  req.headers.authorization

    const result =  await service.tpacSave({ token:token, ...req.body}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}
const tpacReport = async (req, res) =>{        
    const token =  req.headers.authorization

    const result =  await service.tpacReport({ token:token, ...req.body}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}
module.exports =  {
    getDataFrm, getDataFrmView,
    getDataFrmSimplex,  getDataFrmSimplexView,
    evalSimplexSave,
    getDataMonitorView, getDataEvalView, 
    getFrmView,
    pacSave, pacView, tpacSave, tpacReport
}