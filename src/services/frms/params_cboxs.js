//extraCondicion:[[campo, valor], [campo2, valor]...]
"use strict"
const PDEPENDENCIES = {
    frmc_box:{        
        alias: 'cboxs',        
        campos: {
            grupo_formulario_id: ['Grupo de Formularios', false, true, 'C'],
            formulario_id: ['Formulario', true, true, 'C']
            
        }, 
        ilogic: null,
        referer: [        
            { ref: 'f_formulario_grupo', apropiacion: 'grupo_formulario_id', campos: ['grupo_formulario_id', 'nombre_grupo_formulario'],  campoForeign: null,   condicion: {}, condicional:['aplicacion_id,$app'] },
            { ref: 'f_formulario', apropiacion: 'formulario_id', campos: ['formulario_id', 'nombre_formulario'],  campoForeign: 'grupo_formulario_id', condicion: {}, condicional: null},
            
        ],
    },
    fficnf:{        
        alias: 'cboxs_gfi',                
        campos: {
            grupo_formulario_id: ['Grupo de Formularios', false, true, 'C'],
            formulario_id: ['Formulario', true, true, 'C'],
            institucion_id: ['Establecimiento de salus', true, true, 'C']
            
        }, 
        ilogic: null,
        referer: [        
            { ref: 'f_formulario_grupo', apropiacion: 'grupo_formulario_id', campos: ['grupo_formulario_id', 'nombre_grupo_formulario'],  campoForeign: null,   condicion: {}, condicional:['aplicacion_id,$app'] },
            { ref: 'f_formulario', apropiacion: 'formulario_id', campos: ['formulario_id', 'nombre_formulario'],  campoForeign: 'grupo_formulario_id', condicion: {}, condicional: null},
            { ref: 'f_formulario_institucion_cnf', apropiacion: 'institucion_id', campos: ['institucion_id', 'formulario_id'],  campoForeign: 'formulario_id', condicion: {activo:'Y'}, condicional: null},
            
        ],
    }
}
module.exports = PDEPENDENCIES