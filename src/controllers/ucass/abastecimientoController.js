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

module.exports = {
    getControlAbastecimiento
}