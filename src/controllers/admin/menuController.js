const menuGeoRef = require('../../services/admin/MenuService')

const menuGeoreferencia = async (req, res) =>{
    const token =  req.headers.authorization    
const result =  await menuGeoRef.menuGeoreferencia(token)
res.json(result)
}



module.exports = {
    menuGeoreferencia
}