const cmps = {
  gestion: ['GESTION', false, true, 'C'],
  periodo: ['MES', false, true, 'C', , , 'M'],
  eg: ['Ente Gestor', false, true, 'C', , , 'M'],
  dpto: ['Departamento', false, true, 'C', , , 'M'],
  eess: ['Establecimiento de Salud', false, true, 'C', , , 'M'],
}
  //extraCondicion:[[campo, valor], [campo2, valor]...]
  ; ('use strict')
const PDEPENDENCIES = {
  ucass_a: {
    alias: 'ucass_a',
    campos: cmps,
    title_obj: { title: 'UCASS Nro. de ACREDITACIONES', subtitle: 'Ralizada en el periodo' },
    ilogic: {
      ucass_a: `SELECT 
 gestion,
CASE WHEN ah.tipo='O' THEN SUBSTRING(a2.atributo,1,3)||'.' ELSE SUBSTRING(a2.atributo,1,3)||ah.tipo||'eg'  end
AS tipo,
CASE WHEN ah.tipo='O' THEN CASE  WHEN (( ah.fecha + (3 * '1 year'::INTERVAL))::DATE - NOW()::DATE)>60
        THEN 'Vigente'
        WHEN (( ah.fecha + (3 * '1 year'::INTERVAL))::DATE - NOW()::DATE)>0 and (( ah.fecha + (3 * '1 year'::INTERVAL))::DATE - NOW()::DATE) <=60
        THEN 'Por Vencer'
        WHEN (( ah.fecha + (3 * '1 year'::INTERVAL))::DATE - NOW()::DATE)<0
        THEN 'Vencido'
        ELSE 'N/A' END  
ELSE CASE WHEN SUBSTRING(a2.atributo,1,1)='H'THEN 'SegHab.' ELSE 'SegAcre.' END   
END AS vigencia,        
        COUNT(*) AS value
        FROM u_acrehab ah, r_is_atributo a2
    WHERE ah.tipo_reg = a2.atributo_id AND ah.tipo_reg='ACREDITACION' and ah.servicio is null
--AND ah.tipo='O'
$w$
    GROUP BY 1,2,3
     ORDER BY 1,2,3
                `,
      entre_periodos: `SELECT
TO_CHAR(min(coalesce(ah.fecha, '1900-01-01')), 'YYYY-Month') AS amin,
TO_CHAR(max(coalesce(ah.fecha, '1900-01-01')), 'YYYY-Month') AS amax
FROM u_acrehab ah, r_is_atributo a2
WHERE ah.tipo_reg = a2.atributo_id AND ah.tipo_reg='ACREDITACION'
AND ah.tipo='O' and ah.fecha is not null
 $w$`
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["ah.gestion", "ah.gestion"],
        periodo: ["COALESCE(TO_CHAR(ah.fecha,'YYYY-MM'),'1900-01')", "COALESCE(TO_CHAR(ah.fecha,'YYYY-MM'),'1900-01')"],
        eg: ['ah.eg', 'ah.eg'],
        dpto: ['ah.dpto', 'ah.dpto'],
        eess: ['ah.eess', 'ah.eess'],
      },
      query: `SELECT $sa$`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },
  ucass_h: {
    alias: 'ucass_h',
    campos: cmps,
    title_obj: { title: 'UCASS Nro. de HABILITACIONES ', subtitle: 'Ralizada en el periodo' },
    ilogic: {
      ucass_h: `SELECT 
 gestion,

CASE WHEN ah.tipo='O' THEN SUBSTRING(a2.atributo,1,3)||'.' ELSE SUBSTRING(a2.atributo,1,3)||ah.tipo||'eg'  end
AS tipo,
CASE WHEN ah.tipo='O' THEN CASE  WHEN (( ah.fecha + (3 * '1 year'::INTERVAL))::DATE - NOW()::DATE)>60
        THEN 'Vigente'
        WHEN (( ah.fecha + (3 * '1 year'::INTERVAL))::DATE - NOW()::DATE)>0 and (( ah.fecha + (3 * '1 year'::INTERVAL))::DATE - NOW()::DATE) <=60
        THEN 'Por Vencer'
        WHEN (( ah.fecha + (3 * '1 year'::INTERVAL))::DATE - NOW()::DATE)<0
        THEN 'Vencido'
        ELSE 'N/A' END  
ELSE CASE WHEN SUBSTRING(a2.atributo,1,1)='H'THEN 'SegHab.' ELSE 'SegAcre.' END   
END AS vigencia,        
        COUNT(*) AS value
        FROM u_acrehab ah, r_is_atributo a2
    WHERE ah.tipo_reg = a2.atributo_id
    and ah.tipo_reg='HABILITACION' and ah.servicio is null
--AND ah.tipo='O'
$w$
    GROUP BY 1,2,3
     ORDER BY 1,2,3
                `,
      entre_periodos: `SELECT
TO_CHAR(min(coalesce(ah.fecha, '1900-01-01')), 'YYYY-Month') AS amin,
TO_CHAR(max(coalesce(ah.fecha, '1900-01-01')), 'YYYY-Month') AS amax
FROM u_acrehab ah, r_is_atributo a2
WHERE ah.tipo_reg = a2.atributo_id and ah.tipo_reg='HABILITACION'
AND ah.tipo='O' and ah.fecha is not null
 $w$`
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["ah.gestion", "ah.gestion"],
        periodo: ["COALESCE(TO_CHAR(ah.fecha,'YYYY-MM'),'1900-01')", "COALESCE(TO_CHAR(ah.fecha,'YYYY-MM'),'1900-01')"],
        eg: ['ah.eg', 'ah.eg'],
        dpto: ['ah.dpto', 'ah.dpto'],
        eess: ['ah.eess', 'ah.eess'],
      },
      query: `SELECT $sa$`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },
  ucass_groupa: {
    alias: 'ucass_groupa',
    campos: cmps,
    title_obj: { title: 'UCASS - ACREDITACIONES', subtitle: 'Datos de' },
    ilogic: {
      ucass_groupa: `SELECT ah.departamento AS grupo, ah.nivel AS subtercero ,ah.gestion AS subgrupo, i.nombre_corto AS institucion,
COUNT(*) AS value,
SUM(COUNT(*)) OVER (PARTITION BY ah.departamento ORDER BY ah.departamento )  AS acumulado
FROM u_acrehab ah, ae_institucion i
WHERE ah.eg=i.institucion_id
AND ah.tipo_reg='ACREDITACION' and ah.servicio is null
AND ah.tipo='O'
$w$
GROUP BY 1,2,3,4
ORDER BY acumulado DESC, ah.departamento, ah.nivel , ah.gestion , i.nombre_corto 
        `,
      entre_periodos: `SELECT to_char(MIN(ah.fecha), 'DD/MM/YYYY') as amin, to_char(MAX(ah.fecha), 'DD/MM/YYYY') as amax
    FROM u_acrehab ah
WHERE ah.tipo_reg='ACREDITACION'
AND ah.tipo='O' and ah.fecha is not null $w$ `
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["ah.gestion", "ah.gestion"],
        periodo: ["COALESCE(TO_CHAR(ah.fecha,'YYYY-MM'),'1900-01')", "COALESCE(TO_CHAR(ah.fecha,'YYYY-MM'),'1900-01')"],
        eg: ['ah.eg', 'ah.eg'],
        dpto: ['ah.dpto', 'ah.dpto'],
        eess: ['ah.eess', 'ah.eess'],
      },
      query: `SELECT $sa$`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },
  ucass_grouph: {
    alias: 'ucass_grouph',
    campos: cmps,
    title_obj: { title: 'UCASS - HABILITACIONES', subtitle: 'Datos de' },
    ilogic: {
      ucass_grouph: `SELECT ah.departamento AS grupo, ah.nivel AS subtercero ,ah.gestion AS subgrupo, i.nombre_corto AS institucion,
COUNT(*) AS value,
SUM(COUNT(*)) OVER (PARTITION BY ah.departamento ORDER BY ah.departamento )  AS acumulado
FROM u_acrehab ah, ae_institucion i
WHERE ah.eg=i.institucion_id
AND ah.tipo_reg='HABILITACION' and ah.servicio is null
AND ah.tipo='O'
$w$
GROUP BY 1,2,3,4
ORDER BY acumulado DESC, ah.departamento, ah.nivel , ah.gestion , i.nombre_corto 
        `,
      entre_periodos: `SELECT to_char(MIN(ah.fecha), 'DD/MM/YYYY') as amin, to_char(MAX(ah.fecha), 'DD/MM/YYYY') as amax
    FROM u_acrehab ah
WHERE ah.tipo_reg='HABILITACION'
AND ah.tipo='O' and ah.fecha is not null $w$ `
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["ah.gestion", "ah.gestion"],
        periodo: ["COALESCE(TO_CHAR(ah.fecha,'YYYY-MM'),'1900-01')", "COALESCE(TO_CHAR(ah.fecha,'YYYY-MM'),'1900-01')"],
        eg: ['ah.eg', 'ah.eg'],
        dpto: ['ah.dpto', 'ah.dpto'],
        eess: ['ah.eess', 'ah.eess'],
      },
      query: `SELECT $sa$`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },
  ucass_nroa: {
    alias: 'ucass_nroa',
    campos: cmps,
    title_obj: { title: 'UCASS Nro. DE HABILITACIONES', subtitle: 'Comprendidas en el periodo' },
    ilogic: {
      ucass_nroa: `SELECT 
                ah.ente_gestor_name AS row_index, SUBSTRING(ah.tipo_reg,1,3)||'.' AS col_head2, ah.gestion as col_head1,
                COUNT(*) AS value
                FROM u_acrehab ah
                WHERE 
                ah.tipo='O' and ah.servicio is null AND ah.tipo_reg='ACREDITACION' $w$ 
                GROUP BY 1,2,3
                ORDER BY 1,2,3
                `,
      entre_periodos: `SELECT to_char(MIN(ah.fecha), 'DD/MM/YYYY') as amin, to_char(MAX(ah.fecha), 'DD/MM/YYYY') as amax
              FROM u_acrehab ah
          WHERE ah.tipo_reg='ACREDITACION' and ah.servicio is null AND 
          ah.tipo='O' and ah.fecha is not null $w$`
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["ah.gestion", "ah.gestion"],
        periodo: ["COALESCE(TO_CHAR(ah.fecha,'YYYY-MM'),'1900-01')", "COALESCE(TO_CHAR(ah.fecha,'YYYY-MM'),'1900-01')"],
        eg: ['ah.eg', 'ah.eg'],
        dpto: ['ah.dpto', 'ah.dpto'],
        eess: ['ah.eess', 'ah.eess'],
      },
      query: `SELECT $sa$`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },
  ucass_nroh: {
    alias: 'ucass_nroh',
    campos: cmps,
    title_obj: { title: 'UCASS Nro. DE HABILITACIONES', subtitle: 'Comprendidas en el periodo' },
    ilogic: {
      ucass_nroh: `SELECT 
ah.ente_gestor_name AS row_index, SUBSTRING(ah.tipo_reg,1,3)||'.' AS col_head2, ah.gestion as col_head1,
COUNT(*) AS value
FROM u_acrehab ah
WHERE 
ah.tipo='O' and ah.servicio is null AND ah.tipo_reg='HABILITACION' $w$ 
GROUP BY 1,2,3
ORDER BY 1,2,3
                `,
      entre_periodos: `SELECT to_char(MIN(ah.fecha), 'DD/MM/YYYY') as amin, to_char(MAX(ah.fecha), 'DD/MM/YYYY') as amax
    FROM u_acrehab ah
WHERE ah.tipo_reg='HABILITACION' and ah.servicio is null AND 
 ah.tipo='O' and ah.fecha is not null $w$`
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["ah.gestion", "ah.gestion"],
        periodo: ["COALESCE(TO_CHAR(ah.fecha,'YYYY-MM'),'1900-01')", "COALESCE(TO_CHAR(ah.fecha,'YYYY-MM'),'1900-01')"],
        eg: ['ah.eg', 'ah.eg'],
        dpto: ['ah.dpto', 'ah.dpto'],
        eess: ['ah.eess', 'ah.eess'],
      },
      query: `SELECT $sa$`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },
  
  ucass_a_meta: {
    alias: 'ucass_a_meta',
    campos: cmps,
    title_obj: { title: 'UCASS - ACREDITACIONES', subtitle: 'Realizadas vs Metas de ' },
    ilogic: {
      ucass_a_meta: `
      SELECT ah.tipo_reg AS grupo, 
            ah.departamento AS principal, ah.gestion AS segundo, 'exec' AS tipo, 'clase' AS clase,
            COUNT(*) AS VALUE, 0 AS meta
            FROM u_acrehab ah
            WHERE ah.tipo='O' AND ah.tipo_reg='ACREDITACION' and ah.servicio is null $w$
            group BY 1,2,3
            UNION 
            SELECT ah.tipo_reg AS grupo,
            ah.departamento AS principal, ah.gestion AS segundo, 'meta' AS tipo, 'clase' AS clase,
            ah.meta AS VALUE, 1 AS meta 
            FROM u_metas ah
            WHERE ah.tipo_reg='ACREDITACION' $w$
            ORDER BY 1,2,3
        `,
      entre_periodos: `SELECT to_char(MIN(ah.fecha), 'DD/MM/YYYY') as amin, to_char(MAX(ah.fecha), 'DD/MM/YYYY') as amax
                FROM u_acrehab ah
            WHERE ah.tipo_reg='ACREDITACION'
            AND ah.tipo='O' and ah.fecha is not null $w$ `
                },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["ah.gestion", "ah.gestion"],
        periodo: ["COALESCE(TO_CHAR(ah.fecha,'YYYY-MM'),'1900-01')", "COALESCE(TO_CHAR(ah.fecha,'YYYY-MM'),'1900-01')"],
        eg: ['ah.eg', 'ah.eg'],
        dpto: ['ah.dpto', 'ah.dpto'],
        eess: ['ah.eess', 'ah.eess'],
      },
      query: `SELECT $sa$`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },
  ucass_h_meta: {
    alias: 'ucass_h_meta',
    campos: cmps,
    title_obj: { title: 'UCASS - HABILITACIONES', subtitle: 'Realizadas vs Metas de ' },
    ilogic: {
      ucass_h_meta: `
      SELECT ah.tipo_reg AS grupo, 
            ah.departamento AS principal, ah.gestion AS segundo, 'exec' AS tipo, 'clase' AS clase,
            COUNT(*) AS VALUE, 0 AS meta
            FROM u_acrehab ah
            WHERE ah.tipo='O' AND ah.tipo_reg='HABILITACION' and ah.servicio is null $w$
            group BY 1,2,3
            UNION 
            SELECT ah.tipo_reg AS grupo,
            ah.departamento AS principal, ah.gestion AS segundo, 'meta' AS tipo, 'clase' AS clase,
            ah.meta AS VALUE, 1 AS meta 
            FROM u_metas ah 
            WHERE  ah.tipo_reg='HABILITACION' $w$
            ORDER BY 1,2,3
        `,
      entre_periodos: `SELECT to_char(MIN(ah.fecha), 'DD/MM/YYYY') as amin, to_char(MAX(ah.fecha), 'DD/MM/YYYY') as amax
                FROM u_acrehab ah
            WHERE ah.tipo_reg='HABILITACION'
            AND ah.tipo='O' and ah.fecha is not null $w$ `
                },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["ah.gestion", "ah.gestion"],
        periodo: ["COALESCE(TO_CHAR(ah.fecha,'YYYY-MM'),'1900-01')", "COALESCE(TO_CHAR(ah.fecha,'YYYY-MM'),'1900-01')"],
        eg: ['ah.eg', 'ah.eg'],
        dpto: ['ah.dpto', 'ah.dpto'],
        eess: ['ah.eess', 'ah.eess'],
      },
      query: `SELECT $sa$`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },
  ucass_a_eess: {
    alias: 'ucass_a_eess',
    campos: cmps,
    title_obj: { title: 'UCASS - PORCENTAJE DE HABILITACIONES REALIZADAS', subtitle: 'Periodo de ' },
    ilogic: {
      ucass_a_eess: `SELECT 
 ah.tipo_reg AS pila,
ah.departamento AS ejex, 
ah.dpto,      
 ROUND(100 *   COUNT(*) / 
(SELECT COUNT(*)
FROM ae_institucion i, r_institucion_salud r
WHERE i.institucion_id=r.institucion_id
and i.tipo_institucion_id='EESS'
AND r.nivel_atencion IN ('2DONIVEL', '3ERNIVEL', '1ERNIVEL')
AND ah.dpto =i.cod_dpto) ::DECIMAL,2) AS value
        FROM u_acrehab ah, r_is_atributo a2
    WHERE ah.tipo_reg = a2.atributo_id
    and ah.tipo_reg='ACREDITACION' and ah.servicio is null
AND ah.tipo='O' $w$
    GROUP BY 1,2,3
     ORDER BY 1,2
        `,
      por_eg:`SELECT 
eg.nombre_corto AS pila,
ah.departamento AS ejex, 
ah.eg, ah.dpto,
 CASE WHEN (SELECT COUNT(*)
FROM ae_institucion i, r_institucion_salud r
WHERE i.institucion_id=r.institucion_id
and i.tipo_institucion_id='EESS'
AND r.nivel_atencion IN ('2DONIVEL', '3ERNIVEL', '1ERNIVEL')
AND ah.dpto =i.cod_dpto AND ah.eg=i.institucion_root
) =0 THEN  0 ELSE  ROUND(100 *   COUNT(*) /
(SELECT COUNT(*)
FROM ae_institucion i, r_institucion_salud r
WHERE i.institucion_id=r.institucion_id
and i.tipo_institucion_id='EESS'
AND r.nivel_atencion IN ('2DONIVEL', '3ERNIVEL', '1ERNIVEL')
AND ah.dpto =i.cod_dpto AND ah.eg=i.institucion_root
) ::DECIMAL,2) END 
 AS value
        FROM ae_institucion eg, u_acrehab ah, r_is_atributo a2 
    WHERE eg.institucion_id= ah.eg
	 and ah.tipo_reg = a2.atributo_id
    and ah.tipo_reg='ACREDITACION' and ah.servicio is null
AND ah.tipo='O' $w$
    GROUP BY 1,2,3,4
     ORDER BY 1,2`,  
      entre_periodos: `SELECT to_char(MIN(ah.fecha), 'DD/MM/YYYY') as amin, to_char(MAX(ah.fecha), 'DD/MM/YYYY') as amax
                FROM u_acrehab ah
            WHERE ah.tipo_reg='ACREDITACION'
            AND ah.tipo='O' and ah.fecha is not null $w$ `
                },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["ah.gestion", "ah.gestion"],
        periodo: ["COALESCE(TO_CHAR(ah.fecha,'YYYY-MM'),'1900-01')", "COALESCE(TO_CHAR(ah.fecha,'YYYY-MM'),'1900-01')"],
        eg: ['ah.eg', 'ah.eg'],
        dpto: ['ah.dpto', 'ah.dpto'],
        eess: ['ah.eess', 'ah.eess'],
      },
      query: `SELECT $sa$`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },
  ucass_h_eess: {
    alias: 'ucass_h_eess',
    campos: cmps,
    title_obj: { title: 'UCASS - PORCENTAJE DE HABILITACIONES REALIZADAS', subtitle: 'Periodo de ' },
    ilogic: {
      ucass_h_eess: `SELECT 
 ah.tipo_reg AS pila,
ah.departamento AS ejex, 
ah.dpto,      
ROUND(100 *   COUNT(*) / 
(SELECT COUNT(*)
FROM ae_institucion i, r_institucion_salud r
WHERE i.institucion_id=r.institucion_id
and i.tipo_institucion_id='EESS'
AND r.nivel_atencion IN ('2DONIVEL', '3ERNIVEL', '1ERNIVEL')
AND ah.dpto =i.cod_dpto) ::DECIMAL,2) AS value

        FROM u_acrehab ah, r_is_atributo a2
    WHERE ah.tipo_reg = a2.atributo_id
    and ah.tipo_reg='HABILITACION' and ah.servicio is null
AND ah.tipo='O' $w$
    GROUP BY 1,2,3
     ORDER BY 1,2
        `,
    por_eg:`SELECT 
eg.nombre_corto AS pila,
ah.departamento AS ejex, 
ah.eg, ah.dpto,
 CASE WHEN (SELECT COUNT(*)
FROM ae_institucion i, r_institucion_salud r
WHERE i.institucion_id=r.institucion_id
and i.tipo_institucion_id='EESS'
AND r.nivel_atencion IN ('2DONIVEL', '3ERNIVEL', '1ERNIVEL')
AND ah.dpto =i.cod_dpto AND ah.eg=i.institucion_root
) =0 THEN  0 ELSE  ROUND(100 *   COUNT(*) /
(SELECT COUNT(*)
FROM ae_institucion i, r_institucion_salud r
WHERE i.institucion_id=r.institucion_id
and i.tipo_institucion_id='EESS'
AND r.nivel_atencion IN ('2DONIVEL', '3ERNIVEL', '1ERNIVEL')
AND ah.dpto =i.cod_dpto AND ah.eg=i.institucion_root
) ::DECIMAL,2) END 
 AS value
        FROM ae_institucion eg, u_acrehab ah, r_is_atributo a2 
    WHERE eg.institucion_id= ah.eg
	 and ah.tipo_reg = a2.atributo_id
    and ah.tipo_reg='HABILITACION' and ah.servicio is null
AND ah.tipo='O' $w$
    GROUP BY 1,2,3,4
     ORDER BY 1,2`,      
      entre_periodos: `SELECT to_char(MIN(ah.fecha), 'DD/MM/YYYY') as amin, to_char(MAX(ah.fecha), 'DD/MM/YYYY') as amax
                FROM u_acrehab ah
            WHERE ah.tipo_reg='HABILITACION'
            AND ah.tipo='O' and ah.fecha is not null $w$ `
                },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["ah.gestion", "ah.gestion"],
        periodo: ["COALESCE(TO_CHAR(ah.fecha,'YYYY-MM'),'1900-01')", "COALESCE(TO_CHAR(ah.fecha,'YYYY-MM'),'1900-01')"],
        eg: ['ah.eg', 'ah.eg'],
        dpto: ['ah.dpto', 'ah.dpto'],
        eess: ['ah.eess', 'ah.eess'],
      },
      query: `SELECT $sa$`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },
  ucass_h_tbl: {
    alias: 'ucass_h_tbl',
    campos: cmps,
    title_obj: { title: 'UCASS - HABILITACIONES REALIZADAS', subtitle: 'Periodo de ' },
    ilogic: {
      ucass_h_tbl: `SELECT
ah.departamento, eg.nombre_corto AS "ente gestor", ah.establecimiento, ah.nivel, ah.ra_reg as "R.A.", TO_CHAR(ah.fecha,'DD/MM/YYYY') AS fecha
FROM u_acrehab ah, ae_institucion eg
WHERE ah.eg= eg.institucion_id
AND ah.tipo='O' AND ah.tipo_reg='HABILITACION' and ah.servicio is null $w$
ORDER BY 1,2, ah.fecha desc
        `,
          
      entre_periodos: `SELECT to_char(MIN(ah.fecha), 'DD/MM/YYYY') as amin, to_char(MAX(ah.fecha), 'DD/MM/YYYY') as amax
                FROM u_acrehab ah
            WHERE ah.tipo_reg='HABILITACION'
            AND ah.tipo='O' and ah.fecha is not null $w$ `
                },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["ah.gestion", "ah.gestion"],
        periodo: ["COALESCE(TO_CHAR(ah.fecha,'YYYY-MM'),'1900-01')", "COALESCE(TO_CHAR(ah.fecha,'YYYY-MM'),'1900-01')"],
        eg: ['ah.eg', 'ah.eg'],
        dpto: ['ah.dpto', 'ah.dpto'],
        eess: ['ah.eess', 'ah.eess'],
      },
      query: `SELECT $sa$`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },
  ucass_a_tbl: {
    alias: 'ucass_a_tbl',
    campos: cmps,
    title_obj: { title: 'UCASS - ACREDITACIONES REALIZADAS', subtitle: 'Periodo de ' },
    ilogic: {
      ucass_a_tbl: `SELECT
ah.departamento, eg.nombre_corto AS "ente gestor", ah.establecimiento, ah.nivel, ah.ra_reg as "R.A.", TO_CHAR(ah.fecha,'DD/MM/YYYY') AS fecha
FROM u_acrehab ah, ae_institucion eg
WHERE ah.eg= eg.institucion_id
AND ah.tipo='O' AND ah.tipo_reg='ACREDITACION' and ah.servicio is null $w$
ORDER BY 1,2, ah.fecha desc
        `,
          
      entre_periodos: `SELECT to_char(MIN(ah.fecha), 'DD/MM/YYYY') as amin, to_char(MAX(ah.fecha), 'DD/MM/YYYY') as amax
                FROM u_acrehab ah
            WHERE ah.tipo_reg='HABILITACION'
            AND ah.tipo='O' and ah.fecha is not null $w$ `
                },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["ah.gestion", "ah.gestion"],
        periodo: ["COALESCE(TO_CHAR(ah.fecha,'YYYY-MM'),'1900-01')", "COALESCE(TO_CHAR(ah.fecha,'YYYY-MM'),'1900-01')"],
        eg: ['ah.eg', 'ah.eg'],
        dpto: ['ah.dpto', 'ah.dpto'],
        eess: ['ah.eess', 'ah.eess'],
      },
      query: `SELECT $sa$`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },
}
module.exports = PDEPENDENCIES
