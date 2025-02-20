const cmps = {
  gestion: ['GESTION', false, true, 'C'],
  periodo: ['MES', false, true, 'C', , , 'M'],
  eg: ['Ente Gestor', false, true, 'C', , , 'M'],
  dpto: ['Departamento', false, true, 'C', , , 'M'],
  eess: ['Establecimiento de Salud', false, true, 'C', , , 'M'],
}
//extraCondicion:[[campo, valor], [campo2, valor]...]
'use strict'
const PDEPENDENCIES = {
  ss_uaeb: {
    alias: 'ss_uaeb',
    campos: {
      eg: ['Ente Gestor', false, true, 'C', , , 'M'],
      dpto: ['Departamento', false, true, 'C', , , 'M'],
      eess: ['Establecimiento de Salud', false, true, 'C', , , 'M']
    },
    ilogic: {
      ss_uaeb: `SELECT 
sum(CASE WHEN nivel_atencion= '1ERNIVEL' THEN valor ELSE 0 END) AS " 1er Niv.",
sum(CASE WHEN nivel_atencion= '2DONIVEL' THEN valor ELSE 0 END) AS " 2do Niv.",
sum(CASE WHEN nivel_atencion= '3ERNIVEL' THEN valor ELSE 0 END) AS " 3er Niv."
FROM (
SELECT s.nivel_atencion , COUNT(*) as valor
FROM ae_institucion i, r_institucion_salud s
WHERE i.institucion_id = s.institucion_id
AND s.nivel_atencion IN ('2DONIVEL','3ERNIVEL', '1ERNIVEL') $w$
GROUP BY 1) AS tbl`
    },
    referer: [],
    primal: {
      equivalencia: {
        eg: ['i.institucion_root', "i.institucion_root"],
        dpto: ['i.cod_dpto', 'i.cod_dpto'],
        eess: ['i.institucion_id', 'i.institucion_id'],

      },
      query: `SELECT $sa$`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },
  ss_uufam: {
    alias: 'ss_uufam',
    campos: cmps,
    ilogic: {
      ss_uufam: `SELECT 
              (SELECT COUNT(*) FROM tmp_ames WHERE 1=1 $w$) AS ames,
              (SELECT COUNT(*) FROM tmp_inas WHERE 1=1 $w$) AS inas,
              (SELECT COUNT(*) FROM tmp_rrame WHERE 1=1 $w$) AS rrame`
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["to_char(fecha_emision,'YYYY')", "to_char(fecha_emision,'YYYY')"],
        periodo: ["to_char(fecha_emision,'YYYY-MM')","to_char(fecha_emision,'YYYY-MM')"],
        eg: ['eg', "eg"],
        dpto: ['dpto', 'dpto'],
        eess: ['eess', 'eess'],

      },
      query: `SELECT $sa$`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },
  ss_uucass: {
    alias: 'ss_uufam',
    campos: cmps,
    ilogic: {
      ss_uucass: `SELECT 
                SUM(CASE WHEN tipo_registro='HABILITACION' THEN valor ELSE 0 END ) AS habilitacion, 
                SUM(CASE WHEN tipo_registro='ACREDITACION' THEN valor ELSE 0 END ) AS acreditacion
                FROM (SELECT 
                iah.tipo_registro,   a.atributo, COUNT(*) AS valor
                FROM r_institucion_salud_acrehab iah, 
					      r_is_atributo a, ae_institucion i
                WHERE 
                iah.tipo_registro=a.atributo_id 
                AND iah.institucion_id = i.institucion_id  $w$
                GROUP BY iah.tipo_registro, a.atributo) as tbl`
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ['iah.gestion_registro', 'iah.gestion_registro'],
        periodo: ["to_char(iah.fecha_ra, 'YYYY-MM')", "to_char(iah.fecha_ra, 'YYYY-MM')"],
        eg: ['i.institucion_root', "i.institucion_root"],
        dpto: ['i.cod_dpto', 'i.cod_dpto'],
        eess: ['i.institucion_id', 'i.institucion_id'],

      },
      query: `SELECT $sa$`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },

  ss_uufsmt: {
    alias: 'ss_uufsmt',
    campos: cmps,
    ilogic: {
      ss_uufsmt: `SELECT COUNT(DISTINCT r.institucion_id) AS "U.MT reportan"
                  FROM f_formulario_registro r, ae_institucion i
                  WHERE 
                  r.institucion_id=i.institucion_id AND r.formulario_id='ed7c82d8-fb49-4922-8b98-c1967549aaaf'
                  $w$`
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["TO_CHAR(r.create_date,'YYYY')", "TO_CHAR(r.create_date,'YYYY')"],
        periodo: ["TO_CHAR(r.create_date,'YYYY-MM')", "TO_CHAR(r.create_date,'YYYY-MM')"],
        eg: ['i.institucion_root', "i.institucion_root"],
        dpto: ['i.cod_dpto', 'i.cod_dpto'],
        eess: ['i.institucion_id', 'i.institucion_id'],

      },
      query: `SELECT $sa$`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },
  ss_uufsmt_aux: {
    alias: 'ss_uufsmt_aux',
    campos: {eg: ['Ente Gestor', false, true, 'C', , , 'M'],
            dpto: ['Departamento', false, true, 'C', , , 'M'],
            eess: ['Establecimiento de Salud', false, true, 'C', , , 'M']},
    ilogic: {
      ss_uufsmt_aux: `SELECT COUNT(*) as "U. MT Reg."
                      FROM f_formulario_institucion_cnf cc, ae_institucion i
                      WHERE cc.institucion_id= i.institucion_id AND cc.formulario_id='ed7c82d8-fb49-4922-8b98-c1967549aaaf'
                      $w$`
    },
    referer: [],
    primal: {
      equivalencia: {        
        eg: ['i.institucion_root', "i.institucion_root"],
        dpto: ['i.cod_dpto', 'i.cod_dpto'],
        eess: ['i.institucion_id', 'i.institucion_id'],

      },
      query: `SELECT $sa$`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  }
}
module.exports = PDEPENDENCIES
