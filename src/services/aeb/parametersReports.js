'use strict'

const REPORTS = {
  carmelo: {
    table: 'tmp_carmelo',
    tables: 'tmp_carmelo',
    alias: 'Datos Carmelo',
    attributes: [
      ["to_char(fecha_dispensacion, 'YYYY')", 'periodo'],
      ['count(*)', 'registros'],
    ],
    campos: `ente_gestor_name, departamento, regional, establecimiento, nivel_atencion,to_char(fecha_dispensacion, 'YYYY-MM') as periodo, genero, edad, cantidad_dispensada, especialidad,diagnostico`,
    headers: [
      'ENTE GESTOR',
      'Departamento',
      'Regional/Distrital',
      'Nombre el Establecimiento',
      'Nivel de atención',
      'Periodo de dispensacion  (año-mm)',
      'Sexo',
      'EDAD',
      'Cantidad dispensada',
      'Especialidad',
      'Diagnóstico',
    ],
    tipo: 'Count',
    camposOcultos: ['Cantidad dispensada'],
    rows: ['Departamento'],
    cols: ['ENTE GESTOR'],
    mdi: 'mdi-hospital-building',

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
            (val) => `to_char(fecha_dispensacion, 'YYYY')='${val}'`
          )

        sentencia = `( ${sentencia.join(' OR ')} ) `
      } else sentencia = '1=2'
      return sentencia
    },
  },
  pai_regular: {
    table: 'tmp_pai',
    tables: 'tmp_pai',
    alias: 'Datos PAI Regular',
    attributes: [
      ["to_char(fecha_vacunacion, 'YYYY-MM')", 'periodo'],
      ['count(*)', 'registros'],
    ],
    campos: `to_char(fecha_vacunacion, 'YYYY-MM') as fe_vacunacion,estrategia,to_char(fecha_nacimiento, 'YYYY') as nacimiento,edad,genero,nacionalidad, departamento, municipio,cod_rues,establecimiento,ente_gestor_name, vacuna,nro_dosis, proveedor,lote_vacuna,embarazo,jeringa_administracion,lote_diluyente,jeringa_dilusion`,
    headers: [
      'Periodo de Vacunación (YYYY-MM)',
      'Estrategia',
      'Año Nacimiento',
      'Edad (Años)',
      'Sexo',
      'Nacionalidad',
      'Departamento',
      'Municipio',
      'Codigo RUES',
      'Establecimiento',
      'Ente Gestor',
      'Nombre Vacuna',
      'Nro. de Dosis',
      'Proveedor',
      'Lote Vacuna',
      'Embarazo',
      'Jeringa de Administración',
      'Lote Diluyente',
      'Jeringa de Dilusión',
    ],
    tipo: 'Count',
    camposOcultos: [],
    rows: ['Nombre Vacuna'],
    cols: ['Nro. de Dosis'],
    mdi: 'mdi-flask-outline',
    precondicion: [],
    referer: [],
    metodo: function (dato = Array()) {
      let sentencia = ''
      if (Array.isArray(dato)) {
        dato = dato.map((o) => o.periodo)
        if (dato.length == 1 && dato[0] == 'Todos') sentencia = ['1=1']
        else
          sentencia = dato.map(
            (val) => `to_char(fecha_vacunacion, 'YYYY-MM')='${val}'`
          )
        sentencia = `( ${sentencia.join(' OR ')} ) `
      } else sentencia = '1=2'
      return sentencia
    },
  },
  oncologia: {
    table: 'tmp_cancer',
    tables: 'tmp_cancer',
    alias: 'Datos Pacientes de Oncologia - CANCER',
    attributes: [
      ["to_char(fecha_diagnostico, 'YYYY')", 'periodo'],
      ['count(*)', 'registros'],
    ],
    campos: `departamento, ente_gestor_name, establecimiento, edad, edad_recodificada,genero,to_char(fecha_diagnostico,'YYYY-MM'),diagnostico_histopatologico,localizacion, sitio_primario,cie_grupo,localizacion_metastasis,to_char(fecha_defuncion,'YYYY-MM')`,
    headers: ['DEPARTAMENTO','ENTE GESTOR','ESTABLECIMIENTO / INSTITUCION', 'EDAD', 'EDAD RECODIFICADA', 'SEXO', 'PERIODO DE DIAGNÓSTICO (YYYY-MM)', 'DIAGNÓSTICO HISTOPATOLOGICO , CLINICO Y/O IMAGENOLOGICO', 'LOCALIZACIÓN', 'SITIO PRIMARIO', 'CIE GRUPOS', 'LOCALIZACION DE METASTASIS', 'PERIODO DE DEFUNCIÓN'],
    tipo: 'Count',
    camposOcultos: [],
    rows: ['SEXO'],
    cols: ['SITIO PRIMARIO'],
    mdi: 'mdi-seat-flat-angled',
    precondicion: [],
    referer: [],
    metodo: function (dato = Array()) {
      let sentencia = ''
      if (Array.isArray(dato)) {
        dato = dato.map((o) => o.periodo)
        if (dato.length == 1 && dato[0] == 'Todos') sentencia = ['1=1']
        else
          sentencia = dato.map(
            (val) => `to_char(fecha_diagnostico, 'YYYY')='${val}'`
          )
        sentencia = `( ${sentencia.join(' OR ')} ) `
      } else sentencia = '1=2'
      return sentencia
    },
  },
  snis302a: {
    table: 'tmp_snis302a',
    tables: 'tmp_snis302a s, ae_institucion i',
    alias: 'Datos snis - Formularios 302A',
    //attributes:[["gestion||'-'||semana", 'periodo'], ['count(*)', 'registros']],
    attributes: [
      ['formulario', 'periodo'],
      [
        `'['||
string_agg(DISTINCT '{"periodo":"'||gestion||'-'||semana||'", "registros":'||
(SELECT COUNT(*) FROM tmp_snis302a s2 WHERE s2.formulario= tmp_snis302a.formulario AND s2.gestion= tmp_snis302a.gestion AND s2.semana= tmp_snis302a.semana)
||'}', ',' ORDER BY '{"periodo":"'||gestion||'-'||semana||'", "registros":'||
(SELECT COUNT(*) FROM tmp_snis302a s2 WHERE s2.formulario= tmp_snis302a.formulario AND s2.gestion= tmp_snis302a.gestion AND s2.semana= tmp_snis302a.semana)
||'}' DESC
)||' ]'`,
        'registros',
      ],
    ],
    parseAttrib: ['1'],
    campos: `departamento, red,  municipio, i.nombre_corto,establecimiento,gestion,semana,formulario,grupo,variable,lugar_atencion, subvariable,valor`,
    headers: [
      'DEPARTAMENTO', 'RED',  'MUNICIPIO',
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
    tipo: 'Sum',
    camposOcultos: ['VALOR'],
    rows: ['GRUPO DE VARIABLES'],
    cols: ['VARIABLE','DENTRO/FUERA', 'SUBVARIABLE'],
    mdi: 'mdi-seat-flat-angled',
    precondicion: ['s.ente_gestor=i.institucion_id'],
    referer: [],
    metodo: function (dato = {}) {
      //Array(formulario, [semanas "gestion-semana"])
      let sentencia = ''
      if (dato.periodo) sentencia = `s.formulario='${dato.periodo}' and `

      if (Array.isArray(dato.registros)) {
        dato.registros =  dato.registros.map(o=>o.periodo)
        console.log("\n ::::::::::::::", dato.registros)
        let sentenciaAux = ''
        if (dato.registros.length == 1 && dato.registros[0] == 'Todos') sentenciaAux = ['1=1']
        else
          sentenciaAux = dato.registros.map((val) => `gestion||'-'||semana='${val}'`)

        sentencia += `( ${sentenciaAux.join(' OR ')} ) `
      } else sentencia = '1=2'
      return sentencia
    },
  },
  snis301a: {
    table: 'tmp_snis301a',
    tables: 'tmp_snis301a s, ae_institucion i',
    alias: 'Datos snis - Formularios 301A',
    //attributes:[["gestion||'-'||mes", 'periodo'], ['count(*)', 'registros']],
    attributes: [
      ['formulario', 'periodo'],
      [
        `'['||
string_agg(DISTINCT '{"periodo":"'||gestion||'-'||mes||'", "registros":'||
(SELECT COUNT(*) FROM tmp_snis301a s2 WHERE s2.formulario= tmp_snis301a.formulario AND s2.gestion= tmp_snis301a.gestion AND s2.mes= tmp_snis301a.mes)
||'}', ',' ORDER BY '{"periodo":"'||gestion||'-'||mes||'", "registros":'||
(SELECT COUNT(*) FROM tmp_snis301a s2 WHERE s2.formulario= tmp_snis301a.formulario AND s2.gestion= tmp_snis301a.gestion AND s2.mes= tmp_snis301a.mes)
||'}' DESC
)||' ]'`,
        'registros',
      ],
    ],
    parseAttrib: ['1'],
    campos: `departamento, red,  municipio, i.nombre_corto,establecimiento,gestion,mes,formulario,grupo,variable,lugar_atencion, subvariable,valor`,
    headers: [
      'DEPARTAMENTO', 'RED',  'MUNICIPIO',
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
    tipo: 'Sum',
    camposOcultos: ['VALOR'],
    rows: ['GRUPO DE VARIABLES'],
    cols: ['VARIABLE', 'DENTRO/FUERA', 'SUBVARIABLE'],
    mdi: 'mdi-seat-flat-angled',
    precondicion: ['s.ente_gestor=i.institucion_id'],
    referer: [],
    metodo: function (dato = {}) {
      //Array(formulario, [mess "gestion-mes"])
      let sentencia = ''
      if (dato.periodo) sentencia = `s.formulario='${dato.periodo}' and `

      if (Array.isArray(dato.registros)) {
        dato.registros =  dato.registros.map(o=>o.periodo)
        console.log("\n ::::::::::::::", dato.registros)
        let sentenciaAux = ''
        if (dato.registros.length == 1 && dato.registros[0] == 'Todos') sentenciaAux = ['1=1']
        else
          sentenciaAux = dato.registros.map((val) => `gestion||'-'||mes='${val}'`)

        sentencia += `( ${sentenciaAux.join(' OR ')} ) `
      } else sentencia = '1=2'
      return sentencia
    },
  },
  snis301b: {
    table: 'tmp_snis301b',
    tables: 'tmp_snis301b s, ae_institucion i',
    alias: 'Datos SNIS - Formularios 301B',
    //attributes:[["gestion||'-'||mes", 'periodo'], ['count(*)', 'registros']],
    attributes: [
      ['formulario', 'periodo'],
      [
        `'['||
string_agg(DISTINCT '{"periodo":"'||gestion||'-'||mes||'", "registros":'||
(SELECT COUNT(*) FROM tmp_snis301b s2 WHERE s2.formulario= tmp_snis301b.formulario AND s2.gestion= tmp_snis301b.gestion AND s2.mes= tmp_snis301b.mes)
||'}', ',' ORDER BY '{"periodo":"'||gestion||'-'||mes||'", "registros":'||
(SELECT COUNT(*) FROM tmp_snis301b s2 WHERE s2.formulario= tmp_snis301b.formulario AND s2.gestion= tmp_snis301b.gestion AND s2.mes= tmp_snis301b.mes)
||'}' DESC
)||' ]'`,
        'registros',
      ],
    ],
    parseAttrib: ['1'],
    campos: `departamento, red,  municipio, i.nombre_corto,establecimiento,gestion,mes,formulario,grupo,variable,lugar_atencion, subvariable,valor`,
    headers: [
      'DEPARTAMENTO', 'RED',  'MUNICIPIO',
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
    tipo: 'Sum',
    camposOcultos: ['VALOR'],
    rows: ['GRUPO DE VARIABLES'],
    cols: ['VARIABLE', 'SUBVARIABLE'],
    mdi: 'mdi-seat-flat-angled',
    precondicion: ['s.ente_gestor=i.institucion_id'],
    referer: [],
    metodo: function (dato = {}) {
      //Array(formulario, [mess "gestion-mes"])
      let sentencia = ''
      if (dato.periodo) sentencia = `s.formulario='${dato.periodo}' and `

      if (Array.isArray(dato.registros)) {
        dato.registros =  dato.registros.map(o=>o.periodo)
        console.log("\n ::::::::::::::", dato.registros)
        let sentenciaAux = ''
        if (dato.registros.length == 1 && dato.registros[0] == 'Todos') sentenciaAux = ['1=1']
        else
          sentenciaAux = dato.registros.map((val) => `gestion||'-'||mes='${val}'`)

        sentencia += `( ${sentenciaAux.join(' OR ')} ) `
      } else sentencia = '1=2'
      return sentencia
    },
  },
  /*camas: {
    table:'tmp_camas',
    tables:'tmp_camas',
    alias: 'Datos Camas disponibles',    
    attributes:[["to_char(fecha_registro, 'YYYY-MM-DD')", 'periodo'], ['count(*)', 'registros']],
    campos: `to_char(fecha_registro,'YYYY-MM-DD'), mail_origen, ente_gestor, establecimieno, nivel_atencion, servicios_primer, servicios_segundo, servicios_tercer, total_camas, camas_disponibles, total_camas_emergencia, camas_emergencia_disponibles`,
    headers:['Marca temporal','Dirección de correo electrónico','ENTE GESTOR','NOMBRE DEL ESTABLECIMIENTO DE SALUD','NIVEL DE ATENCIÓN','SERVICIOS DEL EESS PRIMER NIVEL','SERVICIOS DEL EESS SEGUNDO NIVEL','SERVICIOS EESS TERCER NIVEL','TOTAL CAMAS HOSPITALIZACIÓN','NÚMERO DE CAMAS DISPONIBLES HOSPITALIZACIÓN','TOTAL CAMAS UREGENCIAS/EMERGENCIAS','NÚMERO DE CAMAS DISPONIBLES URGENCIAS/EMERGENCIAS'],
    tipo: 'Sum',
    camposOcultos: ['TOTAL CAMAS HOSPITALIZACIÓN','NÚMERO DE CAMAS DISPONIBLES HOSPITALIZACIÓN','TOTAL CAMAS UREGENCIAS/EMERGENCIAS','NÚMERO DE CAMAS DISPONIBLES URGENCIAS/EMERGENCIAS'],
    rows: ['ENTE GESTOR'],
    cols: [],
    mdi: 'mdi-seat-flat-angled',
    precondicion: [],    
    referer: [],    
    metodo: function (dato=Array()) {
      let sentencia =  ""
      if(Array.isArray(dato)){
        if(dato.length==1 && dato[0]=='Todos') sentencia = ['1=1']
        else sentencia =  dato.map(val=>`to_char(fecha_registro, 'YYYY-MM-DD')='${val}'`)        
        sentencia = `( ${sentencia.join(' OR ')} ) `
      }else sentencia = '1=2'
      return sentencia
    },
    
  },
  pacientes_conflicto: {
    table:'tmp_pacientes',
    tables:'tmp_pacientes',
    alias: 'Datos Pacientes Hospitalizados - Conflictos',    
    attributes:[["to_char(fecha_registro, 'YYYY-MM-DD')", 'periodo'], ['count(*)', 'registros']],
    campos: `to_char(fecha_registro,'YYYY-MM-DD'), mail_origen, ente_gestor, edad,  diagnostico, conducta, establecimiento`,
    headers:['Marca temporal', 'Dirección de correo electrónico', '1. SEGURO AL QUE PERTENECE', '3. EDAD', '5. DIAGNÓSTICO', '6. CONDUCTA', '7. CENTRO DE REFERENCIA'],
    tipo: 'Count',
    camposOcultos: [],
    rows: ['1. SEGURO AL QUE PERTENECE'],
    cols: ['7. CENTRO DE REFERENCIA'],
    mdi: 'mdi-seat-flat-angled',
    precondicion: [],    
    referer: [],    
    metodo: function (dato=Array()) {
      let sentencia =  ""
      if(Array.isArray(dato)){
        if(dato.length==1 && dato[0]=='Todos') sentencia = ['1=1']
        else sentencia =  dato.map(val=>`to_char(fecha_registro, 'YYYY-MM-DD')='${val}'`)        
        sentencia = `( ${sentencia.join(' OR ')} ) `
      }else sentencia = '1=2'
      return sentencia
    },
    
  },*/
}

module.exports = REPORTS
