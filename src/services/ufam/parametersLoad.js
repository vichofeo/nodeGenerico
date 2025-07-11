'use strict'
const PARAMETERS = {
    
    lames: {
        alias:'tmp_ames',
        attributes:[["to_char(fecha_emision, 'YYYY-MM')", 'periodo'], ['count(*)', 'registros']],
        file: ['NÚMERO', 'AUDITOR RESPONSABLE', 'N° DE AME', 'CASO', 'GENERO', 'EDAD', 'POR FALLECIMIENTO', 'NOMBRE DEL SOLICITANTE ', 'TIPO DE SOLICITUD', 'GESTION SOLICITUD', 'GESTION EJECUCIÓN', 'DEPARTAMENTO', 'ENTE GESTOR', 'ESTABLECIMIENTO', 'SERVICIO', 'ART.    63', 'ART. 64,2', 'ART. 64,4', 'FECHA DE EMISION INFORME AME', 'CRONOGRAMA SEGUIMIENTO AL PAC', 'NOTIFICACION INFORME A LEGITIMADORES', 'NOTIFICACION AL MSyD', 'APELACIÓN', 'OBSERVACION'],
        table: ['numero', 'auditor', 'no_ame', 'caso', 'genero', 'f_edad', 'por_fallecimiento', 'solicitante', 'tipo_solicitud', 'gestion_solicitud', 'gestion_ejecucion', 'ciudad', 'ente_gestor_name', 'establecimiento', 'servicio', 'art_63', 'art_642', 'art_644', 'f_emision', 'f_cronograma', 'notificacion_legitimador', 'notificacion_msyd', 'apelacion', 'observacion'],        
        validate: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        forFilter:['FECHA DE EMISION INFORME AME', 'CRONOGRAMA SEGUIMIENTO AL PAC'],        
        update:[['fecha_emision',"TO_DATE(f_emision, 'DD/MM/YYYY')",'Verifique el formato de fecha Emision DD/MM/YYYY'], 
        ['cronograma',"TO_DATE(f_cronograma, 'DD/MM/YYYY')", 'Verifique el formato fecha Cronograma DD/MM/YYYY'],
        ['edad', `CASE WHEN upper(f_edad)='RN' THEN f_edad ELSE CAST(COALESCE(f_edad, '-1') AS NUMERIC )||'' END `, 'Verifique campo Edad que sea numerico y que no este vacio'],
        ['departamento',`REPLACE(REPLACE(REPLACE(upper(trim(ciudad)),'TRINIDAD','BENI'),'SUCRE','CHUQUISACA'),'COBIJA','PANDO')`,'error en normalizacion departamento']
    ],
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
        table: ['numero', 'gestion_ejecucion', 'ente_gestor_name', 'origen_inas', 'inas_no', 'auditor', 'establecimiento', 'servicio', 'ciudad', 'f_emision', 'f_cronograma', 'observacion'],        
        validate: [0,0,1,0,1,0,0,0,1,0,0,0],
        forFilter:['FECHA DE EMISIÓN','CRONOGRAMA'],        
        update:[['fecha_emision',"TO_DATE(f_emision, 'DD/MM/YYYY')",'Verifique el formato de fecha Emision DD/MM/YYYY'], 
        ['cronograma',"TO_DATE(f_cronograma, 'DD/MM/YYYY')", 'Verifique el formato fecha Cronograma DD/MM/YYYY'],
        ['departamento',`REPLACE(REPLACE(REPLACE(upper(trim(ciudad)),'TRINIDAD','BENI'),'SUCRE','CHUQUISACA'),'COBIJA','PANDO')`,'error en normalizacion departamento']
     ],
        superUpdate: {referer: 'tmp_equivalencia', update:[['eg','eg','Problemas con Ente gestor.'], ['dpto','dpto', 'Problemas con Dpto'], ['eess','eess']], conditional:[['ente_gestor_name','ente_gestor_name'],['departamento','departamento'],['establecimiento','establecimiento']]},
        //key:['fecha_vacunacion', "COALESCE(ci,'-1')",  'fecha_nacimiento', "COALESCE(nombre,'-1')", "COALESCE(edad, '-1')", 'f_genero', 'vacuna'],
        key:['inas_no'],
        keyAux:['numero', 'gestion_ejecucion', 'ente_gestor_name', 'origen_inas', 'inas_no', 'auditor', 'establecimiento', 'servicio', 'departamento', 'f_emision', 'f_cronograma', 'seguimiento'],
        //gender: ['nombre', 'genero','f_genero']        
    },
    lrrame: {
        alias:'tmp_rrame',
        attributes:[["to_char(fecha_emision, 'YYYY-MM')", 'periodo'], ['count(*)', 'registros']],
        file: ['N° ','GESTION INGRESO', 'GESTION EMISIÓN', 'ENTE GESTOR ', 'ORIGEN', 'RRAME', 'AUDITOR RESPONSABLE', 'NOMBRE DEL CASO', 'A)', 'B)', 'C)', 'D)', 'SERVICIO ', 'CIUDAD', 'FECHA DE EMISIÓN', 'NOTIFICACION DE CONCLUSIÓN'],
        table: ['numero','gestion_ingreso','gestion_ejecucion', 'ente_gestor_name', 'origen', 'rrame_no', 'auditor', 'caso','_a', '_b', '_c', '_d','servicio','ciudad','f_emision','notificacion_conclusion'],        
        validate: [0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
        forFilter:['FECHA DE EMISIÓN'],        
        update:[['fecha_emision',"TO_DATE(f_emision, 'DD/MM/YYYY')",'Verifique el formato de fecha Emision DD/MM/YYYY'], 
        ['departamento',`REPLACE(REPLACE(REPLACE(upper(trim(ciudad)),'TRINIDAD','BENI'),'SUCRE','CHUQUISACA'),'COBIJA','PANDO')`,'error en normalizacion departamento']
        ],
        superUpdate: {referer: 'tmp_equivalencia', update:[['eg','eg','Problemas con Ente gestor.'], ['dpto','dpto', 'Problemas con Dpto']], conditional:[['ente_gestor_name','ente_gestor_name'],['departamento','departamento']]},
        //key:['fecha_vacunacion', "COALESCE(ci,'-1')",  'fecha_nacimiento', "COALESCE(nombre,'-1')", "COALESCE(edad, '-1')", 'f_genero', 'vacuna'],
        key:['rrame_no'],
        keyAux:['numero','gestion_ingreso','gestion_ejecucion', 'ente_gestor_name', 'origen', 'rrame_no', 'auditor', 'servicio','departamento','f_emision','notificacion_conclusion'],
        //gender: ['nombre', 'genero','f_genero']        
    },
   


}

module.exports = PARAMETERS