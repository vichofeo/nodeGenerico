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
  ufsmt_frma: {
    alias: 'ufsmt_frma',
    campos: cmps,
    ilogic: {
      /*ufsmt_frma: `SELECT 
                CASE WHEN f.grupo_atributo IS NOT NULL AND  f.grupo_atributo<> 'F_ROW_CIE10_10PAMT' AND substring(p.codigo,1,1)<>'C'
                THEN f.orden||'. ' ELSE  '' END  ||COALESCE(f.atributo,'') AS grupo, 

                --eg.nombre_institucion AS "Ente Gestor",

                dpto.nombre_dpto as subgrupo,
                sum(ll.texto::integer) AS value
                FROM ae_institucion eg,
                f_formulario frm,  u_is_atributo a, f_formulario_registro r,  f_frm_enunciado p, f_frm_subfrm s, f_formulario_llenado ll
                LEFT JOIN f_is_atributo f ON (f.atributo_id= ll.row_ll)
                LEFT JOIN f_is_atributo c ON (c.atributo_id= ll.col_ll)
                LEFT JOIN f_is_atributo sc ON (sc.atributo_id= ll.scol_ll),
                ae_institucion i 
                LEFT JOIN al_departamento dpto ON (dpto.cod_dpto=i.cod_dpto)
                WHERE eg.institucion_id =  i.institucion_root
                AND a.atributo_id =  r.concluido
                AND frm.formulario_id =  r.formulario_id AND i.institucion_id= r.institucion_id
                and r.registro_id= ll.registro_id
                AND ll.formulario_id =  p.formulario_id AND ll.subfrm_id=p.subfrm_id AND ll.enunciado_id= p.enunciado_id
                AND p.formulario_id = s.formulario_id AND p.subfrm_id=s.subfrm_id
                AND frm.codigo_formulario='FRM003'
                AND s.codigo='A.'
                AND p.codigo='A1'
                $w$
                AND ll.row_ll IN ('Fv2A1', 'Fv2A2', 'Fv2A3')
                GROUP BY 1, 2
                ORDER BY 1,2
                `,*/
      ufsmt_frma: `SELECT 
                CASE WHEN f.grupo_atributo IS NOT NULL AND  f.grupo_atributo<> 'F_ROW_CIE10_10PAMT' AND substring(p.codigo,1,1)<>'C'
                THEN f.orden||'. ' ELSE  '' END  ||COALESCE(f.atributo,'') AS grupo, 
 

                dpto.nombre_dpto as subgrupo,
eg.nombre_institucion AS "insitucion",
COALESCE(c.atributo,'') AS "grupo_etario", 
COALESCE(sc.atributo,'') AS genero,
                sum(ll.texto::integer) AS value
                FROM ae_institucion eg,
                f_formulario frm,  u_is_atributo a, f_formulario_registro r,  f_frm_enunciado p, f_frm_subfrm s, f_formulario_llenado ll
                LEFT JOIN f_is_atributo f ON (f.atributo_id= ll.row_ll)
                LEFT JOIN f_is_atributo c ON (c.atributo_id= ll.col_ll)
                LEFT JOIN f_is_atributo sc ON (sc.atributo_id= ll.scol_ll),
                ae_institucion i 
                LEFT JOIN al_departamento dpto ON (dpto.cod_dpto=i.cod_dpto)
                WHERE eg.institucion_id =  i.institucion_root
                AND a.atributo_id =  r.concluido
                AND frm.formulario_id =  r.formulario_id AND i.institucion_id= r.institucion_id
                and r.registro_id= ll.registro_id
                AND ll.formulario_id =  p.formulario_id AND ll.subfrm_id=p.subfrm_id AND ll.enunciado_id= p.enunciado_id
                AND p.formulario_id = s.formulario_id AND p.subfrm_id=s.subfrm_id
                AND frm.codigo_formulario='FRM003'
                AND s.codigo='A.'
                AND p.codigo='A1'
  $w$
                AND ll.row_ll IN ('Fv2A1', 'Fv2A2', 'Fv2A3')
                GROUP BY 1, 2, 3, 4, 5
                ORDER BY 1,2,3
      `
    },
    referer: [],
    primal: {
      equivalencia: {
        gestion: ["TO_CHAR(TO_DATE(r.periodo,'YYYYMMDD'), 'YYYY')", "TO_CHAR(TO_DATE(r.periodo,'YYYYMMDD'), 'YYYY')"],
        periodo: ["TO_CHAR(TO_DATE(r.periodo,'YYYYMMDD'), 'YYYY-MM')", "TO_CHAR(TO_DATE(r.periodo,'YYYYMMDD'), 'YYYY-MM')" ],
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
