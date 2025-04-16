
const QUtils = require('../../models/queries/Qutils')
const qUtil = new QUtils()

const parametros = JSON.stringify(require('./parameters'))
const PARAMETROS = JSON.parse(parametros)

const pcboxs = JSON.stringify(require('./params_cboxs'))
const PCBOXS = JSON.parse(pcboxs)

const LOADERS = require('./parametersLoad.js')

const FrmUtils = require('../frms/FrmsUtils')
const frmUtil = new FrmUtils()

const estado_conclusion = '7'
const estado_revision = '15'

/**
 * verifica permisos para crear formulario en periodo de evaluacion
 * 
 * @returns 
 */
const verificaPrimalRegistro = async (idx) => {
  const obj_cnf = await frmUtil.getRoleSession()
  const obj_session = frmUtil.getObjSession()

  console.log("obj_cnf", obj_cnf)
  console.log("obj_ss", obj_session)
  //verifica pertinencia de datos segun configuracion de firmularios
  //qUtil.setTableInstance('f_formulario_institucion_cnf')
  console.log("\n\n verifica pertinencia de datos segun configuracion de firmularios\n\n")
  let query = `SELECT COUNT(*) as conteo
              FROM upf_file_institucion_cnf cnf
              WHERE cnf.institucion_id = '${obj_session.institucion_id}' and cnf.file_tipo_id ='${idx}'
              AND (EXTRACT(DAY FROM NOW()) <= cnf.limite_dia
              OR (cnf.opening_delay = TO_CHAR(CURRENT_DATE - INTERVAL '1 month','YYYY-MM') AND EXTRACT(DAY FROM NOW()) <= cnf.limite_plus)
              )`
  qUtil.setQuery(query)
  await qUtil.excuteSelect()
  const control = qUtil.getResults()

  //verifica si ya existe el registro PARA EL PERIODO ANTERIOR
  console.log("\n\n verifica si ya existe el registro PARA EL PERIODO ANTERIOR\n\n")
  query = `SELECT COUNT(*) AS existencia
          FROM upf_registro
          WHERE institucion_id='${obj_session.institucion_id}' and file_tipo_id='${idx}'
          AND periodo=TO_CHAR(NOW() - INTERVAL '1 month','YYYY-MM')` //periodo=TO_CHAR(NOW(),'YYYYMM')
  qUtil.setQuery(query)
  await qUtil.excuteSelect()

  const existe = qUtil.getResults()

  if (obj_cnf.primal && control[0].conteo > 0 && existe[0].existencia <= 0)
    obj_cnf.primal = true
  else obj_cnf.primal = false
  return obj_cnf
}

const verificaFechasAbasEnProcesamiento = async (r_id) => {
  const obj_cnf = await frmUtil.getRoleSession()
  const obj_session = frmUtil.getObjSession()
  console.log("\n\n...............")

  qUtil.setTableInstance('upf_registro')
  qUtil.setAttributes([[qUtil.literal(`${obj_cnf.primal} AND concluido::DECIMAL<${estado_conclusion} AND 
                      (CURRENT_DATE<= fecha_climite OR (ctype_plus<>'c0' AND CURRENT_DATE <=flimite_plus))`), 'primal'],
  [qUtil.literal('CURRENT_DATE'), 'fecha']])
  qUtil.setWhere({ registro_id: r_id })
  await qUtil.findTune()

  const r = qUtil.getResults()
  console.log("\n\n ********************> PRIMAL ABSTECIMIENTO:::::::", r, "::::::::::::::\n")
  if (r.length > 0) {
    return { primal: r[0].primal }
  } else {
    return { primal: false }
  }
}
const verificaPermisoAbasEnProcesamiento = async (dto) => {
  try {

    const obj_cnf = frmUtil.getObjSession()
    const idx = dto.data.reg

    qUtil.setResetVars()
    console.log("\n\n ***********VERIFICANDO PERMISO PARA SUBIR INFORMACION ********** \n\n")
    qUtil.setTableInstance('upf_registro')
    await qUtil.findID(idx)
    const r = qUtil.getResults()
    qUtil.setResetVars()

    if (r.concluido == estado_conclusion || r.dni_register != obj_cnf.dni_register)
      r.concluido = true
    else {
      //verifica primal segun dias limite
      const obj_ctrl = await verificaFechasAbasEnProcesamiento(idx)//await verificaPrimal(r.formulario_id)
      console.log("\n\n ***********VALIDEZ REGISTRO ABASTECIMIENTO ********** \n\n", obj_ctrl)
      r.concluido = obj_ctrl.primal
      if (obj_ctrl.primal)
        r.concluido = false
      else
        r.concluido = true
    }

    //verifica estado de conclusion
    return {
      ok: true,
      data: r,
      //obj:obj_cnf,
      message: 'Resultado exitoso. Parametros Evaluacion obtenido',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error de sistema: ABASVERIFYDATA',
      error: error.message,
    }
  }
}

