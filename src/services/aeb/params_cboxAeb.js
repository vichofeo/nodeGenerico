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
  aeb_georef: {
    alias: 'aeb_georef',
    campos: {eg: ['Ente Gestor', false, true, 'C', , , 'M'],
      dpto: ['Departamento', false, true, 'C', , , 'M'],
      eess: ['Establecimiento de Salud', false, true, 'C', , , 'M'],},
    title_obj:{title:'NUMERO DE ESTABLECIMIENTOS DE SALUD DE LA SSCP', subtitle:'Por departamento y nivel de atención'},  
    ilogic: {
      aeb_georef: `SELECT 
              eg.nombre_institucion as ente_gestor, i.nombre_institucion, r.nivel_atencion, a.atributo AS nivel, r.snis,
              i.cod_dpto AS dpto, dpto.nombre_dpto AS ndpto,
              --i.telefono, i.direccion_web, 
              COALESCE (i.zona_barrio,'')||'; '||COALESCE (i.avenida_calle,'') AS direccion,
              COALESCE (i.latitud, dpto.latitud) AS latitud, COALESCE (i.longitud, dpto.longitud) AS longitud,
              to_char(i.fecha_creacion,'DD/MM/YYYY') AS creacion,
              case WHEN STRPOS(r.codigo, 'SN')>0 THEN '-SinCodigo-' ELSE r.codigo END AS cue,
              COALESCE (i.latitud, 'NAN') ||' , '|| COALESCE (i.longitud, 'NAN') AS latlng
              FROM r_institucion_salud r, ae_institucion i, ae_institucion eg, r_is_atributo a, al_departamento dpto
              WHERE 
              r.institucion_id = i.institucion_id AND r.ente_gestor_id = eg.institucion_id AND r.nivel_atencion=a.atributo_id 
              AND i.cod_pais=dpto.cod_pais AND i.cod_dpto = dpto.cod_dpto
              AND r.nivel_atencion IN ('1ERNIVEL','2DONIVEL','3ERNIVEL')
                  $w$`,
      entre_periodos:`select 'Con Cod. RUES y ' as amin, 'Sin Cod RUES' as amax` 
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
  aeb_depniv: {
    alias: 'aeb_depniv',
    campos: {eg: ['Ente Gestor', false, true, 'C', , , 'M'],
      dpto: ['Departamento', false, true, 'C', , , 'M'],
      eess: ['Establecimiento de Salud', false, true, 'C', , , 'M'],},
    title_obj:{title:'NUMERO DE ESTABLECIMIENTOS DE SALUD DE LA SSCP', subtitle:'Y sus niveles de atención'},    
    ilogic: {
      aeb_depniv: `SELECT 
                eg.nombre_corto as ente_gestor, dpto.nombre_dpto AS dpto,
                r.nivel_atencion||r.snis AS nivel_atencion, 
                a.atributo || case WHEN r.snis='Y' THEN ' (c/cr)' ELSE ' (s/cr)' END  AS nivel,
                COUNT(*) AS value,
                SUM(COUNT(*)) OVER (PARTITION BY eg.nombre_corto ORDER BY eg.nombre_corto )  AS acumulado
                FROM r_institucion_salud r, ae_institucion i, ae_institucion eg, r_is_atributo a, al_departamento dpto
                WHERE 
                r.institucion_id = i.institucion_id AND i.institucion_root = eg.institucion_id AND r.nivel_atencion=a.atributo_id 
                AND i.cod_pais=dpto.cod_pais AND i.cod_dpto = dpto.cod_dpto
                AND r.nivel_atencion IN ('1ERNIVEL','2DONIVEL','3ERNIVEL')
                $w$
                GROUP BY 1,2,3,4
                ORDER BY acumulado DESC,1, 2, 3
                `,
      entre_periodos:`select 'Con Cod. RUES y ' as amin, 'Sin Cod RUES' as amax` 
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
 
}
module.exports = PDEPENDENCIES
