const QUtils = require('./../../utils/queries/Qutils')
const qUtil = new QUtils()

const PARAMETERS = require("./parameters")

const REPORTS = {}
REPORTS.aeb = require('./parametersReports')//JSON.parse(JSON.stringify(require('./parametersReports')))
REPORTS.ucass = require('../acrehab/parametersReports')
REPORTS.ufam = require('../ufam/parametersReports')
REPORTS.upfs = require('../upfs/parametersReports')

const defaultOption = 'aeb'
/*const theReports= {
  aeb: REPORTS,
  ucass: REPORTSUCASS
}*/

const FrmUtils = require('./../frms/FrmsUtils')
const frmUtil = new FrmUtils()

const tmpsInitialReport = (dto, handleError) => {
  try {
    let data = REPORTS[defaultOption]


    if (dto?.option && REPORTS[dto.option])
      data = REPORTS[dto.option]
    console.log("intial report opcion", data)
    const d = {}
    for (const key in data) {
      d[key] = { title: data[key].alias }
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

const ___tmpCheckKeySessionInQuery = async (modelo, campos, from, where, order = '', leftjoin = '') => {
  let query = `${campos} ${from} ${leftjoin} ${where} ${order}  `
  let whereSession = ''
  if (modelo?.keySession) {
    whereSession = await frmUtil.getKeySessionConditionLiteral(modelo, null)
    //verifica si exste la variable de session    
    if (query.indexOf('$keySession') < 0)
      where += ` AND ${whereSession}`
  }
  //construye query    
  query = `SELECT ${campos} 
                    FROM ${from} ${leftjoin} 
                    WHERE ${where}
                    ${order}`
  query = query.replaceAll('$keySession', whereSession)

  return query
} 
  const ___tmpStatusLiteral = async(modelos, dto)=>{
    const element = modelos[dto.model]  
    const tabla = element.table
    const atributos =  element.attributes
    let where =  element?.conditional ? element.conditional:'1=1'
    const order = element?.order ? element.order:''
        
    let query =  await ___tmpCheckKeySessionInQuery(element, atributos, tabla, where, order)
    qUtil.setQuery(query)
    await qUtil.excuteSelect()
    let result = qUtil.getResults()

    if(element.parseAttrib && Array.isArray(element.parseAttrib)){
      result =  result.map(obj=>{
        const keys =  Object.keys(obj)            
        let oAux =  {}            
        for (const i in keys) {
          let k = keys[i]
          
          if(element.parseAttrib.includes(i.toString())) obj[k]=JSON.parse(obj[k])
          
          oAux =  Object.assign(oAux, {[k]:obj[k]})
        }
        return oAux
      })
      
     }
     return { [dto.model]: {items:result, multiple:Array.isArray(element.parseAttrib)} }

  }
  const ___tmpStatus = async(modelos, dto)=>{
    const element = modelos[dto.model]  
    const attributes =  element.attributes.map(arr=>[qUtil.literal(arr[0]), arr[1]])
    const agroup = element.attributes.map(arr=> qUtil.literal(arr[0]))

    qUtil.setTableInstance(element.table)
    qUtil.setAttributes(attributes)
    qUtil.setWhere({ swloadend: true })
    agroup.pop()
    qUtil.setGroupBy(agroup)
    //pregunta si es cons Subquery especial
    if(Array.isArray(element.parseAttrib))
      qUtil.setOrder([qUtil.literal("1")])
      else
    qUtil.setOrder([[qUtil.literal(element.attributes[0][0]), 'DESC']])

     await qUtil.findTune()
     
     let result =  qUtil.getResults()
     
     if(element.parseAttrib && Array.isArray(element.parseAttrib)){
      result =  result.map(obj=>{
        const keys =  Object.keys(obj)            
        let oAux =  {}            
        for (const i in keys) {
          let k = keys[i]
          
          if(element.parseAttrib.includes(i.toString())) obj[k]=JSON.parse(obj[k])
          
          oAux =  Object.assign(oAux, {[k]:obj[k]})
        }
        return oAux
      })
      
     }
    return { [dto.model]: {items:result, multiple:Array.isArray(element.parseAttrib)} }
  }
  const tmpsStatus = async (dto, handleError) => {
    try { 
      frmUtil.setToken(dto.token)
      let modelos = REPORTS[defaultOption]
      if(dto?.option && REPORTS[dto.option])
        modelos = REPORTS[dto.option]
  
      let response = {}
      
      if (typeof modelos[dto.model] == 'undefined') throw new Error("Modelo no definido error de diseño")

      if (modelos[dto.model]?.literal)
        response = await ___tmpStatusLiteral(modelos, dto)
      else
        response = await ___tmpStatus(modelos, dto)


      return {
        ok: true,
        data: response,
        message: 'Requerimiento atendido exitosamente',
      }
    } catch (error) {
      //console.log(error)
      handleError.setMessage('Error de sistema: STATUSINITIALSRV')
      handleError.setHttpError(error.message)
      //console.log('error:::', error)
    }
  }

  const tmpsReport = async (dto, handleError) => {
    try {

      let optionReport = REPORTS[defaultOption]
      if(dto?.option && REPORTS[dto.option])
        optionReport = REPORTS[dto.option]

        //VALIDAR USO Y CONDICIONES SEGUN TOKEN //pendiente de patente
        //dondicion extra por lugar

        const datosResult = {}
        const modelo =  dto.modelo
        const datoCondicion =  dto.condicion
        

        //construye query de datos
        console.log("*******************TEMP-REPORT**********************::::::::::::::", datoCondicion)
        
        let campos = optionReport[modelo].campos
        let from = optionReport[modelo].tables
        let where = optionReport[modelo].metodo(datoCondicion) + ' '
        let order = ''

        let leftjoin = ''
        for (let i = 0; i < optionReport[modelo].referer.length; i++) {
            console.log(i)
            if (optionReport[modelo].referer[i].tabla) {
                leftjoin = `${leftjoin} ,
                     ${optionReport[modelo].referer[i].tabla}`
            } else {
                campos = ` ${campos} , ${optionReport[modelo].referer[i].campos}`                
                leftjoin = `${leftjoin} 
                    LEFT JOIN ${optionReport[modelo].referer[i].ref} ON (${optionReport[modelo].referer[i].camporef} = ${optionReport[modelo].referer[i].camporefForeign})`
            }
        }
        if (optionReport[modelo].precondicion && optionReport[modelo].precondicion.length)
            where = `${where} AND ${optionReport[modelo].precondicion.join(' AND ')}`

        //cheka si existe la opcion keySessionpara limitar los resultados segun session institucion
        let query = await ___tmpCheckKeySessionInQuery(optionReport[modelo], campos, from, where, order, leftjoin)
        qUtil.setQuery(query)
        await qUtil.excuteSelect()

        let result = qUtil.getResults()
        let headers = []
        //convierte en array resultados
        if (result.length > 0) {
            headers = optionReport[modelo].headers//Object.keys(result[0])
            result = result.map((obj, index) => Object.values(obj))
            result.unshift(headers)
        }

        //construye datos de configuracion para reporte dinamico
        const cnf = {
            tipo_agregacion: optionReport[modelo].tipo,
            campos_ocultos: optionReport[modelo].camposOcultos,
            diferencia: headers.filter(x => optionReport[modelo].camposOcultos.indexOf(x) === -1),
            rows: optionReport[modelo].rows,
            cols: optionReport[modelo].cols,
            vals: optionReport[modelo].camposOcultos,
            mdi: optionReport[modelo].mdi
        }
        datosResult[modelo] = { values: result, headers: headers, cnf }

        return {
            ok: true,
            data: { ...datosResult, model: modelo, titulo: optionReport[modelo].alias },            
            message: 'Resultado exitoso. Parametros obtenidos'
        }

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: "Error de sistema: RPTGRALSRV",
            error: error.message
        }
    };

}

const tmpsReportSnis =  async (dto, handleError)=>{
  try {
    return{
      ok:true,
      message: "Solicitud ejecutada exitosamente",
      data: PARAMETERS['opciones']
    }
  } catch (error) {
    handleError.setMessage('Error de sistema: STATUSSNISSRV')
      handleError.setHttpError(error.message)
  }
}

const tmpsDeletetSnis =  async (dto, handleError)=>{
  await qUtil.startTransaction()
  try {
    const tablas = { snis301an: 'tmp_snis301a', snis301bn: 'tmp_snis301b', snis302an: 'tmp_snis302a', snis302bn: 'tmp_snis302b' }
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()
    const data = dto.data
    const index = data.snisflag
    let periodo = null
    let ok = null
    let message = ""
    
    /*if(data?.semana && data.semana.split(",").length==1)
      periodo = {semana: data.semana}
    else if(data?.periodo && data.periodo.split(",").length==1)
      periodo = {periodo: data.periodo}
    */
    if(data?.semana && data.periodoSelected.length>0)
      periodo = {semana: data.periodoSelected}
    else if(data?.mes && data.periodoSelected.length>0)
      periodo = {mes: data.periodoSelected}
    
    
    if(tablas[index] && periodo && data.accion==true){
      qUtil.setTableInstance(tablas[index])
      let where = {
        gestion: data.gestion, 
        departamento:data.departamento, 
        ente_gestor_name: data.ente, 
        establecimiento: data.establecimiento,
        ...periodo,
        dni_register: obj_cnf.dni_register
      }
      
      qUtil.setWhere(where)
      await qUtil.deleting()
      ok=true
      message= "Registro Eliminado Correctamente."
    }else{
      ok=false
      message="No se pudo eliminar registro posiblemente desa borrar mas de un mes/semana"
    }
    
    await qUtil.commitTransaction()
    return {
      ok:ok,
      message: message
    }
  } catch (error) {
    
    await qUtil.rollbackTransaction()
    handleError.setMessage('Error de sistema: DESTROYSNISSRV')
      handleError.setHttpError(error.message)
  }
}
module.exports = {
    tmpsInitialReport,
    tmpsStatus,
    tmpsReport, 
    tmpsReportSnis, 
    tmpsDeletetSnis
}
