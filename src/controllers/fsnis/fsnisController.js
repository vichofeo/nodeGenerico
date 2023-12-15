const fsnisService = require('../../services/fsnis/fsnisService')

const fsnisReportParams = async(req, res) =>{    
    const token =  req.headers.authorization
  
    const result = await fsnisService.fsnisReportParams({token: token, ...req.body})
    res.json(result)
  }



module.exports = {
  fsnisReportParams
}  


