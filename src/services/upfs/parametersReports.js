'use strict'

const REPORTS = {
  
  rAbastecimiento: {
    literal: true,
    attributes: 'r.periodo, COUNT(*) as registros',
    table: 'upf_registro r, uf_abastecimiento a',
    conditional: "r.registro_id =  a.registro_id AND r.concluido='7'",
    order: 'GROUP BY 1 ORDER BY 1 DESC', 
    keySession:{replaceKey:false, campo:'r.institucion_id'},    

    tables: 'ae_institucion i, ae_institucion eg, al_departamento d, upf_registro r, uf_abastecimiento ll, uf_liname l',
    alias: 'Datos de Abastecimiento de Farmacias',
    campos: `eg.nombre_institucion AS eg, d.nombre_dpto AS dpto, i.nombre_institucion AS eess,
    l.cod_liname, l.medicamento ||' '|| l.concentracion  AS descripcion, l.forma_farmaceutica AS presentacion, to_char(ll.fecha_vencimiento,'dd/mm/yyyy') AS fvencimiento, ll.reg_sanitario, ll.consumo_mensual, ll.ingresos, ll.egresos, ll.transferencias, ll.saldo_stock AS stock`,
    headers: ['ENTE GESTOR', 'DEPARTAMENTO', 'ESTABLECIMIENTO SALUD',
        'CODIGO/ ITEM', 'DESCRIPCIÓN DEL MEDICAMENTO/CONCENTRACION', 'PRESENTACION', 'FECHA VENCIMIENTO', 'REGISTRO SANITARIO', 'CONSUMO MENSUAL', 'INGRESOS', 'EGRESOS', 'TRANSFERENCIAS', 'SALDOS/STOCK'],
    tipo: 'Sum',
    camposOcultos: ['CONSUMO MENSUAL', 'INGRESOS', 'EGRESOS', 'TRANSFERENCIAS', 'SALDOS/STOCK'],
    rows: ['CODIGO/ ITEM', 'DESCRIPCIÓN DEL MEDICAMENTO/CONCENTRACION', 'PRESENTACION', 'FECHA VENCIMIENTO', 'REGISTRO SANITARIO'],
    cols: ['DEPARTAMENTO'],
    mdi: 'mdi-medical-bag',

    precondicion: ['r.institucion_id = i.institucion_id', 'i.cod_pais=d.cod_pais', 'i.cod_dpto = d.cod_dpto', 'i.institucion_root = eg.institucion_id', 
        'r.registro_id=ll.registro_id', 'll.cod_liname=l.cod_liname', 'll.swloadend =  true', "r.concluido='7'"],
    referer: [],
    //condicionSolicitud: function(){return `to_char(fecha_dispensacion, 'YYYY')='${dato}'`}
    metodo: function (dato = Array()) {
      let sentencia = ''
      if (Array.isArray(dato)) {
        dato = dato.map((o) => o.periodo)

        if (dato.length == 1 && dato[0] == 'Todos') sentencia = ['1=1']
        else
          sentencia = dato.map(
            (val) => `periodo='${val}'`
          )

        sentencia = `( ${sentencia.join(' OR ')} ) `
      } else sentencia = '1=2'
      return sentencia
    },
  },
  snis301a: {
    alias: 'Datos snis - Formularios 301A',
    literal: true,
    attributes: ` formulario AS periodo,
                '['|| string_agg(
                '{"periodo":"'||periodo||'", "registros":'||registros||'}', ',' 
                ORDER BY '{"periodo":"'||periodo||'", "registros":'||registros||'}' DESC
                )||' ]' AS registros `,
    table: `( SELECT formulario, gestion||'-'||mes AS periodo, COUNT(*) AS registros
          FROM tmp_snis301a
          WHERE 
          swloadend = TRUE 
          GROUP BY 1,2
          ORDER BY 1
          ) AS t1`,    
    parseAttrib: ['1'],
    conditional: null,
    order: 'GROUP BY 1 ORDER BY 1',
    tables: 'tmp_snis301a s, ae_institucion i',
    campos: `departamento, red,  municipio, i.nombre_corto,establecimiento,gestion,mes,formulario,grupo,variable,lugar_atencion, subvariable,valor`,
    headers: [
      'DEPARTAMENTO',
      'RED',
      'MUNICIPIO',
      'ENTE GESTOR',
      'ESTABLECIMIENTO / INSTITUCION',
      'GESTION',
      'MES',
      'FORMULARIO',
      'GRUPO DE VARIABLES',
      'VARIABLE',
      'DENTRO/FUERA',
      'SUBVARIABLE',
      'VALOR',
    ],
    tipo: 'Integer Sum',
    camposOcultos: ['VALOR'],
    rows: ['GRUPO DE VARIABLES'],
    cols: ['VARIABLE', 'DENTRO/FUERA', 'SUBVARIABLE'],
    mdi: 'mdi-seat-flat-angled',
    precondicion: ['s.eg=i.institucion_id'],
    referer: [],
    metodo: function (dato = {}) {
      //Array(formulario, [mess "gestion-mes"])
      let sentencia = ''
      if (dato.periodo) sentencia = `s.formulario='${dato.periodo}' and `

      if (Array.isArray(dato.registros)) {
        dato.registros = dato.registros.map((o) => o.periodo)
        console.log('\n ::::::::::::::', dato.registros)
        let sentenciaAux = ''
        if (dato.registros.length == 1 && dato.registros[0] == 'Todos')
          sentenciaAux = ['1=1']
        else
          sentenciaAux = dato.registros.map(
            (val) => `gestion||'-'||mes='${val}'`
          )

        sentencia += `( ${sentenciaAux.join(' OR ')} ) `
      } else sentencia = '1=2'
      return sentencia
    },
  },
  snis301b: {
    literal: true,
    table: `( SELECT formulario, gestion||'-'||mes AS periodo, COUNT(*) AS registros
          FROM tmp_snis301b
          WHERE 
          swloadend = TRUE 
          GROUP BY 1,2
          ORDER BY 1
          ) AS t1`,
    tables: 'tmp_snis301b s, ae_institucion i',
    alias: 'Datos snis - Formularios 301B',
    //attributes:[["gestion||'-'||mes", 'periodo'], ['count(*)', 'registros']],
    attributes: ` formulario AS periodo,
                '['|| string_agg(
                '{"periodo":"'||periodo||'", "registros":'||registros||'}', ',' 
                ORDER BY '{"periodo":"'||periodo||'", "registros":'||registros||'}' DESC
                )||' ]' AS registros `,
    parseAttrib: ['1'],
    conditional: null,
    order: 'GROUP BY 1 ORDER BY 1',
    campos: `departamento, red,  municipio, i.nombre_corto,establecimiento,gestion,mes,formulario,grupo,variable,lugar_atencion, subvariable,valor`,
    headers: [
      'DEPARTAMENTO',
      'RED',
      'MUNICIPIO',
      'ENTE GESTOR',
      'ESTABLECIMIENTO / INSTITUCION',
      'GESTION',
      'MES',
      'FORMULARIO',
      'GRUPO DE VARIABLES',
      'VARIABLE',
      'TIPO VARIABLE',
      'SUBVARIABLE',
      'VALOR',
    ],
    tipo: 'Integer Sum',
    camposOcultos: ['VALOR'],
    rows: ['GRUPO DE VARIABLES'],
    cols: ['VARIABLE', 'SUBVARIABLE'],
    mdi: 'mdi-seat-flat-angled',
    precondicion: ['s.eg=i.institucion_id'],
    referer: [],
    metodo: function (dato = {}) {
      //Array(formulario, [mess "gestion-mes"])
      let sentencia = ''
      if (dato.periodo) sentencia = `s.formulario='${dato.periodo}' and `

      if (Array.isArray(dato.registros)) {
        dato.registros = dato.registros.map((o) => o.periodo)
        console.log('\n ::::::::::::::', dato.registros)
        let sentenciaAux = ''
        if (dato.registros.length == 1 && dato.registros[0] == 'Todos')
          sentenciaAux = ['1=1']
        else
          sentenciaAux = dato.registros.map(
            (val) => `gestion||'-'||mes='${val}'`
          )

        sentencia += `( ${sentenciaAux.join(' OR ')} ) `
      } else sentencia = '1=2'
      return sentencia
    },
  },
  snis302a: {
    literal: true,
    table: `( SELECT formulario, gestion||'-'||semana AS periodo, COUNT(*) AS registros
          FROM tmp_snis302a
          WHERE 
          swloadend = TRUE 
          GROUP BY 1,2
          ORDER BY 1
          ) AS t1`,
    tables: 'tmp_snis302a s, ae_institucion i',
    alias: 'Datos snis - Formularios 302A',
    //attributes:[["gestion||'-'||mes", 'periodo'], ['count(*)', 'registros']],
    attributes: ` formulario AS periodo,
                '['|| string_agg(
                '{"periodo":"'||periodo||'", "registros":'||registros||'}', ',' 
                ORDER BY '{"periodo":"'||periodo||'", "registros":'||registros||'}' DESC
                )||' ]' AS registros `,
    parseAttrib: ['1'],
    conditional: null,
    order: 'GROUP BY 1 ORDER BY 1',
    campos: `departamento, red,  municipio, i.nombre_corto,establecimiento,gestion,semana,formulario,grupo,variable,lugar_atencion, subvariable,valor`,
    headers: [
      'DEPARTAMENTO',
      'RED',
      'MUNICIPIO',
      'ENTE GESTOR',
      'ESTABLECIMIENTO / INSTITUCION',
      'GESTION',
      'SEMANA EPIDEMIOLOGICA',
      'FORMULARIO',
      'GRUPO DE VARIABLES',
      'VARIABLE',
      'DENTRO/FUERA',
      'SUBVARIABLE',
      'VALOR',
    ],
    tipo: 'Integer Sum',
    camposOcultos: ['VALOR'],
    rows: ['GRUPO DE VARIABLES'],
    cols: ['VARIABLE', 'DENTRO/FUERA', 'SUBVARIABLE'],
    mdi: 'mdi-seat-flat-angled',
    precondicion: ['s.eg=i.institucion_id'],
    referer: [],
    metodo: function (dato = {}) {
      //Array(formulario, [semanas "gestion-semana"])
      let sentencia = ''
      if (dato.periodo) sentencia = `s.formulario='${dato.periodo}' and `

      if (Array.isArray(dato.registros)) {
        dato.registros = dato.registros.map((o) => o.periodo)
        console.log('\n ::::::::::::::', dato.registros)
        let sentenciaAux = ''
        if (dato.registros.length == 1 && dato.registros[0] == 'Todos')
          sentenciaAux = ['1=1']
        else
          sentenciaAux = dato.registros.map(
            (val) => `gestion||'-'||semana='${val}'`
          )

        sentencia += `( ${sentenciaAux.join(' OR ')} ) `
      } else sentencia = '1=2'
      return sentencia
    },
  },
  snis302b: {
    literal: true,
    table: `( SELECT formulario, gestion||'-'||mes AS periodo, COUNT(*) AS registros
          FROM tmp_snis302b
          WHERE 
          swloadend = TRUE 
          GROUP BY 1,2
          ORDER BY 1
          ) AS t1`,
    tables: 'tmp_snis302b s, ae_institucion i',
    alias: 'Datos snis - Formularios 302B',
    //attributes:[["gestion||'-'||mes", 'periodo'], ['count(*)', 'registros']],
    attributes: ` formulario AS periodo,
                '['|| string_agg(
                '{"periodo":"'||periodo||'", "registros":'||registros||'}', ',' 
                ORDER BY '{"periodo":"'||periodo||'", "registros":'||registros||'}' DESC
                )||' ]' AS registros `,
    parseAttrib: ['1'],
    conditional: null,
    order: 'GROUP BY 1 ORDER BY 1',
    campos: `departamento, red,  municipio, i.nombre_corto,establecimiento, gestion, mes, formulario, grupo, gvariable,variable,lugar_atencion, subvariable,valor`,
    headers: [
      'DEPARTAMENTO',
      'RED',
      'MUNICIPIO',
      'ENTE GESTOR',
      'ESTABLECIMIENTO / INSTITUCION',
      'GESTION',
      'MES',
      'FORMULARIO',
      'GRUPO DE VARIABLES',
      'TIPO REPORTE',
      'VARIABLE',
      'TIPO VARIABLE',
      'SUBVARIABLE',
      'VALOR',
    ],
    tipo: 'Integer Sum',
    camposOcultos: ['VALOR'],
    rows: ['GRUPO DE VARIABLES'],
    cols: ['TIPO REPORTE', 'VARIABLE', 'TIPO VARIABLE', 'SUBVARIABLE'],
    mdi: 'mdi-seat-flat-angled',
    precondicion: ['s.eg=i.institucion_id'],
    referer: [],
    metodo: function (dato = {}) {
      //Array(formulario, [mess "gestion-mes"])
      let sentencia = ''
      if (dato.periodo) sentencia = `s.formulario='${dato.periodo}' and `

      if (Array.isArray(dato.registros)) {
        dato.registros = dato.registros.map((o) => o.periodo)
        console.log('\n ::::::::::::::', dato.registros)
        let sentenciaAux = ''
        if (dato.registros.length == 1 && dato.registros[0] == 'Todos')
          sentenciaAux = ['1=1']
        else
          sentenciaAux = dato.registros.map(
            (val) => `gestion||'-'||mes='${val}'`
          )

        sentencia += `( ${sentenciaAux.join(' OR ')} ) `
      } else sentencia = '1=2'
      return sentencia
    },
  },
  
}

module.exports = REPORTS
