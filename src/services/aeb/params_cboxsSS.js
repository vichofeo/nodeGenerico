const cmps = {
  gestion: ['GESTION', false, true, 'C'],
  periodo: ['MES', false, true, 'C', , , 'M'],
  eg: ['Ente Gestor', false, true, 'C', , , 'M'],
  dpto: ['Departamento', false, true, 'C', , , 'M'],
  eess: ['Establecimiento de Salud', false, true, 'C', , , 'M'],
}
/** TARJETAS PRINCIPALES DE DASHBOARD */
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
        periodo: ["to_char(fecha_emision,'YYYY-MM')", "to_char(fecha_emision,'YYYY-MM')"],
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
                SUM(CASE WHEN tipo_reg='HABILITACION' THEN valor ELSE 0 END ) AS habilitacion, 
                SUM(CASE WHEN tipo_reg='ACREDITACION' THEN valor ELSE 0 END ) AS acreditacion
                FROM (SELECT 
                iah.tipo_reg,   a.atributo, COUNT(*) AS valor
                FROM u_acrehab iah, 
					      r_is_atributo a
                WHERE 
                iah.tipo_reg=a.atributo_id 
                AND iah.tipo='O'  $w$
                GROUP BY iah.tipo_reg, a.atributo) as tbl`
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ['iah.gestion', 'iah.gestion'],
        periodo: ["to_char(iah.fecha, 'YYYY-MM')", "to_char(iah.fecha, 'YYYY-MM')"],
        eg: ['iah.eg', "iah.eg"],
        dpto: ['iah.dpto', 'iah.dpto'],
        eess: ['iah.eess', 'iah.eess'],

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
    campos: {
      eg: ['Ente Gestor', false, true, 'C', , , 'M'],
      dpto: ['Departamento', false, true, 'C', , , 'M'],
      eess: ['Establecimiento de Salud', false, true, 'C', , , 'M']
    },
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
  },
/** ******************** ************************* *****************
 * tarjetas izquierda 
 * */
  ss_vacunatorio: {
    alias: 'ss_vacunatorio',
    campos: {
      eg: ['Ente Gestor', false, true, 'C', , , 'M'],
      dpto: ['Departamento', false, true, 'C', , , 'M'],
      eess: ['Establecimiento de Salud', false, true, 'C', , , 'M']
    },
    ilogic: {
      ss_vacunatorio: `SELECT COUNT(*) AS "Total"
                      FROM tmp_vacunatorio
                      WHERE 1=1 $w$
              `
    },
    referer: [],
    primal: {
      equivalencia: {        
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
  ss_def_nac: {
    alias: 'ss_def_nac',
    campos: cmps,
    ilogic: {
      ss_def_nac: `SELECT 
              (SELECT COUNT(*) FROM tmp_nacimientos t WHERE 1=1 $w$) AS nac,
              (SELECT COUNT(*) AS def FROM tmp_defunciones t WHERE 1=1 $w$) AS def
              `
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["to_char(fecha,'YYYY')", "to_char(fecha,'YYYY')"],
        periodo: ["to_char(fecha,'YYYY-MM')", "to_char(fecha,'YYYY-MM')"],
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
  ss_cancer: {
    alias: 'ss_cancer',
    campos: cmps,
    ilogic: {
      ss_cancer: `SELECT
		sum(case when tecnica_recoleccion='DF' THEN 1 ELSE 0 END) AS defs,
		sum(case when tecnica_recoleccion='LAB' THEN 1 ELSE 0 END) AS lab,
		sum(case when tecnica_recoleccion='EH' THEN 1 ELSE 0 END) AS EgrHosp,
		COUNT(*) AS total
      FROM tmp_cancer 
		WHERE 1=1 $w$
              `
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["to_char(fecha_diagnostico,'YYYY')", "to_char(fecha_diagnostico,'YYYY')"],
        periodo: ["to_char(fecha_diagnostico,'YYYY-MM')", "to_char(fecha_diagnostico,'YYYY-MM')"],
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

  ss_carmelo: {
    alias: 'ss_carmelo',
    campos: cmps,
    ilogic: {
      ss_carmelo: `SELECT
		sum(case when genero='MASCULINO' THEN 1 ELSE 0 END) AS hombre,
		sum(case when genero='FEMENINO' THEN 1 ELSE 0 END) AS mujer,
		sum(case when genero!='FEMENINO' and genero!='MASCULINO' THEN 1 ELSE 0 END) AS "desc.",
		COUNT(*) AS total
      FROM tmp_carmelo
		WHERE 1=1  $w$
              `
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["to_char(fecha_dispensacion,'YYYY')", "to_char(fecha_dispensacion,'YYYY')"],
        periodo: ["to_char(fecha_dispensacion,'YYYY-MM')", "to_char(fecha_dispensacion,'YYYY-MM')"],
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

  ss_pai: {
    alias: 'ss_pai',
    campos: cmps,
    ilogic: {
      ss_pai: `SELECT TO_CHAR(fecha_vacunacion, 'YYYY-MM-DD') as ejex,  COUNT (*) AS value,
                TO_CHAR((select MAX(fecha_vacunacion) FROM tmp_pai),'DD/MM/YYYY') AS obs
                FROM tmp_pai
                WHERE 1=1 $w$
                GROUP BY 1
                ORDER BY 1 
                            `
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["to_char(fecha_vacunacion,'YYYY')", "to_char(fecha_vacunacion,'YYYY')"],
        periodo: ["to_char(fecha_vacunacion,'YYYY-MM')", "to_char(fecha_vacunacion,'YYYY-MM')"],
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
  ss_nuemo: {
    alias: 'ss_nuemo',
    campos: cmps,
    ilogic: {
      ss_nuemo: `SELECT gestion, SUM(valor) as value
FROM tmp_infecciones 
WHERE 
infeccion='NEUMONIA' $w$
GROUP BY gestion
ORDER BY 1 DESC
LIMIT 3   `
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
  ss_iras: {
    alias: 'ss_iras',
    campos: cmps,
    ilogic: {
      ss_iras: `SELECT gestion, SUM(valor) as value
FROM tmp_infecciones 
WHERE 
infeccion='IRAS' $w$
GROUP BY gestion
ORDER BY 1 DESC
LIMIT 3   `
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
  ss_edas: {
    alias: 'ss_edas',
    campos: cmps,
    ilogic: {
      ss_edas: `SELECT gestion, SUM(valor) as value
FROM tmp_infecciones 
WHERE 
infeccion='EDAS' $w$
GROUP BY gestion
ORDER BY 1 DESC
LIMIT 3   `
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
