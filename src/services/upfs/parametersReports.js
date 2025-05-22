'use strict'

const REPORTS = {

  rAbastecimiento: {
    literal: true,
    attributes: 'r.periodo, COUNT(*) as registros',
    table: 'upf_registro r, uf_abastecimiento a',
    conditional: "r.registro_id =  a.registro_id AND r.concluido='7'",
    order: 'GROUP BY 1 ORDER BY 1 DESC',
    keySession: { replaceKey: false, campo: 'r.institucion_id' },

    tables: `ae_institucion i, ae_institucion eg, al_departamento d, upf_registro r, uf_abastecimiento ll 
              LEFT JOIN  uf_liname l  ON (ll.cod_liname=l.cod_liname )`,
    alias: 'Datos de Abastecimiento de Farmacias',
    campos: `eg.nombre_institucion AS eg, d.nombre_dpto AS dpto, i.nombre_institucion AS eess,SUBSTR(r.periodo,1,4) as gestion,  r.periodo, TO_CHAR(TO_DATE(r.periodo, 'YYYY-MM'), 'month') as mes,
    ll.cod_liname, ll.grupo, ll.variable, ll.subvariable,
    ll.medicamento ||' '|| COALESCE(l.concentracion,'')  AS descripcion, ll.forma_farmaceutica AS presentacion, 
    COALESCE(l.cod_liname,'-NO-REGISTRADO-') as c_liname, COALESCE(l.medicamento,'') ||' '|| COALESCE(l.concentracion,'')  AS dsc_liname, COALESCE(l.forma_farmaceutica,'') AS frm_liname,
    to_char(ll.fecha_vencimiento,'dd/mm/yyyy') AS fvencimiento, ll.reg_sanitario, ll.consumo_mensual, ll.ingresos, ll.egresos, ll.transferencias, ll.saldo_stock AS stock,
    case ll.consumo_mensual  WHEN 0 THEN 0  else round ((ll.saldo_stock/ll.consumo_mensual)::DECIMAL) END as tmes,
    
    CASE  WHEN (ll.fecha_vencimiento - CURRENT_DATE)>60
                THEN 'Vigente'
                WHEN (ll.fecha_vencimiento - CURRENT_DATE)>0 and (ll.fecha_vencimiento - CURRENT_DATE) <=60
                THEN 'Vencimiento proximo'
                WHEN (ll.fecha_vencimiento - CURRENT_DATE)<0
                THEN 'Vencido'
                ELSE 'N/A' END  AS alertax23,
    CASE ll.consumo_mensual WHEN  0 THEN 'Sobre Stock'
          ELSE CASE WHEN (ll.saldo_stock/ll.consumo_mensual)=0 THEN 'Stock cero' 
          WHEN (ll.saldo_stock/ll.consumo_mensual)>0 AND  (ll.saldo_stock/ll.consumo_mensual)<= 3 THEN 'Sub-Stock'
          WHEN (ll.saldo_stock/ll.consumo_mensual)>3 THEN 'Normo Stock'
          ELSE '-Indeterminado-' END 
END AS alertaxs23
    `,
    headers: ['ENTE GESTOR', 'DEPARTAMENTO', 'ESTABLECIMIENTO SALUD', 'GESTION','PERIODO', 'MES',
      'CODIGO/ ITEM', 'GRUPO', 'VARIABLE', 'SUBVARIABLE',
      'DESCRIPCIÓN DEL MEDICAMENTO/CONCENTRACION', 'PRESENTACION', 
      'COD-LINAME', 'DESC-MED-LINAME', 'PRESEN-LINAME', 
      'FECHA VENCIMIENTO', 'REGISTRO SANITARIO', 'CONSUMO MENSUAL', 'INGRESOS', 'EGRESOS', 'TRANSFERENCIAS', 'SALDOS/STOCK',
      'TIEMPO EN MESES', 'ESTADO VIGENCIA', 'ESTADO STOCK'
    ],
    tipo: 'Sum',
    camposOcultos: ['CONSUMO MENSUAL', 'INGRESOS', 'EGRESOS', 'TRANSFERENCIAS', 'SALDOS/STOCK'],
    rows: ['COD-LINAME', 'DESCRIPCIÓN DEL MEDICAMENTO/CONCENTRACION', 'PRESENTACION', 'FECHA VENCIMIENTO', 'REGISTRO SANITARIO'],
    cols: ['DEPARTAMENTO'],
    mdi: 'mdi-medical-bag',

    precondicion: ['r.institucion_id = i.institucion_id', 'i.cod_pais=d.cod_pais', 'i.cod_dpto = d.cod_dpto', 'i.institucion_root = eg.institucion_id',
      'r.registro_id=ll.registro_id', 'll.swloadend =  true', "r.concluido='7'"],
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
    table: `( SELECT formulario, r.periodo AS periodo, COUNT(*) AS registros
          FROM e_snis301a s, upf_registro r
          WHERE r.registro_id = s.registro_id
          and s.swloadend = TRUE  and r.concluido='7'
          AND $keySession
          GROUP BY 1,2
          ORDER BY 1
          ) AS t1`,
    parseAttrib: ['1'],
    conditional: null,
    order: 'GROUP BY 1 ORDER BY 1',
    keySession: { replaceKey: false, campo: 'r.institucion_id' },

    tables: 'ae_institucion i, ae_institucion eg, al_departamento d, upf_registro r, e_snis301a ll',     
    campos: `eg.nombre_institucion AS eg, d.nombre_dpto AS dpto, i.nombre_institucion AS eess, SUBSTR(r.periodo,1,4) as gestion,  r.periodo, TO_CHAR(TO_DATE(r.periodo, 'YYYY-MM'), 'month') as mes,
    ll.formulario, ll.grupo, ll.variable, ll.lugar_atencion, ll.subvariable, ll.valor`,
    headers: ['ENTE GESTOR', 'DEPARTAMENTO', 'ESTABLECIMIENTO SALUD', 'GESTION','PERIODO', 'MES',
      'FORMULARIO', 'GRUPO DE VARIABLES',   'VARIABLE',   'DENTRO/FUERA',   'SUBVARIABLE',    'VALOR',
    ],
    tipo: 'Integer Sum',
    camposOcultos: ['VALOR'],
    rows: ['GRUPO DE VARIABLES'],
    cols: ['VARIABLE', 'DENTRO/FUERA', 'SUBVARIABLE'],
    mdi: 'mdi-code-equal',
    precondicion: ['r.institucion_id = i.institucion_id', 'i.cod_pais=d.cod_pais', 'i.cod_dpto = d.cod_dpto', 'i.institucion_root = eg.institucion_id',
      'r.registro_id=ll.registro_id', 'll.swloadend =  true', "r.concluido='7'"],
    referer: [],
    metodo: function (dato = {}) {
      //Array(formulario, [mess "gestion-mes"])
      let sentencia = ''
      if (dato.periodo) sentencia = `ll.formulario='${dato.periodo}' and `

      if (Array.isArray(dato.registros)) {
        dato.registros = dato.registros.map((o) => o.periodo)
        console.log('\n ::::::::::::::', dato.registros)
        let sentenciaAux = ''
        if (dato.registros.length == 1 && dato.registros[0] == 'Todos')
          sentenciaAux = ['1=1']
        else
          sentenciaAux = dato.registros.map(
            (val) => `r.periodo='${val}'`
          )

        sentencia += `( ${sentenciaAux.join(' OR ')} ) `
      } else sentencia = '1=2'
      return sentencia
    },
  },
  snis301b: {
    alias: 'Datos snis - Formularios 301B',
    literal: true,
    attributes: ` formulario AS periodo,
                '['|| string_agg(
                '{"periodo":"'||periodo||'", "registros":'||registros||'}', ',' 
                ORDER BY '{"periodo":"'||periodo||'", "registros":'||registros||'}' DESC
                )||' ]' AS registros `,
    table: `( SELECT formulario, r.periodo AS periodo, COUNT(*) AS registros
          FROM e_snis301b s, upf_registro r
          WHERE r.registro_id = s.registro_id
          and s.swloadend = TRUE  and r.concluido='7'
          AND $keySession
          GROUP BY 1,2
          ORDER BY 1
          ) AS t1`,
    parseAttrib: ['1'],
    conditional: null,
    order: 'GROUP BY 1 ORDER BY 1',
    keySession: { replaceKey: false, campo: 'r.institucion_id' },
    tables: 'ae_institucion i, ae_institucion eg, al_departamento d, upf_registro r, e_snis301b ll',
    campos: `eg.nombre_institucion AS eg, d.nombre_dpto AS dpto, i.nombre_institucion AS eess, SUBSTR(r.periodo,1,4) as gestion,  r.periodo, TO_CHAR(TO_DATE(r.periodo, 'YYYY-MM'), 'month') as mes,
    ll.formulario, ll.grupo, ll.variable, ll.lugar_atencion, ll.subvariable, ll.valor`,
    headers: ['ENTE GESTOR', 'DEPARTAMENTO', 'ESTABLECIMIENTO SALUD', 'GESTION','PERIODO', 'MES',
      'FORMULARIO', 'GRUPO DE VARIABLES',   'VARIABLE',   'DENTRO/FUERA',   'SUBVARIABLE',    'VALOR'
    ],
    tipo: 'Integer Sum',
    camposOcultos: ['VALOR'],
    rows: ['GRUPO DE VARIABLES'],
    cols: ['VARIABLE', 'SUBVARIABLE'],
    mdi: 'mdi-chemical-weapon',
    precondicion: ['r.institucion_id = i.institucion_id', 'i.cod_pais=d.cod_pais', 'i.cod_dpto = d.cod_dpto', 'i.institucion_root = eg.institucion_id',
      'r.registro_id=ll.registro_id', 'll.swloadend =  true', "r.concluido='7'"],
    referer: [],
    metodo: function (dato = {}) {
      //Array(formulario, [mess "gestion-mes"])
      let sentencia = ''
      if (dato.periodo) sentencia = `ll.formulario='${dato.periodo}' and `

      if (Array.isArray(dato.registros)) {
        dato.registros = dato.registros.map((o) => o.periodo)
        console.log('\n ::::::::::::::', dato.registros)
        let sentenciaAux = ''
        if (dato.registros.length == 1 && dato.registros[0] == 'Todos')
          sentenciaAux = ['1=1']
        else
          sentenciaAux = dato.registros.map(
            (val) => `r.periodo='${val}'`
          )

        sentencia += `( ${sentenciaAux.join(' OR ')} ) `
      } else sentencia = '1=2'
      return sentencia
    },
  },
  snis302a: {
    alias: 'Datos snis - Formularios 302A',
    literal: true,
    attributes: ` formulario AS periodo,
                '['|| string_agg(
                '{"periodo":"'||periodo||'", "registros":'||registros||'}', ',' 
                ORDER BY '{"periodo":"'||periodo||'", "registros":'||registros||'}' DESC
                )||' ]' AS registros `,
    table: `( SELECT formulario, r.periodo AS periodo, COUNT(*) AS registros
          FROM e_snis302a s, upf_registro r
          WHERE r.registro_id = s.registro_id
          and s.swloadend = TRUE  and r.concluido='7'
          AND $keySession
          GROUP BY 1,2
          ORDER BY 1
          ) AS t1`,    
    parseAttrib: ['1'],
    conditional: null,
    order: 'GROUP BY 1 ORDER BY 1',
    keySession: { replaceKey: false, campo: 'r.institucion_id' },
    tables: 'ae_institucion i, ae_institucion eg, al_departamento d, upf_registro r, e_snis302a ll',
    campos: `eg.nombre_institucion AS eg, d.nombre_dpto AS dpto, i.nombre_institucion AS eess, SUBSTR(r.periodo,1,4) as gestion,  r.periodo, TO_CHAR(TO_DATE(r.periodo, 'IYYY-IW'), 'month') as mes,
    ll.formulario, ll.grupo, ll.variable, ll.lugar_atencion, ll.subvariable, ll.valor`,
    headers: ['ENTE GESTOR', 'DEPARTAMENTO', 'ESTABLECIMIENTO SALUD', 'GESTION','SEMANA EPIDEMIOLOGICA', 'MES',
      'FORMULARIO', 'GRUPO DE VARIABLES',   'VARIABLE',   'DENTRO/FUERA',   'SUBVARIABLE',    'VALOR',
    ],
    tipo: 'Integer Sum',
    camposOcultos: ['VALOR'],
    rows: ['GRUPO DE VARIABLES'],
    cols: ['VARIABLE', 'DENTRO/FUERA', 'SUBVARIABLE'],
    mdi: 'mdi-human-male-female',
    precondicion: ['r.institucion_id = i.institucion_id', 'i.cod_pais=d.cod_pais', 'i.cod_dpto = d.cod_dpto', 'i.institucion_root = eg.institucion_id',
      'r.registro_id=ll.registro_id', 'll.swloadend =  true', "r.concluido='7'"],
    referer: [],
    metodo: function (dato = {}) {
      //Array(formulario, [semanas "gestion-semana"])
      let sentencia = ''
      if (dato.periodo) sentencia = `ll.formulario='${dato.periodo}' and `

      if (Array.isArray(dato.registros)) {
        dato.registros = dato.registros.map((o) => o.periodo)
        console.log('\n ::::::::::::::', dato.registros)
        let sentenciaAux = ''
        if (dato.registros.length == 1 && dato.registros[0] == 'Todos')
          sentenciaAux = ['1=1']
        else
          sentenciaAux = dato.registros.map(
            (val) => `r.periodo='${val}'`
          )

        sentencia += `( ${sentenciaAux.join(' OR ')} ) `
      } else sentencia = '1=2'
      return sentencia
    },
  },
  snis302b: {
    alias: 'Datos snis - Formularios 302B',
    literal: true,
    table: `( SELECT formulario, r.periodo AS periodo, COUNT(*) AS registros
          FROM e_snis302b s, upf_registro r
          WHERE r.registro_id = s.registro_id
          and s.swloadend = TRUE  and r.concluido='7'
          AND $keySession
          GROUP BY 1,2
          ORDER BY 1
          ) AS t1`,
    attributes: ` formulario AS periodo,
                '['|| string_agg(
                '{"periodo":"'||periodo||'", "registros":'||registros||'}', ',' 
                ORDER BY '{"periodo":"'||periodo||'", "registros":'||registros||'}' DESC
                )||' ]' AS registros `,
    parseAttrib: ['1'],
    conditional: null,
    order: 'GROUP BY 1 ORDER BY 1',
    keySession: { replaceKey: false, campo: 'r.institucion_id' },
    tables: 'ae_institucion i, ae_institucion eg, al_departamento d, upf_registro r, e_snis302b ll',
    campos: `eg.nombre_institucion AS eg, d.nombre_dpto AS dpto, i.nombre_institucion AS eess, SUBSTR(r.periodo,1,4) as gestion,  r.periodo, TO_CHAR(TO_DATE(r.periodo, 'YYYY-MM'), 'month') as mes,
    ll.formulario, ll.grupo, ll.gvariable , ll.variable, ll.lugar_atencion, ll.subvariable, ll.valor`,
    headers: ['ENTE GESTOR', 'DEPARTAMENTO', 'ESTABLECIMIENTO SALUD', 'GESTION','SEMANA EPIDEMIOLOGICA', 'MES',
      'FORMULARIO', 'GRUPO DE VARIABLES',  'TIPO REPORTE' ,'VARIABLE',  'TIPO VARIABLE',   'SUBVARIABLE', 'VALOR',
    ],
    tipo: 'Integer Sum',
    camposOcultos: ['VALOR'],
    rows: ['GRUPO DE VARIABLES'],
    cols: ['TIPO REPORTE', 'VARIABLE', 'TIPO VARIABLE', 'SUBVARIABLE'],
    mdi: 'mdi-snowman',
    precondicion: ['r.institucion_id = i.institucion_id', 'i.cod_pais=d.cod_pais', 'i.cod_dpto = d.cod_dpto', 'i.institucion_root = eg.institucion_id',
      'r.registro_id=ll.registro_id', 'll.swloadend =  true', "r.concluido='7'"],
    referer: [],
    metodo: function (dato = {}) {
      //Array(formulario, [mess "gestion-mes"])
      let sentencia = ''
      if (dato.periodo) sentencia = `ll.formulario='${dato.periodo}' and `

      if (Array.isArray(dato.registros)) {
        dato.registros = dato.registros.map((o) => o.periodo)
        console.log('\n ::::::::::::::', dato.registros)
        let sentenciaAux = ''
        if (dato.registros.length == 1 && dato.registros[0] == 'Todos')
          sentenciaAux = ['1=1']
        else
          sentenciaAux = dato.registros.map(
            (val) => `r.periodo='${val}'`
          )

        sentencia += `( ${sentenciaAux.join(' OR ')} ) `
      } else sentencia = '1=2'
      return sentencia
    },
  },

}

module.exports = REPORTS
