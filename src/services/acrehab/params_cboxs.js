//extraCondicion:[[campo, valor], [campo2, valor]...]
"use strict"
const PDEPENDENCIES = {    
    eval_box:{        
        alias: 'evalcboxs',        
        campos: {
            cod_dpto:['Departamento', false, true, 'C'],
            eg: ['Ente Gestor', false, true, 'C'],
            institucion_id: ['Establecimiento de Salud', false, true, 'C'],
            tipo_acrehab: ['Tipo Formulario a Aplicar', false, true, 'C'],
            frm_id: ['Formulario de Evaluacion', false, true, 'C'],
            dni_evaluador:['Evaluador', false, true, 'C'],
        }, 
        ilogic: {
            cod_dpto:`SELECT DISTINCT d.cod_dpto AS VALUE, d.nombre_dpto AS text
            FROM  ae_institucion i, al_departamento d, ae_institucion eg
            WHERE i.tipo_institucion_id='EESS'
            AND i.cod_dpto =  d.cod_dpto
            AND i.institucion_root =  eg.institucion_id
            ORDER BY 2`,
            eg:`SELECT DISTINCT eg.institucion_id AS value, eg.nombre_institucion AS text
            FROM  ae_institucion i, al_departamento d, ae_institucion eg
            WHERE i.tipo_institucion_id='EESS'
            AND i.cod_dpto =  d.cod_dpto
            AND i.institucion_root =  eg.institucion_id AND i.cod_dpto = '$campoForeign'
            ORDER BY 2`,
            institucion_id: `SELECT DISTINCT i.institucion_id AS value, d.nombre_dpto ||' - '||  i.nombre_institucion||' - '||e.nivel_atencion text
            FROM  r_institucion_salud e, ae_institucion i, al_departamento d, ae_institucion eg
            WHERE i.tipo_institucion_id='EESS' AND e.institucion_id =  i.institucion_id
            AND i.cod_dpto =  d.cod_dpto
            AND i.institucion_root =  eg.institucion_id AND eg.institucion_id= '$campoForeign' AND i.cod_dpto='$cod_dpto'
            ORDER BY 2`,
            tipo_acrehab:`SELECT distinct a.atributo_id AS VALUE,  a.atributo AS text
            FROM u_frm f, r_is_atributo a
            WHERE f.tipo_acrehab =  a.atributo_id
            AND f.codigo_root='-1'
            ORDER BY 2`,
            frm_id:`SELECT f.frm_id AS VALUE,  f.nombre_frm AS text
            FROM u_frm f, r_is_atributo a
            WHERE f.tipo_acrehab =  a.atributo_id
            AND f.codigo_root='-1' AND a.atributo_id= '$campoForeign' 
            ORDER BY 2`,
            dni_evaluador: `SELECT p.dni_persona AS VALUE,   p.primer_apellido || ' ' || p.segundo_apellido ||' '|| p.nombres ||' ('||apu.login||')' AS TEXT
            FROM aep_institucion_personal ip, au_persona p, apu_credencial apu
            WHERE ip.dni_persona = p.dni_persona
            AND  ip.institucion_id =  apu.institucion_id AND ip.dni_persona=apu.dni_persona
            AND ip.institucion_id = '$inst'
            ORDER BY 2`
        },
        referer: [        
        ],
    },
    
}
module.exports = PDEPENDENCIES