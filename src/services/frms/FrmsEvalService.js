const handleJwt = require('./../../utils/handleJwt')

const cnf_cboxs = JSON.stringify(require('./params_cboxs'))
const PCBOXS = JSON.parse(cnf_cboxs)

const parametros = JSON.stringify(require('./parameters'))
const PARAMETROS = JSON.parse(parametros)

const FrmUtils = require('./FrmsUtils')
const frmUtil = new FrmUtils()

const QUtils = require('../../models/queries/Qutils')
const qUtil = new QUtils()

const { v4: uuidv4 } = require('uuid')

const servicesBasics = require('./FrmsService')

const verificaPrimal = async (f_id) => {
  const obj_cnf = await frmUtil.getRoleSession()
  const obj_session = frmUtil.getObjSession()

  //verifica pertinencia de datos segun configuracion de firmularios
  //qUtil.setTableInstance('f_formulario_institucion_cnf')
  let query = `SELECT COUNT(*) as conteo
              FROM f_formulario_institucion_cnf cnf
              WHERE cnf.formulario_id='${f_id}' AND cnf.institucion_id = '${obj_session.institucion_id}'
              AND EXTRACT(DAY FROM NOW()) <= cnf.limite_dia`
  qUtil.setQuery(query)
  await qUtil.excuteSelect()
  const control = qUtil.getResults()

  //verifica si ya existe el registro con el periodo actual
  query = `SELECT COUNT(*) AS existencia
FROM f_formulario_registro
WHERE formulario_id='${f_id}' AND institucion_id='${obj_session.institucion_id}' AND periodo=TO_CHAR(NOW(),'YYYYMM')`
  qUtil.setQuery(query)
  await qUtil.excuteSelect()
  const existe = qUtil.getResults()

  if (obj_cnf.primal && control[0].conteo > 0 && existe[0].existencia <= 0)
    obj_cnf.primal = true
  else obj_cnf.primal = false
  return obj_cnf
}

const getEvalForms = async (dto) => {
  try {
    const paramLocalModelo = 'evaluacionn'
    dto.modelos = [paramLocalModelo]

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
const saveEvalForm = async (dto, handleError) => {
  try {
    await qUtil.startTransaction()
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession() //await frmUtil.getRoleSession()

    qUtil.setTableInstance('f_formulario_registro')
    qUtil.setDataset(Object.assign(dto.data, obj_cnf))

    await qUtil.create()
    const result = qUtil.getResults()
    
    await qUtil.commitTransaction()

    //guarda todos parametros formulario
    const respuestas =   await construyeDatos({ idx: dto.data.formulario_id, token: dto.token })
    await servicesBasics.saveFormsRes({frm: dto.data.formulario_id, respuestas: respuestas, idx:result.registro_id, token: dto.token})

    
    return await getEvalForms({ idx: dto.data.formulario_id, token: dto.token })

    

    //getEvalForms(dto, handleError)
    //return {}
  } catch (error) {
    await qUtil.rollbackTransaction()
    console.log('\n\nerror::: EN SERVICES SAVE\n', error)
    handleError.setMessage('Error de sistema: FRMSPERSAVE')
    handleError.setHttpError(error.message)
  }
}

const construyeDatos = async (dto) =>{
  frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()

  const datos = await servicesBasics.getFrmsInfo(dto)

  const respuestas = {}

  for (const seccion of datos.data[0].sections) {
    respuestas[seccion.sfrm] = {}    
    for (const pregunta of seccion.questions) {
      respuestas[seccion.sfrm][pregunta.efrm] = {answers:{}, tipo:pregunta.type}

      if([0,1,2].includes(pregunta.type))
        respuestas[seccion.sfrm][pregunta.efrm].answers = {[pregunta.answers[0].ofrm]:null}
      if([3].includes(pregunta.type)){
        for (const fila of pregunta.questions) {
          respuestas[seccion.sfrm][pregunta.efrm].answers[fila.efrm]={}
          for (const col of fila.answers) 
            respuestas[seccion.sfrm][pregunta.efrm].answers[fila.efrm][col.ofrm]=0
        }          
      }

      if([100].includes(pregunta.type)){
        respuestas[seccion.sfrm][pregunta.efrm].answers.tabla = []
        //solo para row y col con repeat ==0
        if(pregunta.mrow && pregunta.mcol && !pregunta.mscol && pregunta.repeat<=0){
          for(const trow of pregunta.mrow.fatributos){
            let tmp = []
            for(const tcol of pregunta.mcol.fatributos){
              tmp.push( {
                  col: tcol.value,
                  scol: null,
                  valor: 0,
                  row: trow
                }
              )
            }
            respuestas[seccion.sfrm][pregunta.efrm].answers.tabla.push(tmp)
          }
        }

        //solo para row y col con repeat >0
        if(pregunta.mrow && pregunta.mcol && !pregunta.mscol && pregunta.repeat>0){
          for (let index=0; index<pregunta.repeat ;index++) {
            let tmp = []
            for(const tcol of pregunta.mcol.fatributos){
              tmp.push( {
                  col: tcol.value,
                  scol: null,
                  valor: 0,
                  row: pregunta.mrow.fatributos[index] ? pregunta.mrow.fatributos[index]:pregunta.mrow.fatributos[0]
                }
              )
            }
            respuestas[seccion.sfrm][pregunta.efrm].answers.tabla.push(tmp)
          }
        }

        //solo para row, col y scol con repeat ==0
        if(pregunta.mrow && pregunta.mcol && pregunta.mscol && pregunta.repeat<=0){

          for (const trow of pregunta.mrow.fatributos) {
            const tmp = []
            for (const tcol of pregunta.mcol.fatributos) {              
              for (const tscol of pregunta.mscol.fatributos) {
                tmp.push({
                  col: tcol.value,
                  scol: tscol.value,
                  valor: 0,
                  row: trow
                })
              }
            }
            respuestas[seccion.sfrm][pregunta.efrm].answers.tabla.push(tmp)
          }
        }
        
        //solo para row, col, scol y repeat >0
        if(pregunta.mrow && pregunta.mcol && pregunta.mscol && pregunta.repeat>0){

          for (let index=0; index<pregunta.repeat ;index++) {
            const tmp = []
            for (const tcol of pregunta.mcol.fatributos) {              
              for (const tscol of pregunta.mscol.fatributos) {
                tmp.push({
                  col: tcol.value,
                  scol: tscol.value,
                  valor: 0,
                  row: pregunta.mrow.fatributos[index] ? pregunta.mrow.fatributos[index]:pregunta.mrow.fatributos[0]                  
                })
              }
            }
            respuestas[seccion.sfrm][pregunta.efrm].answers.tabla.push(tmp)
          }
        }
      }

    }
  }

  console.log("********************************************\n\n\n")
  console.log("respuestas:", respuestas)
  console.log("********************************************\n\n\n")

  //datos.xyz = respuestas
  //return datos

  return respuestas
}
module.exports = {
  getEvalForms,
  saveEvalForm,
}
