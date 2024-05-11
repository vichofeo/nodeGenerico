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
            frm_id:`SELECT f.frm_id AS VALUE,  f.parametro AS text
            FROM u_frm f, r_is_atributo a
            WHERE f.tipo_acrehab =  a.atributo_id
            AND f.codigo_root='-1' AND a.atributo_id= '$campoForeign' 
            ORDER BY 2`,
       
        },
        referer: [        
        ],
    },

    repo_pal_box:{        
        alias: 'evalcboxs',        
        campos: {
            cod_dpto:['Departamento', false, true, 'C'],
            eg: ['Ente Gestor', false, true, 'C'],
            institucion_id: ['Establecimiento de Salud', false, true, 'C'],            
            frm_id: ['Formulario de Evaluacion', false, true, 'C'],
            gestion: ['Gestion', false, true, 'C'],
            
        }, 
        ilogic: {
        },
        referer: [        
        ],
        primal:{
            equivalencia:{cod_dpto:['dpto.cod_dpto','dpto.nombre_dpto'], 
                        eg:['eg.institucion_id', 'eg.nombre_institucion'],
                        institucion_id:['eess.institucion_id','eess.nombre_institucion'],
                        frm_id:['frm.frm_id','frm.parametro'],
                        gestion:['extract(year from pac.create_date)','extract(year from pac.create_date)']
                        },
            query:`SELECT DISTINCT 
            $a$
            FROM u_frm_plan_accion pac, u_frm seccion, u_frm cap, u_frm parametro,
				u_frm_valores val, u_frm_evaluacion eva, u_frm frm,
            ae_institucion eess, ae_institucion eg, al_departamento dpto
            WHERE pac.seccion_id=seccion.frm_id
            AND pac.cap_id=cap.frm_id
            AND pac.parametro_id = parametro.frm_id            
            AND pac.valores_id =  val.valores_id
            and val.evaluacion_id =  eva.evaluacion_id
            and eva.frm_id =  frm.frm_id AND eva.institucion_id=eess.institucion_id
            AND eess.institucion_root =  eg.institucion_id
            AND eess.cod_pais= dpto.cod_pais AND eess.cod_dpto=dpto.cod_dpto
            $w$
            ORDER BY 2`,
            headers:[{value: 'nombre_dpto', text: 'Dpto'}, {value: 'eg', text: 'Ente Gestos'}, {value: 'eess', text: 'Establecimiento'},
            {value: 'gestion', text: 'Gestion'}, {value: 'frm', text: 'Formulario'}, {value: 'Seccion', text: 'Seccion'}, 
            {value: 'capitulo', text: 'Acapite'}, {value: 'standar', text: 'Standar'}, {value: 'fecha_vencimiento', text: 'Vencimiento'}, 
            {value: 'vigencia', text: 'Dias Vigencia'}, {value: 'alertax23', text: 'Estado'}
            ],      
            attributes:`dpto.nombre_dpto, eg.nombre_institucion AS eg, eess.nombre_institucion AS eess,  
            extract(year from pac.create_date) AS gestion, frm.parametro AS frm,
            seccion.codigo||' - '|| seccion.parametro AS seccion, 
            cap.codigo||' '||cap.parametro AS capitulo, 
            parametro.codigo ||'. '|| parametro.parametro AS standar,
            TO_CHAR((pac.fecha_complimiento)::DATE,'dd/mm/yyyy') AS fecha_vencimiento,            
            CASE  WHEN pac.fecha_complimiento IS NULL THEN 'En espera por inicio..'
            WHEN (( pac.fecha_complimiento )::DATE - NOW()::DATE)<0
                    THEN 'Vigencia CONCLUIDA'
                    ELSE 'Quedan: '||(( pac.fecha_complimiento)::DATE - NOW()::DATE) || ' dias.'
                    END AS "vigencia",                    
                    CASE  WHEN (( pac.fecha_complimiento )::DATE - NOW()::DATE)>60
                    THEN 'Vigente'
                    WHEN (( pac.fecha_complimiento )::DATE - NOW()::DATE)>0 and (( pac.fecha_complimiento )::DATE - NOW()::DATE) <=60
                    THEN 'Vencimiento proximo' 
                    WHEN (( pac.fecha_complimiento )::DATE - NOW()::DATE)<0
                    THEN 'Vencido' 
                    ELSE 'N/A' END  AS alertax23`,
        },
        withInitial:true,
        
    },
    
}
module.exports = PDEPENDENCIES