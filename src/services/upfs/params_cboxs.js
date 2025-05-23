const parameters =  require('./parameters')
//$keySession  
//extraCondicion:[[campo, valor], [campo2, valor]...]
//orden de ejecucion : REFERER, PRIMAL, ILOGIC
"use strict"
const PDEPENDENCIES = {
  cnf_upfseess: {
    alias: 'cnfcboxs',
    campos: {
      file_tipo_id: ['ARchivo', true, true, 'C']
    },
    ilogic: {
      file_tipo_id: `SELECT  ft.file_tipo_id as value, gr.nombre_grupo_file||' - '||ft.nombre_tipo_archivo||' (*.'||ft.ext||')' AS text
                FROM upf_file_grupo gr, upf_file_tipo ft
                WHERE 
                gr.grupo_file_id=ft.grupo_file_id
                AND gr.aplicacion_id='$app'
                AND ft.activo='Y'
                ORDER BY 2`,
      instituciones: `SELECT 
        cnf.institucion_id as institucion
        FROM upf_file_institucion_cnf cnf
        WHERE                 
         cnf.file_tipo_id='$campoForeign'
        ORDER BY 1`
    },
    referer: [],
    primal: null,
    withInitial: false,

  },
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
  cbx_monLoaded: {
    alias: 'cboxs_evals',                
        campos: {
            forms: ['Intrumento de captura datos', true, true, 'C'],            
            periodos: ['Periodos', true, true, 'C']
            
        }, 
        ilogic: {
            forms:`SELECT distinct t.file_tipo_id AS VALUE, 
          t.nombre_tipo_archivo ||' ('||CASE WHEN t.sw_semana THEN 'SEMANAL' ELSE  'MENSUAL'END ||')' as text 
          FROM upf_file_tipo t, upf_registro r
          WHERE $keySession
          AND t.file_tipo_id =  r.file_tipo_id
          AND r.activo='Y' AND t.activo= 'Y'
          ORDER BY 2`,
            periodos:`SELECT r.periodo AS value, 
                  CASE WHEN t.sw_semana THEN to_char(TO_DATE(r.periodo, 'IYYY-IW'), 'IYYY- semana - IW')
                  ELSE TO_CHAR(TO_DATE(r.periodo,'YYYY-MM'), 'YYYY - Mon') END AS text
                  FROM upf_file_tipo t, upf_registro r
                  WHERE $keySession AND t.file_tipo_id ='$forms'
                  AND t.file_tipo_id =  r.file_tipo_id
                  AND r.activo='Y' AND t.activo= 'Y'
                  ORDER BY 1 DESC `
        },
        keySession:{replaceKey:false, campo:'r.institucion_id'},
        referer: [],
  },
  cbx_abas_data_table:{        
        alias: 'actcboxsabas',        
        campos: {
          eg: ['ENTE GESTOR', false, true, 'C'],
          dpto: ['DEPARTAMENTO', false, true, 'C'],      
          eess: ['ESTABLECIMIENTO', false, true, 'C'],          
          periodo: ['PERIODO', false, true, 'C'],
        }, 
        ilogic: {
          eg:`SELECT  DISTINCT eg.institucion_id AS value, eg.nombre_corto AS text
              FROM upf_file_tipo t, upf_registro r, ae_institucion i, al_departamento dpto, ae_institucion eg
              WHERE $keySession
              AND t.file_tipo_id =  r.file_tipo_id
              and r.institucion_id =  i.institucion_id
              AND i.cod_pais =  dpto.cod_pais AND i.cod_dpto= dpto.cod_dpto
              AND i.institucion_root =  eg.institucion_id 
              AND t."modelLoad"='abastecimiento'
              ORDER BY 2`,
          dpto:`SELECT  DISTINCT dpto.cod_dpto AS value, dpto.nombre_dpto  AS text
FROM upf_file_tipo t, upf_registro r, ae_institucion i, al_departamento dpto, ae_institucion eg
WHERE $keySession
AND t.file_tipo_id =  r.file_tipo_id
and r.institucion_id =  i.institucion_id
AND i.cod_pais =  dpto.cod_pais AND i.cod_dpto= dpto.cod_dpto
AND i.institucion_root =  eg.institucion_id 
AND t."modelLoad"='abastecimiento'
AND eg.institucion_id='$campoForeign'
ORDER BY 2`,
         eess:`SELECT  DISTINCT r.institucion_id AS value, i.nombre_institucion  AS text
FROM upf_file_tipo t, upf_registro r, ae_institucion i, al_departamento dpto, ae_institucion eg
WHERE $keySession
AND t.file_tipo_id =  r.file_tipo_id
and r.institucion_id =  i.institucion_id
AND i.cod_pais =  dpto.cod_pais AND i.cod_dpto= dpto.cod_dpto
AND i.institucion_root =  eg.institucion_id 
AND t."modelLoad"='abastecimiento'
AND eg.institucion_id='$eg' AND dpto.cod_dpto  = '$campoForeign'
ORDER BY 2`, 
          periodo: `SELECT DISTINCT r.periodo AS value, to_char(to_date(r.periodo,'YYYY-MM'), 'YYYY-MONTH') AS text
FROM upf_file_tipo t, upf_registro r, ae_institucion i, al_departamento dpto, ae_institucion eg
WHERE  $keySession
AND t.file_tipo_id =  r.file_tipo_id
and r.institucion_id =  i.institucion_id
AND i.cod_pais =  dpto.cod_pais AND i.cod_dpto= dpto.cod_dpto
AND i.institucion_root =  eg.institucion_id
AND t."modelLoad"='abastecimiento'
AND eg.institucion_id='$eg' AND dpto.cod_dpto  = '$dpto' and i.institucion_id='$campoForeign'
ORDER BY 1 desc
          `,
          dataTable:`SELECT 
          FROM upf_file_tipo t, ae_institucion i, al_departamento dpto, ae_institucion eg, ${parameters.rprte_abastecimienton.table} 
          WHERE $keySession
          AND t.file_tipo_id =  r.file_tipo_id
and r.institucion_id =  i.institucion_id
AND i.cod_pais =  dpto.cod_pais AND i.cod_dpto= dpto.cod_dpto
AND i.institucion_root =  eg.institucion_id
AND t."modelLoad"='abastecimiento'
          AND ${parameters.rprte_abastecimienton.precondicion.join(' AND ').replaceAll('$paramDoms', '1=1')}
          AND eg.institucion_id='$eg' AND dpto.cod_dpto  = '$dpto' 
          and i.institucion_id='$eess' and r.periodo='$periodo'
          `
        },
        keySession:{replaceKey:false, campo:'i.institucion_id'},
        referer: [ ],
        primal:{
            equivalencia:{  },
            attributes:`${parameters.rprte_abastecimienton.campos} `,
            query:`SELECT 1 as x21`,
            headers:[{ value: "primer_apellido", text: "Primer Apellido" }, { value: "segundo_apellido", text: "Segundo Apellido" }, { value: "nombres", text: "Nombres" },
                { value: "mail_registro", text: "email" }, { value: "enviado", text: "Mail Enviado" }, { value: "obs", text: "Observaciones" }
            ],      
            
        },
        withInitial:false,
        
    }, 


}
module.exports = PDEPENDENCIES