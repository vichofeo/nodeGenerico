'use strict'
const PARAMETERS = {
    
    abastecimiento: {
        alias:'uf_abastecimiento_llenado',
        attributes:[["registro_id", 'periodo'], ['count(*)', 'registros']],
        file: ['CODIGO LINAME', 'MEDICAMENTO CONCENTRACION', 'PRESENTACION', 'CONSUMO PROMEDIO MENSUAL', 'STOCK', 'OBSERVACIONES'],
        table: ['cod_liname','medi1','pre1','consumo_promedio','stock','obs'],
        validate: [1,0,0,1,1,0],
        forFilter:[],        
        update:[
             //['stock', 'CAST(stock AS NUMERIC )', 'Verifique campo STOCK que sea numerico y que no este vacio']
            ],
        key:['registro_id','cod_liname'],        
        keyAux: ['cod_liname','consumo_promedio','stock','obs'],
        gender: null//['paciente', 'genero','f_genero']
    }, 
   


}

module.exports = PARAMETERS