 
const QUtils = require('../../utils/queries/Qutils')
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
const estado_proceso = '3'

const abasServices =  require('./abastecimientoService.js')



//metodos para el cargado
const initialData = async (dto, handleError) => {
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

    //obtiene permisos
    const permiso = await abasServices.verificaPermisoAbasEnProcesamiento(dto)
    return {
      ok: true,
      data: d,
      permiso: permiso.data
    }
  } catch (error) {
    console.log(error)
    handleError.setMessage('Error de sistema: LOADINITIALSRV')
    handleError.setHttpError(error.message)
    console.log('error:::', error)
  }
}

const dataLoadingReport = async (dto, handleError) => {
  try {
    frmUtil.setToken(dto.token)
    //ids de establecimientos permitidos    
    const resp =  await frmUtil.getGroupIdsInstitucion() 
    
    const ids_institucion = resp.join("','") //frmUtil.getResults().join("','")
    let whereAux = ''
    if (ids_institucion)
      whereAux = `AND r.institucion_id IN ('${ids_institucion}')`

    //colocar aki restriccion por estblecimiento segun rol
    //const formulario_id = dto.model
    const query = `
              SELECT 
              eg.institucion_id AS idx, eg.nombre_institucion AS periodo,
              '['||string_agg(DISTINCT '{"periodo":"'||r.periodo||'", "registros":'||
              (SELECT COUNT(*) FROM uf_abastecimiento_llenado ll2 
              WHERE ll2.registro_id=r.registro_id)
              ||' }'  ,',' 
              ORDER BY '{"periodo":"'||r.periodo||'", "registros":'||
              (SELECT COUNT(*) FROM uf_abastecimiento_llenado ll2 
              WHERE ll2.registro_id=r.registro_id)
              ||' }' desc
              )||']' AS registros


              FROM uf_abastecimiento_registro r, ae_institucion i, ae_institucion eg
              WHERE r.institucion_id =  i.institucion_id
              AND i.institucion_root=eg.institucion_id
              ${whereAux}
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

const getDataLoadingReport = async (dto, handleError) => {
  try {
    //datos de session
    frmUtil.setToken(dto.token)
    //const obj_cnf = frmUtil.getObjSession()

    const modelo = dto.modelo
//    const pregunta_id = dto.condicion.idx
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
    const query = `
    SELECT eg.nombre_institucion AS "Ente Gestor",
i.nombre_institucion AS "Establecimiento Salud", 
dpto.nombre_dpto AS "Departamento",

TO_CHAR(TO_DATE(r.periodo,'YYYYMMDD'), 'YYYY-Mon') AS "Periodo",
a.atributo AS "Estado",
ll.stock AS "Stock", ll.consumo_promedio AS "Consumo Promedio" 

FROM ae_institucion eg,
 u_is_atributo a, 
uf_abastecimiento_registro r,  

uf_abastecimiento_llenado ll,

ae_institucion i 
LEFT JOIN al_departamento dpto ON (dpto.cod_dpto=i.cod_dpto)
WHERE eg.institucion_id =  i.institucion_root
AND a.atributo_id =  r.concluido
and r.institucion_id= i.institucion_id
and r.registro_id= ll.registro_id

and eg.institucion_id='${modelo}'

${whereAux}
ORDER BY 4,3,2`

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
      campos_ocultos: ['Stock', 'Consumo Promedio'],
      diferencia: headers.filter((x) => ['Stock', 'Consumo Promedio'].indexOf(x) === -1),
      rows: ['Establecimiento Salud'],
      cols: ['Stock', 'Consumo Promedio'],
      vals: ['Stock', 'Consumo Promedio'],
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

const loadersComprobate = async(dto, handleError)=>{
  try {
    //datos de session
    const data = dto.data
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()
    const resp =  await frmUtil.getGroupIdsInstitucion()    
    const whereInst = resp.length>0 ? {institucion_id: resp} : {}

    //queries para validez de botona reporte
    const resultComprobacion = {}
    qUtil.setTableInstance("uf_abastecimiento_institucion_cnf")
    qUtil.setAttributes([[qUtil.literal('count(*)'), 'conteo']])
    qUtil.setWhere({...whereInst})
    await qUtil.findTune()
    resultComprobacion.frm_inst = qUtil.getResults()[0].conteo

    qUtil.setTableInstance("uf_abastecimiento_registro")
    qUtil.setAttributes([[qUtil.literal('count(*)'), 'conteo']])
    qUtil.setWhere({...whereInst,  periodo: data.periodos, concluido:qUtil.cMayorIgualQue('7'), revisado:qUtil.cMayorIgualQue('15')})
    await qUtil.findTune()
    resultComprobacion.frm_regs = qUtil.getResults()[0].conteo

    qUtil.setTableInstance("ae_institucion")
    qUtil.setAttributes([[qUtil.literal('count(*)'), 'conteo']])
    qUtil.setWhere({es_unidad: true, tipo_institucion_id: 'ASUSS', parent_grp_id: null, root: null, institucion_id: obj_cnf.institucion_id  })
    await qUtil.findTune()
    resultComprobacion.r_master = qUtil.getResults()[0].conteo

    qUtil.setTableInstance("ae_institucion")
    qUtil.setAttributes([[qUtil.literal('count(*)'), 'conteo']])
    qUtil.setWhere({tipo_institucion_id: 'EESS', parent_grp_id: obj_cnf.institucion_id  })
    await qUtil.findTune()
    resultComprobacion.r_slave = qUtil.getResults()[0].conteo

    //obtiene departamento de slave si existe
    resultComprobacion.dpto = 'Nacional'
    resultComprobacion.dptal = false
    if(resultComprobacion.r_slave>0){
      qUtil.setTableInstance("ae_institucion")
      qUtil.setInclude({association: 'dpto', required: true,
        attributes: ['nombre_dpto']      
      })
      await qUtil.findID(obj_cnf.institucion_id)
      resultComprobacion.dpto = qUtil.getResults().dpto.nombre_dpto    
      resultComprobacion.dptal = true
    }
    delete resultComprobacion.r_master
    delete resultComprobacion.r_slave

    return {
      ok: true,      
      data: resultComprobacion,
      message: 'Resultado exitoso. Parametros obtenidos',
    }

  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error de sistema: RPTCMPBFARMSTESRV',
      error: error.message,
    }
  }
}

const actualizaEstadoLoader = async(dto, handleError)=>{
  try {
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSessionForModify()
    //datos de session
    const idx = dto.data.idx
    
    console.log("\n\n",dto,"\n\n")
    //console.log("\n\n",payload,"\n\n")
    await qUtil.startTransaction()
    if(dto.data?.payload?.process){
      //const payload = dto.data.payload
      //cambia a estado de en proceso
      qUtil.setTableInstance("uf_abastecimiento_llenado")
      qUtil.setDataset({dni_register: obj_cnf.dni_register, last_modify_date_time: obj_cnf.last_modify_date_time  ,concluido:estado_proceso})      
      qUtil.setWhere({registro_id: idx})
      await qUtil.modify()

      qUtil.setTableInstance('uf_abastecimiento_registro')
      qUtil.setDataset({dni_register: obj_cnf.dni_register, last_modify_date_time: obj_cnf.last_modify_date_time, concluido:estado_proceso})
      qUtil.setWhere({registro_id: idx})
      await qUtil.modify()
    }else{
      //cambia a estado de en proceso
      qUtil.setTableInstance("uf_abastecimiento_llenado")
      qUtil.setDataset({dni_register: obj_cnf.dni_register, last_modify_date_time: obj_cnf.last_modify_date_time  ,concluido:estado_conclusion})      
      qUtil.setWhere({registro_id: idx})
      await qUtil.modify()

      qUtil.setTableInstance('uf_abastecimiento_registro')
      qUtil.setDataset({dni_register: obj_cnf.dni_register, last_modify_date_time: obj_cnf.last_modify_date_time, 
        concluido:estado_conclusion, fecha_concluido:new Date(), revisado: 8})
      qUtil.setWhere({registro_id: idx})
      await qUtil.modify()
    }
    

    await qUtil.commitTransaction()
    return {
      ok: true,      
      //data: resultComprobacion,
      message: 'Resultado exitoso. Parametros obtenidos',
    }

  } catch (error) {
    qUtil.rollbackTransaction()
    console.log(error)
    return {
      ok: false,
      message: 'Error de sistema: RPTCMPBFARMSTESRV',
      error: error.message,
    }
  }
}
module.exports = {    
    initialData, dataLoadingReport,
    getDataLoadingReport,
    loadersComprobate, 
    actualizaEstadoLoader
 
}