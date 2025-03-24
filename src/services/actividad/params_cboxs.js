//extraCondicion:[[campo, valor], [campo2, valor]...]
"use strict"
const PDEPENDENCIES = {    
    act_box:{        
        alias: 'ainstcboxs',        
        campos: {
            clase_actividad: ['Actividad', false, true, 'C'],
            tipo_actividad: ['Tipo Actividad', false, true, 'C'],
        }, 
        ilogic: null,
        referer: [        
            { ref: 'r_is_atributo', apropiacion: 'clase_actividad', campos: ['atributo_id', 'atributo'],  campoForeign: null,   condicion: {grupo_atributo:'ACTIVIDAD', precedencia:null}, condicional:null },            
            { ref: 'r_is_atributo', apropiacion: 'tipo_actividad', campos: ['atributo_id', 'atributo'],  campoForeign: 'precedencia',   condicion: {grupo_atributo:'ACTIVIDAD'}, condicional:null },            
            
        ],
    },
    actividades:{        
        alias: 'actcboxs',        
        campos: {
            actividad_id: ['Actividad', true, true, 'C']
        }, 
        ilogic: {
        },
        referer: [   
            { ref: 'cr_actividad', apropiacion: 'actividad_id', campos: ['actividad_id', 'nombre_actividad'], condicion: {activo:'Y', actividad_root:null}, condicional: ['institucion_id,$inst'] },     
        ],
        primal:{
            equivalencia:{ },
            attributes:`p.primer_apellido, p.segundo_apellido, p.nombres, ap.mail_registro, p.dni_persona as dni`,
            query:`SELECT DISTINCT 
            $a$
            FROM cr_actividad a , cr_actividad_personas ap, au_persona p
            WHERE 
            a.actividad_id = ap.actividad_id and ap.dni_persona=p.dni_persona
            and a.activo='Y' and  a.institucion_id='$inst' 
            and a.actividad_id=$campoForeign
            $w$
            ORDER BY 1`,
            headers:[{ value: "primer_apellido", text: "Primer Apellido" }, { value: "segundo_apellido", text: "Segundo Apellido" }, { value: "nombres", text: "Nombres" },
                { value: "mail_registro", text: "email" }
            ],      
            
        },
        withInitial:true,
        
    }, 
    
}
module.exports = PDEPENDENCIES