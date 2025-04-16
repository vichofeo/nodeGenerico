'use strict'
const PARAMETERS = {
    
    abastecimiento: {
        alias:'uf_abastecimiento_llenado',
        attributes:[["registro_id", 'periodo'], ['count(*)', 'registros']],
        file: ['NRO.', 'CÓDIGO LINAME', ' MEDICAMENTO', ' FORMA FARMACÉUTICAS/PRESENTACION', 'FECHA DE VENCIMIENTO', ' REGISTRO SANITARIO', ' CONSUMO MENSUAL', ' INGRESOS/ENTRADAS', ' EGRESOS/SALIDAS', ' TRANSFERENCIAS', ' STOCK/ SALDOS '],
        table: ['xnro','cod_liname','xmedi1','xpre1','fecha_vencimiento','reg_sanitario','consumo_mensual','ingresos', 'egresos', 'transferencias', 'saldo_stock'],
        validate: [0,1,1,1,1,1,1,1,1,1,1],
        forFilter:['fecha_vencimiento'],        
        update:[
             //['stock', 'CAST(stock AS NUMERIC )', 'Verifique campo STOCK que sea numerico y que no este vacio']
            ],
        key:['registro_id', 'file_id', 'cod_liname'],        
        keyAux: ['cod_liname','consumo_promedio','stock','obs'],
        gender: null//['paciente', 'genero','f_genero']
    }, 
   


}

module.exports = PARAMETERS