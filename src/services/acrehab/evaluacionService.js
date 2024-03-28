const { Association } = require('sequelize')
const HandleErrors = require('../../utils/handleErrors')
const QUtils = require('./../../models/queries/Qutils')
const qUtil = new QUtils()

const handleJwt = require('./../../utils/handleJwt')

const parametros = JSON.stringify(require('./parameters'))
const PARAMETROS = JSON.parse(parametros)

const pcboxs = JSON.stringify(require('./params_cboxs'))
const PCBOXS = JSON.parse(pcboxs)

const FrmUtils = require('./../frms/FrmsUtils')

const frmUtil = new FrmUtils()

const getDataTreeFrm = async (group_id, datos) => {
  datos.children = []
  qUtil.setTableInstance('u_frm')
  qUtil.setAttributes([
    ['frm_id', 'id'],
    [qUtil.literal("codigo ||': ' || nombre_frm "), 'name'],
    'proposito',
    'codigo',
  ])
  qUtil.setWhere({
    codigo_root: datos.codigo,
    frm: group_id,
    parametro: null,
    activo: 'Y',
  })
  qUtil.setOrder(['orden'])
  await qUtil.findTune()
  const result = qUtil.getResults()
  for (const element of result) {
    //console.log("/*********************::", element.codigo," ->", element.nombre_frm)
    const tmp = await getDataTreeFrm(group_id, element)
    datos.children.push(tmp)
  }

  return datos
}
const getDataFrmView = async (dto, handleError) => {
  try {
    // obtiene datos de session
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()

    const idx = dto.idx
    //obtiene for de cnf evaluacion
    qUtil.setTableInstance('u_frm_evaluacion')
    await qUtil.findID(idx)
    const results = qUtil.getResults()

    const frm_group = results.frm_id
    const frm_id = results.frm_id
    //dato incial de formulario
    qUtil.setResetVars()
    qUtil.setTableInstance('u_frm')
    await qUtil.findID(frm_id)
    const result = qUtil.getResults()

    const datos = await getDataTreeFrm(frm_group, {
      id: result.frm_id,
      name: result.nombre_frm,
      codigo: result.codigo,
      proposito: result.proposito,
    })

    return {
      ok: true,
      data: [datos],
      message: 'Requerimiento Exitoso',
    }
  } catch (error) {
    console.log(error)
    handleError.setMessage('Error de sistema: GETDATVIEWSRV')
    handleError.setHttpError(error.message)
  }
}
const getDataFrm = async (dto, handleError) => {
  try {
    // obtiene datos de session
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()

    const idx = dto.idx
    //obtiene for de cnf evaluacion
    qUtil.setTableInstance('u_frm_evaluacion')
    await qUtil.findID(idx)
    const results = qUtil.getResults()
    if (
      results?.dni_evaluador &&
      results.dni_evaluador == obj_cnf.dni_register
    ) {
      //construye informacion para extarer datos de los formularios
      const frm_group = results.frm_id
      const frm_id = results.frm_id
      //dato incial de formulario
      qUtil.setResetVars()
      qUtil.setTableInstance('u_frm')
      await qUtil.findID(frm_id)
      const result = qUtil.getResults()

      console.log(
        '/-------------------::',
        result.codigo,
        ' ->',
        result.nombre_frm
      )
      const datos = await getDataTreeFrm(frm_group, {
        id: result.frm_id,
        name: result.nombre_frm,
        codigo: result.codigo,
        proposito: result.proposito,
      })

      return {
        ok: true,
        data: [datos],
        message: 'Requerimiento Exitoso',
      }
    } else {
      return {
        ok: false,
        //data: result,
        message: 'Este usuario No esta autorizado para realizar esta tarea.',
      }
    }
  } catch (error) {
    console.log(error)
    handleError.setMessage('Error de sistema: ACREHABDATNSRV')
    handleError.setHttpError(error.message)
  }
}

