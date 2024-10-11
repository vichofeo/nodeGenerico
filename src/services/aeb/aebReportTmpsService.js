const QUtils = require('./../../models/queries/Qutils')
const qUtil = new QUtils()

const REPORTS = require('./parametersReports')//JSON.parse(JSON.stringify(require('./parametersReports')))
const REPORTSUCASS = require('../acrehab/parametersReports')

const theReports= {
  aeb: REPORTS,
  ucass: REPORTSUCASS
}

const FrmUtils = require('./../frms/FrmsUtils')
const frmUtil = new FrmUtils()

const tmpsInitialReport = (dto, handleError) => {
    try {
      let data = REPORTS
      if(dto.option)
      data = theReports[dto.option]

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

  const tmpsStatus = async (dto, handleError) => {
    try { 
      
      let modelos = REPORTS
      if(dto.option)
        modelos = theReports[dto.option]
  
      let response = {}
      
      if(typeof modelos[dto.model] == 'undefined') throw new Error("Modelo no definido error de diseño")

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
        response = { [dto.model]: {items:result, multiple:Array.isArray(element.parseAttrib)} }
      
     
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

  const tmpsReport = async (dto, handleError) => {
    try {

      let optionReport = REPORTS
      if(dto.option)
        optionReport = theReports[dto.option]

        //VALIDAR USO Y CONDICIONES SEGUN TOKEN //pendiente de patente
        //dondicion extra por lugar

        const datosResult = {}
        const modelo =  dto.modelo
        const datoCondicion =  dto.condicion
        

        //construye query de datos
        console.log("*****************************************::::::::::::::", datoCondicion)
        
        let campos = optionReport[modelo].campos
        let from = optionReport[modelo].tables
        let where = optionReport[modelo].metodo(datoCondicion) + ' '

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

        //ejecuta query construido
        let query = `SELECT ${campos} FROM ${from} ${leftjoin} WHERE ${where}`
        
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

module.exports = {
    tmpsInitialReport,
    tmpsStatus,
    tmpsReport
}
