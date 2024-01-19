const AUXILIAR = JSON.stringify(require('../../config/parameters2'))
const PARAMETROS = JSON.parse(AUXILIAR)
const original = JSON.parse(AUXILIAR)

const services = require('./FrmsUtils')
const objService =  new services()

const getDataModelParam = async (dto) => {
    dto.modelos = [dto.modelo]   
    objService.setParametros(PARAMETROS) 
    const result = objService.getDataParams(dto)
    delete result.institucion
    return result
}
 
module.exports = {
    getDataModelParam
}