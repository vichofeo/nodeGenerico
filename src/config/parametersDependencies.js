//extraCondicion:[[campo, valor], [campo2, valor]...]
"use strict"
const PDEPENDENCIES = {
    frmc_box:{        
        alias: 'frms',        
        campos: {
            grupo_formulario_id: ['Grupo de Formularios', false, true, 'C'],
            formulario_id: ['Formulario', true, true, 'C']
            
        }, 
        ilogic: null,
        referer: [        
            { ref: 'f_formulario_grupo', campos: ['grupo_formulario_id', 'nombre_grupo_formulario'], camporef: 'grupo_formulario_id', campoLink:null,  extraCondicion: null },
            { ref: 'f_formulario', campos: ['formulario_id', 'nombre_formulario'], camporef: 'formulario_id', campoLink:'grupo_formulario_id', extraCondicion: null},
            
        ],
    }
}
module.exports = PDEPENDENCIES