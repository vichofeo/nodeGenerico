const { Association, where } = require('sequelize')
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

const estado_terminado =  7
const caracter_porcentaje = '% '
const max_updated_tpac = 3
const getDataTreeFrm = async (group_id, datos, evaluacion = '-1', viewAll = false) => {
  //valores de session paa verificar si es del usuario logueado
  const obj_cnf = frmUtil.getObjSession()

  datos.children = []
  datos.evaluadores = datos.evaluadores.map(o => o.dni_evaluador).includes(obj_cnf.dni_register)
  qUtil.setTableInstance('u_frm')
  qUtil.setAttributes([
    ['frm_id', 'id'], [qUtil.literal("codigo ||': ' || parametro "), 'name'],
    ['ordenanza', 'proposito'],
    'codigo',
  ])
  const where = {
    codigo_root: datos.codigo,
    frm: group_id,
    es_parametro: false,
    activo: 'Y',
  }
  if (viewAll) delete where.es_parametro

  qUtil.setWhere(where)
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
  //INCLUYE informaicon de evaluadores
  qUtil.pushInclude({
    association: 'evaluadores', required: false,
    attributes: ['dni_evaluador'],
    where: { evaluacion_id: evaluacion }
  })
  await qUtil.findTune()
  const result = qUtil.getResults()
  for (const element of result) {
    //console.log("/*********************::", element.codigo," ->", element.parametro)
    const tmp = await getDataTreeFrm(group_id, element, evaluacion, viewAll)
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
      name: result.parametro,
      codigo: result.codigo,
      proposito: result.ordenanza,
      evaluadores: []
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

    //construye informacion para extarer datos de los formularios
    const frm_group = results.frm_id
    const frm_id = results.frm_id
    //dato incial de formulario
    qUtil.setResetVars()
    qUtil.setTableInstance('u_frm')
    await qUtil.findID(frm_id)
    const result = qUtil.getResults()

    console.log('/-------------------::', result.codigo, ' ->', result.parametro)
    const datos = await getDataTreeFrm(frm_group, {
      id: result.frm_id,
      name: result.parametro,
      codigo: result.codigo,
      proposito: result.ordenanza,
      evaluadores: []
    }, idx)

    return {
      ok: true,
      data: [datos],
      message: 'Requerimiento Exitoso',
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
      association: 'valor', required: false,
      attributes: [['valores_id', 'idx'], 'valor', ['observacion', 'obs'], [qUtil.literal("CASE WHEN concluido = '"+ estado_terminado+"' THEN true ELSE false END"),'concluido']],
      where: { evaluacion_id: idx },
      include:[{
        association: 'value_labels', required: false,        
        attributes: [['atributo', 'label']]
      }]
    })

    qUtil.pushInclude({
      association: 'evaluadores', required: false,
      attributes: ['dni_evaluador'],
      where: { evaluacion_id: idx }
    })

    await qUtil.findTune()
    const result = qUtil.getResults()

    return {
      ok: true,
      data: result.map(o => ({ ...o, evaluadores: o.evaluadores.map(oo => oo.dni_evaluador).includes(obj_cnf.dni_register) })),
      message: 'Requerimiento Exitoso',
    }

  } catch (error) {
    console.log(error)
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
      include:[{
        association: 'value_labels', required: false,        
        attributes: [['atributo', 'label']]
      }]
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
/**
 * Graba valores de la evaluacion de undeterminado parametro Padre con sus subaparametros evaluables
 * @param {*} dto 
 * @param {*} handleError 
 * @returns 
 */
const evalSimplexSave = async (dto, handleError) => {
  try {
    const estado_conclusion = 3
    // obtiene datos de session
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()

    const idx = dto.idx
    //obtiene for de cnf evaluacion
    qUtil.setTableInstance("u_frm_evaluacion")
    await qUtil.findID(dto.idx)
    const dEvaluacion = qUtil.getResults()

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
        aux = { evaluacion_id: dto.idx, frm_id: tmp[0], dni_evaluador: obj_cnf.dni_register, ...aux }
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
    //actualiza estado conclusion
    if (dEvaluacion.concluido < estado_conclusion) {
      qUtil.setTableInstance('u_frm_evaluacion')
      qUtil.setDataset({ concluido: estado_conclusion })
      qUtil.setWhere({ evaluacion_id: dto.idx })
      await qUtil.modify()
    }
    //termina transaccion
    await qUtil.commitTransaction()

    return {
      ok: true,
      //data: payload,
      message: 'Requerimiento Exitoso. Parametros Guardados',
    }

  } catch (error) {
    await qUtil.rollbackTransaction()
    console.log(error)
    handleError.setMessage('Error de sistema: UFRMEVALSIMPLEXSAVESRV')
    handleError.setHttpError(error.message)
  }
}

/**
 * metodo que cuenta las opciones grabadas en valores por evaluacion solicitada
 * @param {*} group_id 
 * @param {*} eval_id 
 * @param {*} codigo 
 * @param {*} vector 
 * @returns 
 */
const getDataConteo = async (group_id, eval_id, codigo, vector = { conteo: [], all: [], pac: [] }) => {

  qUtil.setTableInstance('u_frm')
  qUtil.setAttributes([['frm_id', 'idx'],
    'codigo',
  ['parametro', 'nombre_frm'], ['ordenanza', 'proposito'],
    'parametro', 'ordenanza', 'es_parametro', 'obligatorio', 'su_peso'
  ])
  qUtil.setWhere({ codigo_root: codigo, frm: group_id, activo: 'Y', })
  qUtil.setOrder(['orden'])
  qUtil.setInclude({
    association: 'valor',
    required: false,
    attributes: [['valores_id', 'idx'], 'valor', 'observacion', 'dni_evaluador', 'concluido'],
    include:[{
      association: 'tpac', required: false,
      attributes:['dni_evaluador']

    }],
    where: { evaluacion_id: eval_id },
  })

  qUtil.pushInclude({
    association: 'padre', required: false,
    attributes: [['frm_id', 'idx'], 'codigo', 'codigo_root', 'parametro'],
    where:{frm: group_id, activo: 'Y'},
    include: [{
      association: 'opciones', required: false,
      //attributes: ['grupo'],
      include: [{
        association: 'valores',
        attributes: [['atributo', 'label'], 'color', ['atributo_id', 'value'], 'factor', 'pac'],
      }]
    }]
  })

  await qUtil.findTune()
  const result = qUtil.getResults()

  //vacia el todo dato en un vector
  for (const element of result) {
    const auxiliar = JSON.parse(JSON.stringify(element))
    const temporal = auxiliar?.padre?.opciones?.valores

    console.log("\n\n\n TEMPROAL:", auxiliar.es_parametro)

    //si es parametro vectoriza etiquetas de campo parametros de tabla atributos ej: cumple, no cumple, no aplica
    auxiliar.es_parametro && temporal ? auxiliar.labels = temporal.map(obj => obj.label).sort() : ''

    if (auxiliar.es_parametro && auxiliar.valor.length > 0 && temporal) {
      //filtra datos      
      const filtrado = temporal.filter(valor => valor.value == auxiliar.valor[0].valor)
      if (filtrado.length > 0) {
        //arama objeto con finromacion del valor y la configuracion de atributos
        // ** analizar si cambiar el label por el id de atributo
        auxiliar.valor[0] = Object.assign(auxiliar.valor[0], filtrado[0], { [filtrado[0].label]: auxiliar.valor[0].valor })
        element.valor[0] = auxiliar.valor[0]
      }
      if (auxiliar.valor[0].pac) {
        //elimina informacon intrasendente
        delete auxiliar.padre.opciones
        vector.pac.push(JSON.parse(JSON.stringify(auxiliar)))
      }
    }

    //elimina nodo padre
    //delete auxiliar.padre


    vector.all.push(auxiliar)
    //-------------------------- segunda parte realiza conteo de respuestas registrada -----------------------
    //realiza conteo de respuestas
    const codigo = element.codigo
    if (element.es_parametro) {
      delete element.parametro
      
      element.evaluado = 0
      element.tpac = 0
      element.terminado=0
      element.obligado=0
      element.puntaje=0
      
      if (element.valor.length > 0) {//verifica si esta con datos
        element.labels = {[element.valor[0].value]:{value:element.valor[0].value, label:element.valor[0].label, factor:element.valor[0].factor}}
        element.evaluado = 1
        //verifica si se grabo valores nulos
        if (element.valor[0].valor === null) element['nulo'] = 1
        else {
          let puntaje = 0
          if (element.su_peso > 0) {
            element.peso = 1
            element[element.valor[0].value] = 1
            puntaje =  element[caracter_porcentaje + element.valor[0].value] = element.su_peso * (element.valor[0].factor > 0 ? element.valor[0].factor : 1)
            //registra las nuevas etiquetas
            element.labels = Object.assign(element.labels, {peso:{label:'peso'}},
              {[caracter_porcentaje + element.valor[0].value]:{value:caracter_porcentaje + element.valor[0].value, 
                label: element.valor[0].label + caracter_porcentaje, factor:element.valor[0].factor}})
          } else {
            //si su peso es menor igual a 0  solo se hace un conteo
            puntaje = element[element.valor[0].value] = 1
          }
          if(element.valor[0].tpac) element.tpac = 1
          if(element.valor[0].concluido ==  estado_terminado) element.terminado = 1
          if(element.valor[0].factor>0 && element.obligatorio) element.obligado = 1
          if(element.valor[0].factor>0) element.puntaje =  puntaje
        }

        element.obs = element.valor[0].observacion ? 1 : 0
      }
      delete element.valor
      delete element.codigo
      delete element.nombre_frm
      delete element.proposito
      delete element.ordenanza
      delete element.padre
      delete element.es_parametro
      delete element.su_peso
      delete element.idx


      vector.conteo.push(element)
    }

    await getDataConteo(group_id, eval_id, codigo, vector)

  }//fin bucle principal

  return vector
}
/**
 * Metodo para totalizar los valores registrados en la evaluacion que sirve como monitor de lo realizado
 * @param {*} dto 
 * @param {*} handleError 
 * @returns 
 */
const getDataMonitorView = async (dto, handleError) => {
  try {
    // obtiene datos de session
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()

    const idx = dto.idx
    //obtiene for de cnf evaluacion
    qUtil.setTableInstance('u_frm_evaluacion')
    qUtil.setInclude({
      association: 'eess', required: false,
      attributes:['nombre_institucion']
    })
    qUtil.pushInclude({
      association: 'tipo', required: false,
      attributes:[['atributo','tipo']]
    })
    qUtil.pushInclude({
      association: 'frm', required: false,
      attributes:[['parametro','formulario']]
    })
    qUtil.pushInclude({
      association: 'estado', required: false,
      //attributes:[['parametro','formulario']]
    })
    qUtil.pushInclude({
      association: 'registerby', required: false,
      attributes:[['primer_apellido','apellido'], 'nombres']
    })
    qUtil.pushInclude({
      association: 'evaluadores', required: false,
      attributes:[['dni_evaluador','pevaluador']],
      include:[{
        association: 'evaluador', required: false,        
        attributes:[['primer_apellido','apellido'], 'nombres']
      }]
    })
    await qUtil.findID(idx)
    const results = qUtil.getResults()
    //construye informacion para extarer datos de los formularios
    const frm_group = results.frm_id
    const frm_id = results.frm_id
    const evaluador = results.dni_register
    const excelencia =  results.excelencia
    
    results.evaluadores = [...new Set(results.evaluadores.map(obj=>(`${obj.evaluador.apellido} ${obj.evaluador.nombres}`)))].join(', ')
    delete results.evaluacion_id
    delete results.institucion_id
    delete results.frm_id

    //dato incial de formulario
    qUtil.setResetVars()
    qUtil.setTableInstance('u_frm')
    await qUtil.findID(frm_id)
    let result = qUtil.getResults()
    console.log("\n\n result FRM........ \n\n")

    //obtiene registros de primer nivel
    qUtil.setWhere({ frm: frm_group, codigo_root: result.codigo })
    qUtil.setOrder(['orden'])
    await qUtil.findTune()
    result = qUtil.getResults()


    //recorre resultados de primeras seccionesde formulario
    const graphData= {labels:[], data:[]}
    const datos = []
    let cabecerasAux = []
    let labels =  {obligado: {label: 'Obligatorias Obtenidas'}, promedio:{label:'Promedio Obtenido'}}
    for (const key in result) {      
      //busca datos contando
      const tmp = await getDataConteo(frm_group, idx, result[key].codigo)
      const data = { evaluado: 0 }
      //hace el calculo por grupo        
      for (const element of tmp.conteo) {                
        for (const index in element) {          
          if(index!='labels'){
              if (typeof data[index] === 'undefined')
              data[index] = 0
            data[index] = data[index] + element[index]
          }else{
            labels =  Object.assign(labels, element.labels)
          }
        }//fin for q recorre objeto
        //delete element.labels
      }
      //obtiene calculo final segun flag de excelencia
      if(data?.peso && data?.peso == tmp.conteo.length) data.promedio =  data.puntaje
      else if(excelencia) data.promedio = Number((data.puntaje / tmp.conteo.length).toFixed(2))*100
      else data.promedio = (Number((data.obligado / data.obligatorio).toFixed(2)) * 100).toLocaleString()
      
      
      //datos[`${key}`] = {
      datos.push({
        idx: result[key].frm_id,
        codigo: result[key].codigo,
        formulario: result[key].parametro,
        total: tmp.conteo.length,        
        ...data,
        //admin: evaluador == obj_cnf.dni_register,
        //completed:  tmp.conteo.length == data.evaluado,
        finalizar: (evaluador == obj_cnf.dni_register && tmp.conteo.length == data.evaluado),
        concluido: (tmp.conteo.length ==  data.terminado),
        //tmp: tmp

      })
      
      cabecerasAux.push(...Object.keys(data))
      //vacia dato para grafico
      graphData.labels.push(result[key].codigo)
      graphData.data.push(data.promedio)
    }//fin for in key
    

    //convierte cabeceras en objeto para titulos
    console.log("\n\n\n cabeceras::::", cabecerasAux)
    //cabecerasAux = cabecerasAux.filter(valor => valor != 'evaluado' && valor != 'obligatorio' && valor != 'obs' && valor != 'tpac')
    cabecerasAux = cabecerasAux.filter(valor => !['evaluado', 'obligatorio', 'obs', 'tpac','terminado','obligado' ,'puntaje', 'peso', 'promedio'].includes(valor))
    console.log("\n\n\n fiktrado::::", cabecerasAux)
    cabecerasAux = cabecerasAux.sort().reverse()
    const cabeceras = {}
    for (const element of cabecerasAux) {
      cabeceras[element] = labels[element].label//  element[0].toUpperCase() + element.slice(1) //labels[element].label// 
    }
//titulos para el grafico
graphData.title = 'CUMPLIMIENTO DE REQUISITOS PARA LA '+ results.tipo_acrehab.toUpperCase()
graphData.subtitle = '"'+ results.eess.nombre_institucion +'"'
    return {
      ok: true,
      data: datos,
      evaluacion_data:results,
      header: { formulario: 'Formulario Inspeccion', codigo: 'Codigo', 
            total: 'Nro. Parametros', evaluado: 'Evaluados', 
            obligatorio: 'Obligatorios',
            obligado:labels.obligado.label ,
            ...cabeceras, 
            obs: 'Con Observacion', nulo: 'Nulo/Vacio', 
            promedio: labels.promedio.label,
            finalizar: "Accion" }, //cabeceras.filter(function (v, i, self) {return i == self.indexOf(v)}).sort(),
      message: 'Requerimiento Exitoso',
      graphData: graphData,
      
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

/**
 * metodo para obtener toda la estructura de un determinado formulario
 * @param {*} dto 
 * @param {*} handleError 
 * @returns 
 */
const getFrmView = async (dto, handleError) => {
  try {
    // obtiene datos de session
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()

    const idx = dto.idx


    qUtil.setTableInstance('u_frm')
    await qUtil.findID(idx)
    const result = qUtil.getResults()

    const datos = await getDataTreeFrm(idx, {
      id: result.frm_id,
      name: result.parametro,
      codigo: result.codigo,
      proposito: result.ordenanza,
      evaluadores: []
    }, '-1', true)

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
/**
 * plan de accion servicess
 */
const pacSave = async (dto, handleError) => {
  try {
    //inicia transaccion
    console.log("\n\n\n.... inicia transaccion ")
    await qUtil.startTransaction()

    estado_conclusion = '7'
    // obtiene datos de session
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()

    //id de  evaluacion
    const idx = dto.idx
    const seccion = dto.seccion
    //obtiene for de cnf evaluacion
    qUtil.setTableInstance("u_frm_evaluacion")
    await qUtil.findID(idx)
    const dEvaluacion = qUtil.getResults()

    qUtil.setTableInstance("u_frm")
    await qUtil.findID(seccion)
    const dFrmSeccion = qUtil.getResults()

    //obtiene lista de parametros en la seccion
    const parametros = await getDataConteo(dEvaluacion.frm_id, idx, dFrmSeccion.codigo)

    //paramaetros ALL se filtra para obnert id para concluir
    const ids = parametros.all.map(obj => obj.idx)
    ids.push(seccion)
    const payload = parametros.pac.map(obj => ({
      valores_id: obj.valor[0].idx,
      frm_id: dEvaluacion.frm_id,
      seccion_id: seccion,
      cap_id: obj.padre.idx,
      parametro_id: obj.idx,
      dni_evaluador: obj.valor[0].dni_evaluador,
      ...frmUtil.getObjSession()
    }))

    

    //actualiza estado de conclusion en valores
    delete obj_cnf.create_date
    obj_cnf.last_modify_date_time = new Date()
    qUtil.setTableInstance('u_frm_valores')
    qUtil.setDataset({ concluido: estado_conclusion, ...obj_cnf })
    qUtil.setWhere({ frm_id: ids, evaluacion_id: idx })
    await qUtil.modify()

    //inserta registros de plan de accion 
    qUtil.setTableInstance('u_frm_plan_accion')
    qUtil.setDataset(payload)
    await qUtil.createwLote()

    //verifica si todos los parametros estan con estado de conclusion 7
    qUtil.setTableInstance('u_frm')
    qUtil.setAttributes([[qUtil.countData('*'),'frm_total']])
    qUtil.setWhere({frm:dEvaluacion.frm_id, es_parametro:true})
    await qUtil.findTune()
    const dCountFrm =  qUtil.getResults()

    qUtil.setTableInstance('u_frm_valores')
    qUtil.setAttributes([[qUtil.countData('*'),'vals_total']])
    qUtil.setWhere({evaluacion_id:dEvaluacion.evaluacion_id, concluido: estado_conclusion})
    await qUtil.findTune()
    const dCountValores =  qUtil.getResults()

    //pregunta si ambos valores son iguales para actualizar rgistro de evaluacion
    if(dCountFrm[0].frm_total == dCountValores[0].vals_total){
      //actualiza estado
      qUtil.setTableInstance('u_frm_evaluacion')
      qUtil.setDataset({
        concluido: estado_conclusion,
        dni_register: obj_cnf.dni_register,
        last_modify_date_time: new Date()
      })
      qUtil.setWhere({evaluacion_id: dEvaluacion.evaluacion_id})
      await qUtil.modify()
    }

    await qUtil.commitTransaction()

    return {
      ok: true,
      data: parametros,
      message: 'Requerimiento Exitoso. Parametros Guardados',
    }

  } catch (error) {
    console.log(error)
    await qUtil.rollbackTransaction()
    
    handleError.setMessage('Error de sistema: SAVEPAC')
    handleError.setHttpError(error.message)
  }
}
const pacView = async (dto, handleError) => {
  try {
    // obtiene datos de session
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()

    const idx = dto.idx
    console.log("\n\n señalessssssssssssssss")
    //obtiene for de cnf evaluacion
    qUtil.setTableInstance('u_frm_evaluacion')
    await qUtil.findID(idx)
    const results = qUtil.getResults()

    const frm_group = results.frm_id
    const frm_id = results.frm_id

    //obtiene dato de valores
    //dato incial de formulario
    qUtil.setResetVars()
    qUtil.setTableInstance('u_frm_valores')
    qUtil.setAttributes(['valores_id','observacion'])
    qUtil.setOrder([qUtil.col('tpac.seccion.orden'), qUtil.col('frm.orden')])
    qUtil.setInclude({
      association: 'frm', required: false,
      attributes:['codigo', 'codigo_root', 'parametro']
    })
    qUtil.pushInclude({
      association: 'tpac', required: true,
      attributes:['fecha_registro','fecha_complimiento', 'acciones', 'dni_evaluador','conteo'],
      include:[{
        association: 'formulario', required: true,
        attributes:['codigo', 'codigo_root', 'parametro', 'nombre_corto']
      },
      {
        association: 'seccion', required: true,
        attributes:['codigo', 'codigo_root', 'parametro', 'nombre_corto']
      },
      {
        association: 'capitulo', required: true,
        attributes:['codigo', 'codigo_root', 'parametro', 'nombre_corto']
      },{
        association: 'register', required: true,
        attributes:['primer_apellido','nombres']
      }
    ]
    })
    qUtil.setWhere({evaluacion_id:idx})
    await qUtil.findTune()
    const result = qUtil.getResults()

    //construye datos
    const datos = {}
    for (const element of result) {
      const codigo = element.tpac.seccion.codigo
      if(typeof datos[codigo]=='undefined') datos[codigo] = {codigo: element.tpac.seccion.codigo, codigo_root: element.tpac.seccion.codigo_root, parametro: element.tpac.seccion.parametro}
      if(!Array.isArray(datos[codigo][element.tpac.capitulo.codigo])) datos[codigo][element.tpac.capitulo.codigo] = []
      const evaluador = element.tpac.dni_evaluador
      const persona = element.tpac.register 
      delete element.tpac.dni_evaluador
      delete element.tpac.register 
      
      
      const obj ={
        idx: element.valores_id,
        codigo: element.frm.codigo,
        codigo_root: element.frm.codigo_root,        
        parametro: element.frm.parametro,
        obs:element.observacion,
        evaluador: `${persona.primer_apellido} ${persona.nombres}`,
        continue: (evaluador == obj_cnf.dni_register),
        updated: (element.tpac.conteo<= max_updated_tpac),
        ...element.tpac
      }
      //datos[codigo].push(obj)
      datos[codigo][element.tpac.capitulo.codigo].push(obj)
    }

    return {
      ok: true,
      data: datos,
      message: 'Requerimiento Exitoso',
    }
  } catch (error) {
    console.log(error)
    handleError.setMessage('Error de sistema: GETDATVIEWSRV')
    handleError.setHttpError(error.message)
  }
}
const tpacSave = async (dto, handleError) => {
  try {
    
    // obtiene datos de session
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()

    //id de  evaluacion
    const idx = dto.idx
    
    //obtiene for de cnf evaluacion
    qUtil.setTableInstance("u_frm_plan_accion")
    await qUtil.findID(idx)
    const dtpac = qUtil.getResults()

    //verifica q sea el usuario correcto
    if(dtpac.dni_evaluador == obj_cnf.dni_register){
      //continua guardado      
      if(dtpac.conteo<=max_updated_tpac){
        if(dtpac.conteo == 0) dto.fecha_registro =  new Date()
        else delete dto.fecha_registro
        dto.conteo = dtpac.conteo + 1
        //dto.valores_id =  dto.idx
        const data =  Object.assign(dto, obj_cnf)
        delete data.create_date
        data.last_modify_date_time =  new Date()
        qUtil.startTransaction()
        qUtil.setTableInstance("u_frm_plan_accion")
        qUtil.setDataset(data)
        qUtil.setWhere({valores_id: dto.idx})
        await qUtil.modify()

        qUtil.commitTransaction()

        return {
          ok: true,
         // data: parametros,
          message: 'Requerimiento Exitoso. Parametros Guardados',
        }

      }else{
        handleError.setCode(403)
      return {
        ok: false,        
        message: 'Ya no cuenta con Numero de actualizaciones permitidas ',
      }
      }
      

      
    }else{
      handleError.setCode(401)
      return {
        ok: false,        
        message: 'Usuario no Autorizado',
      }
    }

    

  } catch (error) {
    await qUtil.rollbackTransaction()
    console.log(error)
    handleError.setMessage('Error de sistema: SAVETPAC')
    handleError.setHttpError(error.message)
  }
}

const tpacReport = async (dto, handleError) => {
  try {
    
    // obtiene datos de session
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()
    const aa = '$a$'
    const ww =  '$w$'
    const model =  dto.model
    const parametros =  dto.parameters
    let query = PCBOXS[model]?.primal?.query
    const attrib =  PCBOXS[model]?.primal?.attributes 
    const where = []
    for (const key in parametros) {
      if(parametros[key]!='-1'){
        where.push(`${PCBOXS[model]?.primal?.equivalencia[key][0]} = '${parametros[key]}'`) 
      }
    }
    //reemplazo de variables
    query = query.replaceAll(aa, attrib)
    let condicion =  ""
    if(where.length>0){
      condicion =  " AND "+ where.join(" and ")
    }

    query =  query.replaceAll(ww, condicion)
    //ejecuta query
    qUtil.setQuery(query)
    await qUtil.excuteSelect()
    const result =  qUtil.getResults()
    const headers = PCBOXS[model]?.primal?.headers




    return {
      ok: true,
      data: {items: result, headers: headers},
      message: 'Requerimiento Exitoso. Parametros Guardados',
    }

  } catch (error) {
    
    console.log(error)
    handleError.setMessage('Error de sistema: SAVETPAC')
    handleError.setHttpError(error.message)
  }
}
module.exports = {
  getDataFrm,
  getDataFrmView,
  getDataFrmSimplex,
  getDataFrmSimplexView,
  evalSimplexSave,
  getDataMonitorView, getDataEvalView,
  getFrmView,
  pacSave, pacView, tpacSave, tpacReport
}
