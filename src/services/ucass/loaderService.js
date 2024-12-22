 
const QUtils = require('../../models/queries/Qutils')
const qUtil = new QUtils()

const parametros = JSON.stringify(require('./parameters'))
const PARAMETROS = JSON.parse(parametros)

const pcboxs = JSON.stringify(require('./params_cboxs'))
const PCBOXS = JSON.parse(pcboxs)

const LOADERS = require('./parametersLoad.js')

const FrmUtils = require('../frms/FrmsUtils')
const frmUtil = new FrmUtils()

const estado_conclusion='7'
const estado_revision='15'



//metodos para el cargado
const initialData = (dto, handleError) => {
  try {
    const data = LOADERS
    const d = {}
    for (const key in data) {
      d[key] = {
        file: data[key].file,
        table: data[key].table,
        forFilter: data[key].forFilter,
        applyFilter: data[key].filterByFunc ? true : false,
      }
    }

    return {
      ok: true,
      data: d,
    }
  } catch (error) {
    console.log(error)
    handleError.setMessage('Error de sistema: LOADINITIALSRV')
    handleError.setHttpError(error.message)
    console.log('error:::', error)
  }
}
module.exports = {
    
    initialData
 
}