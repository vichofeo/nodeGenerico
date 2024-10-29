const QUtils = require('./../../models/queries/Qutils')
const qUtil = new QUtils()

const FrmUtils = require('./../frms/FrmsUtils')
const frmUtil = new FrmUtils()

const frmsInitialReport = async (dto, handleError) => {
  try {
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()
    
    //ids de establecimientos permitidos
    const ids_institucion = await frmUtil.getGroupIdsInstitucion()//frmUtil.getResults()
    //busca formularios a partir de la configuracion de autorizacion por caracterizacion de institucion
    qUtil.setTableInstance("f_formulario_institucion_cnf")
    qUtil.setAttributes(['formulario_id'])
    qUtil.setInclude({association:'frms', required: true,
      attributes:['formulario_id','descripcion']
    })
    if(ids_institucion.length>0) qUtil.setWhere({institucion_id:ids_institucion})
    qUtil.setGroupBy([qUtil.literal(1),qUtil.literal(2),qUtil.literal(3)])
    qUtil.setOrder([qUtil.literal(2),qUtil.literal(3)])
    await qUtil.findTune()
    const results = qUtil.getResults()

    const d = {}
    for (const obj of results) {
      d[obj.frms.formulario_id] = { title: obj.frms.descripcion, ids_institucion }
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

const frmsStatusReport = async (dto, handleError) => {
  try {
    frmUtil.setToken(dto.token)
    //ids de establecimientos permitidos    
    const resp =  await frmUtil.getGroupIdsInstitucion() 
    
    const ids_institucion = resp.join("','") //frmUtil.getResults().join("','")
    let whereAux = ''
    if (ids_institucion)
      whereAux = `AND r.institucion_id IN ('${ids_institucion}')`

    //colocar aki restriccion por estblecimiento segun rol
    const formulario_id = dto.model
    const query = `SELECT 
p.enunciado_id AS idx, p.codigo || '.- ' ||p.enunciado AS periodo, 
'['||string_agg(DISTINCT '{"periodo":"'||r.periodo||'", "registros":'||
(SELECT COUNT(*) FROM f_formulario_llenado ll2 WHERE ll2.formulario_id =  ll.formulario_id AND ll2.subfrm_id=ll.subfrm_id AND ll2.enunciado_id= ll.enunciado_id)
||' }'  ,',' 
ORDER BY '{"periodo":"'||r.periodo||'", "registros":'||
(SELECT COUNT(*) FROM f_formulario_llenado ll2 WHERE ll2.formulario_id =  ll.formulario_id AND ll2.subfrm_id=ll.subfrm_id AND ll2.enunciado_id= ll.enunciado_id)
||' }' desc
)||']' AS registros
FROM f_formulario_registro r,  f_formulario_llenado ll, f_frm_enunciado p, f_frm_subfrm s
WHERE 
r.registro_id= ll.registro_id  
AND ll.formulario_id =  p.formulario_id AND ll.subfrm_id=p.subfrm_id AND ll.enunciado_id= p.enunciado_id
AND p.formulario_id = s.formulario_id AND p.subfrm_id=s.subfrm_id
and r.formulario_id='${formulario_id}' ${whereAux}
GROUP BY 1,2
ORDER BY 2`
    qUtil.setQuery(query)
    await qUtil.excuteSelect()

    let response = {}

    let result = qUtil.getResults()
    //parse results
    result = result.map((obj) => ({
      ...obj,
      registros: JSON.parse(obj.registros),
    }))

    response = { [dto.model]: { items: result, multiple: true } }

    return {
      ok: true,
      data: response,
      message: 'Requerimiento atendido exitosamente',
    }
  } catch (error) {
    console.log(error)
    handleError.setMessage('Error de sistema: STATUSINITIALSRV')
    handleError.setHttpError(error.message)
    console.log('error:::', error)
  }
}

const frmsReport = async (dto, handleError) => {
  try {
    //datos de session
    frmUtil.setToken(dto.token)
    //const obj_cnf = frmUtil.getObjSession()

    const modelo = dto.modelo
    const pregunta_id = dto.condicion.idx
    const periodos = dto.condicion.registros.map((o) => o.periodo)
    let whereAux = ''
    if (periodos[0] == 'Todos') whereAux = ''
    else whereAux = `AND r.periodo in ('${periodos.join("','")}')`

    //VALIDAR USO Y CONDICIONES SEGUN TOKEN
    //ids de establecimientos permitidos
    const resp =  await frmUtil.getGroupIdsInstitucion()
    const ids_institucion = resp.join("','")
    if (ids_institucion)
      whereAux = ` ${whereAux} AND r.institucion_id IN ('${ids_institucion}')`

    const datosResult = {}
    const query = `SELECT 
i.nombre_institucion AS establecimiento, frm.descripcion AS formulario, 
TO_CHAR(TO_DATE(r.periodo,'YYYYMMDD'), 'YYYY-Mon') AS periodo,
a.atributo AS estado, s.nombre_subfrm AS seccion ,p.codigo ||'.- '|| p.enunciado as pregunta,
f.atributo AS grupo, c.atributo AS "variable", sc.atributo AS subvariable, ll.texto AS valor
FROM ae_institucion i ,f_formulario frm,  u_is_atributo a, f_formulario_registro r,  f_frm_enunciado p, f_frm_subfrm s, f_formulario_llenado ll
LEFT JOIN f_is_atributo f ON (f.atributo_id= ll.row_ll)
LEFT JOIN f_is_atributo c ON (c.atributo_id= ll.col_ll)
LEFT JOIN f_is_atributo sc ON (sc.atributo_id= ll.scol_ll)
WHERE a.atributo_id =  r.concluido
AND frm.formulario_id =  r.formulario_id AND i.institucion_id= r.institucion_id
and r.registro_id= ll.registro_id
AND ll.formulario_id =  p.formulario_id AND ll.subfrm_id=p.subfrm_id AND ll.enunciado_id= p.enunciado_id
AND p.formulario_id = s.formulario_id AND p.subfrm_id=s.subfrm_id
and r.formulario_id='${modelo}'
AND ll.enunciado_id = '${pregunta_id}'
${whereAux}
ORDER BY 5,6,7`

    qUtil.setQuery(query)
    await qUtil.excuteSelect()

    let result = qUtil.getResults()
    let headers = []
    //convierte en array resultados
    if (result.length > 0) {
      headers = Object.keys(result[0])
      result = result.map((obj, index) => Object.values(obj))
      result.unshift(headers)
    }

    //construye datos de configuracion para reporte dinamico
    const cnf = {
      tipo_agregacion: 'Sum',
      campos_ocultos: ['valor'],
      diferencia: headers.filter((x) => ['valor'].indexOf(x) === -1),
      rows: ['grupo'],
      cols: ['variable', 'subvariable'],
      vals: ['valor'],
      mdi: 'mdi-seat-flat-angled',
    }
    datosResult[modelo] = { values: result, headers: headers, cnf }

    return {
      ok: true,
      data: { ...datosResult, model: modelo, titulo: 'Datos de formulario' },
      message: 'Resultado exitoso. Parametros obtenidos',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error de sistema: RPTGRALSRV',
      error: error.message,
    }
  }
}
module.exports = {
  frmsInitialReport,
  frmsStatusReport,
  frmsReport,
}
