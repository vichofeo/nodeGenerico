 const HandleErrors = require('../../utils/handleErrors.js')
const handleError = new HandleErrors()

const service =  require('../../services/upfs/registroService.js')

const getControlRegis = async(req, res)=>{
  //const idx = req.params.idx
  const token =  req.headers.authorization
  const data =  req.body
  const paramDoms =  data?.paramDoms ?  data?.paramDoms : undefined
  const result = await service.getControlRegis({paramDoms ,idx:data.idx, token: token})
  res.json(result)
}

const saveRegCtrlRegis = async(req, res)=>{  
  const token =  req.headers.authorization
  const result = await service.saveRegCtrlRegis({data:req.body, token: token}, handleError)
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
    getControlRegis,
    saveRegCtrlRegis, getDataRegistrador,

}