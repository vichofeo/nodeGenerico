const cmps = {
  gestion: ['GESTION', false, true, 'C'],
  periodo: ['MES', false, true, 'C', , , 'M'],
  eg: ['Ente Gestor', false, true, 'C', , , 'M'],
  dpto: ['Departamento', false, true, 'C', , , 'M'],
  eess: ['Establecimiento de Salud', false, true, 'C', , , 'M'],
}
const infecciones_dash = require('./params_cboxsDash')
//extraCondicion:[[campo, valor], [campo2, valor]...]
'use strict'
const PDEPENDENCIES = {
  adefuncion: {
    alias: 'adefuncion',
    campos: cmps,
    title_obj: { title: '10 PRINCIPALES CAUSAS DE DEFUNCION', subtitle: 'En el periodo de' },
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
        `,
      entre_periodos: `SELECT to_char(MIN(t.fecha_defuncion),'DD/MM/YYYY') AS amin, to_char(MAX(t.fecha_defuncion),'DD/MM/YYYY') AS amax
FROM tmp_defunciones t, ae_institucion i,
(SELECT coalesce(t.causa_directa, 'Unknow') as causa_directa, COUNT(*)
FROM tmp_defunciones t, ae_institucion i
WHERE 
t.eess =  i.institucion_id 
$w$
GROUP BY 1
ORDER BY 2 DESC
LIMIT 10) AS tt2
WHERE 
t.eess =  i.institucion_id 
$w$
AND coalesce(t.causa_directa, 'Unknow') =  tt2.causa_directa`
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
    title_obj: { title: 'NUMERO DE DEFUNCIONES', subtitle: 'En el periodo de' },
    ilogic: {
      adef_lineas: `
        SELECT TO_CHAR(t.fecha_defuncion, 'YYYY-MM-DD') as ejex,  COUNT (*) AS value,
                TO_CHAR((select MAX(fecha_defuncion) FROM tmp_defunciones),'DD/MM/YYYY') AS obs
                FROM tmp_defunciones t
                WHERE 1=1 $w$
                GROUP BY 1
                ORDER BY 1
        `,
      adef_dpto: `SELECT  d.nombre_dpto as pila, eg.nombre_corto as ejex ,COUNT(*) AS value
      FROM tmp_defunciones t, al_departamento d , ae_institucion eg
		WHERE d.cod_dpto = t.dpto	and t.eg=eg.institucion_id
$w$
      GROUP BY 1,2
      ORDER BY 1,2`,
      adef_etario: `SELECT 
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
                GROUP BY t.sexo`,
      entre_periodos: `SELECT to_char(MIN(t.fecha_defuncion),'DD/MM/YYYY') AS amin, to_char(MAX(t.fecha_defuncion),'DD/MM/YYYY') AS amax
       FROM tmp_defunciones t
                WHERE 1=1 $w$`
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["to_char(t.fecha_defuncion, 'YYYY')", "to_char(t.fecha_defuncion, 'YYYY')"],
        periodo: ["to_char(t.fecha_defuncion, 'YYYY-MM')", "to_char(t.fecha_defuncion, 'YYYY-MM')"],
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
  adef_nrodef: {
    alias: 'adef_nrodef',
    campos: cmps,
    title_obj: { title: 'DEFUNCIONES POR DEPARTAMENTO', subtitle: 'Comprendidas en el periodo' },
    ilogic: {
      adef_nrodef: `SELECT 
          t.ente_gestor_name AS row_index, upper(substr(t.sexo,1,1)) AS col_head2, t.departamento as col_head1,
          COUNT(*) AS value
          FROM tmp_defunciones t
          WHERE 
          1=1 $w$
          GROUP BY 1,2,3
          ORDER BY 1,2,3
                `,
      entre_periodos: `SELECT to_char(MIN(t.fecha_defuncion),'DD/MM/YYYY') AS amin, to_char(MAX(t.fecha_defuncion),'DD/MM/YYYY') AS amax
       FROM tmp_defunciones t
                WHERE 1=1 $w$`
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["to_char(t.fecha_defuncion, 'YYYY')", "to_char(t.fecha_defuncion, 'YYYY')"],
        periodo: ["to_char(t.fecha_defuncion, 'YYYY-MM')", "to_char(t.fecha_defuncion, 'YYYY-MM')"],
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
  anac_lineas: {
    alias: 'anac_lineas',
    campos: cmps,
    title_obj: { title: 'NUMERO DE NACIMIENTOS', subtitle: 'En el periodo de' },
    ilogic: {
      anac_lineas: ` SELECT TO_CHAR(t.fecha_nacimiento, 'YYYY-MM-DD') as ejex,  COUNT (*) AS value,
                TO_CHAR((select MAX(fecha_nacimiento) FROM tmp_nacimientos),'DD/MM/YYYY') AS obs
                FROM tmp_nacimientos t
                WHERE 1=1 $w$
                GROUP BY 1
                ORDER BY 1       
        `,
      anac_dpto: `SELECT  d.nombre_dpto as pila, eg.nombre_corto as ejex ,COUNT(*) AS value
      FROM tmp_nacimientos t, al_departamento d , ae_institucion eg
		WHERE d.cod_dpto = t.dpto	and t.eg=eg.institucion_id
$w$
      GROUP BY 1,2
      ORDER BY 1,2`,
      anac_etario: `SELECT 
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
                GROUP BY t.sexo`,
      entre_periodos: `SELECT to_char(MIN(t.fecha_nacimiento),'DD/MM/YYYY') AS amin, to_char(MAX(t.fecha_nacimiento),'DD/MM/YYYY') AS amax
       FROM tmp_nacimientos t
                WHERE 1=1 $w$`
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["to_char(t.fecha_nacimiento, 'YYYY')", "to_char(t.fecha_nacimiento, 'YYYY')"],
        periodo: ["to_char(t.fecha_nacimiento, 'YYYY-MM')", "to_char(t.fecha_nacimiento, 'YYYY-MM')"],
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
  anac_nronac: {
    alias: 'anac_nronac',
    campos: cmps,
    title_obj: { title: 'NACIMIENTOS POR DEPARTAMENTO', subtitle: 'Comprendidas en el periodo' },
    ilogic: {
      anac_nronac: `SELECT 
          t.ente_gestor_name AS row_index, upper(substr(t.sexo,1,1)) AS col_head2, t.departamento as col_head1,
          COUNT(*) AS value
          FROM tmp_nacimientos t
          WHERE 
          1=1 $w$
          GROUP BY 1,2,3
          ORDER BY 1,2,3
                `,
      entre_periodos: `SELECT to_char(MIN(t.fecha_nacimiento),'DD/MM/YYYY') AS amin, to_char(MAX(t.fecha_nacimiento),'DD/MM/YYYY') AS amax
       FROM tmp_defunciones t
                WHERE 1=1 $w$`
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["to_char(t.fecha_nacimiento, 'YYYY')", "to_char(t.fecha_nacimiento, 'YYYY')"],
        periodo: ["to_char(t.fecha_nacimiento, 'YYYY-MM')", "to_char(t.fecha_nacimiento, 'YYYY-MM')"],
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


  apai_vacun: {
    alias: 'apai_vacun',
    campos: cmps,
    title_obj: { title: 'VACUNAS - PAI', subtitle: 'Datos de' },
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
        `,
      entre_periodos: `SELECT to_char(MIN(t.fecha_vacunacion), 'DD/MM/YYYY') as amin, to_char(MAX(t.fecha_vacunacion), 'DD/MM/YYYY') as amax
    FROM tmp_pai t, ae_institucion i
WHERE t.eess =  i.institucion_id $w$`
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
    title_obj: { title: 'VACUNAS - DOSIS APLICADAS', subtitle: 'Datos de' },
    ilogic: {
      apai_vacun_pie: `SELECT  vacuna as pila, nro_dosis as ejex, COUNT(*) AS value,
      SUM(COUNT(*)) OVER (PARTITION BY vacuna ORDER BY vacuna ) AS total_acumulado
      FROM tmp_pai t WHERE 1=1 $w$
      GROUP BY 1,2
      ORDER BY 1,2
        `,
      entre_periodos: `SELECT to_char(MIN(t.fecha_vacunacion), 'DD/MM/YYYY') as amin, to_char(MAX(t.fecha_vacunacion), 'DD/MM/YYYY') as amax
      FROM tmp_pai t WHERE 1=1 $w$`
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
    title_obj: { title: 'DATOS - PAI', subtitle: 'Informacion de ' },
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
                ORDER BY 1`,
      entre_periodos: `SELECT to_char(MIN(t.fecha_vacunacion), 'DD/MM/YYYY') as amin, to_char(MAX(t.fecha_vacunacion), 'DD/MM/YYYY') as amax
      FROM tmp_pai t WHERE 1=1 $w$`
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
    title_obj: { title: 'BENEFICIO CARMELO', subtitle: 'Datos de' },
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
                        ORDER BY 3 DESC,1,2  `,
      entre_periodos: `SELECT to_char(min(t.fecha_dispensacion), 'DD/MM/YYYY') AS amin, to_char(max(t.fecha_dispensacion), 'DD/MM/YYYY') AS amax
                        FROM tmp_carmelo t, ae_institucion eg
                WHERE t.eg=eg.institucion_id AND t.fecha_dispensacion <> '1900-01-01'
                $w$`
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

  //canales endemicos
  aneumonia_count: {
    alias: 'aneumonia_count',
    campos: cmps,
    title_obj: { title: 'NUMERO DE CASOS DE NEUMONIA POR GESTION ', subtitle: 'Semana de' },
    ilogic: {
      infec_casos: infecciones_dash.dash_neumonia.ilogic.infec_casos,
      entre_periodos: `SELECT  to_char(MIN(TO_DATE(gestion||'-'||semana, 'IYYY-IW')), 'IYYY-IW') AS amin, to_char(Max(TO_DATE(gestion||'-'||semana, 'IYYY-IW')), 'IYYY-IW') AS amax
               FROM tmp_infecciones 
                WHERE infeccion='NEUMONIA' $w$`
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
  aneumonia_gral: {
    alias: 'aneumonia_gral',
    campos: cmps,
    title_obj: { title: 'REPORTE DE NEUMONIA ', subtitle: 'Por departamento, por Gestión de semana ' },
    ilogic: {
      infec_dpto: infecciones_dash.dash_neumonia.ilogic.infec_dpto,
      infec_gestion: infecciones_dash.dash_neumonia.ilogic.infec_gestion,
      entre_periodos: `SELECT  to_char(MIN(TO_DATE(gestion||'-'||semana, 'IYYY-IW')), 'IYYY-IW') AS amin, to_char(Max(TO_DATE(gestion||'-'||semana, 'IYYY-IW')), 'IYYY-IW') AS amax
               FROM tmp_infecciones 
                WHERE infeccion='NEUMONIA' $w$`
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
    title_obj: { title: 'CANALES ENDEMICOS - NEUMONIA', subtitle: 'Informacion semanal de ' },
    ilogic: {
      infec_quartil: infecciones_dash.dash_neumonia.ilogic.infec_quartil,
      infec_frecuencia: infecciones_dash.dash_neumonia.ilogic.infec_frecuencia,
      entre_periodos: `SELECT  to_char(MIN(TO_DATE(gestion||'-'||semana, 'IYYY-IW')), 'IYYY-IW') AS amin, to_char(Max(TO_DATE(gestion||'-'||semana, 'IYYY-IW')), 'IYYY-IW') AS amax
               FROM tmp_infecciones 
                WHERE infeccion='NEUMONIA' $w$`

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
    title_obj: { title: 'CANALES ENDEMICOS - NEUMONIA DEPARTAMENTALES', subtitle: 'Informacion semanal de ' },
    ilogic: {
      infec_dpto_q: infecciones_dash.dash_neumonia.ilogic.infec_dpto_q,
      entre_periodos: `SELECT  to_char(MIN(TO_DATE(gestion||'-'||semana, 'IYYY-IW')), 'IYYY-IW') AS amin, to_char(Max(TO_DATE(gestion||'-'||semana, 'IYYY-IW')), 'IYYY-IW') AS amax
               FROM tmp_infecciones 
                WHERE infeccion='NEUMONIA' $w$`
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

  airas_gral: {
    alias: 'airas_gral',
    campos: cmps,
    title_obj: { title: 'REPORTE DE IRA´s ', subtitle: 'Por departamento, por Gestión de semana ' },
    ilogic: {
      infec_dpto: infecciones_dash.dash_iras.ilogic.infec_dpto,
      infec_gestion: infecciones_dash.dash_iras.ilogic.infec_gestion,
      entre_periodos: `SELECT  to_char(MIN(TO_DATE(gestion||'-'||semana, 'IYYY-IW')), 'IYYY-IW') AS amin, to_char(Max(TO_DATE(gestion||'-'||semana, 'IYYY-IW')), 'IYYY-IW') AS amax
               FROM tmp_infecciones 
                WHERE infeccion='IRAS' $w$`
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
  airas_count: {
    alias: 'airas_count',
    campos: cmps,
    title_obj: { title: 'NUMERO DE CASOS DE IRA´s POR GESTION ', subtitle: 'Semana de' },
    ilogic: {
      infec_casos: infecciones_dash.dash_iras.ilogic.infec_casos,
      entre_periodos: `SELECT  to_char(MIN(TO_DATE(gestion||'-'||semana, 'IYYY-IW')), 'IYYY-IW') AS amin, to_char(Max(TO_DATE(gestion||'-'||semana, 'IYYY-IW')), 'IYYY-IW') AS amax
               FROM tmp_infecciones 
                WHERE infeccion='IRAS' $w$`
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
    title_obj: { title: 'CANALES ENDEMICOS - IRA´s', subtitle: 'Informacion semanal de ' },
    ilogic: {
      infec_quartil: infecciones_dash.dash_iras.ilogic.infec_quartil,
      infec_frecuencia: infecciones_dash.dash_iras.ilogic.infec_frecuencia,
      entre_periodos: `SELECT  to_char(MIN(TO_DATE(gestion||'-'||semana, 'IYYY-IW')), 'IYYY-IW') AS amin, to_char(Max(TO_DATE(gestion||'-'||semana, 'IYYY-IW')), 'IYYY-IW') AS amax
               FROM tmp_infecciones 
                WHERE infeccion='IRAS' $w$`

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
    title_obj: { title: 'CANALES ENDEMICOS - IRA´s DEPARTAMENTALES', subtitle: 'Informacion semanal de ' },
    ilogic: {
      infec_dpto_q: infecciones_dash.dash_iras.ilogic.infec_dpto_q,
      entre_periodos: `SELECT  to_char(MIN(TO_DATE(gestion||'-'||semana, 'IYYY-IW')), 'IYYY-IW') AS amin, to_char(Max(TO_DATE(gestion||'-'||semana, 'IYYY-IW')), 'IYYY-IW') AS amax
               FROM tmp_infecciones 
                WHERE infeccion='IRAS' $w$`
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
  //edas
  aedas_gral: {
    alias: 'aedas_gral',
    campos: cmps,
    title_obj: { title: 'REPORTE DE EDA´s ', subtitle: 'Por departamento, por Gestión de semana ' },
    ilogic: {

      infec_dpto: infecciones_dash.dash_edas.ilogic.infec_dpto,
      infec_gestion: infecciones_dash.dash_edas.ilogic.infec_gestion,
      entre_periodos: `SELECT  to_char(MIN(TO_DATE(gestion||'-'||semana, 'IYYY-IW')), 'IYYY-IW') AS amin, to_char(Max(TO_DATE(gestion||'-'||semana, 'IYYY-IW')), 'IYYY-IW') AS amax
               FROM tmp_infecciones 
                WHERE infeccion='EDAS' $w$`
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
  aedas_count: {
    alias: 'aedas_count',
    campos: cmps,
    title_obj: { title: 'NUMERO DE CASOS DE EDA´s POR GESTION ', subtitle: 'Semana de' },
    ilogic: {
      infec_casos: infecciones_dash.dash_edas.ilogic.infec_casos,
      entre_periodos: `SELECT  to_char(MIN(TO_DATE(gestion||'-'||semana, 'IYYY-IW')), 'IYYY-IW') AS amin, to_char(Max(TO_DATE(gestion||'-'||semana, 'IYYY-IW')), 'IYYY-IW') AS amax
               FROM tmp_infecciones 
                WHERE infeccion='EDAS' $w$`
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
    title_obj: { title: 'CANALES ENDEMICOS - EDA´s', subtitle: 'Informacion semanal de ' },
    ilogic: {
      infec_quartil: infecciones_dash.dash_edas.ilogic.infec_quartil,
      infec_frecuencia: infecciones_dash.dash_edas.ilogic.infec_frecuencia,
      entre_periodos: `SELECT  to_char(MIN(TO_DATE(gestion||'-'||semana, 'IYYY-IW')), 'IYYY-IW') AS amin, to_char(Max(TO_DATE(gestion||'-'||semana, 'IYYY-IW')), 'IYYY-IW') AS amax
               FROM tmp_infecciones 
                WHERE infeccion='EDAS' $w$`

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
    title_obj: { title: 'CANALES ENDEMICOS - EDA´s DEPARTAMENTALES', subtitle: 'Informacion semanal de ' },
    ilogic: {
      infec_dpto_q: infecciones_dash.dash_iras.ilogic.infec_dpto_q,
      entre_periodos: `SELECT  to_char(MIN(TO_DATE(gestion||'-'||semana, 'IYYY-IW')), 'IYYY-IW') AS amin, to_char(Max(TO_DATE(gestion||'-'||semana, 'IYYY-IW')), 'IYYY-IW') AS amax
               FROM tmp_infecciones 
                WHERE infeccion='EDAS' $w$`
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

  //VCUNATORIOS
  avacunatorio: {
    alias: 'avacunatorio',
    campos: {
      eg: ['Ente Gestor', false, true, 'C', , , 'M'],
      dpto: ['Departamento', false, true, 'C', , , 'M'],
      eess: ['Establecimiento de Salud', false, true, 'C', , , 'M'],
    },
    title_obj: { title: 'VACUNATORIOS DE LA SSCP', subtitle: ' ' },
    ilogic: {
      /*dataTable: `
          SELECT 
v.departamento, v.municipio, v.institucion, v.establecimiento, direccion, lat, lng,
v.telefono, v.horarios
FROM tmp_vacunatorio v
WHERE 1=1
$w$
order by v.departamento, v.municipio,  v.institucion, v.establecimiento
          `,*/
          dataTable:`SELECT
dpto.nombre_dpto AS departamento, eg.nombre_corto AS institucion, i.nombre_institucion AS establecimiento,
i.zona_barrio ||' '||COALESCE(i.avenida_calle) AS direccion,
i.latitud AS lat, i.longitud AS lng, 
i.telefono, i.direccion_web AS horarios
FROM ae_institucion eg, ae_institucion i, al_departamento dpto, r_institucion_salud r
WHERE 
r.institucion_id=i.institucion_id
AND i.institucion_root= eg.institucion_id
AND i.cod_pais=dpto.cod_pais AND i.cod_dpto= dpto.cod_dpto
AND r.vacunatorio=TRUE  $w$
order by dpto.cod_dpto`,
     /* entre_periodos: `SELECT 
STRING_AGG(DISTINCT v.departamento, ', ' ORDER BY v.departamento) AS amin, '' AS amax
FROM tmp_vacunatorio v WHERE 1=1 $w$
`*/
entre_periodos: `SELECT '' AS amin, '' AS amax`

    },
    keySession: {},
    referer: [],
    primal: {
      equivalencia: {
        eg: ['i.institucion_root', 'i.institucion_root'],
        dpto: ['i.cod_dpto', 'i.cod_dpto'],
        eess: ['i.institucion_id', 'i.institucion_id']
      },
      attributes: null,//`${parameters.rprte_abastecimienton.campos} `,
      query: `SELECT DISTINCT $sa$`,
      headers: [{ value: "departamento", text: "DEPARTAMENTO" },
      { value: "institucion", text: "ENTE GESTOR" },
      { value: "establecimiento", text: "ESTABLECIMIENTO SALUD" },
        //{ value: "direccion", text: "DIRECCIÓN" }
      ],

    },
    withInitial: true,

  },

  //HEMODFILIA
   ahemofilia: {
    alias: 'ahemofilia',
    campos: {
      eg: ['Ente Gestor', false, true, 'C', , , 'M'],
      dpto: ['Departamento', false, true, 'C', , , 'M'],
      eess: ['Establecimiento de Salud', false, true, 'C', , , 'M']
    },
    title_obj: { title: 'CASOS DE HEMOFILIA', subtitle: null },
    ilogic: {
      hemo_eg: `SELECT 
                eg.nombre_corto as pila, 
                tipo_hemofilia AS  ejex, 
					 COUNT(*) AS value
                FROM tmp_hemofilia h, ae_institucion eg
                WHERE h.eg= eg.institucion_id $w$
                GROUP BY 1,2
                ORDER BY 1, 2`,
      hemo_severidad:`SELECT 
      eg.nombre_corto AS ente_gestor , 
SUM(CASE  WHEN  h.grado_severidad= 'LEVE' THEN 1 ELSE 0 END) AS "Leve",
                SUM(CASE WHEN h.grado_severidad= 'MODERADA' THEN 1 ELSE 0 END) AS "Moderada",
                SUM(CASE WHEN h.grado_severidad= 'MODERADA DE COMPORTAMIENTO SEVERO' THEN 1 ELSE 0 END) AS "Moderada Comportamiento Severo",
                SUM(CASE WHEN h.grado_severidad= 'SEVERA' THEN 1 ELSE 0 END) AS "Severa",
                SUM( CASE WHEN h.grado_severidad= 'MODERADA' THEN 0 
                    WHEN h.grado_severidad= 'LEVE' THEN 0
                    WHEN h.grado_severidad= 'MODERADA DE COMPORTAMIENTO SEVERO'  THEN 0
                    WHEN h.grado_severidad= 'SEVERA'  THEN 0
                    ELSE 1 END)  AS  "Unknown"
                FROM tmp_hemofilia h, ae_institucion eg
                WHERE h.eg=eg.institucion_id  $w$
                GROUP BY 1
                ORDER BY 1`,          
      hemo_tipo: `SELECT 
       eg.nombre_corto as pila,                 
              h.tipo_hemofilia AS grupo,
              h.tipo_hemofilia ||' - '||h.grado_severidad  AS  ejex,
              COUNT(*) AS value					 
FROM tmp_hemofilia h, ae_institucion eg
                WHERE h.eg= eg.institucion_id $w$
                GROUP BY 1,2,3
                ORDER BY 1, 2,3 `,
      hemo_dpto: `SELECT d.nombre_dpto as pila,  h.tipo_hemofilia AS ejex, COUNT(*) AS value					 
                FROM tmp_hemofilia h, al_departamento d
                WHERE h.dpto=d.cod_dpto $w$
                GROUP BY 1,2
                ORDER BY 1, 2`,          

      hemo_genero: `SELECT h.tipo_hemofilia as pila, h.genero AS ejex, COUNT(*) AS value					 
                FROM tmp_hemofilia h
                WHERE 1=1 $w$
                GROUP BY 1,2
                UNION 
                SELECT 'A', 'F', 0              
                ORDER BY 1, 2`,
      hemo_tratamiento: `SELECT i.nombre_corto as pila, h.tratamiento_recibido  AS ejex, COUNT(*) AS value					 
                FROM tmp_hemofilia h, ae_institucion i
                WHERE h.eg= i.institucion_id  $w$
                GROUP BY 1,2
                ORDER BY 1, 2`,
entre_periodos: `SELECT  '' AS amin, '' as amax`

    },
    referer: [],
    primal: {
      equivalencia: {        
        eg: ['h.eg', 'h.eg'],
        dpto: ['h.dpto', 'h.dpto'],
        eess: ['h.eess', 'h.eess'],
      },
      query: `SELECT $sa$ `,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },
  //ONCOLOGIA Y RENAL
  //1. Oncologia
  aonco_nr: {
    alias: 'aonco_nr',
    campos: cmps,
    title_obj: { title: 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL', subtitle: 'Fuente: SNIS Información de ' },
    ilogic: {
      aonco_nr: `
        SELECT t.subvariable AS pivot, to_char(to_date(t.gestion||'-'||t.mes, 'YYYY-MM'),'YYYY-MM') AS ejex,
        to_date(t.gestion||'-'||t.mes, 'YYYY-MM'),
        SUM(t.valor) AS value
        FROM tmp_snis302b t
        WHERE t.tipo='MLI'
        AND t.formulario = 'ENFERMEDADES ONCOLOGICAS' $w$
        GROUP BY 1,2,3
        ORDER BY 3,1`,
      aonco_dpto: `SELECT
t.departamento as pila ,
t.departamento   as pivot ,
      t.subvariable as ejex ,
sum(valor) AS value					 
                FROM tmp_snis302b t
                WHERE t.tipo='MLI' AND t.formulario = 'ENFERMEDADES ONCOLOGICAS' 
                $w$
      GROUP BY  1,2,3
      ORDER BY 1,3 `,
      aonco_eg: `SELECT  t.ente_gestor_name as pila , 
t.subvariable  as ejex, 
SUM(t.valor) AS VALUE,
SUM(SUM(t.valor)) OVER (PARTITION BY t.ente_gestor_name ORDER BY t.ente_gestor_name,  t.subvariable ) AS total
                FROM tmp_snis302b t
                WHERE t.tipo='MLI'
        AND t.formulario = 'ENFERMEDADES ONCOLOGICAS' $w$
                GROUP BY 1,2
                ORDER BY 4  `,

      entre_periodos: `SELECT  to_char(MIN(to_date(t.gestion||'-'||t.mes, 'YYYY-MM')), 'YYYY-Month') AS amin, to_char(Max(to_date(t.gestion||'-'||t.mes, 'YYYY-MM')), 'YYYY-Month') AS amax
               FROM tmp_snis302b t WHERE  t.tipo='MLI'
                AND t.formulario = 'ENFERMEDADES ONCOLOGICAS' $w$`
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["t.gestion", "t.gestion"],
        periodo: ["to_char(to_date(t.gestion||'-'||t.mes, 'YYYY-MM'), 'YYYY-MM')", "to_char(to_date(t.gestion||'-'||t.mes, 'YYYY-MM'), 'YYYY-MM')"],
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
  aonco_n: {
    alias: 'aonco_n',
    campos: cmps,
    title_obj: { title: 'REGISTRO DE ENFERMEDADES ONCOLOGICAS - NUEVOS', subtitle: 'Fuente: SNIS Información de ' },
    ilogic: {
      aonco_n: `
SELECT 
t.grupo  AS grupo, 
t.departamento as subgrupo,
t.ente_gestor_name AS "institucion",
t.variable AS grupo_etario,
case WHEN t.lugar_atencion='VARON' THEN 'Masculino' WHEN t.lugar_atencion='MUJER' THEN 'Femenino' ELSE 'unknow' END
AS genero,
SUM(t.valor) AS value
FROM tmp_snis302b t
WHERE t.tipo='MLI'
AND t.formulario = 'ENFERMEDADES ONCOLOGICAS' and t.subvariable='N'
$w$
GROUP BY 1,2, 3, 4,5
ORDER BY 1,2,3,4                
        `,
      entre_periodos: `SELECT  to_char(MIN(to_date(t.gestion||'-'||t.mes, 'YYYY-MM')), 'YYYY-Month') AS amin, to_char(Max(to_date(t.gestion||'-'||t.mes, 'YYYY-MM')), 'YYYY-Month') AS amax
               FROM tmp_snis302b t WHERE  t.tipo='MLI'
                AND t.formulario = 'ENFERMEDADES ONCOLOGICAS' $w$`
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["t.gestion", "t.gestion"],
        periodo: ["to_char(to_date(t.gestion||'-'||t.mes, 'YYYY-MM'), 'YYYY-MM')", "to_char(to_date(t.gestion||'-'||t.mes, 'YYYY-MM'), 'YYYY-MM')"],
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
  aonco_r: {
    alias: 'aonco_r',
    campos: cmps,
    title_obj: { title: 'REGISTRO DE ENFERMEDADES ONCOLOGICAS - REPETIDOS', subtitle: 'Fuente: SNIS Información de ' },
    ilogic: {
      aonco_r: `
SELECT 
t.grupo  AS grupo, 
t.departamento as subgrupo,
t.ente_gestor_name AS "institucion",
t.variable AS grupo_etario,
case WHEN t.lugar_atencion='VARON' THEN 'Masculino' WHEN t.lugar_atencion='MUJER' THEN 'Femenino' ELSE 'unknow' END
AS genero,
SUM(t.valor) AS value
FROM tmp_snis302b t
WHERE t.tipo='MLI'
AND t.formulario = 'ENFERMEDADES ONCOLOGICAS' and t.subvariable='R'
$w$
GROUP BY 1,2, 3, 4,5
ORDER BY 1,2,3,4                
        `,
      entre_periodos: `SELECT  to_char(MIN(to_date(t.gestion||'-'||t.mes, 'YYYY-MM')), 'YYYY-Month') AS amin, to_char(Max(to_date(t.gestion||'-'||t.mes, 'YYYY-MM')), 'YYYY-Month') AS amax
               FROM tmp_snis302b t WHERE  t.tipo='MLI'
                AND t.formulario = 'ENFERMEDADES ONCOLOGICAS' $w$`
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["t.gestion", "t.gestion"],
        periodo: ["to_char(to_date(t.gestion||'-'||t.mes, 'YYYY-MM'), 'YYYY-MM')", "to_char(to_date(t.gestion||'-'||t.mes, 'YYYY-MM'), 'YYYY-MM')"],
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
  aonco_table: {
    alias: 'aonco_table',
    campos: cmps,
    title_obj: { title: 'DATOS DE REGISTRO ENFERMEDADES ONCOLOGICAS', subtitle: 'Fuente: SNIS Información de ' },
    ilogic: {
      aonco_table: `SELECT 
t.ente_gestor_name AS row_index, t.subvariable||'.' AS col_head2, t.departamento as col_head1,
SUM(t.valor) AS value
FROM tmp_snis302b t
WHERE t.tipo='MLI'
AND t.formulario = 'ENFERMEDADES ONCOLOGICAS' $w$
GROUP BY 1,2,3
ORDER BY 1,2,3      
        `,
      entre_periodos: `SELECT  to_char(MIN(to_date(t.gestion||'-'||t.mes, 'YYYY-MM')), 'YYYY-Month') AS amin, to_char(Max(to_date(t.gestion||'-'||t.mes, 'YYYY-MM')), 'YYYY-Month') AS amax
               FROM tmp_snis302b t WHERE  t.tipo='MLI'
                AND t.formulario = 'ENFERMEDADES ONCOLOGICAS' $w$`

    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["t.gestion", "t.gestion"],
        periodo: ["to_char(to_date(t.gestion||'-'||t.mes, 'YYYY-MM'), 'YYYY-MM')", "to_char(to_date(t.gestion||'-'||t.mes, 'YYYY-MM'), 'YYYY-MM')"],
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
  //2.renal
  arenal_nr: {
    alias: 'arenal_nr',
    campos: cmps,
    title_obj: { title: 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL', subtitle: 'Fuente: SNIS Información de ' },
    ilogic: {
      arenal_nr: `
        SELECT t.subvariable AS pivot, to_char(to_date(t.gestion||'-'||t.mes, 'YYYY-MM'),'YYYY-MM') AS ejex,
        to_date(t.gestion||'-'||t.mes, 'YYYY-MM'),
        SUM(t.valor) AS value
        FROM tmp_snis302b t
        WHERE t.tipo='MLI'
        AND t.formulario = 'ENFERMEDAD Y ESTADIO RENAL' $w$
        GROUP BY 1,2,3
        ORDER BY 3,1`,
      aonco_dpto: `SELECT
t.departamento as pila ,
t.departamento   as pivot ,
      t.subvariable as ejex ,
sum(valor) AS value					 
                FROM tmp_snis302b t
                WHERE t.tipo='MLI'
        AND t.formulario = 'ENFERMEDAD Y ESTADIO RENAL' $w$
      GROUP BY  1,2,3
      ORDER BY 1,3 `,
      aonco_eg: `SELECT  t.ente_gestor_name as pila ,
t.subvariable  as ejex, 
SUM(t.valor) AS VALUE,
SUM(SUM(t.valor)) OVER (PARTITION BY t.ente_gestor_name ORDER BY t.ente_gestor_name,  t.subvariable ) AS total
                FROM tmp_snis302b t
                WHERE t.tipo='MLI'
        AND t.formulario = 'ENFERMEDAD Y ESTADIO RENAL' $w$
                GROUP BY 1,2
                ORDER BY 4  `,

      entre_periodos: `SELECT  to_char(MIN(to_date(t.gestion||'-'||t.mes, 'YYYY-MM')), 'YYYY-Month') AS amin, to_char(Max(to_date(t.gestion||'-'||t.mes, 'YYYY-MM')), 'YYYY-Month') AS amax
               FROM tmp_snis302b t WHERE  t.tipo='MLI'
                AND t.formulario = 'ENFERMEDAD Y ESTADIO RENAL' $w$`
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["gestion", "gestion"],
        periodo: ["to_char(to_date(t.gestion||'-'||t.mes, 'YYYY-MM'), 'YYYY-MM')", "to_char(to_date(t.gestion||'-'||t.mes, 'YYYY-MM'), 'YYYY-MM')"],
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
  arenal_n: {
    alias: 'arenal_n',
    campos: cmps,
    title_obj: { title: 'REGISTRO DE ENFERMEDADES RENALES - NUEVOS', subtitle: 'Fuente: SNIS Información de ' },
    ilogic: {
      arenal_n: `
SELECT 
t.grupo  AS grupo, 
t.departamento as subgrupo,
t.ente_gestor_name AS "institucion",
t.variable AS grupo_etario,
case WHEN t.lugar_atencion='VARON' THEN 'Masculino' WHEN t.lugar_atencion='MUJER' THEN 'Femenino' ELSE 'unknow' END
AS genero,
SUM(t.valor) AS value
FROM tmp_snis302b t
WHERE t.tipo='MLI'
AND t.formulario = 'ENFERMEDAD Y ESTADIO RENAL' and t.subvariable='N'
$w$
GROUP BY 1,2, 3, 4,5
ORDER BY 1,2,3,4                
        `,
      entre_periodos: `SELECT  to_char(MIN(to_date(t.gestion||'-'||t.mes, 'YYYY-MM')), 'YYYY-Month') AS amin, to_char(Max(to_date(t.gestion||'-'||t.mes, 'YYYY-MM')), 'YYYY-Month') AS amax
               FROM tmp_snis302b t WHERE  t.tipo='MLI'
                AND t.formulario = 'ENFERMEDAD Y ESTADIO RENAL' $w$`
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["t.gestion", "t.gestion"],
        periodo: ["to_char(to_date(t.gestion||'-'||t.mes, 'YYYY-MM'), 'YYYY-MM')", "to_char(to_date(t.gestion||'-'||t.mes, 'YYYY-MM'), 'YYYY-MM')"],
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
  arenal_r: {
    alias: 'arenal_r',
    campos: cmps,
    title_obj: { title: 'REGISTRO DE ENFERMEDADES RENALES - REPETIDOS', subtitle: 'Fuente: SNIS Información de ' },
    ilogic: {
      arenal_r: `
SELECT 
t.grupo  AS grupo, 
t.departamento as subgrupo,
t.ente_gestor_name AS "institucion",
t.variable AS grupo_etario,
case WHEN t.lugar_atencion='VARON' THEN 'Masculino' WHEN t.lugar_atencion='MUJER' THEN 'Femenino' ELSE 'unknow' END
AS genero,
SUM(t.valor) AS value
FROM tmp_snis302b t
WHERE t.tipo='MLI'
AND t.formulario = 'ENFERMEDAD Y ESTADIO RENAL' and t.subvariable='R'
$w$
GROUP BY 1,2, 3, 4,5
ORDER BY 1,2,3,4                
        `,
      entre_periodos: `SELECT  to_char(MIN(to_date(t.gestion||'-'||t.mes, 'YYYY-MM')), 'YYYY-Month') AS amin, to_char(Max(to_date(t.gestion||'-'||t.mes, 'YYYY-MM')), 'YYYY-Month') AS amax
               FROM tmp_snis302b t WHERE  t.tipo='MLI'
                AND t.formulario = 'ENFERMEDAD Y ESTADIO RENAL' $w$`
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["t.gestion", "t.gestion"],
        periodo: ["to_char(to_date(t.gestion||'-'||t.mes, 'YYYY-MM'), 'YYYY-MM')", "to_char(to_date(t.gestion||'-'||t.mes, 'YYYY-MM'), 'YYYY-MM')"],
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
  arenal_table: {
    alias: 'arenal_table',
    campos: cmps,
    title_obj: { title: 'DATOS DE NUMERO DE REGISTROS DE ENFERMEDADES RENALES', subtitle: 'Fuente: SNIS Información de ' },
    ilogic: {
      arenal_table: `SELECT
t.ente_gestor_name AS row_index, t.subvariable||'.' AS col_head2, t.departamento as col_head1,
SUM(t.valor) AS value
FROM tmp_snis302b t
WHERE t.tipo='MLI'
AND t.formulario = 'ENFERMEDAD Y ESTADIO RENAL'  $w$
GROUP BY 1,2,3
ORDER BY 1,2,3      
        `,
      entre_periodos: `SELECT  to_char(MIN(to_date(t.gestion||'-'||t.mes, 'YYYY-MM')), 'YYYY-Month') AS amin, to_char(Max(to_date(t.gestion||'-'||t.mes, 'YYYY-MM')), 'YYYY-Month') AS amax
               FROM tmp_snis302b t WHERE  t.tipo='MLI'
                AND t.formulario = 'ENFERMEDAD Y ESTADIO RENAL' $w$`

    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["t.gestion", "t.gestion"],
        periodo: ["to_char(to_date(t.gestion||'-'||t.mes, 'YYYY-MM'), 'YYYY-MM')", "to_char(to_date(t.gestion||'-'||t.mes, 'YYYY-MM'), 'YYYY-MM')"],
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
}
module.exports = PDEPENDENCIES
