'use strict'
const aeb_load =  require('../aeb/parametersLoad')
const PARAMETERS = {
    
    abastecimiento: {
        alias:'uf_abastecimiento',
        attributes:[["registro_id", 'periodo'], ['count(*)', 'registros']],
        //file: ['NRO.', 'CÓDIGO LINAME', 'MEDICAMENTO', 'FORMA FARMACÉUTICAS/PRESENTACION', 'FECHA DE VENCIMIENTO', 'REGISTRO SANITARIO', 'CONSUMO MENSUAL', 'INGRESOS/ENTRADAS', 'EGRESOS/SALIDAS', 'TRANSFERENCIAS', 'STOCK/ SALDOS'],
        //table: ['xnro','cod_liname','medicamento','forma_farmaceutica','f_vencimiento','reg_sanitario','consumo_mensual','ingresos', 'egresos', 'transferencias', 'saldo_stock'],
        file: ['NRO.', 'GRUPO', 'VARIABLE', 'SUBVARIABLE', 'DESCRIPCIÓN DEL MEDICAMENTO/CONCENTRACION', 'FORMA FARMACÉUTICAS/PRESENTACION', 'FECHA DE VENCIMIENTO', 'REGISTRO SANITARIO', 'CONSUMO MENSUAL', 'INGRESOS/ENTRADAS', 'EGRESOS/SALIDAS', 'TRANSFERENCIAS', 'STOCK / SALDOS'],
        table: ['xnro','grupo', 'variable', 'subvariable', 'medicamento','forma_farmaceutica','f_vencimiento','reg_sanitario','consumo_mensual','ingresos', 'egresos', 'transferencias', 'saldo_stock'],
        validate: [0,1,1,1,1,1,0,1,1,1,1,1,1],
        forFilter:['FECHA DE VENCIMIENTO'],        
        update:[['fecha_vencimiento',"TO_DATE(f_vencimiento, 'DD/MM/YYYY')",'Verifique el formato de fecha vencimiento sea DD/MM/YYYY'],
        ['cod_liname', `UPPER(grupo)||'-'||LPAD(variable, 2, '0')||'-'||LPAD(subvariable, 2, '0')`, 'No se puedo autogenerar el codigo liname'],
        ['grupo', `UPPER(grupo)`, 'No se pudo actualizar el grupo'], 
        ['variable', `LPAD(variable, 2, '0')`, 'No se pudo actualizar la variable'], 
        ['subvariable', `LPAD(subvariable, 2, '0')`, 'No se pudo actualizar la subvariable']
             //['stock', 'CAST(stock AS NUMERIC )', 'Verifique campo STOCK que sea numerico y que no este vacio']
            ],
        key:['registro_id', 'cod_liname'],        
        keyAux: ['cod_liname','consumo_mensual','saldo_stock','transferencias'],
        gender: null//['paciente', 'genero','f_genero']
    },     
    lsnis_301a:{
        alias:'e_snis301a',
        attributes:[["gestion||'-'||mes", 'periodo'], ['count(*)', 'registros']],        
        file: [[[0,0],['frm','INFORME MENSUAL DE PRODUCCIÓN DE SERVICIOS']], [[3,3], 'departamento'], [[4,8], 'establecimiento'], [[4,44], 'gestion'], [[4,36],'mes'], [[3,21], 'red'], [[3,40], 'municipio'],[[2,40], 'sub_sector']],
        table: [ 'formulario', 'grupo', "variable", 'subvariable', 'lugar_atencion','valor'],        
        validate: [1,1,0,0,0,1],
        forFilter:  null,//[ array de campos fecha a validar],        
        update:[],        
        key:[ 'registro_id', 'formulario', 'grupo', "COALESCE(variable,'-1')","COALESCE(lugar_atencion, '-1')" ,"COALESCE(subvariable, '-1')"],
        keyAux:['formulario', 'grupo', 'variable','lugar_atencion' ,'subvariable', 'valor'],
        //gender: ['nombre', 'genero','f_genero']
        filterByFunc: aeb_load.snis_301a.filterByFunc

    },
    lsnis_301b: {
        alias: 'e_snis301b',
        attributes: [["gestion||'-'||mes", 'periodo'], ['count(*)', 'registros']],
        file: [[[2,1],['frm','INFORME MENSUAL DE PRODUCCIÓN DE SERVICIOS DE II Y III NIVEL']], [[5,4], 'departamento'], [[6,4], 'establecimiento'], [[6,30], 'gestion'], [[6,23],'mes'], [[5,14], 'red'], [[5,23], 'municipio'],[[4,39], 'sub_sector']],
        table: ['formulario', 'grupo', "variable", 'subvariable', 'valor'],        
        validate: [1,1,0,0,2],
        //table: ['formulario', 'grupo', "variable", 'subvariable', 'lugar_atencion', 'valor'],        
        forFilter: null,//[ array de campos fecha a validar],        
        update: [],
        key: ['registro_id', 'formulario', 'grupo', "COALESCE(variable,'-1')", "COALESCE(lugar_atencion, '-1')", "COALESCE(subvariable, '-1')"],
        keyAux: ['formulario', 'grupo', 'variable', 'lugar_atencion', 'subvariable', 'valor'],
        filterByFunc: aeb_load.snis_301b.filterByFunc

    },
    lsnis_302a:{
        alias:'e_snis302a',
        attributes:[["gestion||'-'||semana", 'periodo'], ['count(*)', 'registros']],        
        file: [[[1,26],['frm','NOTIFICACIÓN PARA LA VIGILANCIA EPIDEMIOLÓGICA']], [[4,3], 'departamento'], [[5,6], 'establecimiento'], [[5,35], 'gestion'], [[2,87],'semana'], [[4,28], 'red'], [[4,59], 'municipio'],[[5,57], 'sub_sector']],
        table: ['formulario', 'grupo', "variable", 'subvariable', 'lugar_atencion', 'valor'],        
        validate: [2,1,1,0,0,2],
        forFilter:  null,//['Fecha de Vacunación','Fecha de Nacimiento'],        
        update:[],        
        key:['registro_id', 'formulario', 'grupo', "COALESCE(variable,'-1')","COALESCE(lugar_atencion, '-1')" ,"COALESCE(subvariable, '-1')"],
        keyAux:['formulario', 'grupo', 'variable','lugar_atencion' ,'subvariable', 'valor'],
        
        filterByFunc: aeb_load.snis_302a.filterByFunc
    },
    lsnis_302b:{
        alias:'e_snis302b',
        attributes:[["gestion||'-'||mes", 'periodo'], ['count(*)', 'registros']],        
        file: [[[1,1],['frm','NOTIFICACIÓN MENSUAL  PARA LA VIGILANCIA EPIDEMIOLOGICA  (ENFERMEDADES NO TRANSMISIBLES Y FACTORES DE RIESGO)']], [[6,7], 'departamento'], [[8,8], 'establecimiento'], [[8,44], 'gestion'], [[8,33],'mes'], [[6,18], 'red'], [[6,30], 'municipio'],[[6,43], 'sub_sector']],
        table: ['formulario', 'grupo', 'gvariable',"variable", 'subvariable',  'valor'],        
        validate: [2,1,1,0,0,2],
        forFilter:  null,//[ array de campos fecha a validar],        
        update:[],        
        key:[ 'registro_id','formulario', 'grupo', "COALESCE(variable,'-1')","COALESCE(lugar_atencion, '-1')" ,"COALESCE(subvariable, '-1')"],
        keyAux:['formulario', 'grupo', 'variable','lugar_atencion' ,'subvariable', 'valor'],
       filterByFunc: aeb_load.snis_302b.filterByFunc
    },
    lcarmelo: {
        alias:'e_carmelo',
        attributes:[["to_char(fecha_dispensacion, 'YYYY-MM')", 'periodo'], ['count(*)', 'registros']],
        file: ['ENTE GESTOR','DEPARTAMENTO','MUNICIPIO','Nombre el Establecimiento de Salud','Nivel de Atención','Fecha de dispensación  (dd/mm/año)','Nombre del paciente ','N° de Matrícula Asegurado / Beneficiario','Sexo','Edad original ','Cantidad dispensada ','N° de receta ','ESPECIALIDAD ORIGINAL','Diagnóstico','Observaciones'],
        table: ['ente_gestor','departamento','municipio','establecimiento','nivel_atencion','f_dispensacion','paciente','matricula','f_genero','f_edad','cantidad_dispensada','no_receta','especialidad','diagnostico','observacion'],
        validate: [1,1,1,1,1,1,1,0,1,1,0,0,0,0,0],
        forFilter:['Fecha de dispensacion'],        
        update:[['fecha_dispensacion',"COALESCE(CASE  WHEN  textregexeq(f_dispensacion,'^[[:digit:]]+(\.[[:digit:]]+)?$') THEN TO_TIMESTAMP(trunc(f_dispensacion::NUMERIC - (25567 + 2)) * 86400) ELSE TO_DATE(f_dispensacion, 'DD/MM/YYYY') END,'1900-01-01') ",'Verifique el formato de fecha Dispensacion DD/MM/YYYY, que no sea vacio o nulo'],
                ['matricula', "COALESCE(matricula, '-Sin Matricula-')",'error en matricula'],
                ['paciente', "COALESCE(paciente, '-Sin Nombre-')",'error en matricula'],
               // ['edad',"CASE  WHEN  textregexeq(f_edad,'^[[:digit:]]+(\.[[:digit:]]+)?$') THEN f_edad ELSE 'Unknown' END ",'el campo edad no cumple con el formato'],
                ['edad',`CASE 
             WHEN f_edad IS NULL THEN -1
             WHEN textregexeq(f_edad,'^[[:digit:]]+(\\.[[:digit:]]+)?$') THEN f_edad::numeric
             ELSE (REGEXP_MATCH(f_edad, '\\d+'))[1]::integer
           END`,'el campo edad no cumple con el formato'],
                ['ente_gestor', "Upper(COALESCE(ente_gestor, 'Unknown'))",''],
                ['departamento', "upper(COALESCE(departamento, 'Unknown'))",''],
                ['establecimiento', "upper(COALESCE(establecimiento, 'Unknown'))",''],
                ['nivel_atencion', "upper(COALESCE(nivel_atencion, 'Unknown'))",''],                
                ['genero', "upper(COALESCE(upper(trim(f_genero)),'Unknown'))",''],
                
            ],        
        key:['fecha_dispensacion','paciente','ente_gestor','departamento','establecimiento','nivel_atencion', 'matricula', "COALESCE(no_receta,'-1')", "idx"],
        //keyAux:['fecha_dispensacion','paciente', 'matricula','genero', 'edad','ente_gestor','departamento','establecimiento','nivel_atencion','matricula','cantidad_dispensada','no_receta','especialidad','diagnostico','observacion'],
        keyAux: ['ente_gestor','departamento','municipio','establecimiento','nivel_atencion','f_dispensacion','paciente','matricula','f_genero','f_edad','cantidad_dispensada','no_receta','especialidad','diagnostico','observacion'],
        gender: null//['paciente', 'genero','f_genero']
    }, 
    lnutri_mama: {
        alias:'e_nutri_mama',
        attributes:[["to_char(fecha_dispensacion, 'YYYY-MM')", 'periodo'], ['count(*)', 'registros']],
        file: ['Ente Gestor', 'Departamento', 'Municipio', 'Nombre el Establecimiento de Salud', 'Nivel de Atención', 'Fecha de dispensación  (dd/mm/año)', 'Nombre del paciente ', 'N° de Matrícula Asegurado ó Beneficiario', 'Semanas de gestación', 'Edad (Solo años)', 'Cantidad dispensada ', 'N° de receta ', 'Especialidad ', 'Diagnóstico', 'Observaciones',],
        table: ['ente_gestor','departamento','municipio','establecimiento','nivel_atencion','f_dispensacion','paciente','matricula', 'f_sgestacion','f_edad','cantidad_dispensada','no_receta','especialidad','diagnostico','observacion'],
        validate: [1,1,1,1,1,1,1,0,1,1,0,0,0,0,0],
        forFilter:['Fecha de dispensacion'],        
        update:[['fecha_dispensacion',"COALESCE(CASE  WHEN  textregexeq(f_dispensacion,'^[[:digit:]]+(\.[[:digit:]]+)?$') THEN TO_TIMESTAMP(trunc(f_dispensacion::NUMERIC - (25567 + 2)) * 86400) ELSE TO_DATE(f_dispensacion, 'DD/MM/YYYY') END,'1900-01-01') ",'Verifique el formato de fecha Dispensacion DD/MM/YYYY, que no sea vacio o nulo'],
                ['matricula', "COALESCE(matricula, '-Sin Matricula-')",'error en matricula'],
                ['paciente', "COALESCE(paciente, '-Sin Nombre-')",'error en matricula'],
               // ['edad',"CASE  WHEN  textregexeq(f_edad,'^[[:digit:]]+(\.[[:digit:]]+)?$') THEN f_edad ELSE 'Unknown' END ",'el campo edad no cumple con el formato'],
                ['edad',`CASE WHEN f_edad IS NULL THEN -1 WHEN textregexeq(f_edad,'^[[:digit:]]+(\\.[[:digit:]]+)?$') THEN f_edad::numeric ELSE (REGEXP_MATCH(f_edad, '\\d+'))[1]::integer END`,'el campo edad no cumple con el formato'],
                ['semana_gestacion',`CASE WHEN f_sgestacion IS NULL THEN -1 WHEN textregexeq(f_sgestacion,'^[[:digit:]]+(\\.[[:digit:]]+)?$') THEN f_sgestacion::numeric ELSE (REGEXP_MATCH(f_edad, '\\d+'))[1]::integer END`,'el campo semana gestacion no cumple con el formato'],
                ['ente_gestor', "Upper(COALESCE(ente_gestor, 'Unknown'))",''],
                ['departamento', "upper(COALESCE(departamento, 'Unknown'))",''],
                ['establecimiento', "upper(COALESCE(establecimiento, 'Unknown'))",''],
                ['nivel_atencion', "upper(COALESCE(nivel_atencion, 'Unknown'))",''],                
                
                
            ],        
        key:['fecha_dispensacion','paciente','ente_gestor','departamento','establecimiento','nivel_atencion', 'matricula', "COALESCE(no_receta,'-1')", "idx"],
        //keyAux:['fecha_dispensacion','paciente', 'matricula','genero', 'edad','ente_gestor','departamento','establecimiento','nivel_atencion','matricula','cantidad_dispensada','no_receta','especialidad','diagnostico','observacion'],
        keyAux: ['ente_gestor','departamento','municipio','establecimiento','nivel_atencion','f_dispensacion','paciente','matricula','f_sgestacion','f_edad','cantidad_dispensada','no_receta','especialidad','diagnostico','observacion'],
        gender: null//['paciente', 'genero','f_genero']
    },
}

module.exports = PARAMETERS