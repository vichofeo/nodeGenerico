'use strict'
const aeb_load =  require('../aeb/parametersLoad')
const PARAMETERS = {
    
    abastecimiento: {
        alias:'uf_abastecimiento',
        attributes:[["registro_id", 'periodo'], ['count(*)', 'registros']],
        file: ['NRO.', 'CÓDIGO LINAME', 'MEDICAMENTO', 'FORMA FARMACÉUTICAS/PRESENTACION', 'FECHA DE VENCIMIENTO', 'REGISTRO SANITARIO', 'CONSUMO MENSUAL', 'INGRESOS/ENTRADAS', 'EGRESOS/SALIDAS', 'TRANSFERENCIAS', 'STOCK/ SALDOS'],
        table: ['xnro','cod_liname','xmedi1','xpre1','fecha_vencimiento','reg_sanitario','consumo_mensual','ingresos', 'egresos', 'transferencias', 'saldo_stock'],
        validate: [0,1,0,0,1,1,1,1,1,1,1],
        forFilter:['fecha_vencimiento'],        
        update:[
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
        key:[ 'formulario', 'grupo', "COALESCE(variable,'-1')","COALESCE(lugar_atencion, '-1')" ,"COALESCE(subvariable, '-1')"],
        keyAux:['formulario', 'grupo', 'variable','lugar_atencion' ,'subvariable', 'valor'],
        //gender: ['nombre', 'genero','f_genero']
        filterByFunc: aeb_load.snis_301a.filterByFunc

    },


}

module.exports = PARAMETERS