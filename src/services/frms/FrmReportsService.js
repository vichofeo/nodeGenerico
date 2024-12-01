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
    const query = `SELECT eg.nombre_institucion AS "Ente Gestor",
i.nombre_institucion AS "Establecimiento Salud", 
dpto.nombre_dpto AS "Departamento",
frm.descripcion AS Formulario, 
TO_CHAR(TO_DATE(r.periodo,'YYYYMMDD'), 'YYYY-Mon') AS Periodo,
a.atributo AS estado, s.nombre_subfrm AS seccion ,p.codigo ||'.- '|| p.enunciado as Pregunta,

CASE WHEN f.grupo_atributo IS NOT NULL AND  f.grupo_atributo<> 'F_ROW_CIE10_10PAMT' AND substring(p.codigo,1,1)<>'C'
THEN f.orden||'. ' ELSE  '' END  ||f.atributo AS Grupo, 
c.atributo AS "variable", sc.atributo AS subvariable, ll.texto AS Valor
FROM ae_institucion eg,
f_formulario frm,  u_is_atributo a, f_formulario_registro r,  f_frm_enunciado p, f_frm_subfrm s, f_formulario_llenado ll
LEFT JOIN f_is_atributo f ON (f.atributo_id= ll.row_ll)
LEFT JOIN f_is_atributo c ON (c.atributo_id= ll.col_ll)
LEFT JOIN f_is_atributo sc ON (sc.atributo_id= ll.scol_ll),
ae_institucion i 
LEFT JOIN al_departamento dpto ON (dpto.cod_dpto=i.cod_dpto)
WHERE eg.institucion_id =  i.institucion_root
AND a.atributo_id =  r.concluido
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
const frmsConsolidado = async (dto, handleError) => {
  try {
    //datos de session
    frmUtil.setToken(dto.token)
    const resp =  await frmUtil.getGroupIdsInstitucion()
    const thewhere = resp.length>0 ? {where :{institucion_id: resp}} : {wheres :'nones'}
    const whereBase = resp.length>0 ? ` AND i.institucion_id in ('${resp.join("','")}')` : ''
    const data = dto.data

    //informacion de formulario
    qUtil.setTableInstance("f_formulario")
    await qUtil.findID(data.forms)
    const frmResult =  qUtil.getResults()
    
    //instituciones visibles por acceso o permiso
    qUtil.setTableInstance("f_frm_enunciado")
    qUtil.setAttributes(['subfrm_id', 'enunciado_id', 'alldetail', 'codigo', 'enunciado'])
    qUtil.setWhere({formulario_id: data.forms})
    qUtil.setOrder(['codigo', 'orden'])
    await qUtil.findTune()
    let enunciados =  qUtil.getResults()

    //establecimientos de salud q cumplen con la condicion
    qUtil.setTableInstance('ae_institucion')
    qUtil.setAttributes(['institucion_id','nombre_institucion'])
    qUtil.setInclude({
      association: 'children', required: true,
      attributes:['institucion_id','nombre_institucion'],
      ...thewhere,
      include:[{association: 'frmreg', required: true,
        attributes:['registro_id'],
        where :{formulario_id:data.forms, periodo:data.periodos, concluido: qUtil.cMayorIgualQue('7'), revisado: qUtil.cMayorIgualQue('15') }
      }]
    })
    await qUtil.findTune()
    let establecimientos = qUtil.getResults()

    //construye atributos para query de salida 
    const atributosEstablecimiento =  []
    const titlesEstablecimientos={}
    let index = 1
    let indexAux = 1
    for (const eess of establecimientos) {
      const nombre =  eess.nombre_institucion
      const inst_id =  eess.institucion_id
      titlesEstablecimientos[nombre] = eess.children.map(o=>`${index++}. ${o.nombre_institucion}`)
      //titlesEstablecimientos[nombre] = eess.children.map(o=>[ inst_id+'|'+o.institucion_id,`${index++}. ${o.nombre_institucion}` ])
      //atributosEstablecimiento.push(...eess.children.map(o=>nombre+'|'+o.nombre_institucion))
      atributosEstablecimiento.push(...
        eess.children.map(o=>`SUM(CASE WHEN eg.institucion_id ||'|'|| i.institucion_id = '${inst_id}|${o.institucion_id}' AND (c.sw_sg=TRUE OR c.sw_sg IS NULL) THEN ll.texto::decimal ELSE 0 END) AS "${indexAux++}. ${o.nombre_institucion}"`)
      )
    }

    
    //recorre preguntas
    const results = []
    let auxControl = "-1"
    for (const enunciado of enunciados) {
      let query_base = `SELECT `
      if(enunciado.alldetail){
        results.push({variable: `${enunciado.codigo} ${enunciado.enunciado}`})
        query_base += `
      CASE WHEN f.grupo_atributo IS NOT NULL AND  f.grupo_atributo<> 'F_ROW_CIE10_10PAMT' AND substring(p.codigo,1,1)<>'C'
      THEN LPAD(f.orden::text,2,'0')||'. ' ELSE  '' END  ||f.atributo AS variable, 
      `
      } else {
        if(auxControl!=enunciado.subfrm_id){
          auxControl= enunciado.subfrm_id
          qUtil.setTableInstance("f_frm_subfrm")
          await qUtil.findID(auxControl)
          const auxResult =  qUtil.getResults()
          results.push({variable: auxResult.nombre_subfrm})
        }
        
        query_base += ` '${enunciado.codigo} ${enunciado.enunciado}' as variable, ` 
      }

      query_base += atributosEstablecimiento.join(",\n") + ', SUM(CASE WHEN (c.sw_sg=TRUE OR c.sw_sg IS NULL) THEN ll.texto::decimal ELSE 0 END) AS "total"'
      query_base += `
      FROM ae_institucion eg,
