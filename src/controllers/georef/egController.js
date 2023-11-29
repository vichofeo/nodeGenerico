const egService = require('../../services/georef/EgService')

const dataEESS = async(req, res) =>{
    const idx = req.params.idx
    const token =  req.headers.authorization
  
    const result = await egService.dataEESS({idx:idx, token: token})
    res.json(result)
  }

  const saveDataEESS = async(req, res) =>{    
    const datoDTO =  req.body
  
    const result = await egService.saveDataEESS(datoDTO)
    res.json(result)
  }

  const getDataFrm =  async (req, res) =>{
    const idx = req.params.idx
    const modelo = req.params.modelo
    const token =  req.headers.authorization
    const result = await egService.getDataFrm({idx:idx, modelo:modelo, token: token})
    res.json(result)
  }

  const getDataModelParam =  async (req, res) =>{    
    const modelo = req.params.modelo
    const token =  req.headers.authorization
    const result = await egService.getDataModelParam({modelo:modelo, token: token})
    res.json(result)
  }
const getDataModelByIdxParam =  async(req, res) =>{
    const idx = req.body.idx    
    const modelo = req.body.modelo
    const token =  req.headers.authorization            
    const result = await egService.getDataModelByIdxParam({idx:idx, modelo:modelo, token: token, noverify:true})
    res.json(result)
}
const saveDataModelByIdxParam =  async(req, res) =>{
  const token =  req.headers.authorization            
  const result = await egService.saveDataModelByIdxParam({token:token, ...req.body})
  res.json(result)
}


const weUsersget = async (req, res) =>{      
    const token =  req.headers.authorization
    const result = await egService.weUsersget({token:token, idx:'-1', swAll:true})
    res.json(result)
}
const weUserget = async (req, res) =>{      
  const token =  req.headers.authorization
  const idx = req.params.idx
  const result = await egService.weUsersget({token:token, idx:idx, swAll:false})
  res.json(result)
}

const weUserSave = async(req, res) =>{
  const token =  req.headers.authorization
  const datos = req.body
  const result = await egService.weUserSave({token:token, data: datos})
  res.json(result)
}

//modulo mis establecimeintos
const misEess = async(req, res) =>{
  const token =  req.headers.authorization  
  const result = await egService.misEess({token:token})
  res.json(result)
}
  module.exports = {
    dataEESS,  saveDataEESS, getDataFrm,
    weUsersget, weUserget, weUserSave,
    getDataModelParam, getDataModelByIdxParam, saveDataModelByIdxParam,
    misEess
  }