//extraCondicion:[[campo, valor], [campo2, valor]...]
"use strict"
const PDEPENDENCIES = {
    precios: {
        alias: 'precios',
        campos: {          
          gestion: ['GESTION', false, true, 'C'],          
        },
        ilogic: {
          precio_gestion: `SELECT 
                        l.cod_liname, l.medicamento, l.forma_farmaceutica, l.concentracion, l.clasificacion_atq,
                        CASE WHEN l.uso_restringido THEN 'SI' ELSE 'NO' END AS uso, p.precio
                        FROM uf_liname l, uf_liname_pref p
                        WHERE l.cod_liname=p.cod_liname $w$
                        ORDER BY 1  `,
          
        },
        referer: [],
        primal: {
          equivalencia: {            
            gestion: ["gestion", "''||gestion"]            
          },
          query: `SELECT DISTINCT $a$
                FROM uf_liname_pref
                WHERE 1=1
                $w$
                ORDER BY 2`,
          headers: [{}],
          attributes: null,
        },
        withInitial: false,
      },
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
    
   
}
module.exports = PDEPENDENCIES