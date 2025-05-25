const cmps = {
    gestion: ['GESTION', false, true, 'C'],
    periodo: ['MES', false, true, 'C', , , 'M'],
    eg: ['Ente Gestor', false, true, 'C', , , 'M'],
    dpto: ['Departamento', false, true, 'C', , , 'M'],
    eess: ['Establecimiento de Salud', false, true, 'C', , , 'M'],
  }
  const infecciones_dash =  require('./params_cboxsDash')
  //extraCondicion:[[campo, valor], [campo2, valor]...]
  'use strict'
  const PDEPENDENCIES = {     
    adefuncion: {
      alias: 'adefuncion',
      campos: cmps,
      ilogic: {      
        adefuncion: `SELECT 
coalesce(t.causa_directa, 'Unknow')  AS grupo, 
 dpto.nombre_dpto as subgrupo,
eg.nombre_corto AS "institucion",

 CASE  
WHEN tbl>=0 AND  tbl<=20 THEN '00-20' 
WHEN tbl>20 and tbl<=25 THEN '20-25' 
WHEN tbl>25 and tbl<=30 THEN '25-30' 
WHEN tbl>30 and tbl<=35 THEN '30-35' 
WHEN tbl>35 and tbl<=40 THEN '35-40' 
WHEN tbl>40 and tbl<=45 THEN '40-45' 
WHEN tbl>45 and tbl<=50 THEN '45-50' 
WHEN tbl>50 and tbl<=55 THEN '50-55' 
WHEN tbl>55 and tbl<=60 THEN '55-60' 
WHEN tbl>60 and tbl<=65 THEN '60-65' 
WHEN tbl>65 and tbl<=70 THEN '65-70' 
WHEN tbl>70 and tbl<=75 THEN '70-75' 
WHEN tbl>75 and tbl<=80 THEN '75-80' 
WHEN tbl>80 THEN '80++' 
 ELSE 'Unknow' END AS grupo_etario,
t.sexo AS genero ,
count(*) AS value

FROM tmp_defunciones t, ae_institucion i, ae_institucion eg, al_departamento dpto,
EXTRACT(YEAR FROM age(t.fecha_defuncion , t.fecha_nacimiento)) AS tbl,
(SELECT coalesce(t.causa_directa, 'Unknow') as causa_directa, COUNT(*)
FROM tmp_defunciones t, ae_institucion i, ae_institucion eg, al_departamento dpto
WHERE 
t.eess =  i.institucion_id AND t.eg= i.institucion_root
AND i.institucion_root =  eg.institucion_id
AND i.cod_pais =  dpto.cod_pais AND i.cod_dpto =  dpto.cod_dpto
$w$
GROUP BY 1
ORDER BY 2 DESC
LIMIT 10) AS tt2
WHERE 
t.eess =  i.institucion_id AND t.eg= i.institucion_root
AND i.institucion_root =  eg.institucion_id
AND i.cod_pais =  dpto.cod_pais AND i.cod_dpto =  dpto.cod_dpto
$w$
AND coalesce(t.causa_directa, 'Unknow') =  tt2.causa_directa
GROUP BY 1,2, 3, 4,5
ORDER BY 1,2,3
        `
      },
      referer: [],
      primal: {
        equivalencia: {
          gestion: ["to_char(t.fecha_defuncion, 'YYYY')", "to_char(t.fecha_defuncion, 'YYYY')"],
          periodo: ["to_char(t.fecha_defuncion, 'YYYY-MM')", "to_char(t.fecha_defuncion, 'YYYY-MM')"],
          eg: ['i.institucion_root', 'i.institucion_root'],
          dpto: ['i.cod_dpto', 'i.cod_dpto'],
          eess: ['i.institucion_id', 'i.institucion_id'],
        },
        query: `SELECT $sa$`,
        headers: [{}],
        attributes: null,
      },
      withInitial: true,
    },
    adef_lineas: {
      alias: 'adef_lineas',
      campos: cmps,
      ilogic: {      
        adef_lineas: `
        SELECT TO_CHAR(t.fecha_defuncion, 'YYYY-MM-DD') as ejex,  COUNT (*) AS value,
                TO_CHAR((select MAX(fecha_defuncion) FROM tmp_defunciones),'DD/MM/YYYY') AS obs
                FROM tmp_defunciones t
                WHERE 1=1 $w$
                GROUP BY 1
                ORDER BY 1
        `, 
        adef_dpto:`SELECT  d.nombre_dpto as pila, eg.nombre_corto as ejex ,COUNT(*) AS value
      FROM tmp_defunciones t, al_departamento d , ae_institucion eg
		WHERE d.cod_dpto = t.dpto	and t.eg=eg.institucion_id
$w$
      GROUP BY 1,2
      ORDER BY 1,2`,
      adef_etario:`SELECT 
                t.sexo as ejex,
                SUM(CASE WHEN tedad >=0 and tedad<=5 THEN 1 ELSE 0 END)AS "00-05",
                SUM(CASE WHEN tedad >5 and tedad<=10 THEN 1 ELSE 0 END) AS "05-10",
                SUM(CASE WHEN tedad >10 and tedad<=15 THEN 1 ELSE 0 END) as "10-15",
                SUM(CASE WHEN tedad >15 and tedad<=20 THEN 1 ELSE 0 END) as "15-20",
                SUM(CASE WHEN tedad >20 and tedad<=25 THEN 1 ELSE 0 END) as "20-25",
                SUM(CASE WHEN tedad >25 and tedad<=30 THEN 1 ELSE 0 END) as "25-30",
                SUM(CASE WHEN tedad >30 and tedad<=35 THEN 1 ELSE 0 END) as "30-35",
                SUM(CASE WHEN tedad >35 and tedad<=40 THEN 1 ELSE 0 END) as "35-40",
                SUM(CASE WHEN tedad >40 and tedad<=45 THEN 1 ELSE 0 END) as "40-45",
                SUM(CASE WHEN tedad >45 and tedad<=50 THEN 1 ELSE 0 END) as "45-50",
                SUM(CASE WHEN tedad >50 and tedad<=55 THEN 1 ELSE 0 END) as "50-55",
                SUM(CASE WHEN tedad >55 and tedad<=60 THEN 1 ELSE 0 END) as "55-60",
                SUM(CASE WHEN tedad >60 and tedad<=65 THEN 1 ELSE 0 END) as "60-65",
                SUM(CASE WHEN tedad >65 and tedad<=70 THEN 1 ELSE 0 END) as "65-70",
                SUM(CASE WHEN tedad >70 and tedad<=75 THEN 1 ELSE 0 END) as "70-75",
                SUM(CASE WHEN tedad >75 and tedad<=80 THEN 1 ELSE 0 END) as "75-80",
                SUM(CASE WHEN tedad >80 and tedad<=85 THEN 1 ELSE 0 END) as "80-85",
                SUM(CASE WHEN tedad >85 and tedad<=90 THEN 1 ELSE 0 END) as "85-90",
                SUM(CASE WHEN tedad >90  THEN 1 ELSE 0 END) as "90++"
                FROM tmp_defunciones t,
                EXTRACT(YEAR FROM age(t.fecha_defuncion , t.fecha_nacimiento)) AS tedad
                WHERE 1=1 
					      $w$
                GROUP BY t.sexo`
      },
      referer: [],
      primal: {
        equivalencia: {
          gestion: ["to_char(t.fecha_defuncion, 'YYYY')", "to_char(t.fecha_defuncion, 'YYYY')"],
          periodo: ["to_char(t.fecha_defuncion, 'YYYY-MM')", "to_char(t.fecha_defuncion, 'YYYY-MM')"],
          eg: ['t.eg', 't.eg'],
          dpto: ['i.dpto', 'i.dpto'],
          eess: ['i.eess', 'i.eess'],
        },
        query: `SELECT $sa$`,
        headers: [{}],
        attributes: null,
      },
      withInitial: true,
    },
    anac_lineas: {
      alias: 'anac_lineas',
      campos: cmps,
      ilogic: {      
        anac_lineas: ` SELECT TO_CHAR(t.fecha_nacimiento, 'YYYY-MM-DD') as ejex,  COUNT (*) AS value,
                TO_CHAR((select MAX(fecha_nacimiento) FROM tmp_nacimientos),'DD/MM/YYYY') AS obs
                FROM tmp_nacimientos t
                WHERE 1=1 $w$
                GROUP BY 1
                ORDER BY 1       
        `, 
        anac_dpto:`SELECT  d.nombre_dpto as pila, eg.nombre_corto as ejex ,COUNT(*) AS value
      FROM tmp_nacimientos t, al_departamento d , ae_institucion eg
		WHERE d.cod_dpto = t.dpto	and t.eg=eg.institucion_id
$w$
      GROUP BY 1,2
      ORDER BY 1,2`,
      anac_etario:`SELECT 
                t.sexo as ejex,
                SUM(CASE WHEN tedad >=0 and tedad<=20 THEN 1 ELSE 0 END)AS "00-20",
                SUM(CASE WHEN tedad >20 and tedad<=25 THEN 1 ELSE 0 END) as "20-25",
                SUM(CASE WHEN tedad >25 and tedad<=30 THEN 1 ELSE 0 END) as "25-30",
                SUM(CASE WHEN tedad >30 and tedad<=35 THEN 1 ELSE 0 END) as "30-35",
                SUM(CASE WHEN tedad >35 and tedad<=40 THEN 1 ELSE 0 END) as "35-40",
                SUM(CASE WHEN tedad >40 and tedad<=45 THEN 1 ELSE 0 END) as "40-45",
                SUM(CASE WHEN tedad >45 and tedad<=50 THEN 1 ELSE 0 END) as "45-50",
                SUM(CASE WHEN tedad >50  THEN 1 ELSE 0 END) as "50++",
                SUM(CASE WHEN tedad <0  THEN 1 ELSE 0 END) AS "s/edad"
                FROM tmp_nacimientos t,
                COALESCE(t.edad_gestacional::INTEGER, -1) AS tedad
                WHERE 1=1 
$w$
                GROUP BY t.sexo`
      },
      referer: [],
      primal: {
        equivalencia: {
          gestion: ["to_char(t.fecha_nacimiento, 'YYYY')", "to_char(t.fecha_nacimiento, 'YYYY')"],
          periodo: ["to_char(t.fecha_nacimiento, 'YYYY-MM')", "to_char(t.fecha_nacimiento, 'YYYY-MM')"],
          eg: ['t.eg', 't.eg'],
          dpto: ['i.dpto', 'i.dpto'],
          eess: ['i.eess', 'i.eess'],
        },
        query: `SELECT $sa$`,
        headers: [{}],
        attributes: null,
      },
      withInitial: true,
    },
    acancer_barras: {
      alias: 'acancer_barras',
      campos: cmps,
      ilogic: {      
        acancer_barras: ` SELECT '' as pila,
tt.nombre_corto AS ejex, 
CASE WHEN p.ente_gestor IS null THEN 0 
                  ELSE  ROUND((1000*tt.pacientes::numeric/p.poblacion_afiliada::NUMERIC),1)
                  END  AS value
                  FROM (
                  SELECT t.ente_gestor , eg.nombre_corto,
                  COUNT(*) AS pacientes
                  FROM tmp_cancer t, ae_institucion eg
                  WHERE t.eg=eg.institucion_id $w$
                  GROUP BY 1,2) AS tt
                  LEFT JOIN tmp_cancer_poblacion p ON (tt.ente_gestor = p.ente_gestor)
                  order by 3       
        `, 
        acancer_dpto:`SELECT  d.nombre_dpto as pila, eg.nombre_corto as ejex ,COUNT(*) AS value
      FROM tmp_cancer t, al_departamento d , ae_institucion eg
		WHERE d.cod_dpto = t.dpto	and t.eg=eg.institucion_id
$w$
      GROUP BY 1,2
      ORDER BY 1,2`,
      
      },
      referer: [],
      primal: {
        equivalencia: {
          gestion: ["to_char(t.fecha_diagnostico, 'YYYY')", "to_char(t.fecha_diagnostico, 'YYYY')"],
          periodo: ["to_char(t.fecha_diagnostico, 'YYYY-MM')", "to_char(t.fecha_diagnostico, 'YYYY-MM')"],
          eg: ['t.eg', 't.eg'],
          dpto: ['i.dpto', 'i.dpto'],
          eess: ['i.eess', 'i.eess'],
        },
        query: `SELECT $sa$`,
        headers: [{}],
        attributes: null,
      },
      withInitial: true,
    },
    acancer: {
      alias: 'acancer',
      campos: cmps,
      ilogic: {      
        acancer: `SELECT 
coalesce(t.localizacion, 'Unknow')  AS grupo, 
 dpto.nombre_dpto as subgrupo,
eg.nombre_corto AS "institucion",
t.edad_recodificada AS grupo_etario,
case WHEN t.genero='M' THEN 'Masculino' WHEN t.genero='F' THEN 'Femenino' ELSE 'unknow' end  AS genero ,
count(*) AS value

FROM tmp_cancer t, ae_institucion i, ae_institucion eg, al_departamento dpto,

(SELECT coalesce(t.localizacion, 'Unknow') as causa_directa, COUNT(*)
FROM tmp_cancer t, ae_institucion i, ae_institucion eg, al_departamento dpto
WHERE 
t.eess =  i.institucion_id AND t.eg= i.institucion_root
AND i.institucion_root =  eg.institucion_id
AND i.cod_pais =  dpto.cod_pais AND i.cod_dpto =  dpto.cod_dpto
$w$
GROUP BY 1
ORDER BY 2 DESC
LIMIT 10) AS tt2
WHERE 
t.eess =  i.institucion_id AND t.eg= i.institucion_root
AND i.institucion_root =  eg.institucion_id
AND i.cod_pais =  dpto.cod_pais AND i.cod_dpto =  dpto.cod_dpto
$w$
AND coalesce(t.localizacion, 'Unknow') =  tt2.causa_directa
GROUP BY 1,2, 3, 4,5
ORDER BY 1,2,3
        `
      },
      referer: [],
      primal: {
        equivalencia: {
          gestion: ["to_char(t.fecha_diagnostico, 'YYYY')", "to_char(t.fecha_diagnostico, 'YYYY')"],
          periodo: ["to_char(t.fecha_diagnostico, 'YYYY-MM')", "to_char(t.fecha_diagnostico, 'YYYY-MM')"],
          eg: ['i.institucion_root', 'i.institucion_root'],
          dpto: ['i.cod_dpto', 'i.cod_dpto'],
          eess: ['i.institucion_id', 'i.institucion_id'],
        },
        query: `SELECT $sa$`,
        headers: [{}],
        attributes: null,
      },
      withInitial: true,
    },
    apai_vacun: {
      alias: 'apai_vacun',
      campos: cmps,
      ilogic: {      
        apai_vacun: `SELECT 
t.vacuna  AS grupo, 
t.nro_dosis AS subtercero,
 dpto.nombre_dpto as subgrupo,
eg.nombre_corto AS "institucion",

 CASE
 WHEN t.edad>=0 AND  t.edad<=0.25 THEN '.00m-03m'
 WHEN t.edad>0.25 AND  t.edad<=0.5 THEN '.04m-06m'
 WHEN t.edad>0.5 AND  t.edad<=0.75 THEN '.07m-09m'
 WHEN t.edad>0.75 AND  t.edad<=1 THEN '.10m-12m'
WHEN t.edad>1 AND  t.edad<=5 THEN '00-05'
WHEN t.edad>5 AND  t.edad<=10 THEN '00-10'
WHEN t.edad>10 AND  t.edad<=15 THEN '10-15'
WHEN t.edad>15 AND  t.edad<=20 THEN '15-20'
WHEN t.edad>20 and t.edad<=25 THEN '20-25' 
WHEN t.edad>25 and t.edad<=30 THEN '25-30' 
WHEN t.edad>30 and t.edad<=35 THEN '30-35' 
WHEN t.edad>35 and t.edad<=40 THEN '35-40' 
WHEN t.edad>40 and t.edad<=45 THEN '40-45' 
WHEN t.edad>45 and t.edad<=50 THEN '45-50' 
WHEN t.edad>50 and t.edad<=55 THEN '50-55' 
WHEN t.edad>55 and t.edad<=60 THEN '55-60' 
WHEN t.edad>60 and t.edad<=65 THEN '60-65' 
WHEN t.edad>65 and t.edad<=70 THEN '65-70' 
WHEN t.edad>70 and t.edad<=75 THEN '70-75' 
WHEN t.edad>75 and t.edad<=80 THEN '75-80' 
WHEN t.edad>80 and t.edad<=85 THEN '80-85' 
WHEN t.edad>85 THEN '85++' 
 ELSE 'Unknow' END AS grupo_etario,
t.genero AS genero ,
count(*) AS value

FROM tmp_pai t, ae_institucion i, ae_institucion eg, al_departamento dpto
WHERE 
t.eess =  i.institucion_id AND t.eg= i.institucion_root
AND i.institucion_root =  eg.institucion_id
AND i.cod_pais =  dpto.cod_pais AND i.cod_dpto =  dpto.cod_dpto
$w$
GROUP BY 1,2, 3, 4,5,6
ORDER BY 1,2,3,4,5
        `
      },
      referer: [],
      primal: {
        equivalencia: {
          gestion: ["to_char(t.fecha_vacunacion, 'YYYY')", "to_char(t.fecha_vacunacion, 'YYYY')"],
          periodo: ["to_char(t.fecha_vacunacion, 'YYYY-MM')", "to_char(t.fecha_vacunacion, 'YYYY-MM')"],
          eg: ['i.institucion_root', 'i.institucion_root'],
          dpto: ['i.cod_dpto', 'i.cod_dpto'],
          eess: ['i.institucion_id', 'i.institucion_id'],
        },
        query: `SELECT $sa$`,
        headers: [{}],
        attributes: null,
      },
      withInitial: true,
    },
    apai_vacun_pie: {
      alias: 'apai_vacun_pie',
      campos: cmps,
      ilogic: {      
        apai_vacun_pie: `SELECT  vacuna as pila, nro_dosis as ejex, COUNT(*) AS value,
      SUM(COUNT(*)) OVER (PARTITION BY vacuna ORDER BY vacuna ) AS total_acumulado
      FROM tmp_pai t WHERE 1=1 $w$
      GROUP BY 1,2
      ORDER BY 1,2
        `
      },
      referer: [],
      primal: {
        equivalencia: {
          gestion: ["to_char(t.fecha_vacunacion, 'YYYY')", "to_char(t.fecha_vacunacion, 'YYYY')"],
          periodo: ["to_char(t.fecha_vacunacion, 'YYYY-MM')", "to_char(t.fecha_vacunacion, 'YYYY-MM')"],
          eg: ['t.eg', 't.eg'],
          dpto: ['t.dpto', 't.dpto'],
          eess: ['t.eess', 't.eess'],
        },
        query: `SELECT $sa$`,
        headers: [{}],
        attributes: null,
      },
      withInitial: true,
    },
    apai_vacun_dpeg: {
      alias: 'apai_vacun_dpeg',
      campos: cmps,
      ilogic: {      
        apai_vacun_dpeg: `SELECT  d.nombre_dpto as pila, eg.nombre_corto as ejex ,COUNT(*) AS value
      FROM tmp_pai t, al_departamento d , ae_institucion eg
		WHERE d.cod_dpto = t.dpto	and t.eg=eg.institucion_id
$w$
      GROUP BY 1,2
      ORDER BY 1,2
        `,
        apai_vacun_hetario: `SELECT 
                genero as ejex,
                SUM(CASE WHEN cast(edad as DECIMAL) >=0 and cast(edad as DECIMAL)<=0.25 THEN 1 ELSE 0 END)as "0m-3m",
                SUM(CASE WHEN cast(edad as DECIMAL) >0.25 and cast(edad as DECIMAL)<=0.50 THEN 1 ELSE 0 END)AS "4m-6m",
                SUM(CASE WHEN cast(edad as DECIMAL) >0.50 and cast(edad as DECIMAL)<=0.75 THEN 1 ELSE 0 END)AS "7m-9m",
                SUM(CASE WHEN cast(edad as DECIMAL) >0.75 and cast(edad as DECIMAL)<=1 THEN 1 ELSE 0 END)AS "10m-12m",

                SUM(CASE WHEN cast(edad as decimal) >1 and cast(edad as decimal)<=5 THEN 1 ELSE 0 END)as "1-5",
                SUM(CASE WHEN cast(edad as decimal) >5 and cast(edad as decimal)<=10 THEN 1 ELSE 0 END) as "5-10",
                SUM(CASE WHEN cast(edad as decimal) >10 and cast(edad as decimal)<=15 THEN 1 ELSE 0 END) as "10-15",
                SUM(CASE WHEN cast(edad as decimal) >15 and cast(edad as decimal)<=20 THEN 1 ELSE 0 END) as "15-20",
                SUM(CASE WHEN cast(edad as decimal) >20 and cast(edad as decimal)<=25 THEN 1 ELSE 0 END) as "20-25",
                SUM(CASE WHEN cast(edad as decimal) >25 and cast(edad as decimal)<=30 THEN 1 ELSE 0 END) as "25-30",
                SUM(CASE WHEN cast(edad as decimal) >30 and cast(edad as decimal)<=35 THEN 1 ELSE 0 END) as "30-35",
                SUM(CASE WHEN cast(edad as decimal) >35 and cast(edad as decimal)<=40 THEN 1 ELSE 0 END) as "35-40",
                SUM(CASE WHEN cast(edad as decimal) >40 and cast(edad as decimal)<=45 THEN 1 ELSE 0 END) as "40-45",
                SUM(CASE WHEN cast(edad as decimal) >45 and cast(edad as decimal)<=50 THEN 1 ELSE 0 END) as "45-50",
                SUM(CASE WHEN cast(edad as decimal) >50 and cast(edad as decimal)<=55 THEN 1 ELSE 0 END) as "50-55",
                SUM(CASE WHEN cast(edad as decimal) >55 and cast(edad as decimal)<=60 THEN 1 ELSE 0 END) as "55-60",
                SUM(CASE WHEN cast(edad as decimal) >60 and cast(edad as decimal)<=65 THEN 1 ELSE 0 END) as "60-65",
                SUM(CASE WHEN cast(edad as decimal) >65 and cast(edad as decimal)<=70 THEN 1 ELSE 0 END) as "65-70",
                SUM(CASE WHEN cast(edad as decimal) >70 and cast(edad as decimal)<=75 THEN 1 ELSE 0 END) as "70-75",
                SUM(CASE WHEN cast(edad as decimal) >75 and cast(edad as decimal)<=80 THEN 1 ELSE 0 END) as "75-80",
                SUM(CASE WHEN cast(edad as decimal) >80 and cast(edad as decimal)<=85 THEN 1 ELSE 0 END) as "80-85",
                SUM(CASE WHEN cast(edad as decimal) >85  THEN 1 ELSE 0 END) as "85++"
                FROM tmp_pai t
                WHERE 1=1 $w$
                GROUP BY genero`,
        apai_day: `SELECT TO_CHAR(fecha_vacunacion, 'YYYY-MM-DD') as ejex,  COUNT (*) AS value,
                TO_CHAR((select MAX(fecha_vacunacion) FROM tmp_pai),'DD/MM/YYYY') AS obs
                FROM tmp_pai t
                WHERE 1=1 $w$
                GROUP BY 1
                ORDER BY 1`        
      },
      referer: [],
      primal: {
        equivalencia: {
          gestion: ["to_char(t.fecha_vacunacion, 'YYYY')", "to_char(t.fecha_vacunacion, 'YYYY')"],
          periodo: ["to_char(t.fecha_vacunacion, 'YYYY-MM')", "to_char(t.fecha_vacunacion, 'YYYY-MM')"],
          eg: ['t.eg', 't.eg'],
          dpto: ['t.dpto', 't.dpto'],
          eess: ['t.eess', 't.eess'],
        },
        query: `SELECT $sa$`,
        headers: [{}],
        attributes: null,
      },
      withInitial: true,
    },
    acarmelo: {
      alias: 'acarmelo',
      campos: cmps,
      ilogic: {      
        acarmelo: `SELECT eg.nombre_corto as pila,  extract(year from fecha_dispensacion) AS ejex, COUNT(*) AS value					 
                FROM tmp_carmelo t, ae_institucion eg
                WHERE t.eg=eg.institucion_id
                $w$
                GROUP BY 1,2
                ORDER BY 1, 2`,
      acarmelo_gesdpto: `SELECT dpto.nombre_dpto as pila,  extract(year from fecha_dispensacion) AS ejex, COUNT(*) AS value					 
                FROM tmp_carmelo t, al_departamento dpto
                WHERE t.dpto=dpto.cod_dpto
                $w$
                GROUP BY 1,2
                ORDER BY 1, 2`,
      acarmelo_genero: `SELECT genero as pila,  COUNT(*) AS value,
                SUM(COUNT(*)) OVER (PARTITION BY genero ORDER BY genero ) AS total_acumulado					 
                        FROM tmp_carmelo t
                        WHERE 1=1 $w$
                        GROUP BY 1
                        ORDER BY 1`,
      acarmelo_genero_dpto: `SELECT dpto.nombre_dpto as pila, genero AS ejex, COUNT(*) AS value					 
                        FROM tmp_carmelo t, al_departamento dpto
                        WHERE t.dpto = dpto.cod_dpto
                        $w$
                        GROUP BY 1,2
                        ORDER BY 3 DESC,1,2  `
      },
      referer: [],
      primal: {
        equivalencia: {
          gestion: ["to_char(t.fecha_dispensacion, 'YYYY')", "to_char(t.fecha_dispensacion, 'YYYY')"],
          periodo: ["to_char(t.fecha_dispensacion, 'YYYY-MM')", "to_char(t.fecha_dispensacion, 'YYYY-MM')"],
          eg: ['t.eg', 't.eg'],
          dpto: ['t.dpto', 't.dpto'],
          eess: ['t.eess', 't.eess'],
        },
        query: `SELECT $sa$`,
        headers: [{}],
        attributes: null,
      },
      withInitial: true,
    },

    aneumonia: {
      alias: 'aneumonia',
      campos: cmps,
      ilogic: {        
        infec_casos: infecciones_dash.dash_neumonia.ilogic.infec_casos,
        infec_dpto: infecciones_dash.dash_neumonia.ilogic.infec_dpto,
        infec_gestion: infecciones_dash.dash_neumonia.ilogic.infec_gestion,
      },
      referer: [],
      primal: {
        equivalencia: {
          gestion: ["gestion", "gestion"],
          periodo: ["to_char(TO_DATE(gestion||'-'||semana, 'IYYY-IW'), 'YYYY-MM')", "to_char(TO_DATE(gestion||'-'||semana, 'IYYY-IW'), 'YYYY-MM')"],        
          dpto: ['dpto', 'dpto']  
        },
        query: `SELECT $sa$`,
        headers: [{}],
        attributes: null,
      },
      withInitial: true,
    },
    aneumonia_qf: {
      alias: 'aneumonia_qf',
      campos: cmps,
      ilogic: {
        infec_quartil: infecciones_dash.dash_neumonia.ilogic.infec_quartil,
        infec_frecuencia: infecciones_dash.dash_neumonia.ilogic.infec_frecuencia,      
        
      },
      referer: [],
      primal: {
        equivalencia: {
          gestion: ["gestion", "gestion"],
          periodo: ["to_char(TO_DATE(gestion||'-'||semana, 'IYYY-IW'), 'YYYY-MM')", "to_char(TO_DATE(gestion||'-'||semana, 'IYYY-IW'), 'YYYY-MM')"],        
          dpto: ['dpto', 'dpto']  
        },
        query: `SELECT $sa$`,
        headers: [{}],
        attributes: null,
      },
      withInitial: true,
    },
    aneumonia_dpto: {
      alias: 'aneumonia_dpto',
      campos: cmps,
      ilogic: {
        infec_dpto_q: infecciones_dash.dash_neumonia.ilogic.infec_dpto_q
      },
      referer: [],
      primal: {
        equivalencia: {
          gestion: ["gestion", "gestion"],
          periodo: ["to_char(TO_DATE(gestion||'-'||semana, 'IYYY-IW'), 'YYYY-MM')", "to_char(TO_DATE(gestion||'-'||semana, 'IYYY-IW'), 'YYYY-MM')"],        
          dpto: ['dpto', 'dpto']  
        },
        query: `SELECT $sa$`,
        headers: [{}],
        attributes: null,
      },
      withInitial: true,
    },

    airas: {
      alias: 'airas',
      campos: cmps,
      ilogic: {        
        infec_casos: infecciones_dash.dash_iras.ilogic.infec_casos,
        infec_dpto: infecciones_dash.dash_iras.ilogic.infec_dpto,
        infec_gestion: infecciones_dash.dash_iras.ilogic.infec_gestion,
      },
      referer: [],
      primal: {
        equivalencia: {
          gestion: ["gestion", "gestion"],
          periodo: ["to_char(TO_DATE(gestion||'-'||semana, 'IYYY-IW'), 'YYYY-MM')", "to_char(TO_DATE(gestion||'-'||semana, 'IYYY-IW'), 'YYYY-MM')"],        
          dpto: ['dpto', 'dpto']  
        },
        query: `SELECT $sa$`,
        headers: [{}],
        attributes: null,
      },
      withInitial: true,
    },
    airas_qf: {
      alias: 'airas_qf',
      campos: cmps,
      ilogic: {
        infec_quartil: infecciones_dash.dash_iras.ilogic.infec_quartil,
        infec_frecuencia: infecciones_dash.dash_iras.ilogic.infec_frecuencia,      
        
      },
      referer: [],
      primal: {
        equivalencia: {
          gestion: ["gestion", "gestion"],
          periodo: ["to_char(TO_DATE(gestion||'-'||semana, 'IYYY-IW'), 'YYYY-MM')", "to_char(TO_DATE(gestion||'-'||semana, 'IYYY-IW'), 'YYYY-MM')"],        
          dpto: ['dpto', 'dpto']  
        },
        query: `SELECT $sa$`,
        headers: [{}],
        attributes: null,
      },
      withInitial: true,
    },
    airas_dpto: {
      alias: 'airas_dpto',
      campos: cmps,
      ilogic: {
        infec_dpto_q: infecciones_dash.dash_iras.ilogic.infec_dpto_q
      },
      referer: [],
      primal: {
        equivalencia: {
          gestion: ["gestion", "gestion"],
          periodo: ["to_char(TO_DATE(gestion||'-'||semana, 'IYYY-IW'), 'YYYY-MM')", "to_char(TO_DATE(gestion||'-'||semana, 'IYYY-IW'), 'YYYY-MM')"],        
          dpto: ['dpto', 'dpto']  
        },
        query: `SELECT $sa$`,
        headers: [{}],
        attributes: null,
      },
      withInitial: true,
    },

    aedas: {
      alias: 'aedas',
      campos: cmps,
      ilogic: {        
        infec_casos: infecciones_dash.dash_edas.ilogic.infec_casos,
        infec_dpto: infecciones_dash.dash_edas.ilogic.infec_dpto,
        infec_gestion: infecciones_dash.dash_edas.ilogic.infec_gestion,
      },
      referer: [],
      primal: {
        equivalencia: {
          gestion: ["gestion", "gestion"],
          periodo: ["to_char(TO_DATE(gestion||'-'||semana, 'IYYY-IW'), 'YYYY-MM')", "to_char(TO_DATE(gestion||'-'||semana, 'IYYY-IW'), 'YYYY-MM')"],        
          dpto: ['dpto', 'dpto']  
        },
        query: `SELECT $sa$`,
        headers: [{}],
        attributes: null,
      },
      withInitial: true,
    },
    aedas_qf: {
      alias: 'aedas_qf',
      campos: cmps,
      ilogic: {
        infec_quartil: infecciones_dash.dash_edas.ilogic.infec_quartil,
        infec_frecuencia: infecciones_dash.dash_edas.ilogic.infec_frecuencia,      
        
      },
      referer: [],
      primal: {
        equivalencia: {
          gestion: ["gestion", "gestion"],
          periodo: ["to_char(TO_DATE(gestion||'-'||semana, 'IYYY-IW'), 'YYYY-MM')", "to_char(TO_DATE(gestion||'-'||semana, 'IYYY-IW'), 'YYYY-MM')"],        
          dpto: ['dpto', 'dpto']  
        },
        query: `SELECT $sa$`,
        headers: [{}],
        attributes: null,
      },
      withInitial: true,
    },
    aedas_dpto: {
      alias: 'aedas_dpto',
      campos: cmps,
      ilogic: {
        infec_dpto_q: infecciones_dash.dash_iras.ilogic.infec_dpto_q
      },
      referer: [],
      primal: {
        equivalencia: {
          gestion: ["gestion", "gestion"],
          periodo: ["to_char(TO_DATE(gestion||'-'||semana, 'IYYY-IW'), 'YYYY-MM')", "to_char(TO_DATE(gestion||'-'||semana, 'IYYY-IW'), 'YYYY-MM')"],        
          dpto: ['dpto', 'dpto']  
        },
        query: `SELECT $sa$`,
        headers: [{}],
        attributes: null,
      },
      withInitial: true,
    },
  }
  module.exports = PDEPENDENCIES
  