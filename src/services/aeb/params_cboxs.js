const SS_CBOXSS = require('./params_cboxsSS')
const AEB_CBOXS = require('./params_cboxAeb')
const UFAM_CBOXS = require('./params_cboxUfam')
const UCASS_CBOXS = require('./params_cboxUcass')
const UFSMT_CBOXS = require('./params_cboxUfsmt')

const OTHERSAEB_CBOX = require('./params_cboxAebAll')

const DASHBOARD =  require('./params_cboxsDash')

//extraCondicion:[[campo, valor], [campo2, valor]...]
'use strict'
const PDEPENDENCIES = {
  ...DASHBOARD,
  //cBox for sala situacional 
  ss_eess:{        
    alias: 'ss_eess',
    campos: {      
      gestion: ['GESTION', false, true, 'C'],
      periodo: ['MES', false, true, 'C',,,'M'],
      eg: ['Ente Gestor', false, true, 'C',,,'M'],
      dpto:['Departamento', false, true, 'C',,,'M'],
      eess: ['Establecimiento de Salud', false, true, 'C',,,'M'],
  }, 
  
  ilogic: {
    gestion:`SELECT GENERATE_SERIES(2019,EXTRACT(YEAR  FROM CURRENT_DATE),1) as value, GENERATE_SERIES(2019,EXTRACT(YEAR  FROM CURRENT_DATE),1) as text `,
    eg:`SELECT DISTINCT eg.institucion_id AS value, eg.nombre_institucion AS text
      FROM  ae_institucion i, al_departamento d, ae_institucion eg
      WHERE i.tipo_institucion_id='EESS'
      AND i.cod_dpto =  d.cod_dpto
      AND i.institucion_root =  eg.institucion_id 
      ORDER BY 2`,

      dpto:`SELECT DISTINCT d.cod_dpto AS VALUE, d.nombre_dpto AS text
      FROM  ae_institucion i, al_departamento d, ae_institucion eg
      WHERE i.tipo_institucion_id='EESS'
      AND i.cod_dpto =  d.cod_dpto
      AND i.institucion_root =  eg.institucion_id
      $iqw$
      ORDER BY 2`,
      
      eess: `SELECT DISTINCT i.institucion_id AS value, eg.nombre_corto||': '||d.nombre_dpto ||' - '||  i.nombre_institucion||' - '||e.nivel_atencion text
      FROM  r_institucion_salud e, ae_institucion i, al_departamento d, ae_institucion eg
      WHERE i.tipo_institucion_id='EESS' AND e.institucion_id =  i.institucion_id
      AND i.cod_dpto =  d.cod_dpto
      AND i.institucion_root =  eg.institucion_id 
      $iqw$
      ORDER BY 2`,
  },
  ilogicMultiple:{eg:'eg.institucion_id', dpto:'d.cod_dpto', eess:'i.institucion_id' },
  primal: {
    equivalencia: {     
      
      periodo: ["to_char((CASE WHEN '$campoForeign'='-1' or '$campoForeign'='undefined' THEN '2019' ELSE '$campoForeign' END||'-01-01')::DATE + (interval '1' month * GENERATE_SERIES(0,month_count::INT)), 'YYYY-MM')", 
              "to_char((CASE WHEN '$campoForeign'='-1' or '$campoForeign'='undefined' THEN '2019' ELSE '$campoForeign' END||'-01-01')::DATE + (interval '1' month * GENERATE_SERIES(0,month_count::INT)), 'YYYY-MM')"],
    },
    query: `SELECT $a$
    from (
   SELECT 
   CASE WHEN '$campoForeign'='-1' or '$campoForeign'='undefined' THEN extract(year from diff) * 12 + extract(month from diff)  
	ELSE 
	CASE WHEN extract(year from diff) >=1 THEN 12 ELSE extract(month from diff) END
	END  as month_count
   from (
          select age(current_timestamp, (CASE WHEN '$campoForeign'='-1' or '$campoForeign'='undefined' THEN '2019' ELSE '$campoForeign' END||'-01-01 00:00:00')::timestamp) as diff
   ) td
) t`,
    headers: [{}],
    attributes: null,
  },
    referer: [],
    withInitial: true,
},
equivalencias:{        
  alias: 'equivalencias',
  campos: {          
    eg: ['Ente Gestor', false, true, 'C'],
    dpto:['Departamento', false, true, 'C'],
    eess: ['Establecimiento de Salud', false, true, 'C'],
  }, 
  ilogic: null,
  ilogicMultiple: null,
  primal: {
    equivalencia: {      
      eg: ['eg.institucion_id', 'eg.nombre_institucion'],
      dpto: ['d.cod_dpto', 'd.nombre_dpto'],
      eess: ['i.institucion_id', " i.nombre_institucion||' ('||e.nivel_atencion||')'"]
    },
    query: `SELECT DISTINCT $a$            
            FROM  r_institucion_salud e, ae_institucion i, al_departamento d, ae_institucion eg
            WHERE i.tipo_institucion_id='EESS' AND e.institucion_id =  i.institucion_id
            AND i.cod_dpto =  d.cod_dpto
            AND i.institucion_root =  eg.institucion_id 
            $w$
            ORDER BY 2`,
    headers: [{}],
    attributes: null,
  },
    referer: [],
    withInitial: false,
},
...SS_CBOXSS,
...AEB_CBOXS,
...UFAM_CBOXS,
...UCASS_CBOXS,
...UFSMT_CBOXS,
...OTHERSAEB_CBOX
}
module.exports = PDEPENDENCIES
