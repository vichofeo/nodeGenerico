const HandleErrors = require('./../../utils/handleErrors')
const handleError = new HandleErrors()

const service =  require('./../../services/observatorio/observatorioService')


const getDataCboxLigado = async (req, res) =>{    
    const modelo =  req.body.modelo
    const token =  req.headers.authorization

    const result =  await service.getDataCboxLigado({modelo:modelo, token:token, ...req.body}, handleError) 
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}





module.exports = {

    getDataCboxLigado,



}