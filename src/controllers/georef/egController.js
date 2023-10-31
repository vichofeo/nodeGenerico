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
    const result = await egService.getDataFrm({idx:idx, modelo:modelo})
    res.json(result)
  }
  module.exports = {
    dataEESS,  saveDataEESS, getDataFrm
  }