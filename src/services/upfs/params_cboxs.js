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
  }


}
module.exports = PDEPENDENCIES