 
const QUtils = require('../../models/queries/Qutils')
const qUtil = new QUtils()

const parametros = JSON.stringify(require('./parameters'))
const PARAMETROS = JSON.parse(parametros)

const pcboxs = JSON.stringify(require('./params_cboxs'))
const PCBOXS = JSON.parse(pcboxs)

const FrmUtils = require('../frms/FrmsUtils')
const frmUtil = new FrmUtils()

const estado_conclusion='7'
const estado_revision='15'

const getControlAbastecimiento = async (dto) => {
  try {
    
    const paramLocalModelo = !dto.swModel ? 'abastecimienton' : 'evaluacion_todes'
    dto.modelos = [paramLocalModelo]
console.log("\n\n\n&&&&&&&&&&&& PROCESADOR GENERICO MODELO: ",dto ," &&&&&&&&&&&&\n\n\n")
    frmUtil.setParametros(PARAMETROS)
    await frmUtil.getDataParams(dto)
    const result = frmUtil.getResults()

    const obj_cnf = await verificaPrimal(dto.idx)

    return {
      ok: true,
      data: result,
      role: obj_cnf,
      message: 'Resultado exitoso. Parametros obtenidos',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error de sistema: NEGOCYCNFFORMS',
      error: error.message,
    }
  }
}


module.exports = {
    getControlAbastecimiento
 
}