const getDataFrmSimplex = async (dto, handleError) => {
  try {
    // obtiene datos de session
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()

    const idx = dto.idx
    //obtiene for de cnf evaluacion
    qUtil.setTableInstance('u_frm_evaluacion')
    await qUtil.findID(idx)
    const results = qUtil.getResults()
    if (
      results?.dni_evaluador &&
      results.dni_evaluador == obj_cnf.dni_register
    ) {
      //construye informacion para extarer datos de los formularios
      const frm_group = results.frm_id

      //dato incial de formulario
      qUtil.setResetVars()
      qUtil.setTableInstance('u_frm')
      qUtil.setAttributes([
        ['frm_id', 'idx'],
        'parametro',
        ['ordenanza', 'medio'],
        'obligatorio',
        'aplica',
        'codigo',
      ])
      qUtil.setWhere({
        frm: frm_group,
        parametro: qUtil.notNull(),
        codigo_root: dto.codigo,
        activo: 'Y',
      })
      qUtil.setOrder(['orden'])

      //includes
      qUtil.setInclude({
        association: 'valor',
        required: false,
        attributes: [['valores_id', 'idx'], 'valor', ['observacion', 'obs']],
        where: { evaluacion_id: idx },
      })

      await qUtil.findTune()
      const result = qUtil.getResults()

      return {
        ok: true,
        data: result,
        message: 'Requerimiento Exitoso',
      }
    } else {
      return {
        ok: false,
        //data: result,
        message: 'Este usuario No esta autorizado para realizar esta tarea.',
      }
    }
  } catch (error) {
    //console.log(error)
    console.log('\n\nerror::: EN SERVICES\n')
    handleError.setMessage('Error de sistema: ACREHABDATNSRV')
    handleError.setHttpError(error.message)
  }
}

const getDataFrmSimplexView = async (dto, handleError) => {
  try {
    // obtiene datos de session
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()

    const idx = dto.idx
    //obtiene for de cnf evaluacion
    qUtil.setTableInstance('u_frm_evaluacion')
    await qUtil.findID(idx)
    const results = qUtil.getResults()

    //construye informacion para extarer datos de los formularios
    const frm_group = results.frm_id

    //dato incial de formulario
    qUtil.setResetVars()
    qUtil.setTableInstance('u_frm')
    qUtil.setAttributes([
      ['frm_id', 'idx'],
      'parametro',
      ['ordenanza', 'medio'],
      'obligatorio',
      'aplica',
      'codigo',
    ])
    qUtil.setWhere({
      frm: frm_group,
      parametro: qUtil.notNull(),
      codigo_root: dto.codigo,
      activo: 'Y',
    })
    qUtil.setOrder(['orden'])

    //includes
    qUtil.setInclude({
      association: 'valor',
      required: false,
      attributes: [['valores_id', 'idx'], 'valor', ['observacion', 'obs']],
      where: { evaluacion_id: idx },
    })

    await qUtil.findTune()
    const result = qUtil.getResults()

    return {
      ok: true,
      data: result,
      message: 'Requerimiento Exitoso',
    }
  } catch (error) {
    console.log(error)
    handleError.setMessage('Error de sistema: EVALSIMPLEXVIEWRV')
    handleError.setHttpError(error.message)
  }
}
const evalSimplexSave = async (dto, handleError) => {
  try {
    // obtiene datos de session
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()

    const idx = dto.idx
    //obtiene for de cnf evaluacion
    qUtil.setTableInstance('u_frm_evaluacion')
    await qUtil.findID(idx)
    const results = qUtil.getResults()
    if (
      results?.dni_evaluador &&
      results.dni_evaluador == obj_cnf.dni_register
    ) {
      //prepara datsos en formato
      const datos = dto.data
      //instancia tabla
      qUtil.setTableInstance('u_frm_valores')

      //inicia transaccion
      await qUtil.startTransaction()
      //obtiene ids id_frm|valor
      for (const key in datos.valor) {
        const tmp = datos.valor[key].split('|')
        let aux = { valor: tmp[1] ? tmp[1] : null, observacion: datos.obs[key] }
        if (dto.sw) {
          aux = { evaluacion_id: dto.idx, frm_id: tmp[0], ...aux }
          const payload = Object.assign(obj_cnf, aux)
          //guarda datos
          qUtil.setDataset(payload)
          await qUtil.create()
        } else {
          //modifica datos
          qUtil.setWhere({ valores_id: tmp[0] })
          delete obj_cnf.create_date
          obj_cnf.last_modify_date_time = new Date()
          const payload = Object.assign(obj_cnf, aux)
          qUtil.setDataset(payload)
          await qUtil.modify()
        }
      }
      //termina transaccion
      await qUtil.commitTransaction()

      return {
        ok: true,
        //data: payload,
        message: 'Requerimiento Exitoso. Parametros Guardados',
      }
    } else {
      return {
        ok: false,
        //data: result,
        message: 'Este usuario No esta autorizado para realizar esta tarea.',
      }
    }
  } catch (error) {
    await qUtil.rollbackTransaction()
    console.log(error)
    handleError.setMessage('Error de sistema: UFRMEVALSIMPLEXSAVESRV')
    handleError.setHttpError(error.message)
  }
}

