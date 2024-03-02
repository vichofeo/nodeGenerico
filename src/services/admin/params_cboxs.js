//extraCondicion:[[campo, valor], [campo2, valor]...]
"use strict"
const PDEPENDENCIES = {
    admin_box:{        
        alias: 'acboxs',        
        campos: {
            aplicacion_id: ['Aplicacion', false, true, 'C'],
            role: ['rol', false, true, 'C']
            
        }, 
        ilogic: null,
        referer: [        
            { ref: 'ap_aplicacion', apropiacion: 'aplicacion_id', campos: ['aplicacion_id', 'nombre_aplicacion'],  campoForeign: null,   condicion: {}, condicional:null },
            { ref: 'ap_aplicacion_role', apropiacion: 'role', campos: ['role', 'name_role'],  campoForeign: 'aplicacion_id', condicion: {}, condicional: null},
            
        ],
    },
    
}
module.exports = PDEPENDENCIES