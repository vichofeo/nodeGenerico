//$keySession  
//extraCondicion:[[campo, valor], [campo2, valor]...]
"use strict"
const PDEPENDENCIES = {
  cnf_upfseess:{        
    alias: 'cnfcboxs',        
    campos: {
      file_tipo_id: ['ARchivo', true, true, 'C']
    }, 
    ilogic: {
      file_tipo_id:`SELECT  ft.file_tipo_id ,gr.nombre_grupo_file||' - '||ft.nombre_tipo_archivo||' (*.'||ft.ext||')' AS text
                FROM upf_file_grupo gr, upf_file_tipo ft
                WHERE 
                gr.grupo_file_id=ft.grupo_file_id
                AND gr.aplicacion_id='$app'
                AND ft.activo='Y'
                ORDER BY 2`,
    },
    referer: [],
    primal:{
        equivalencia:{ },
        attributes:``,
        query:`SELECT 
        cnf.institucion_id
        FROM upf_file_institucion_cnf cnf
        WHERE                 
         cnf.file_tipo_id='$campoForeign'
        ORDER BY 1`,
        headers:[],      
        
    },
    withInitial:true,
    
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
    regsFarms:{
        alias: 'cboxs_evals',                
        campos: {            
            periodos: ['Periodos', true, true, 'C']
            
        }, 
        ilogic: {
            
            periodos:`SELECT distinct fr.periodo AS VALUE,
            to_char(TO_DATE(fr.periodo, 'YYYYMM'), 'YYYY - Mon') AS text
            FROM uf_abastecimiento_registro fr
            WHERE  $keySession            
            ORDER BY 1 DESC`
        },
        keySession:{replaceKey:false, campo:'fr.institucion_id'},
        referer: [],
    }
    
   
}
module.exports = PDEPENDENCIES