const getDataConteo = async (group_id, eval_id, codigo, vector=[]) => {
    
    qUtil.setTableInstance('u_frm')
    qUtil.setAttributes([        
      'codigo', 'parametro'
    ]) 
    qUtil.setWhere({
      codigo_root: codigo,
      frm: group_id,      
      activo: 'Y',
    })
    qUtil.setOrder(['orden'])
    qUtil.setInclude({
        association: 'valor',
        required: false,
        attributes: [ 'valor', 'observacion'],
        where: { evaluacion_id: eval_id },
      })

    await qUtil.findTune()
    const result = qUtil.getResults()
    for (const element of result) {
      console.log("/*********************::", element.codigo," ->", element.name)
      
      if(element.parametro){
        delete element.parametro
        element.evaluado = 0
        if(element.valor.length > 0){
          element.evaluado = 1
          element[element.valor[0].valor] = 1
          element.obs =  element.valor[0].observacion ? 1 : 0          
        }
        delete element.valor

        vector.push(element)
      }
      
      const tmp = await getDataConteo(group_id, eval_id, element.codigo, vector)
      
    }
  
    return vector
  }
const getDataMonitorView = async (dto, handleError) => {
  try {
    // obtiene datos de session
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()

    const idx = dto.idx
    //obtiene for de cnf evaluacion
    qUtil.setTableInstance('u_frm_evaluacion')
    await qUtil.findID(idx)
    const results = qUtil.getResults()

    //construye informacion para extarer datos de los formularios
    const frm_group = results.frm_id
    const frm_id = results.frm_id
    //dato incial de formulario
    qUtil.setResetVars()
    qUtil.setTableInstance('u_frm')
    await qUtil.findID(frm_id)
    let result = qUtil.getResults()

    //obtiene registros de primer nivel
    qUtil.setWhere({frm:frm_group, codigo_root: result.codigo})
    await qUtil.findTune()
    result =  qUtil.getResults()
    const datos = []
    for (const key in result) {
        //busca datos contando
        datos[key] = await getDataConteo(frm_group, idx, result[key].codigo)        
    }

    

    return {
      ok: true,
      data: datos,
      message: 'Requerimiento Exitoso',
    }
  } catch (error) {
    console.log(error)
    handleError.setMessage('Error de sistema: ACREHABDATNSRV')
    handleError.setHttpError(error.message)
  }
}
module.exports = {
  getDataFrm,
  getDataFrmView,
  getDataFrmSimplex,
  getDataFrmSimplexView,
  evalSimplexSave,
  getDataMonitorView
}