const getControlRegis = async (dto) => {
  try {

    const paramLocalModelo = !dto.model ? 'registradosn' : dto.model

    //titulo de la carga
    qUtil.setTableInstance("upf_file_tipo")
    qUtil.setInclude({
      association: 'ufgroup', required: true,
      attributes: ['nombre_grupo_file'],
    })
    await qUtil.findID(dto.idx)
    const tituloFile = qUtil.getResults()

    if (PARAMETROS.hasOwnProperty(paramLocalModelo) && Object.keys(tituloFile).length > 0) {
      dto.modelos = [paramLocalModelo]
      console.log("\n\n\n&&&&&&&&&&&& PROCESADOR GENERICO MODELO: ", dto, " &&&&&&&&&&&&\n\n\n")
      frmUtil.setParametros(PARAMETROS)
      await frmUtil.getDataParams(dto)
      const result = frmUtil.getResults()

      const obj_cnf = await verificaPrimalRegistro(dto.idx)



      return {
        ok: true,
        data: result,
        role: obj_cnf,
        title: `${tituloFile?.ufgroup?.nombre_grupo_file} - ${tituloFile?.nombre_tipo_archivo} (*.${tituloFile?.ext})`.replaceAll('undefined', '--'),
        message: 'Resultado exitoso. Parametros obtenidos',
      }
    } else {
      return {
        ok: false,
        message: 'Modelo de datos Inexistente',
      }
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

const saveRegCtrlRegis = async (dto, handleError) => {
  try {
    await qUtil.startTransaction()
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession() //await frmUtil.getRoleSession()
    delete dto.data.last_modify_date_time

    //obtiene fechas limite de conclusion y revision
    qUtil.setTableInstance('upf_file_institucion_cnf')
    qUtil.setAttributes([
      [qUtil.literal(`(to_date('${dto.data.periodo}','YYYY-MM') + CAST(limite_dia-1 ||'days' AS INTERVAL)) + INTERVAL '1 month'`), 'fecha_climite'],
      [qUtil.literal(`(to_date('${dto.data.periodo}','YYYY-MM') + CAST(revision_dia-1 ||'days' AS INTERVAL)) + INTERVAL '1 month'`), 'fecha_rlimite'],
      [qUtil.literal(`(to_date('${dto.data.periodo}','YYYY-MM') + CAST(limite_plus-1 ||'days' AS INTERVAL)) + INTERVAL '1 month'`), 'flimite_plus'],
      [qUtil.literal(`(to_date('${dto.data.periodo}','YYYY-MM') + CAST(revision_plus-1 ||'days' AS INTERVAL)) + INTERVAL '1 month'`), 'frevisado_plus'],
      'opening_delay'
    ])
    qUtil.setWhere({ institucion_id: dto.data.institucion_id, file_tipo_id: dto.data.file_tipo_id })
    await qUtil.findTune()
    const data_cnfFrm = qUtil.getResults()

    //repone configuracion en caso de ser registro por demora
    if (data_cnfFrm[0].opening_delay) {
      console.log("\n *************REGISTRO POR DEMORA :::::\n")
      const obj_mod = frmUtil.getObjSessionForModify()
      delete obj_mod.institucion_id
      qUtil.setDataset({ opening_delay: null, ...obj_mod })
      await qUtil.modify()
      data_cnfFrm[0].ctype_plus = 'c1'
    }

    qUtil.setTableInstance('upf_registro')
    qUtil.setDataset(Object.assign(obj_cnf, data_cnfFrm[0], dto.data))

    await qUtil.create()
    const result = qUtil.getResults()

    await qUtil.commitTransaction()

    //actualiza cxy del registro enviado


    return await getControlRegis({ idx: null, token: dto.token, idx: dto.data.file_tipo_id, model: dto.data.ForeignModel })



    //getEvalForms(dto, handleError)
    //return {}
  } catch (error) {
    await qUtil.rollbackTransaction()
    console.log('\n\nerror::: EN SERVICES SAVE\n', error)
    handleError.setMessage('Error de sistema: FRMSPERSAVE')
    handleError.setHttpError(error.message)
  }
}

const getDataRegistrador = async (dto, handleError) => {
  try {
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()

    //extrae informacion de titulos 
    qUtil.setTableInstance('upf_registro')
    qUtil.setInclude({
      association: 'ufrinst', required: true,
      attributes: ['nombre_institucion'],
      include: [{
        association: 'father', required: true,
        attributes: ['nombre_institucion'],
      },
      {
        association: 'dpto', required: true,
        attributes: ['nombre_dpto'],
      }
      ]
    })
    qUtil.pushInclude({
      association: 'ufregister', required: true,
      attributes: ['primer_apellido', 'segundo_apellido', 'nombres'],
    })

    await qUtil.findID(dto.data.idx)

    const result = qUtil.getResults()

    const dataresponse = {
      eg: result.ufrinst.father.nombre_institucion,
      eess: result.ufrinst.nombre_institucion,
      dpto: result.ufrinst.dpto.nombre_dpto,
      usr: `${result.ufregister.primer_apellido} ${result.ufregister.segundo_apellido} ${result.ufregister.nombres}`,
    }

    return {
      ok: true,
      data: dataresponse,

      message: 'Resultado exitoso. Parametros obtenidos',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error de sistema: NEGOCYCNINFOReGFFORMS',
      error: error.message,
    }
  }
}


module.exports = {
  getControlRegis,
  saveRegCtrlRegis,
  getDataRegistrador,
  verificaPermisoAbasEnProcesamiento

}