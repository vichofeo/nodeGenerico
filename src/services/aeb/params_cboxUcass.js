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
        periodo: ["COALESCE(TO_CHAR(ah.fecha,'YYYY-MM'),'1900-01')", "COALESCE(TO_CHAR(ah.fecha,'YYYY-MM'),'1900-01')" ],
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
