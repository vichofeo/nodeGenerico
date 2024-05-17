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
            {value: 'gestion', text: 'Gestion'}, {value: 'frm', text: 'Formulario'}, {value: 'seccion', text: 'Seccion'}, 
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

    mydash:{        
        alias: 'MyDasboard',        
        campos: {
            gestion: ['Gestion', false, true, 'C'],
            evaluaciones:['Evaluaciones', false, true, 'TT'],
            dptos:['Evaluaciones por Departamento', false, true, 'TT'],
            estados:['Estado Evaluacion por Formulario', false, true, 'TT'],
            pac_fin:['PAC x Fecha Cumplimiento', false, true, 'TT'],
            pac_ini:['PAC x Fecha Inicio', false, true, 'TT'],
            
        }, 
        ilogic: {
            gestion:`SELECT DISTINCT extract(year from create_date) as value, extract(year from create_date) as text            
            FROM u_frm_evaluacion
            ORDER BY 2 desc`,
            evaluaciones:`SELECT a.atributo_id, a.atributo AS estado, a.color, COUNT(e.*) AS VALUE,
            SUM(COUNT(e.*)) OVER (ORDER BY a.atributo_id )
              AS evaluaciones, 
              SUM(Sum(case when e.excelencia = true THEN 1 ELSE 0 END)) OVER (ORDER BY a.atributo_id ) AS excelencia
            FROM u_is_atributo a
            LEFT JOIN u_frm_evaluacion e ON (e.concluido =  a.atributo_id AND extract(year FROM e.create_date)='$campoForeign')
            WHERE a.grupo_atributo='ESTADO_CONCLUSION'
             AND a.atributo_id>'0' 
            GROUP BY a.atributo_id, a.atributo, a.color
            ORDER BY a.atributo_id`,
             dptos: `SELECT dpto.cod_dpto,dpto.nombre_dpto AS dpto, f.orden, f.nombre_corto AS frm, COUNT(e.*) AS value
             FROM u_frm f
             LEFT JOIN u_frm_evaluacion e   ON ( f.frm_id=e.frm_id AND extract(year from e.create_date)= '$gestion')
             left JOIN ae_institucion i ON (e.institucion_id =  i.institucion_id)
             left JOIN al_departamento dpto ON (i.cod_pais =  dpto.cod_pais AND i.cod_dpto=dpto.cod_dpto)
             WHERE
             f.codigo_root='-1'
             GROUP BY dpto.cod_dpto,dpto.nombre_dpto, f.orden, f.nombre_corto
             ORDER BY dpto.cod_dpto, f.orden `,
            estados: ` SELECT 
                f.orden, f.nombre_corto as frm, a.atributo_id, a.atributo as estado, a.color, COUNT(*) AS value,
                SUM(COUNT(*)) OVER (PARTITION BY f.nombre_corto ORDER BY a.atributo_id ) as acumulado
                FROM u_is_atributo a,
                u_frm_evaluacion e, u_frm f
                WHERE 
                a.atributo_id =  e.concluido AND e.frm_id= f.frm_id
                and extract(year from e.create_date)= '$gestion'
                GROUP BY f.orden, f.nombre_corto, a.atributo_id, a.atributo, a.color
                ORDER BY f.orden, a.atributo_id `,
            pac_fin: `SELECT 
            CASE WHEN p.fecha_complimiento IS null THEN 's/Iniciar' ELSE to_char(p.fecha_complimiento,'YYYY-MM')END AS mes,
            COUNT(*) AS value
            FROM u_frm_evaluacion e, u_frm_valores v, u_frm_plan_accion p
            WHERE 
            e.evaluacion_id = v.evaluacion_id AND v.valores_id=p.valores_id and extract(year from e.create_date)= '$gestion'
            GROUP BY 1 ORDER BY 1`,
            pac_ini: `SELECT 
            CASE WHEN p.fecha_registro IS null THEN 's/Iniciar' ELSE to_char(p.fecha_registro,'YYYY-MM')END AS mes,
            COUNT(*) AS value
            FROM u_frm_evaluacion e, u_frm_valores v, u_frm_plan_accion p
            WHERE 
            e.evaluacion_id = v.evaluacion_id AND v.valores_id=p.valores_id and extract(year from e.create_date)= '$gestion'
            GROUP BY 1 ORDER BY 1`

            
            
       
        },
        referer: [        
        ],
    },
    
}
module.exports = PDEPENDENCIES