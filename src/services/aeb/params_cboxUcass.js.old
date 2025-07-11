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
  ucass_ah: {
    alias: 'ucass_ah',
    campos: cmps,
    title_obj:{title:'UCASS Nro. de HABILITACIONES / ACREDITACIONES', subtitle:'Ralizada en el periodo'},
    ilogic: {
      ucass_ah: `SELECT 
COALESCE(TO_CHAR(ah.fecha_ra,'YYYY'),'1900') AS gestion,
a2.atributo AS tipo,
        CASE  WHEN (( ah.fecha_ra + (ah.vigencia_anios * '1 year'::INTERVAL))::DATE - NOW()::DATE)>60
        THEN 'Vigente'
        WHEN (( ah.fecha_ra + (ah.vigencia_anios * '1 year'::INTERVAL))::DATE - NOW()::DATE)>0 and (( ah.fecha_ra + (ah.vigencia_anios * '1 year'::INTERVAL))::DATE - NOW()::DATE) <=60
        THEN 'Por Vencer'
        WHEN (( ah.fecha_ra + (ah.vigencia_anios * '1 year'::INTERVAL))::DATE - NOW()::DATE)<0
        THEN 'Vencido'
        ELSE 'N/A' END  AS vigencia,
        COUNT(*) AS value

        FROM r_institucion_salud_acrehab ah, ae_institucion i, ae_institucion eg,
al_departamento dpto,  r_is_atributo a2, r_is_atributo a3
    WHERE 
    ah.institucion_id=i.institucion_id AND i.institucion_root =  eg.institucion_id AND 
    i.cod_pais=dpto.cod_pais AND i.cod_dpto =  dpto.cod_dpto

    AND a2.atributo_id=ah.estado_acrehab AND a3.atributo_id=ah.activo 
    $w$
    GROUP BY 1,2,3
     ORDER BY 1,2,3
                `,
                entre_periodos: `SELECT
min(TO_CHAR(coalesce(ah.fecha_ra, '1900-01-01'), 'YYYY-Month')) AS amin,
max(TO_CHAR(coalesce(ah.fecha_ra, '1900-01-01'), 'YYYY-Month')) AS amax
FROM r_institucion_salud_acrehab ah, ae_institucion i
WHERE 
ah.institucion_id = i.institucion_id and ah.fecha_ra is not null
 $w$`
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["ah.gestion_registro", "ah.gestion_registro"],
        periodo: ["COALESCE(TO_CHAR(ah.fecha_ra,'YYYY-MM'),'1900-01')", "COALESCE(TO_CHAR(ah.fecha_ra,'YYYY-MM'),'1900-01')" ],
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
