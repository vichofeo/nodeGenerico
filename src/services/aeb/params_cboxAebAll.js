const cmps = {
    gestion: ['GESTION', false, true, 'C'],
    periodo: ['MES', false, true, 'C', , , 'M'],
    eg: ['Ente Gestor', false, true, 'C', , , 'M'],
    dpto: ['Departamento', false, true, 'C', , , 'M'],
    eess: ['Establecimiento de Salud', false, true, 'C', , , 'M'],
  }
  //extraCondicion:[[campo, valor], [campo2, valor]...]
  ;('use strict')
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
  }
  module.exports = PDEPENDENCIES
  