'use strict'
const PARAMETERS = {
    
    lames: {
        alias:'tmp_ames',
        attributes:[["to_char(fecha_emision, 'YYYY-MM')", 'periodo'], ['count(*)', 'registros']],
        file: ['NÚMERO', 'AUDITOR RESPONSABLE', 'N° DE AME', 'CASO', 'GENERO', 'EDAD', 'POR FALLECIMIENTO', 'NOMBRE DEL SOLICITANTE ', 'TIPO DE SOLICITUD', 'GESTION SOLICITUD', 'GESTION EJECUCIÓN', 'DEPARTAMENTO', 'ENTE GESTOR', 'ESTABLECIMIENTO', 'SERVICIO', 'ART.    63', 'ART. 64,2', 'ART. 64,4', 'FECHA DE EMISION INFORME AME', 'CRONOGRAMA SEGUIMIENTO AL PAC', 'NOTIFICACION INFORME A LEGITIMADORES', 'NOTIFICACION AL MSyD', 'APELACIÓN', 'OBSERVACION'],
        table: ['numero', 'auditor', 'no_ame', 'caso', 'genero', 'f_edad', 'por_fallecimiento', 'solicitante', 'tipo_solicitud', 'gestion_solicitud', 'gestion_ejecucion', 'departamento', 'ente_gestor_name', 'establecimiento', 'servicio', 'art_63', 'art_642', 'art_644', 'f_emision', 'f_cronograma', 'notificacion_legitimador', 'notificacion_msyd', 'apelacion', 'observacion'],        
        validate: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        forFilter:['FECHA DE EMISION INFORME AME', 'CRONOGRAMA SEGUIMIENTO AL PAC'],        
        update:[['fecha_emision',"TO_DATE(f_emision, 'DD/MM/YYYY')",'Verifique el formato de fecha Emision DD/MM/YYYY'], 
        ['cronograma',"TO_DATE(f_cronograma, 'DD/MM/YYYY')", 'Verifique el formato fecha Cronograma DD/MM/YYYY'],
        ['edad', `CAST(COALESCE(f_edad, '-1') AS NUMERIC )`, 'Verifique campo Edad que sea numerico y que no este vacio'] ],
        superUpdate: {referer: 'tmp_equivalencia', update:[['eg','eg','Problemas con Ente gestor.'], ['dpto','dpto', 'Problemas con Dpto'], ['eess','eess']], conditional:[['ente_gestor_name','ente_gestor_name'],['departamento','departamento'],['establecimiento','establecimiento']]},
        //key:['fecha_vacunacion', "COALESCE(ci,'-1')",  'fecha_nacimiento', "COALESCE(nombre,'-1')", "COALESCE(edad, '-1')", 'f_genero', 'vacuna'],
        key:['no_ame'],
        keyAux:['numero', 'auditor', 'no_ame', 'caso', 'genero', 'f_edad', 'por_fallecimiento', 'solicitante', 'tipo_solicitud', 'gestion_solicitud', 'gestion_ejecucion', 'departamento', 'ente_gestor_name', 'establecimiento', 'servicio', 'art_63', 'art_642', 'art_644', 'fecha_emision', 'cronograma', 'notificacion_legitimador', 'notificacion_msyd', 'apelacion', 'observacion'],
        //gender: ['nombre', 'genero','f_genero']        
    },

    linas: {
        alias:'tmp_inas',
        attributes:[["to_char(fecha_emision, 'YYYY-MM')", 'periodo'], ['count(*)', 'registros']],
        file: ['N° ', 'GESTION', 'ENTE GESTOR ', 'ORIGEN DE INAS', 'INAS N° ', 'AUDITOR RESPONSABLE', 'ESTABLECIMIENTO DE SALUD ', 'SERVICIO ', 'CIUDAD', 'FECHA DE EMISIÓN', 'CRONOGRAMA', 'OBSERVACION'],
        table: ['numero', 'gestion_ejecucion', 'ente_gestor_name', 'origen_inas', 'inas_no', 'auditor', 'establecimiento', 'servicio', 'departamento', 'f_emision', 'f_cronograma', 'observacion'],        
        validate: [0,0,1,0,1,0,0,0,1,0,0,0],
        forFilter:['FECHA DE EMISIÓN','CRONOGRAMA'],        
        update:[['fecha_emision',"TO_DATE(f_emision, 'DD/MM/YYYY')",'Verifique el formato de fecha Emision DD/MM/YYYY'], 
        ['cronograma',"TO_DATE(f_cronograma, 'DD/MM/YYYY')", 'Verifique el formato fecha Cronograma DD/MM/YYYY'] ],
        superUpdate: {referer: 'tmp_equivalencia', update:[['eg','eg','Problemas con Ente gestor.'], ['dpto','dpto', 'Problemas con Dpto'], ['eess','eess']], conditional:[['ente_gestor_name','ente_gestor_name'],['departamento','departamento'],['establecimiento','establecimiento']]},
        //key:['fecha_vacunacion', "COALESCE(ci,'-1')",  'fecha_nacimiento', "COALESCE(nombre,'-1')", "COALESCE(edad, '-1')", 'f_genero', 'vacuna'],
        key:['inas_no'],
        keyAux:['numero', 'gestion_ejecucion', 'ente_gestor_name', 'origen_inas', 'inas_no', 'auditor', 'establecimiento', 'servicio', 'departamento', 'f_emision', 'f_cronograma', 'seguimiento'],
        //gender: ['nombre', 'genero','f_genero']        
    },
   


}

module.exports = PARAMETERS