
const HandleErrors = require('../../utils/handleErrors.js')
const handleError = new HandleErrors()

const service =  require('../../services/upfs/loaderService.js')
const registroService =  require('../../services/upfs/registroService')

//para iniciar parametros
const initialData = async (req, res) =>{    
    const body =  req.body
    const token =  req.headers.authorization

    const result =  await service.initialData({token:token, data: body}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const dataLoadingReport = async (req, res) =>{    
    const body =  req.body
    const token =  req.headers.authorization

    const result =  await service.dataLoadingReport({token:token, ...body}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const getDataLoadingReport = async (req, res) =>{
    //handleError.setRes(res)    ???
    const body =  req.body
    const token =  req.headers.authorization

    const result =  await service.getDataLoadingReport({token:token, modelo: body.model, condicion:body.solicitud, option:body?.option}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
    
}

const loadersComprobate = async (req, res) =>{
    //handleError.setRes(res)    ???
    const body =  req.body
    const token =  req.headers.authorization

    const result =  await service.loadersComprobate({token:token, data:body}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
    
}
const verificaPermisoAbasEnProcesamiento = async(req, res)=>{
  
  const token =  req.headers.authorization
  const result = await registroService.verificaPermisoAbasEnProcesamiento({data:req.body, token: token}, handleError)
  handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())

  //res.json(result)
}
const actualizaEstadoLoader = async(req, res)=>{
  
    const token =  req.headers.authorization
    const result = await service.actualizaEstadoLoader({data:req.body, token: token}, handleError)
    handleError.setResponse(result)
      res.status(handleError.getCode()).json(handleError.getResponse())
  
    //res.json(result)
  }

  /**
   * cargado a BD proveniente de comboFile
   * @param {*} req 
   * @param {*} res 
   */
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
    
    initialData, dataLoadingReport, getDataLoadingReport,
    loadersComprobate,
    verificaPermisoAbasEnProcesamiento,
    actualizaEstadoLoader,

    xlsxLoad, xlsxNormalize

}