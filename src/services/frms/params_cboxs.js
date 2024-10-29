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
            institucion_id: ['Establecimiento de salud', true, true, 'C']
            
        }, 
        ilogic: null,
        referer: [        
            { ref: 'f_formulario_grupo', apropiacion: 'grupo_formulario_id', campos: ['grupo_formulario_id', 'nombre_grupo_formulario'],  campoForeign: null,   condicion: {}, condicional:['aplicacion_id,$app'] },
            { ref: 'f_formulario', apropiacion: 'formulario_id', campos: ['formulario_id', 'nombre_formulario'],  campoForeign: 'grupo_formulario_id', condicion: {}, condicional: null},
            { ref: 'f_formulario_institucion_cnf', apropiacion: 'institucion_id', campos: ['institucion_id', 'formulario_id'],  campoForeign: 'formulario_id', condicion: {activo:'Y'}, condicional: null},
            
        ],
    },
    monFrms:{
        alias: 'cboxs_evals',                
        campos: {
            forms: ['Formularios', true, true, 'C'],            
            periodos: ['Periodos', true, true, 'C']
            
        }, 
        ilogic: {
            forms:`SELECT distinct f.formulario_id AS value,f.codigo_formulario ||'-'|| f.nombre_formulario||'-'||  f.descripcion AS text
            FROM f_formulario_registro fr, f_formulario f
            WHERE  $keySession
            AND fr.formulario_id=f.formulario_id
            ORDER BY 2`,
            periodos:`SELECT distinct fr.periodo AS VALUE,
            to_char(TO_DATE(fr.periodo, 'YYYYMM'), 'YYYY - Mon') AS text
            FROM f_formulario_registro fr
            WHERE  $keySession
            AND fr.formulario_id = '$forms' 
            ORDER BY 1 DESC`
        },
        keySession:{replaceKey:false, campo:'fr.institucion_id'},
        referer: [],
    }
}
module.exports = PDEPENDENCIES