'use strict'

const { header } = require("express-validator")

const REPORTS = {
  carmelo: {
    table:'tmp_carmelo',
    tables:'tmp_carmelo',
    alias: 'Datos Carmelo',    
    attributes:[["to_char(fecha_dispensacion, 'YYYY')", 'periodo'], ['count(*)', 'registros']],
    campos: `ente_gestor_name, departamento, regional, establecimiento, nivel_atencion,to_char(fecha_dispensacion, 'YYYY-MM') as periodo, genero, edad, cantidad_dispensada, especialidad,diagnostico`,
    headers: ['ENTE GESTOR','Departamento','Regional/Distrital','Nombre el Establecimiento','Nivel de atención','Periodo de dispensacion  (año-mm)','Sexo','EDAD','Cantidad dispensada','Especialidad','Diagnóstico'],
    tipo: 'Count',
    camposOcultos: ['Cantidad dispensada'],
    rows: ['Departamento'],
    cols: ['ENTE GESTOR'],
    mdi: 'mdi-hospital-building',
    

    precondicion: [],
    
    referer: [],
    //condicionSolicitud: function(){return `to_char(fecha_dispensacion, 'YYYY')='${dato}'`}
    metodo: function (dato=Array()) {
      let sentencia =  ""
      if(Array.isArray(dato)){
        if(dato.length==1 && dato[0]=='Todos') sentencia = ['1=1']
        else sentencia =  dato.map(val=>`to_char(fecha_dispensacion, 'YYYY')='${val}'`)
        
        sentencia = `( ${sentencia.join(' OR ')} ) `
      }else sentencia = '1=2'
      return sentencia
    },
    
  },
  pai_regular: {
    table:'tmp_pai',
    tables:'tmp_pai',
    alias: 'Datos PAI Regular',    
    attributes:[["to_char(fecha_vacunacion, 'YYYY-MM')", 'periodo'], ['count(*)', 'registros']],
    campos: `to_char(fecha_vacunacion, 'YYYY-MM') as fe_vacunacion,estrategia,to_char(fecha_nacimiento, 'YYYY') as nacimiento,edad,genero,nacionalidad, departamento, municipio,cod_rues,establecimiento,ente_gestor_name, vacuna,nro_dosis, proveedor,lote_vacuna,embarazo,jeringa_administracion,lote_diluyente,jeringa_dilusion`,
    headers:['Periodo de Vacunación (YYYY-MM)','Estrategia','Año Nacimiento','Edad (Años)','Sexo','Nacionalidad','Departamento','Municipio','Codigo RUES','Establecimiento', 'Ente Gestor','Nombre Vacuna','Nro. de Dosis','Proveedor','Lote Vacuna','Embarazo','Jeringa de Administración','Lote Diluyente','Jeringa de Dilusión'],
    tipo: 'Count',
    camposOcultos: [],
    rows: ['Nombre Vacuna'],
    cols: ['Nro. de Dosis'],
    mdi: 'mdi-flask-outline',
    precondicion: [],    
    referer: [],    
    metodo: function (dato=Array()) {
      let sentencia =  ""
      if(Array.isArray(dato)){
        if(dato.length==1 && dato[0]=='Todos') sentencia = ['1=1']
        else sentencia =  dato.map(val=>`to_char(fecha_vacunacion, 'YYYY-MM')='${val}'`)        
        sentencia = `( ${sentencia.join(' OR ')} ) `
      }else sentencia = '1=2'
      return sentencia
    },
    
  },
  oncologia: {
    table:'tmp_cancer',
    tables:'tmp_caNcer',
    alias: 'Datos Pacientes de Oncologia - CANCER',    
    attributes:[["to_char(fecha_diagnostico, 'YYYY')", 'periodo'], ['count(*)', 'registros']],
    campos: `departamento, ente_gestor_name, establecimiento, edad, edad_recodificada,genero,to_char(fecha_diagnostico,'YYYY-MM'),diagnostico_histopatologico,localizacion, sitio_primario,cie_grupo,localizacion_metastasis,to_char(fecha_defuncion,'YYYY-MM')`,
    headers:['DEPARTAMENTO','ENTE GESTOR','ESTABLECIMIENTO / INSTITUCION','EDAD','EDAD RECODIFICADA','SEXO','PERIODO DE DIAGNÓSTICO (YYYY-MM)','DIAGNÓSTICO HISTOPATOLOGICO , CLINICO Y/O IMAGENOLOGICO','LOCALIZACIÓN','SITIO PRIMARIO','CIE GRUPOS','LOCALIZACION DE METASTASIS','PERIODO DE DEFUNCIÓN'],
    tipo: 'Count',
    camposOcultos: [],
    rows: ['SEXO'],
    cols: ['SITIO PRIMARIO'],
    mdi: 'mdi-seat-flat-angled',
    precondicion: [],    
    referer: [],    
    metodo: function (dato=Array()) {
      let sentencia =  ""
      if(Array.isArray(dato)){
        if(dato.length==1 && dato[0]=='Todos') sentencia = ['1=1']
        else sentencia =  dato.map(val=>`to_char(fecha_diagnostico, 'YYYY')='${val}'`)        
        sentencia = `( ${sentencia.join(' OR ')} ) `
      }else sentencia = '1=2'
      return sentencia
    },
    
  },
}


module.exports =  REPORTS
