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
  ufam_air_a: {
    alias: 'ufam_air_a',
    campos: cmps,
    title_obj: { title: 'UFAM Nro. DE AUDITORIAS MEDICAS AMES ', subtitle: 'Comprendidas en el periodo' },
    ilogic: {
      ufam_air_a: `SELECT coalesce(eg.nombre_corto, t.ente_gestor_name) as ente_gestor, 'AMES' AS grupo,  t.gestion_ejecucion as gestion, COUNT(*) AS value
                FROM tmp_ames t LEFT JOIN  ae_institucion eg ON (t.eg= eg.institucion_id)
                WHERE 1=1
                $w$
                GROUP BY 1,2,3
                ORDER BY value DESC, 1,2,3
                `,
      entre_periodos: `SELECT TO_CHAR(MIN(t.fecha_emision), 'YYYY-Month') AS amin, to_char(MAX(t.fecha_emision),'YYYY-Month') AS amax FROM tmp_ames t
                WHERE t.fecha_emision is not null $w$`
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["t.gestion_ejecucion", "t.gestion_ejecucion"],
        periodo: [
          "to_char(t.fecha_emision,'YYYY-MM')",
          "to_char(t.fecha_emision,'YYYY-MM')",
        ],
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
  ufam_air_i: {
    alias: 'ufam_air_i',
    campos: cmps,
    title_obj: { title: 'UFAM Nro. DE AUDITORIAS MEDICAS INAS ', subtitle: 'Comprendidas en el periodo' },
    ilogic: {
      ufam_air_i: `SELECT coalesce(eg.nombre_corto, t.ente_gestor_name) as ente_gestor, 'INAS' AS grupo,  t.gestion_ejecucion as gestion, COUNT(*) AS value
                FROM tmp_inas t LEFT JOIN  ae_institucion eg ON (t.eg= eg.institucion_id)
                WHERE 1=1  $w$
                GROUP BY 1,2,3
                ORDER BY value DESC, 1,2,3
                `,
      entre_periodos: `SELECT to_char(MIN(t.fecha_emision),'YYYY-Month') AS amin, to_char(MAX(t.fecha_emision),'YYYY-Month') AS amax FROM tmp_inas t
                WHERE  t.fecha_emision is not null  $w$`
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["t.gestion_ejecucion", "t.gestion_ejecucion"],
        periodo: [
          "to_char(t.fecha_emision,'YYYY-MM')",
          "to_char(t.fecha_emision,'YYYY-MM')",
        ],
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
  ufam_air_r: {
    alias: 'ufam_air_r',
    campos: cmps,
    title_obj: { title: 'UFAM Nro. DE AUDITORIAS MEDICAS RRAME ', subtitle: 'Comprendidas en el periodo' },
    ilogic: {
      ufam_air_r: `SELECT coalesce(eg.nombre_corto, t.ente_gestor_name) as ente_gestor, 'RRAME' AS grupo, t.gestion_ejecucion as gestion, COUNT(*) AS value
                FROM tmp_rrame t LEFT JOIN  ae_institucion eg ON (t.eg= eg.institucion_id)
                WHERE 1=1 $w$
                GROUP BY 1,2,3
                ORDER BY value DESC, 1,2,3
                `,
      entre_periodos: `SELECT to_char(MIN(t.fecha_emision),'YYYY-Month') AS amin, to_char(MAX(t.fecha_emision),'YYYY-Month') AS amax
      FROM tmp_rrame t WHERE  t.fecha_emision is not null $w$`
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["t.gestion_ejecucion", "t.gestion_ejecucion"],
        periodo: [
          "to_char(t.fecha_emision,'YYYY-MM')",
          "to_char(t.fecha_emision,'YYYY-MM')",
        ],
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

  //graph p2 Dashboard
  ufam_air_dpto_a: {
    alias: 'ufam_air_dpto',
    campos: cmps,
    title_obj: { title: 'UFAM Nro. DE AUDITORIAS MEDICAS AMES POR DEPARTAMENTO', subtitle: 'Comprendidas en el periodo' },
    ilogic: {      
      ufam_air_dpto_a: `SELECT coalesce(eg.nombre_corto, t.ente_gestor_name) as pila, t.gestion_ejecucion AS ejex, COUNT(*) AS value
                FROM tmp_ames t LEFT JOIN  ae_institucion eg ON (t.eg= eg.institucion_id)
                WHERE 1=1 $w$
                GROUP BY 1,2
                ORDER BY 1,2`,
      dpto_eg_gestion: `SELECT departamento as pila, gestion_ejecucion as ejex,  COUNT(*) AS value,
      to_char((select max(fecha_emision) from tmp_ames),'DD/MM/YYYY') as obs
                FROM tmp_ames t
                WHERE 1=1 $w$
                GROUP BY departamento, gestion_ejecucion 
                ORDER BY 1, 2`,
      
      entre_periodos: `SELECT to_char(MIN(t.fecha_emision),'YYYY-Month') AS amin, to_char(MAX(t.fecha_emision),'YYYY-Month') AS amax FROM tmp_ames t
                WHERE t.fecha_emision is not null $w$`
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["t.gestion_ejecucion", "t.gestion_ejecucion"],
        periodo: [
          "to_char(t.fecha_emision,'YYYY-MM')",
          "to_char(t.fecha_emision,'YYYY-MM')",
        ],
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
  ufam_air_dpto_i: {
    alias: 'ufam_air_dpto_i',
    campos: cmps,
    title_obj: { title: 'UFAM Nro. DE AUDITORIAS MEDICAS INAS POR DEPARTAMENTO', subtitle: 'Comprendidas en el periodo' },
    ilogic: {      
      ufam_air_dpto_i: `SELECT coalesce(eg.nombre_corto, t.ente_gestor_name) as pila, t.gestion_ejecucion AS ejex, COUNT(*) AS value
                FROM tmp_inas t LEFT JOIN  ae_institucion eg ON (t.eg= eg.institucion_id)
                WHERE 1=1 $w$
                GROUP BY 1,2
                ORDER BY 1,2`,
      dpto_eg_gestion: `SELECT departamento as pila, gestion_ejecucion as ejex,  COUNT(*) AS value,
      to_char((select max(fecha_emision) from tmp_inas),'DD/MM/YYYY') as obs
                FROM tmp_inas t
                WHERE 1=1 $w$
                GROUP BY departamento, gestion_ejecucion 
                ORDER BY 1, 2`,
      
      entre_periodos: `SELECT to_char(MIN(t.fecha_emision),'YYYY-Month') AS amin, to_char(MAX(t.fecha_emision),'YYYY-Month') AS amax FROM tmp_inas t
                WHERE t.fecha_emision is not null $w$`
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["t.gestion_ejecucion", "t.gestion_ejecucion"],
        periodo: ["to_char(t.fecha_emision,'YYYY-MM')", "to_char(t.fecha_emision,'YYYY-MM')"],
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
  ufam_air_dpto_r: {
    alias: 'ufam_air_dpto_r',
    campos: cmps,
    title_obj: { title: 'UFAM Nro. DE AUDITORIAS MEDICAS RRAME POR DEPARTAMENTO', subtitle: 'Comprendidas en el periodo' },
    ilogic: {      
      ufam_air_dpto_r: `SELECT coalesce(eg.nombre_corto, t.ente_gestor_name) as pila, t.gestion_ejecucion AS ejex, COUNT(*) AS value
                FROM tmp_rrame t LEFT JOIN  ae_institucion eg ON (t.eg= eg.institucion_id)
                WHERE 1=1 $w$
                GROUP BY 1,2
                ORDER BY 1,2`,
      dpto_eg_gestion: `SELECT departamento as pila, gestion_ejecucion as ejex,  COUNT(*) AS value,
      to_char((select max(fecha_emision) from tmp_rrame),'DD/MM/YYYY') as obs
                FROM tmp_rrame t
                WHERE 1=1 $w$
                GROUP BY departamento, gestion_ejecucion 
                ORDER BY 1, 2`,
      
      entre_periodos: `SELECT to_char(MIN(t.fecha_emision), 'YYYY-Month') AS amin, to_char(MAX(t.fecha_emision),'YYYY-Month') AS amax FROM tmp_rrame t
                WHERE t.fecha_emision is not null $w$`
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["t.gestion_ejecucion", "t.gestion_ejecucion"],
        periodo: ["to_char(t.fecha_emision,'YYYY-MM')", "to_char(t.fecha_emision,'YYYY-MM')"],
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
  ufam_air_gen_a: {
    alias: 'ufam_air_gen_a',
    campos: cmps,
    title_obj: { title: 'UFAM Nro. DE AUDITORIAS MEDICAS AME POR GENERO', subtitle: 'Comprendidas en el periodo' },
    ilogic: {      
      ufam_air_gen_a: `SELECT gestion_ejecucion as pila, genero as ejex,  COUNT (*) AS value
                FROM tmp_ames t
                WHERE 1=1 $w$
                GROUP BY gestion_ejecucion, genero
                ORDER BY 1,2`,
      gen_eg: `SELECT coalesce(eg.nombre_corto, t.ente_gestor_name) as pila, genero as ejex,  COUNT (*) AS value
                FROM tmp_ames t LEFT JOIN  ae_institucion eg ON (t.eg= eg.institucion_id)
                WHERE 1=1 $w$
                GROUP BY 1, genero
                ORDER BY 1,2`,
      
      entre_periodos: `SELECT to_char(MIN(t.fecha_emision), 'YYYY-Month') AS amin, to_char(MAX(t.fecha_emision),'YYYY-Month') AS amax FROM tmp_ames t
                WHERE t.fecha_emision is not null $w$`
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["t.gestion_ejecucion", "t.gestion_ejecucion"],
        periodo: ["to_char(t.fecha_emision,'YYYY-MM')", "to_char(t.fecha_emision,'YYYY-MM')"],
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
  ufam_air_tipo_sol: {
    alias: 'ufam_air_tipo_sol',
    campos: cmps,
    title_obj: { title: 'UFAM AUDITORIAS MEDICAS AMES POR TIPO DE SOLICITUD POR DEPARTAMENTO', subtitle: 'Comprendidas en el periodo' },
    ilogic: {      
      ufam_air_tipo_sol: `SELECT departamento as pila, coalesce(tipo_solicitud,'Unknow') as ejex,  COUNT (*) AS value, 
                SUM(COUNT(*)) OVER (PARTITION BY departamento ORDER BY departamento, tipo_solicitud ) AS total_acumulado
                FROM tmp_ames t
                WHERE 1=1 $w$
                GROUP BY departamento, tipo_solicitud
                ORDER BY 1,2`,
     
      
      entre_periodos: `SELECT to_char(MIN(t.fecha_emision), 'YYYY-Month') AS amin, to_char(MAX(t.fecha_emision),'YYYY-Month') AS amax FROM tmp_ames t
                WHERE t.fecha_emision is not null $w$`
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["t.gestion_ejecucion", "t.gestion_ejecucion"],
        periodo: ["to_char(t.fecha_emision,'YYYY-MM')", "to_char(t.fecha_emision,'YYYY-MM')"],
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
