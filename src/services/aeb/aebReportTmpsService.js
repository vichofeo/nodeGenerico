const QUtils = require('./../../models/queries/Qutils')
const qUtil = new QUtils()

const REPORTS = require('./parametersReports')//JSON.parse(JSON.stringify(require('./parametersReports')))

const FrmUtils = require('./../frms/FrmsUtils')
const frmUtil = new FrmUtils()

const tmpsInitialReport = (dto, handleError) => {
    try {
      const data = REPORTS
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
      const modelos = REPORTS
  
      let response = {}
      
        const element = modelos[dto.model]
  
        qUtil.setTableInstance(element.table)
        qUtil.setAttributes([
          [qUtil.literal(element.attributes[0][0]), element.attributes[0][1]],
          [qUtil.literal(element.attributes[1][0]), element.attributes[1][1]],
        ])
        qUtil.setWhere({ swloadend: true })
        qUtil.setGroupBy([qUtil.literal(element.attributes[0][0])])
        qUtil.setOrder([[qUtil.literal(element.attributes[0][0]), 'DESC']])
        await qUtil.findTune()
        response = { [dto.model]: qUtil.getResults() }
      
  
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

        //VALIDAR USO Y CONDICIONES SEGUN TOKEN //pendiente de patente
        //dondicion extra por lugar

        const datosResult = {}
        const modelo =  dto.modelo
        const datoCondicion =  dto.condicion
        

        //construye query de datos
        console.log("*****************************************::::::::::::::", datoCondicion)
        
        let campos = REPORTS[modelo].campos
        let from = REPORTS[modelo].tables
        let where = REPORTS[modelo].metodo(datoCondicion) + ' '

        let leftjoin = ''
        for (let i = 0; i < REPORTS[modelo].referer.length; i++) {
            console.log(i)
            if (REPORTS[modelo].referer[i].tabla) {
                leftjoin = `${leftjoin} ,
                     ${REPORTS[modelo].referer[i].tabla}`
            } else {
                campos = ` ${campos} , ${REPORTS[modelo].referer[i].campos}`                
                leftjoin = `${leftjoin} 
                    LEFT JOIN ${REPORTS[modelo].referer[i].ref} ON (${REPORTS[modelo].referer[i].camporef} = ${REPORTS[modelo].referer[i].camporefForeign})`
            }
        }
        if (REPORTS[modelo].precondicion && REPORTS[modelo].precondicion.length)
            where = `${where} AND ${REPORTS[modelo].precondicion.join(' AND ')}`

        //ejecuta query construido
        let query = `SELECT ${campos} FROM ${from} ${leftjoin} WHERE ${where}`
        
        qUtil.setQuery(query)
        await qUtil.excuteSelect()

        let result = qUtil.getResults()
        let headers = []
        //convierte en array resultados
        if (result.length > 0) {
            headers = REPORTS[modelo].headers//Object.keys(result[0])
            result = result.map((obj, index) => Object.values(obj))
            result.unshift(headers)
        }

        //construye datos de configuracion para reporte dinamico
        const cnf = {
            tipo_agregacion: REPORTS[modelo].tipo,
            campos_ocultos: REPORTS[modelo].camposOcultos,
            diferencia: headers.filter(x => REPORTS[modelo].camposOcultos.indexOf(x) === -1),
            rows: REPORTS[modelo].rows,
            cols: REPORTS[modelo].cols,
            vals: REPORTS[modelo].camposOcultos,
            mdi: REPORTS[modelo].mdi
        }
        datosResult[modelo] = { values: result, headers: headers, cnf }

        return {
            ok: true,
            data: { ...datosResult, model: modelo, titulo: REPORTS[modelo].alias },            
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
