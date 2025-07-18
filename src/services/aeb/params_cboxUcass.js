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
  ucass_ah: {
    alias: 'ucass_ah',
    campos: cmps,
    title_obj: { title: 'UCASS Nro. de HABILITACIONES / ACREDITACIONES', subtitle: 'Ralizada en el periodo' },
    ilogic: {
      ucass_ah: `SELECT 
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
--AND ah.tipo='O'
$w$
    GROUP BY 1,2,3
     ORDER BY 1,2,3
                `,
      entre_periodos: `SELECT
TO_CHAR(min(coalesce(ah.fecha, '1900-01-01')), 'YYYY-Month') AS amin,
TO_CHAR(max(coalesce(ah.fecha, '1900-01-01')), 'YYYY-Month') AS amax
FROM u_acrehab ah, r_is_atributo a2
WHERE ah.tipo_reg = a2.atributo_id
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
      ucass_groupa: `SELECT ah.departamento AS grupo, ah.nivel AS subtercero ,ah.gestion AS subgrupo, ah.ente_gestor_name AS institucion,
COUNT(*) AS value,
SUM(COUNT(*)) OVER (PARTITION BY ah.departamento ORDER BY ah.departamento )  AS acumulado
FROM u_acrehab ah
WHERE ah.tipo_reg='ACREDITACION'
AND ah.tipo='O'
$w$
GROUP BY 1,2,3,4
ORDER BY acumulado DESC, ah.departamento, ah.nivel , ah.gestion , ah.ente_gestor_name 
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
      ucass_grouph: `SELECT ah.departamento AS grupo, ah.nivel AS subtercero ,ah.gestion AS subgrupo, ah.ente_gestor_name AS institucion,
COUNT(*) AS value,
SUM(COUNT(*)) OVER (PARTITION BY ah.departamento ORDER BY ah.departamento )  AS acumulado
FROM u_acrehab ah
WHERE ah.tipo_reg='HABILITACION'
AND ah.tipo='O'
$w$
GROUP BY 1,2,3,4
ORDER BY acumulado DESC, ah.departamento, ah.nivel , ah.gestion , ah.ente_gestor_name 
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
  ucass_nroah: {
    alias: 'ucass_nroah',
    campos: cmps,
    title_obj: { title: 'UCASS Nro. DE ACREDITACIONES - HABILITACIONES', subtitle: 'Comprendidas en el periodo' },
    ilogic: {
      ucass_nroah: `SELECT 
ah.ente_gestor_name AS row_index, SUBSTRING(ah.tipo_reg,1,3)||'.' AS col_head2, ah.gestion as col_head1,
COUNT(*) AS value
FROM u_acrehab ah
WHERE 
ah.tipo='O' $w$
GROUP BY 1,2,3
ORDER BY 1,2,3
                `,
      entre_periodos: `SELECT to_char(MIN(ah.fecha), 'DD/MM/YYYY') as amin, to_char(MAX(ah.fecha), 'DD/MM/YYYY') as amax
    FROM u_acrehab ah
WHERE 
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
  ucass_ah_meta: {
    alias: 'ucass_ah_meta',
    campos: cmps,
    title_obj: { title: 'UCASS - ACREDITACIONES', subtitle: 'Datos de' },
    ilogic: {
      ucass_ah_meta: `
      SELECT ah.tipo_reg AS grupo, 
            ah.departamento AS principal, ah.gestion AS segundo, 'exec' AS tipo, 'clase' AS clase,
            COUNT(*) AS VALUE, 0 AS meta
            FROM u_acrehab ah
            WHERE ah.tipo='O'
            group BY 1,2,3
            UNION 

            SELECT mm.tipo_reg AS grupo,
            mm.departamento AS principal, mm.gestion AS segundo, 'meta' AS tipo, 'clase' AS clase,
            mm.meta AS VALUE, 1 AS meta 
            FROM u_metas mm
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
}
module.exports = PDEPENDENCIES
