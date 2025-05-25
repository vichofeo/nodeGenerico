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
          eg: ['ENTE GESTOR', false, true, 'C', , , 'M'],
          dpto: ['DEPARTAMENTO', false, true, 'C', , , 'M'],      
          eess: ['ESTABLECIMIENTO', false, true, 'C', , , 'M'],          
          periodo: ['PERIODO', false, true, 'C', , , , true],
        }, 
        ilogic: {          
          periodo: `SELECT DISTINCT r.periodo AS value, to_char(to_date(r.periodo,'YYYY-MM'), 'YYYY-MONTH') AS text
FROM upf_file_tipo t, upf_registro r, ae_institucion i, al_departamento dpto, ae_institucion eg
WHERE  $keySession
and t.file_tipo_id =  r.file_tipo_id
and r.institucion_id =  i.institucion_id
AND i.cod_pais =  dpto.cod_pais AND i.cod_dpto= dpto.cod_dpto
AND i.institucion_root =  eg.institucion_id
AND t."modelLoad"='abastecimiento'
$w$
order by 1 desc
          `,
          dataTable:`SELECT codigo, descripcion, presentacion, 
CASE  WHEN (fvencimiento - CURRENT_DATE)<0
THEN 'Periodo Vigencia CONCLUIDO'
ELSE 'Restan: '||(fvencimiento - CURRENT_DATE) || ' dias.'
END AS "vigencia",
CASE  WHEN (fvencimiento - CURRENT_DATE)>60
THEN 'Vigente'
WHEN (fvencimiento - CURRENT_DATE)>0 and (fvencimiento - CURRENT_DATE) <=60
THEN 'Vencimiento proximo'
WHEN (fvencimiento - CURRENT_DATE)<0
THEN 'Vencido'
ELSE 'N/A' END  AS alertax23,
TO_CHAR(fvencimiento, 'DD/MM/YYYY') AS fvencimiento,
consumo, ingreso, egreso, transferencia, stock,
CASE consumo WHEN  0 THEN 4
ELSE CASE WHEN (stock/consumo)=0 THEN 3 
			 WHEN (stock/consumo)>0 AND  (stock/consumo)<= 3 THEN 2
			 WHEN (stock/consumo)>3 THEN 1
ELSE -1 END 
END AS alertaxs23,
ARRAY[['success','warning','error', 'purple'],
['Normo Stock', 'Sub-Stock', 'Stock cero', 'Sobre Stock']] AS alertaxs23_text,
case consumo  WHEN 0 THEN 0  else round ((stock/consumo)::NUMERIC, 2) END as tmes
FROM (
SELECT 
coalesce(l.cod_liname,'-NO LINAME-') AS codigo, 
CASE WHEN l.cod_liname IS NOT NULL THEN l.medicamento ||' '|| l.concentracion ELSE ll.cod_liname ||' '|| ll.medicamento END AS descripcion,
l.forma_farmaceutica AS presentacion, ll.fecha_vencimiento AS fvencimiento,                 
round(SUM(ll.consumo_mensual)::NUMERIC,2) AS consumo,
round(SUM(ll.ingresos)::numeric,2) AS ingreso, 
round(SUM(ll.egresos)::numeric,2) AS egreso, 
round(SUM(ll.transferencias)::numeric,2) AS transferencia, 
round(SUM(ll.saldo_stock)::numeric,2) AS stock
FROM ae_institucion i, al_departamento dpto, ae_institucion eg, upf_file_tipo t,
upf_registro r, uf_abastecimiento ll
LEFT JOIN uf_liname l ON (ll.cod_liname=l.cod_liname )
WHERE t.file_tipo_id =  r.file_tipo_id
and r.institucion_id =  i.institucion_id
AND i.cod_pais =  dpto.cod_pais AND i.cod_dpto= dpto.cod_dpto
AND i.institucion_root =  eg.institucion_id
AND t."modelLoad"='abastecimiento'
AND r.registro_id=ll.registro_id and 
ll.swloadend =  TRUE AND r.periodo='$campoForeign'
$w$
group BY 1,2,3,4) AS tbl
ORDER BY 1,6,2
          `
        },
        keySession:{replaceKey:false, campo:'i.institucion_id'},
        referer: [ ],
        primal:{
            equivalencia:{
              eg:['eg.institucion_id','eg.nombre_corto'],
              dpto:['dpto.cod_dpto', 'dpto.nombre_dpto'],
              eess:['r.institucion_id', 'i.nombre_institucion'],
              },
            attributes:null,//`${parameters.rprte_abastecimienton.campos} `,
             query:`
SELECT DISTINCT $a$
          FROM upf_file_tipo t, upf_registro r, ae_institucion i, al_departamento dpto, ae_institucion eg
WHERE  $keySession and 
t.file_tipo_id =  r.file_tipo_id
and r.institucion_id =  i.institucion_id
AND i.cod_pais =  dpto.cod_pais AND i.cod_dpto= dpto.cod_dpto
AND i.institucion_root =  eg.institucion_id
AND t."modelLoad"='abastecimiento'
$w$
order by 2
`,
            headers:[{ value: "codigo", text: "CODIGO LINAME" }, { value: "descripcion", text: "DESCRIPCION" }, { value: "presentacion", text: "PRESENTACION" },
                { value: "alertax23", text: "ESTADO VIGENCIA" }, { value: "vigencia", text: "VIGENCIA" }, { value: "fvencimiento", text: "FECHA VENCIMIENTO" },
                { value: "alertaxs23", text: "ESTADO STOCK" },
                { value: "consumo", text: "CONSUMO MENSUAL" }, { value: "ingreso", text: "INGRESOS" }, { value: "egreso", text: "EGRESOS" }, { value: "transferencia", text: "TRANSFERENCIAS" },
                { value: "stock", text: "SALDOS/STOCK" }, { value: "tmes", text: "TIEMPO EN MESES" }
            ],      
            
        },
        withInitial:true,
        
    }, 


}
module.exports = PDEPENDENCIES