f_formulario frm,  u_is_atributo a, f_formulario_registro r,  f_frm_enunciado p, f_frm_subfrm s, f_formulario_llenado ll
LEFT JOIN f_is_atributo f ON (f.atributo_id= ll.row_ll)
LEFT JOIN f_is_atributo c ON (c.atributo_id= ll.col_ll ),
ae_institucion i
LEFT JOIN al_departamento dpto ON (dpto.cod_dpto=i.cod_dpto) ` 
    query_base += `
    WHERE eg.institucion_id =  i.institucion_root
AND a.atributo_id =  r.concluido
AND frm.formulario_id =  r.formulario_id AND i.institucion_id= r.institucion_id
and r.registro_id= ll.registro_id
AND ll.formulario_id =  p.formulario_id AND ll.subfrm_id=p.subfrm_id AND ll.enunciado_id= p.enunciado_id
AND p.formulario_id = s.formulario_id AND p.subfrm_id=s.subfrm_id
and r.formulario_id='${data.forms}' 
AND ll.subfrm_id ='${enunciado.subfrm_id}' AND ll.enunciado_id = '${enunciado.enunciado_id}'
AND r.periodo ='${data.periodos}' ${whereBase}
GROUP BY 1
ORDER BY 1
    `
      console.log("\n\n\n")
      qUtil.setQuery(query_base)
      await qUtil.excuteSelect()
      
      results.push(...qUtil.getResults())
    }


    return {
      ok: true,
      data: {titles: titlesEstablecimientos, 
        items:results,
        frm: {abrev: frmResult.nombre_formulario, nombre: frmResult.descripcion}
      },//{ ...datosResult, model: modelo, titulo: 'Datos de formulario' },
      message: 'Resultado exitoso. Parametros obtenidos',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error de sistema: RPTCNSDDOSRV',
      error: error.message,
    }
  }
}
module.exports = {
  frmsInitialReport,
  frmsStatusReport,
  frmsReport,
  frmsConsolidado
}
