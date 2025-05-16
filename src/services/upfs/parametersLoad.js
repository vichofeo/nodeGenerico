'use strict'
const aeb_load =  require('../aeb/parametersLoad')
const PARAMETERS = {
    
    abastecimiento: {
        alias:'uf_abastecimiento',
        attributes:[["registro_id", 'periodo'], ['count(*)', 'registros']],
        file: ['NRO.', 'CÓDIGO LINAME', 'MEDICAMENTO', 'FORMA FARMACÉUTICAS/PRESENTACION', 'FECHA DE VENCIMIENTO', 'REGISTRO SANITARIO', 'CONSUMO MENSUAL', 'INGRESOS/ENTRADAS', 'EGRESOS/SALIDAS', 'TRANSFERENCIAS', 'STOCK/ SALDOS'],
        table: ['xnro','cod_liname','medicamento','forma_farmaceutica','f_vencimiento','reg_sanitario','consumo_mensual','ingresos', 'egresos', 'transferencias', 'saldo_stock'],
        validate: [0,1,1,1,1,1,1,1,1,1,1],
        forFilter:['FECHA DE VENCIMIENTO'],        
        update:[['fecha_vencimiento',"TO_DATE(f_vencimiento, 'DD/MM/YYYY')",'Verifique el formato de fecha vencimiento sea DD/MM/YYYY']
             //['stock', 'CAST(stock AS NUMERIC )', 'Verifique campo STOCK que sea numerico y que no este vacio']
            ],
        key:['registro_id', 'file_id', 'cod_liname'],        
        keyAux: ['cod_liname','consumo_mensual','saldo_stock','transferencias'],
        gender: null//['paciente', 'genero','f_genero']
    },     
    snis_301a:{
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
    snis_301b: {
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
    snis_302a:{
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
    snis_302b:{
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


}

module.exports = PARAMETERS