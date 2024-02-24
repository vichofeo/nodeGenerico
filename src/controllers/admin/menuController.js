const menuGeoRef = require('../../services/admin/MenuService')
const HandleErrors = require('../../utils/handleErrors')
const handleError  = new HandleErrors()

const menuGeoreferencia = async (req, res) => {
  try {
    handleError.setRes(res)
    const token = req.headers.authorization
    const result = await menuGeoRef.menuGeoreferencia(token, handleError)
    res.json(result)
   //handleError.handleResponse(result)  
  } catch (error) {
    console.log("-------------------ERROR-------------------", error.message)
  }
  
}

module.exports = {
  menuGeoreferencia,
}
