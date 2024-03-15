//extraCondicion:[[campo, valor], [campo2, valor]...]
"use strict"
const PDEPENDENCIES = {    
    act_box:{        
        alias: 'ainstcboxs',        
        campos: {
            clase_actividad: ['Aplicacion', false, true, 'C'],
            tipo_actividad: ['Institucion', false, true, 'C'],
        }, 
        ilogic: null,
        referer: [        
            { ref: 'r_is_atributo', apropiacion: 'clase_actividad', campos: ['atributo_id', 'atributo'],  campoForeign: null,   condicion: {grupo_atributo:'ACTIVIDAD', precedencia:null}, condicional:null },            
            { ref: 'r_is_atributo', apropiacion: 'tipo_actividad', campos: ['atributo_id', 'atributo'],  campoForeign: 'precedencia',   condicion: {grupo_atributo:'ACTIVIDAD'}, condicional:null },            
            
        ],
    },
    
}
module.exports = PDEPENDENCIES