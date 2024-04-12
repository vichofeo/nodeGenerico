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
    ['frm_id', 'id'], [qUtil.literal("codigo ||': ' || nombre_frm "), 'name'],
    'proposito',
    'codigo',
  ])
  qUtil.setWhere({
    codigo_root: datos.codigo,
    frm: group_id, es_parametro: false, activo: 'Y',
  })
  qUtil.setOrder(['orden', qUtil.col('opciones.valores.atributo')])
  //includes
  const cnf = {
    association: 'opciones', required: false,
    attributes: ['grupo'],
    include: [{
      association: 'valores',
      attributes: [['atributo', 'label'], 'color', ['atributo_id', 'value'], ['condicionante', 'sw']],

    }
    ]
  }
  qUtil.setInclude(cnf)
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

      console.log('/-------------------::', result.codigo, ' ->', result.nombre_frm)
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
        ['frm_id', 'idx'], 'parametro', ['ordenanza', 'medio'],
        'obligatorio', 'aplica', 'codigo',
      ])
      qUtil.setWhere({
        frm: frm_group,
        es_parametro: true,
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

const getDataConteo = async (group_id, eval_id, codigo, vector = { conteo: [], all: [] }) => {

  qUtil.setTableInstance('u_frm')
  qUtil.setAttributes([
    'codigo',
    'nombre_frm', 'proposito',
    'parametro', 'ordenanza', 'es_parametro', 'obligatorio'
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
    attributes: ['valor', 'observacion'],
    where: { evaluacion_id: eval_id },
  })
  /*qUtil.pushInclude({
    association: 'opciones', required: false,
    attributes: ['grupo'],
    include: [{
      association: 'valores',
      attributes: [['atributo', 'label'], 'color', ['atributo_id', 'value'], ['condicionante', 'sw']],
    }]
  })*/
  qUtil.pushInclude({
    association: 'padre', required: false,
    attributes: ['codigo_root'],
    include:[{
      association: 'opciones', required: false,
    attributes: ['grupo'],
    include: [{
      association: 'valores',
      attributes: [['atributo', 'label'], 'color', ['atributo_id', 'value']],
    }]
    }]
  }) 

  await qUtil.findTune()
  const result = qUtil.getResults()
  for (const element of result) {
    const auxiliar =  JSON.parse(JSON.stringify(element))
    const temporal =  auxiliar?.padre?.opciones?.valores
    auxiliar.es_parametro ? auxiliar.labels =  temporal.map(obj=>obj.label).sort() : ''

    if(auxiliar.es_parametro && auxiliar.valor.length>0){
      //filtra datos      
      const filtrado = temporal.filter(valor=>valor.value == auxiliar.valor[0].valor)
      if(filtrado.length>0){
        auxiliar.valor[0] =  Object.assign(auxiliar.valor[0],filtrado[0], {[filtrado[0].label]: auxiliar.valor[0].valor})
        element.valor[0] = auxiliar.valor[0]
      }
    }
    delete auxiliar.padre
    
    vector.all.push(auxiliar)
    //realiza conteo de respuestas
    const codigo = element.codigo
    if (element.es_parametro) {
      delete element.parametro
      element.evaluado = 0
      if (element.valor.length > 0) {
        element.evaluado = 1
        if (element.valor[0].valor === null) element['nulo'] = 1
        else element[element.valor[0].label] = 1

        element.obs = element.valor[0].observacion ? 1 : 0
      }
      delete element.valor
      delete element.codigo
      delete element.nombre_frm
      delete element.proposito
      delete element.ordenanza
      delete element.padre
      delete element.es_parametro

      vector.conteo.push(element)
    }

    await getDataConteo(group_id, eval_id, codigo, vector)

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
    qUtil.setWhere({ frm: frm_group, codigo_root: result.codigo })
    await qUtil.findTune()
    result = qUtil.getResults()
    const datos = []
    let cabecerasAux = []
    for (const key in result) {
      //busca datos contando
      const tmp = await getDataConteo(frm_group, idx, result[key].codigo)
      const data = { evaluado: 0 }
      //hace el calculo por grupo        
      for (const element of tmp.conteo) {
        for (const index in element) {
          if (typeof data[index] === 'undefined')
            data[index] = 0
          data[index] = data[index] + element[index]
        }
      }
      datos[`${key}`] = {
        codigo: result[key].codigo,
        formulario: result[key].nombre_frm,
        total: tmp.conteo.length, 
        ...data,
        
      }
      cabecerasAux.push(...Object.keys(data))
    }//fin for in key

    //convierte cabeceras en objeto para titulos
    cabecerasAux =  cabecerasAux.filter(valor => valor != 'evaluado' && valor != 'obligatorio' && valor != 'obs');
    const cabeceras = {}
    for (const element of cabecerasAux) {
      cabeceras[element] = element[0].toUpperCase() + element.slice(1)
    }


    return {
      ok: true,
      data: datos,
      header: { formulario: 'Formulario Inspeccion', codigo: 'Codigo', total: 'Nro. Parametros',obligatorio:'Obligatorios' ,evaluado: 'Evaluados', ...cabeceras, obs:'Con Observacion' ,nulo: 'Nulo/Vacio' }, //cabeceras.filter(function (v, i, self) {return i == self.indexOf(v)}).sort(),
      message: 'Requerimiento Exitoso',
      
    }
  } catch (error) {
    console.log(error)
    handleError.setMessage('Error de sistema: ACREHABDATNSRV')
    handleError.setHttpError(error.message)
  }
}

const getDataEvalView = async (dto, handleError) => {
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
    qUtil.setWhere({ frm: frm_group, codigo_root: result.codigo })
    await qUtil.findTune()
    result = qUtil.getResults()
    const datos = {}
    const cabeceras = []
    for (const key in result) {
      //busca datos contando
      const tmp = await getDataConteo(frm_group, idx, result[key].codigo)
      datos[result[key].codigo] = tmp.all
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
  getDataMonitorView, getDataEvalView
}
