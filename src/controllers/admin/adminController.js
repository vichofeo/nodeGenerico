const srv = require('./../../services/admin/AdminServices')

const getDataForParam = async(req, res)=>{
  const modelo = req.params.modelo
  const token =  req.headers.authorization
  const result = await srv.getDataForParam({modelo:modelo, token: token})
  res.json(result)
}

const getDataModelByIdxModel =  async (req, res) =>{
  const idx = req.params.idx
  const modelo = req.params.modelo
  const token =  req.headers.authorization
  const result = await srv.getDataModelByIdxModel({idx:idx, modelo:modelo, token: token})
  res.json(result)
}


const getDataModelForNewReg =  async(req, res) =>{
  const idx = req.body.idx    
  const modelo = req.body.modelo
  const token =  req.headers.authorization            
  const result = await srv.getDataModelByIdxModel({idx:idx, modelo:modelo, token: token})
  res.json(result)
}


const saveDataModifyInsertByModel =  async(req, res) =>{
  console.log("\n\n\n\n\n GUARDANDOOOO .......................")
  const token =  req.headers.authorization   
  console.log("\n\nPAYLOAD, ", req.body)         
  const result = await srv.saveDataModifyInsertByModel({token:token, ...req.body})
  res.json(result)
}


module.exports = {
  getDataForParam,
  getDataModelByIdxModel,
  getDataModelForNewReg,
  saveDataModifyInsertByModel
}
