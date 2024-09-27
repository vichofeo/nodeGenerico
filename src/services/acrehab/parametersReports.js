'use strict'



const REPORTS = {
  
  
  camas: {
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
    
  },
  camas_disponibles: {
    table:'cf_evento',
    tables:'cf_evento e, ae_institucion i, ae_institucion h',
    alias: 'Datos Camas Disponibles Mañana - Tarde - Noche',    
    attributes:[["to_char(fecha_registro, 'YYYY-MM-DD')", 'periodo'], ['count(*)', 'registros']],
    campos: `i.nombre_corto, h.nombre_institucion, e.nivel, TO_CHAR(e.fecha_registro, 'YYYY-MM-DD') AS f_registro,
    total_camas_disp, total_camas_disp_uti, total_camas_disp_uci, total_camas_disp_eme, 
m_camas_disp, m_camas_disp_uti, m_camas_disp_uci, m_camas_dis_eme, 
t_camas_disp, t_camas_disp_uti, t_camas_disp_uci, t_camas_disp_eme, 
n_camas_disp, n_camas_disp_uti, n_camas_disp_uci, n_camas_disp_eme`,
    headers:['Ente Gestor', 'Establecimiento de Salud', 'Nivel', 'Fecha de registro',
      'Total camas', 'Total camas UTI', 'Total camas UCI', 'Total camas EMERGENCIA',
      'MAÑANA: camas Disponibles', 'MAÑANA: camas Disponibles - UTI', 'MAÑANA: camas Disponibles - UCI', 'MAÑANA: camas Disponibles - EMERGENCIA',
      'TARDE: camas Disponibles', 'TARDE: camas Disponibles - UTI', 'TARDE: camas Disponibles - UCI', 'TARDE: camas Disponibles - EMERGENCIA',
      'NOCHE: camas Disponibles', 'NOCHE: camas Disponibles - UTI', 'NOCHE: camas Disponibles - UCI', 'NOCHE: camas Disponibles - EMERGENCIA'
    ],
    tipo: 'Sum',
    camposOcultos: ['Total camas', 'Total camas UTI', 'Total camas UCI', 'Total camas EMERGENCIA',
      'MAÑANA: camas Disponibles', 'MAÑANA: camas Disponibles - UTI', 'MAÑANA: camas Disponibles - UCI', 'MAÑANA: camas Disponibles - EMERGENCIA',
      'TARDE: camas Disponibles', 'TARDE: camas Disponibles - UTI', 'TARDE: camas Disponibles - UCI', 'TARDE: camas Disponibles - EMERGENCIA',
      'NOCHE: camas Disponibles', 'NOCHE: camas Disponibles - UTI', 'NOCHE: camas Disponibles - UCI', 'NOCHE: camas Disponibles - EMERGENCIA'],
    rows: ['Ente Gestor'],
    cols: ['Establecimiento de Salud'],
    mdi: 'mdi-seat-flat-angled',
    precondicion: ["e.ente_gestor_id =  i.institucion_id", "e.establecimiento_id =  h.institucion_id"],    
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
}


module.exports =  REPORTS
