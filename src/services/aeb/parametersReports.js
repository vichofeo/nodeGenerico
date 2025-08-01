'use strict'

const { nacimientos } = require("./parametersLoad")

const REPORTS = {
  hemofilia: {
    table: 'tmp_hemofilia',
    tables: 'tmp_hemofilia',
    alias: 'Datos Hemofilia',
    attributes: [
      ['tipo_hemofilia', 'periodo'],
      ['count(*)', 'registros'],
    ],
    campos: `ente_gestor_name, departamento, establecimiento, edad, genero, tipo_hemofilia, grado_severidad, tratamiento_recibido`,
    headers: [
      'ENTE GESTOR',
      'Departamento',      
      'Nombre el Establecimiento',
      'EDAD',
      'Sexo',      
      'Tipo Hemofilia',
      'Grado Severidad',
      'Tratamiento Recibido'
      
    ],
    tipo: 'Count',
    camposOcultos: [],
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
            (val) => `gestion='${val}'`
          )

        sentencia = `( ${sentencia.join(' OR ')} ) `
      } else sentencia = '1=2'
      return sentencia
    },
  },
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
    headers: [
      'DEPARTAMENTO',
      'ENTE GESTOR',
      'ESTABLECIMIENTO / INSTITUCION',
      'EDAD',
      'EDAD RECODIFICADA',
      'SEXO',
      'PERIODO DE DIAGNÓSTICO (YYYY-MM)',
      'DIAGNÓSTICO HISTOPATOLOGICO , CLINICO Y/O IMAGENOLOGICO',
      'LOCALIZACIÓN',
      'SITIO PRIMARIO',
      'CIE GRUPOS',
      'LOCALIZACION DE METASTASIS',
      'PERIODO DE DEFUNCIÓN',
    ],
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

  nacimientos: {
    table: 'tmp_nacimientos',
    tables: 'tmp_nacimientos',
    alias: 'Datos de Nacimientos',
    attributes: [
      ["to_char(fecha_nacimiento, 'YYYY-MM')", 'periodo'],
      ['count(*)', 'registros'],
    ],
    campos: `departamento,establecimiento,nivel,ente_gestor_name,ambito,to_char(fecha_nacimiento,'YYYY-MM'),sexo,parto_atendido,edad_gestacional,malformaciones,peso,talla`,
    headers: ['Departamento', 'Establecimiento', 'Nivel Atencion', 'Ente Gestor', 'Rural/Urbano', 'Periodo Nacimiento', 'Sexo', 'Parto atendido', 'Edad gestacional', 'Malformaciones', 'Peso', 'Talla' ],
    tipo: 'Count',
    camposOcultos: [],
    rows: ['Departamento'],
    cols: ['Ente Gestor'],
    mdi: 'mdi-baby-buggy',

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
            (val) => `to_char(fecha_nacimiento, 'YYYY-MM')='${val}'`
          )

        sentencia = `( ${sentencia.join(' OR ')} ) `
      } else sentencia = '1=2'
      return sentencia
    },
  },
  defunciones: {
    table: 'tmp_defunciones',
    tables: 'tmp_defunciones',
    alias: 'Datos de defunciones',
    attributes: [
      ["to_char(fecha_defuncion, 'YYYY-MM')", 'periodo'],
      ['count(*)', 'registros'],
    ],
    campos: `departamento,establecimiento,nivel,ente_gestor_name,ambito,to_char(fecha_defuncion, 'YYYY-MM'),edad_anio,sexo,grado_Instruccion,estado_civil,causa_directa,cie10_causa_directa_codigo||' - '||cie10_causa_directa_descripcion,causa_antecedente_1,cie10_causa_antecedente_1_codigo||' - '||cie10_causa_antecedente_1_descripcion,causa_contribuyente_1,cie10_causa_contribuyente_1_codigo||' -  '||cie10_causa_contribuyente_1_descripcion,cie10_causa_B_sica_codigo||' - '||cie10_causa_B_sica_descripcion,presuncion_muerte,mecanismo_muerte,defuncion_femenina,causa_fue_complicacion_embarazo,causa_complic_embarazo,estado`,
    headers: ['Departamento', 'Establecimiento', 'Nivel', 'Ente Gestor', 'Rura/Urbano', 'Periodo Defunción', 'Edad Año', 'Sexo', 'Grado Instrucción', 'Estado Civil', 'Causa Directa', 'CIE10 Causa Directa', 'Causa Antecedente 1', 'IE10 Causa Antecedente 1',  'Causa Contribuyente 1', 'CIE10 Causa Contribuyente 1',  'CIE10 Causa Básica ',  'Presunción Muerte', 'Mecanismo Muerte', 'Defunción Femenina', 'Causa Fue Complicación Embarazo', 'Causa Complicó Embarazo', 'Estado'],
    tipo: 'Count',
    camposOcultos: [''],
    rows: ['Departamento'],
    cols: ['Ente Gestor'],
    mdi: 'mdi-emoticon-dead',

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
            (val) => `to_char(fecha_defuncion, 'YYYY-MM')='${val}'`
          )

        sentencia = `( ${sentencia.join(' OR ')} ) `
      } else sentencia = '1=2'
      return sentencia
    },
  },
  snis301a: {
    literal: true,
    table: `( SELECT formulario, gestion||'-'||mes AS periodo, COUNT(*) AS registros
          FROM tmp_snis301a
          WHERE 
          swloadend = TRUE 
          GROUP BY 1,2
          ORDER BY 1
          ) AS t1`,
    tables: 'tmp_snis301a s, ae_institucion i',
    alias: 'Datos snis - Formularios 301A',
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
          swloadend = TRUE  and tipo is null
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
    precondicion: ['s.eg=i.institucion_id','s.tipo is null'],
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
  /*camas: {
    table:'tmp_camas',
    tables:'tmp_camas',
    alias: 'Datos Camas disponibles',    
    attributes:[["to_char(fecha_registro, 'YYYY-MM-DD')", 'periodo'], ['count(*)', 'registros']],
    campos: `to_char(fecha_registro,'YYYY-MM-DD'), mail_origen, ente_gestor, establecimieno, nivel_atencion, servicios_primer, servicios_segundo, servicios_tercer, total_camas, camas_disponibles, total_camas_emergencia, camas_emergencia_disponibles`,
    headers:['Marca temporal','Dirección de correo electrónico','ENTE GESTOR','NOMBRE DEL ESTABLECIMIENTO DE SALUD','NIVEL DE ATENCIÓN','SERVICIOS DEL EESS PRIMER NIVEL','SERVICIOS DEL EESS SEGUNDO NIVEL','SERVICIOS EESS TERCER NIVEL','TOTAL CAMAS HOSPITALIZACIÓN','NÚMERO DE CAMAS DISPONIBLES HOSPITALIZACIÓN','TOTAL CAMAS UREGENCIAS/EMERGENCIAS','NÚMERO DE CAMAS DISPONIBLES URGENCIAS/EMERGENCIAS'],
    tipo: 'Integer Sum',
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
