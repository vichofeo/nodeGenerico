const frmService = require('../../services/frms/FrmsService')



const getDataModelParam =  async (req, res) =>{    
    const modelo = req.params.modelo
    const token =  req.headers.authorization
    const result = await frmService.getDataModelParam({modelo:modelo, token: token})
    res.json(result)
  }

module.exports = {
    getDataModelParam
}