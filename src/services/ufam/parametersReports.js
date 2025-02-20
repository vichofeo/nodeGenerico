'use strict'


const REPORTS = {
  rames: {
    table: 'tmp_ames',
    tables: 'tmp_ames',
    alias: 'Datos A.M.E.S.',
    attributes: [["to_char(fecha_emision, 'YYYY-MM')", 'periodo'], ['count(*)', 'registros']],
    campos: `numero,auditor,no_ame,caso,genero,edad,por_fallecimiento,solicitante,tipo_solicitud,gestion_solicitud,gestion_ejecucion,departamento,ente_gestor_name,establecimiento,servicio,art_63,art_642,art_644,to_char(fecha_emision,'YYYY-MM'),to_char(cronograma,'YYYY-MM'),notificacion_legitimador,notificacion_msyd,apelacion,observacion`,
    headers: ['NÚMERO', 'AUDITOR RESPONSABLE', 'N° DE AME', 'CASO', 'GENERO', 'EDAD', 'POR FALLECIMIENTO', 'NOMBRE DEL SOLICITANTE ', 'TIPO DE SOLICITUD', 'GESTION SOLICITUD', 'GESTION EJECUCIÓN', 'DEPARTAMENTO', 'ENTE GESTOR', 'ESTABLECIMIENTO', 'SERVICIO', 'ART.    63', 'ART. 64,2', 'ART. 64,4', 'PERIODO EMISION INFORME AME', 'PERIODO CRONOGRAMA SEGUIMIENTO AL PAC', 'NOTIFICACION INFORME A LEGITIMADORES', 'NOTIFICACION AL MSyD', 'APELACIÓN', 'OBSERVACION' ],
    tipo: 'Count',
    camposOcultos: [],
    rows: ['ENTE GESTOR'],
    cols: ['DEPARTAMENTO'],
    mdi: 'mdi-cart-plus',

    precondicion: [],

    referer: [],
    //condicionSolicitud: function(){return `to_char(fecha_dispensacion, 'YYYY')='${dato}'`}
    metodo: function (dato = Array()) {
      let sentencia = ''
      if (Array.isArray(dato)) {
        dato = dato.map((o) => o.periodo)

        if (dato.length == 1 && dato[0] == 'Todos') sentencia = ['1=1']
        else
          sentencia = dato.map(
            (val) => `to_char(fecha_emision, 'YYYY-MM')='${val}'`
          )

        sentencia = `( ${sentencia.join(' OR ')} ) `
      } else sentencia = '1=2'
      return sentencia
    },
  },
  rinas: {
    table: 'tmp_inas',
    tables: 'tmp_inas',
    alias: 'Datos I.N.A.S.',
    attributes: [["to_char(fecha_emision, 'YYYY-MM')", 'periodo'], ['count(*)', 'registros']],
    campos: `numero,gestion,ente_gestor_name,origen_inas,inas_no,auditor,establecimiento,servicio,departamento,f_emision,f_cronograma,observacion`,
    headers: ['No.', 'GESTION', 'ENTE GESTOR', 'ORIGEN DE INAS', 'INAS N° ', 'AUDITOR RESPONSABLE', 'ESTABLECIMIENTO DE SALUD ', 'SERVICIO ', 'CIUDAD', 'FECHA DE EMISIÓN', 'CRONOGRAMA', 'OBSERVACION'],
    tipo: 'Count',
    camposOcultos: [],
    rows: ['ENTE GESTOR'],
    cols: ['CIUDAD'],
    mdi: 'mdi-home-assistant',

    precondicion: [],

    referer: [],
    //condicionSolicitud: function(){return `to_char(fecha_dispensacion, 'YYYY')='${dato}'`}
    metodo: function (dato = Array()) {
      let sentencia = ''
      if (Array.isArray(dato)) {
        dato = dato.map((o) => o.periodo)

        if (dato.length == 1 && dato[0] == 'Todos') sentencia = ['1=1']
        else
          sentencia = dato.map(
            (val) => `to_char(fecha_emision, 'YYYY-MM')='${val}'`
          )

        sentencia = `( ${sentencia.join(' OR ')} ) `
      } else sentencia = '1=2'
      return sentencia
    },
  },
 
}

module.exports = REPORTS
