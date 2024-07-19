//extraCondicion:[[campo, valor], [campo2, valor]...]
'use strict'
const PDEPENDENCIES = {
  dash_mt_control: {
    alias: 'medTrabControl',
    campos: {
      departamento: ['DEPARTAMENTO', false, true, 'C'],      
      eg: ['ENTE GESTOR', false, true, 'C'],
      gestion: ['GESTION', false, true, 'C'],
      periodo: ['MES', false, true, 'C'],
      frm: ['Tipo Formulario', false, true, 'C'],
    },
    ilogic: {
      mt_control: `SELECT 
      ente_gestor AS fila, departamento AS col, 
      formulario AS serie,
      to_char(periodo,'YYYY-MM') AS ejex, 
      CASE WHEN valor='SI' THEN 1 ELSE -1 END AS value
      FROM tmp_mt_frmctrl
      WHERE 1=1 $w$
      ORDER BY 1,2,3,4`,
      
    },
    referer: [],
    primal: {
      equivalencia: {
        departamento: ['departamento', 'departamento'],        
        eg: ['ente_gestor', 'ente_gestor'],
        gestion: ['extract(year from periodo)', 'extract(year from periodo)'],
        periodo: [
          "TO_CHAR(periodo, 'YYYY-MM')",
          "TO_CHAR(periodo, 'YYYY-MM')",
        ],
        frm: ['formulario', 'formulario'],
        
      },
      query: `SELECT DISTINCT $a$
                FROM tmp_mt_frmctrl
                WHERE 1=1
                $w$
                ORDER BY 2`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },
  dash_mt_frms: {
    alias: 'medtrabegs',
    campos: {
      departamento: ['DEPARTAMENTO', false, true, 'C'],      
      eg: ['ENTE GESTOR', false, true, 'C'],
      gestion: ['GESTION', false, true, 'C'],
      periodo: ['MES', false, true, 'C'],
      frm: ['Tipo Formulario', false, true, 'C'],
    },
    ilogic: {      
      mt_frm_eg:`SELECT 
                formulario AS pivot, ente_gestor AS pila, 
                TO_CHAR(periodo, 'YYYY-MM') AS ejex,
                case WHEN SUM(reportado) is null THEN 0 else SUM(reportado) end  AS value
                FROM tmp_mt_frms
                WHERE 1=1 $w$
                GROUP BY 1,2,3
                ORDER BY 1,2,3`
    },
    referer: [],
    primal: {
      equivalencia: {
        departamento: ['departamento', 'departamento'],        
        eg: ['ente_gestor', 'ente_gestor'],
        gestion: ['extract(year from periodo)', 'extract(year from periodo)'],
        periodo: [
          "TO_CHAR(periodo, 'YYYY-MM')",
          "TO_CHAR(periodo, 'YYYY-MM')",
        ],
        frm: ['formulario', 'formulario'],
        
      },
      query: `SELECT DISTINCT $a$
                FROM tmp_mt_frms
                WHERE 1=1
                $w$
                ORDER BY 2`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },
  dash_mt_frmdpto: {
    alias: 'medtrabdptos',
    campos: {
      departamento: ['DEPARTAMENTO', false, true, 'C'],      
      eg: ['ENTE GESTOR', false, true, 'C'],
      gestion: ['GESTION', false, true, 'C'],
      periodo: ['MES', false, true, 'C'],
      frm: ['Tipo Formulario', false, true, 'C'],
    },
    ilogic: {      
      mt_frm_eg:`SELECT 
                formulario AS pivot, departamento AS pila, 
                TO_CHAR(periodo, 'YYYY-MM') AS ejex,
                case WHEN SUM(reportado) is null THEN 0 else SUM(reportado) end  AS value
                FROM tmp_mt_frms
                WHERE 1=1 $w$
                GROUP BY 1,2,3
                ORDER BY 1,2,3`
    },
    referer: [],
    primal: {
      equivalencia: {
        departamento: ['departamento', 'departamento'],        
        eg: ['ente_gestor', 'ente_gestor'],
        gestion: ['extract(year from periodo)', 'extract(year from periodo)'],
        periodo: [
          "TO_CHAR(periodo, 'YYYY-MM')",
          "TO_CHAR(periodo, 'YYYY-MM')",
        ],
        frm: ['formulario', 'formulario'],
        
      },
      query: `SELECT DISTINCT $a$
                FROM tmp_mt_frms
                WHERE 1=1
                $w$
                ORDER BY 2`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },
  dash_mt_egdpto: {
    alias: 'medtrabegdpto',
    campos: {
      departamento: ['DEPARTAMENTO', false, true, 'C'],      
      eg: ['ENTE GESTOR', false, true, 'C'],
      gestion: ['GESTION', false, true, 'C'],
      periodo: ['MES', false, true, 'C'],
      frm: ['Tipo Formulario', false, true, 'C'],
    },
    ilogic: {      
      mt_frm_egdpto:`SELECT pivot, pila, ejex, value,
                SUM(value) OVER (PARTITION BY pivot, pila ORDER BY pivot, pila, ejex ) AS total_acumulado
                FROM (
                SELECT 
                formulario AS pivot, ente_gestor AS pila, 
                departamento AS ejex,
                SUM(CASE WHEN reportado is null THEN 0 ELSE reportado END ) AS VALUE
                FROM tmp_mt_frms
                WHERE 1=1 $w$
                GROUP BY 1,2,3
                ORDER BY 1,2,3
                ) AS tt`
    },
    referer: [],
    primal: {
      equivalencia: {
        departamento: ['departamento', 'departamento'],        
        eg: ['ente_gestor', 'ente_gestor'],
        gestion: ['extract(year from periodo)', 'extract(year from periodo)'],
        periodo: [
          "TO_CHAR(periodo, 'YYYY-MM')",
          "TO_CHAR(periodo, 'YYYY-MM')",
        ],
        frm: ['formulario', 'formulario'],
        
      },
      query: `SELECT DISTINCT $a$
                FROM tmp_mt_frms
                WHERE 1=1
                $w$
                ORDER BY 2`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },
  dash_mt_dptoeg: {
    alias: 'medtrabegdpto',
    campos: {
      departamento: ['DEPARTAMENTO', false, true, 'C'],      
      eg: ['ENTE GESTOR', false, true, 'C'],
      gestion: ['GESTION', false, true, 'C'],
      periodo: ['MES', false, true, 'C'],
      frm: ['Tipo Formulario', false, true, 'C'],
    },
    ilogic: {      
      mt_frm_egdpto:`SELECT pivot, pila, ejex, value,
                SUM(value) OVER (PARTITION BY pivot, pila ORDER BY pivot, pila, ejex ) AS total_acumulado
                FROM (
                SELECT 
                formulario AS pivot, departamento AS pila, 
                ente_gestor AS ejex,
                SUM(CASE WHEN reportado is null THEN 0 ELSE reportado END ) AS VALUE
                FROM tmp_mt_frms
                WHERE 1=1 $w$
                GROUP BY 1,2,3
                ORDER BY 1,2,3
                ) AS tt`
    },
    referer: [],
    primal: {
      equivalencia: {
        departamento: ['departamento', 'departamento'],        
        eg: ['ente_gestor', 'ente_gestor'],
        gestion: ['extract(year from periodo)', 'extract(year from periodo)'],
        periodo: [
          "TO_CHAR(periodo, 'YYYY-MM')",
          "TO_CHAR(periodo, 'YYYY-MM')",
        ],
        frm: ['formulario', 'formulario'],
        
      },
      query: `SELECT DISTINCT $a$
                FROM tmp_mt_frms
                WHERE 1=1
                $w$
                ORDER BY 2`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },
  dash_mt_frmnr: {
    alias: 'medtrabegdpto',
    campos: {
      departamento: ['DEPARTAMENTO', false, true, 'C'],      
      eg: ['ENTE GESTOR', false, true, 'C'],
      gestion: ['GESTION', false, true, 'C'],
      periodo: ['MES', false, true, 'C'],
      frm: ['Tipo Formulario', false, true, 'C'],
    },
    ilogic: {      
      mt_frm_nr:`SELECT 
formulario AS pivot, ente_gestor AS col, 
departamento AS pila, 
TO_CHAR(periodo, 'YYYY-MM') AS ejex
FROM tmp_mt_frms
WHERE 
 reportado IS null $w$
GROUP BY 1,2,3,4
ORDER BY 1,2,3,4`
    },
    referer: [],
    primal: {
      equivalencia: {
        departamento: ['departamento', 'departamento'],        
        eg: ['ente_gestor', 'ente_gestor'],
        gestion: ['extract(year from periodo)', 'extract(year from periodo)'],
        periodo: [
          "TO_CHAR(periodo, 'YYYY-MM')",
          "TO_CHAR(periodo, 'YYYY-MM')",
        ],
        frm: ['formulario', 'formulario'],
        
      },
      query: `SELECT DISTINCT $a$
                FROM tmp_mt_frms
                WHERE reportado IS null
                $w$
                ORDER BY 2`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },
}
module.exports = PDEPENDENCIES
