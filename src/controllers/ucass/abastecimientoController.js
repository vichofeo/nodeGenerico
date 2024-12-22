 const HandleErrors = require('../../utils/handleErrors.js')
const handleError = new HandleErrors()

const service =  require('../../services/ucass/abastecimientoService.js')

const getControlAbastecimiento = async(req, res)=>{
  //const idx = req.params.idx
  const token =  req.headers.authorization
  const data =  req.body
  const paramDoms =  data?.paramDoms ?  data?.paramDoms : undefined
  const result = await service.getControlAbastecimiento({paramDoms ,idx:data.idx, token: token, swModel:data.swAll})
  res.json(result)
}

const saveRegCtrlAbas = async(req, res)=>{  
  const token =  req.headers.authorization
  const result = await service.saveRegCtrlAbas({data:req.body, token: token}, handleError)
  handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())

  //res.json(result)
}
const getDataRegistrador = async(req, res)=>{  
  const token =  req.headers.authorization
  const result = await service.getDataRegistrador({data:req.body, token: token}, handleError)
  handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())

}


module.exports = {
    getControlAbastecimiento,
    saveRegCtrlAbas, getDataRegistrador,

}