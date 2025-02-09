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
  ufam_air: {
    alias: 'ufam_air',
    campos: cmps,
    ilogic: {
      ufam_air: `SELECT eg.nombre_corto as ente_gestor, 'RRAME' AS grupo, t.gestion, COUNT(*) AS value
                FROM tmp_rrame t, ae_institucion eg, ae_institucion i, al_departamento dpto
                WHERE 
                t.eg = i.institucion_root AND t.eess = i.institucion_id AND t.dpto = i.cod_dpto
                AND i.institucion_root = eg.institucion_id 
                AND i.cod_pais = dpto.cod_pais AND i.cod_dpto = dpto.cod_dpto
                $w$
                GROUP BY 1,2,3

                UNION 

                SELECT eg.nombre_corto as ente_gestor, 'INAS' AS grupo,  t.gestion, COUNT(*) AS value
                FROM tmp_inas t, ae_institucion eg, ae_institucion i, al_departamento dpto
                WHERE 
                t.eg = i.institucion_root AND t.eess = i.institucion_id AND t.dpto = i.cod_dpto
                AND i.institucion_root = eg.institucion_id 
                AND i.cod_pais = dpto.cod_pais AND i.cod_dpto = dpto.cod_dpto
                $w$
                GROUP BY 1,2,3

                UNION
                
                SELECT eg.nombre_corto as ente_gestor, 'AMES' AS grupo,  t.gestion, COUNT(*) AS value
                FROM tmp_ames t, ae_institucion eg, ae_institucion i, al_departamento dpto
                WHERE 
                t.eg = i.institucion_root AND t.eess = i.institucion_id AND t.dpto = i.cod_dpto
                AND i.institucion_root = eg.institucion_id 
                AND i.cod_pais = dpto.cod_pais AND i.cod_dpto = dpto.cod_dpto
                $w$
                GROUP BY 1,2,3
                ORDER BY 1,2,3
                `,
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ['t.gestion', 't.gestion'],
        periodo: [
          "to_char(t.fecha_emision,'YYYY-MM')",
          "to_char(t.fecha_emision,'YYYY-MM')",
        ],
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
  ufam_air_dpto: {
    alias: 'ufam_air_genero',
    campos: cmps,
    ilogic: {
      ufam_air_dpto: `SELECT dpto.nombre_dpto as pila, t.gestion AS ejex, COUNT(*) AS value

                FROM tmp_rrame t, ae_institucion eg, ae_institucion i, al_departamento dpto
                WHERE 
                t.eg = i.institucion_root AND t.eess = i.institucion_id AND t.dpto = i.cod_dpto
                AND i.institucion_root = eg.institucion_id 
                AND i.cod_pais = dpto.cod_pais AND i.cod_dpto = dpto.cod_dpto
                $w$
                GROUP BY 1,2

                UNION 

SELECT dpto.nombre_dpto as pila, t.gestion AS ejex, COUNT(*) AS value

                FROM tmp_inas t, ae_institucion eg, ae_institucion i, al_departamento dpto
                WHERE 
                t.eg = i.institucion_root AND t.eess = i.institucion_id AND t.dpto = i.cod_dpto
                AND i.institucion_root = eg.institucion_id 
                AND i.cod_pais = dpto.cod_pais AND i.cod_dpto = dpto.cod_dpto
                $w$
                GROUP BY 1,2

                UNION
                
SELECT dpto.nombre_dpto as pila, t.gestion AS ejex, COUNT(*) AS value
                FROM tmp_ames t, ae_institucion eg, ae_institucion i, al_departamento dpto
                WHERE 
                t.eg = i.institucion_root AND t.eess = i.institucion_id AND t.dpto = i.cod_dpto
                AND i.institucion_root = eg.institucion_id 
                AND i.cod_pais = dpto.cod_pais AND i.cod_dpto = dpto.cod_dpto
                $w$
                GROUP BY 1,2
                ORDER BY 1,2
                `,
        ames: `SELECT dpto.nombre_dpto as pila, t.gestion AS ejex, COUNT(*) AS value
                FROM tmp_ames t, ae_institucion eg, ae_institucion i, al_departamento dpto
                WHERE 
                t.eg = i.institucion_root AND t.eess = i.institucion_id AND t.dpto = i.cod_dpto
                AND i.institucion_root = eg.institucion_id 
                AND i.cod_pais = dpto.cod_pais AND i.cod_dpto = dpto.cod_dpto
                $w$
                GROUP BY 1,2
                ORDER BY 1,2`,
        inas: `SELECT dpto.nombre_dpto as pila, t.gestion AS ejex, COUNT(*) AS value

                FROM tmp_inas t, ae_institucion eg, ae_institucion i, al_departamento dpto
                WHERE 
                t.eg = i.institucion_root AND t.eess = i.institucion_id AND t.dpto = i.cod_dpto
                AND i.institucion_root = eg.institucion_id 
                AND i.cod_pais = dpto.cod_pais AND i.cod_dpto = dpto.cod_dpto
                $w$
                GROUP BY 1,2 ORDER BY 1,2`,
        rrame: `SELECT dpto.nombre_dpto as pila, t.gestion AS ejex, COUNT(*) AS value

                FROM tmp_rrame t, ae_institucion eg, ae_institucion i, al_departamento dpto
                WHERE 
                t.eg = i.institucion_root AND t.eess = i.institucion_id AND t.dpto = i.cod_dpto
                AND i.institucion_root = eg.institucion_id 
                AND i.cod_pais = dpto.cod_pais AND i.cod_dpto = dpto.cod_dpto
                $w$
                GROUP BY 1,2 ORDER BY 1,2`                
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ['t.gestion', 't.gestion'],
        periodo: [
          "to_char(t.fecha_emision,'YYYY-MM')",
          "to_char(t.fecha_emision,'YYYY-MM')",
        ],
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
