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
    inst_box:{        
        alias: 'ainstcboxs',        
        campos: {
            aplicacion_id: ['Aplicacion', false, true, 'C'],
            institucion_id: ['Institucion', false, true, 'C'],
        }, 
        ilogic: null,
        referer: [        
            { ref: 'ap_aplicacion', apropiacion: 'aplicacion_id', campos: ['aplicacion_id', 'nombre_aplicacion'],  campoForeign: null,   condicion: {}, condicional:null },            
            { ref: 'ape_aplicacion_institucion', apropiacion: 'institucion_id', campos: ['institucion_id', 'institucion_id'],  campoForeign: 'aplicacion_id',   condicion: {}, condicional:null },            
            
        ],
    },
    ainst_box:{        
        alias: 'ainst_box',        
        campos: {
            institucion_id: ['Institucion', false, true, 'C'],
            aplicacion_id: ['Aplicacion', false, true, 'C'],            
            role:['Rol', false, true, 'C'],
        }, 
        ilogic: {institucion_id:`SELECT 
                                distinct i.institucion_id AS value, 
                                UPPER(COALESCE(d.nombre_dpto, ''))||' - '||i.tipo_institucion_id||' - '||i.nombre_institucion AS text
                                FROM ape_aplicacion_institucion ai, ae_institucion i 
                                LEFT JOIN al_departamento d ON (i.cod_pais=d.cod_pais AND i.cod_dpto=d.cod_dpto)
                                WHERE ai.institucion_id=i.institucion_id
                                ORDER BY 2`,
                aplicacion_id: `SELECT distinct app.aplicacion_id as value, app.nombre_aplicacion as text
                                FROM ape_aplicacion_institucion ai, ap_aplicacion app
                                WHERE ai.aplicacion_id =  app.aplicacion_id AND ai.institucion_id='$campoForeign'
                                ORDER BY 2`,
                role: `SELECT distinct ar.role AS value, ar.name_role AS text
                        FROM ape_aplicacion_institucion ai, ap_aplicacion_role ar
                        WHERE ai.aplicacion_id = ar.aplicacion_id AND ar.aplicacion_id='$campoForeign' 
                        ORDER BY 2`
                },
        referer: [],
    },
}
module.exports = PDEPENDENCIES