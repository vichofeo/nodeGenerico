//extraCondicion:[[campo, valor], [campo2, valor]...]
'use strict'
const PDEPENDENCIES = {
  dash_ames: {
    alias: 'ames',
    campos: {
      departamento: ['DEPARTAMENTO', false, true, 'C',,,'M'],
      eg: ['ENTE GESTOR', false, true, 'C',,,'M'],
      establecimiento: ['ESTABLECIMIENTO', false, true, 'C',,,'M'],
      tipo_solicitud: ['TIPO DE SOLICITUD', false, true, 'C',,,'M'],
      servicio: ['SERVICIO', false, true, 'C',,,'M'],
      gestion: ['GESTION', false, true, 'C',,,'M'],
      genero: ['GENERO', false, true, 'C'],
      notificacion_legitimador: [
        'NOTIFICACION INFORME A LEGITIMADORES',
        false,
        true,
        'C'
      ],
      notificacion_msyd: ['NOTIFICACION AL MSyD', false, true, 'C'],
      apelacion: ['APELACIÓN', false, true, 'C'],
      art63: ['ART.    63', false, true, 'C'],
      art642: ['ART. 64,2', false, true, 'C'],
      art644: ['ART. 64,4', false, true, 'C'],
    },
    ilogic: {
      ames_ejecutadas: `SELECT gestion_ejecucion as gestion, COUNT(*) AS value, SUM(COUNT(*)) OVER (ORDER BY  gestion_ejecucion ) AS total_acumulado
                FROM tmp_ames
                WHERE 1=1 $w$
                GROUP BY gestion_ejecucion
                ORDER BY 1`,
      ames_eg_gestion: `SELECT 
                ente_gestor_name as pila, gestion_ejecucion as ejex, COUNT(*) AS value, SUM(COUNT(*)) OVER (PARTITION BY ente_gestor_name ORDER BY ente_gestor_name, gestion_ejecucion ) AS total_acumulado
                FROM tmp_ames 
                WHERE 1=1 $w$
                GROUP BY ente_gestor_name, gestion_ejecucion
                ORDER BY 1, 2`,
      ames_dpto_eg_gestion: `SELECT departamento as pila, gestion_ejecucion as ejex,  COUNT(*) AS value,
      to_char((select max(fecha_emision) from tmp_ames),'DD/MM/YYYY') as obs
                FROM tmp_ames 
                WHERE 1=1 $w$
                GROUP BY departamento, gestion_ejecucion 
                ORDER BY 1, 2`,
      ames_genero: `SELECT gestion_ejecucion as pila, genero as ejex,  COUNT (*) AS value
                FROM tmp_ames
                WHERE 1=1 $w$
                GROUP BY gestion_ejecucion, genero
                ORDER BY 1,2
                `,
      ames_tipo_sol: `SELECT departamento as pila, coalesce(tipo_solicitud,'Unknow') as ejex,  COUNT (*) AS value, 
                SUM(COUNT(*)) OVER (PARTITION BY departamento ORDER BY departamento, tipo_solicitud ) AS total_acumulado
                FROM tmp_ames
                WHERE 1=1 $w$
                GROUP BY departamento, tipo_solicitud
                ORDER BY 1,2`,
      ames_emision_ini: `SELECT 
                CASE WHEN fecha_emision IS null 
				THEN 'unknown' ELSE to_char(fecha_emision,'YYYY-MM')END AS periodo,
                COUNT(*) AS value
                FROM tmp_ames
                WHERE 1=1 $w$
                GROUP BY 1 ORDER BY 1`,
      ames_emision_fin: `SELECT 
                CASE WHEN cronograma IS null 
				THEN 'unknown' 
				ELSE to_char(cronograma,'YYYY-MM')END AS periodo,
                COUNT(*) AS value
                FROM tmp_ames
                WHERE 1=1 $w$
                GROUP BY 1 ORDER BY 1`,
      ames_eg_arts: `SELECT
                ente_gestor_name, 
                SUM(CASE WHEN art_63='SI' THEN 1 ELSE 0 END) AS art_63,
                SUM(CASE WHEN art_642 ='SI' THEN 1 ELSE 0 END) AS "art_64.2",
                SUM(CASE WHEN art_644 ='SI' THEN 1 ELSE 0 END) AS "art_64.4"
                FROM tmp_ames
                WHERE 1=1 $w$
                GROUP BY ente_gestor_name
                ORDER BY 1`,
      ames_gestion_arts: `SELECT
                gestion_ejecucion as gestion, 
                SUM(CASE WHEN art_63='SI' THEN 1 ELSE 0 END) AS art_63,
                SUM(CASE WHEN art_642 ='SI' THEN 1 ELSE 0 END) AS "art_64.2",
                SUM(CASE WHEN art_644 ='SI' THEN 1 ELSE 0 END) AS "art_64.4"
                FROM tmp_ames
                WHERE 1=1 $w$
                GROUP BY gestion_ejecucion
                ORDER BY 1`,
      ames_servicio: `SELECT servicio AS ejex, COUNT(*) AS value
                FROM tmp_ames WHERE 1=1 $w$
                GROUP BY 1
                ORDER BY 1`,
    },
    referer: [],
    primal: {
      equivalencia: {
        departamento: ['departamento', 'departamento'],
        eg: ['ente_gestor_name', 'ente_gestor_name'],
        establecimiento: ['establecimiento', "ente_gestor_name||': '|| departamento ||' - ' ||establecimiento"],
        tipo_solicitud: ['tipo_solicitud', 'tipo_solicitud'],
        servicio: ['servicio', 'servicio'],
        gestion: ['gestion_ejecucion', 'gestion_ejecucion'],
        genero: ['genero', 'genero'],
        notificacion_legitimador: [
          'notificacion_legitimador',
          'notificacion_legitimador',
        ],
        notificacion_msyd: ['notificacion_msyd', 'notificacion_msyd'],
        apelacion: ['apelacion', 'apelacion'],
        art63: ['art_63', 'art_63'],
        art642: ['art_642', 'art_642'],
        art644: ['art_644', 'art_644'],
      },
      query: `SELECT DISTINCT 
            $a$
            FROM tmp_ames
            WHERE 1=1
            $w$
            ORDER BY 2`,
      headers: [{}],
      attributes: `departamento, ente_gestor_name AS eg, establecimiento AS eess,
            gestion_solicitud, 
            gestion_ejecucion,
            TO_CHAR(cronograma,'dd/mm/yyyy') AS fecha_vencimiento,
            CASE  WHEN fecha_emision IS NULL THEN 'En espera por inicio..'
            WHEN (( cronograma )::DATE - NOW()::DATE)<0
                    THEN 'Vigencia CONCLUIDA'
                    ELSE 'Quedan: '||(( cronograma)::DATE - NOW()::DATE) || ' dias.'
                    END AS "vigencia",
                    CASE  WHEN (( cronograma )::DATE - NOW()::DATE)>60
                    THEN 'Vigente'
                    WHEN (( cronograma )::DATE - NOW()::DATE)>0 and (( cronograma )::DATE - NOW()::DATE) <=60
                    THEN 'Vencimiento proximo'
                    WHEN (( cronograma )::DATE - NOW()::DATE)<0
                    THEN 'Vencido'
                    ELSE 'N/A' END  AS alertax23`,
    },
    withInitial: true,
  },

  dash_inas: {
    alias: 'inas',
    campos: {
      //departamento:['DEPARTAMENTO', false, true, 'C'],
      departamento: ['CIUDAD', false, true, 'C',,,'M'],
      eg: ['ENTE GESTOR', false, true, 'C',,,'M'],
      establecimiento: ['ESTABLECIMIENTO', false, true, 'C',,,'M'],
      //tipo_solicitud:['TIPO DE SOLICITUD', false, true, 'C'],
      servicio: ['SERVICIO', false, true, 'C',,,'M'],
      gestion: ['GESTION', false, true, 'C',,,'M'],

      //genero:['GENERO', false, true, 'C'],
      //notificacion_legitimador:['NOTIFICACION INFORME A LEGITIMADORES', false, true, 'C'],
      //notificacion_msyd: ['NOTIFICACION AL MSyD', false, true, 'C'],
      //apelacion:['APELACIÓN', false, true, 'C'],
      //art63:['ART.    63', false, true, 'C'],
      //art642:['ART. 64,2', false, true, 'C'],
      //art644:['ART. 64,4', false, true, 'C']
    },
    ilogic: {
      ames_ejecutadas: `SELECT gestion_ejecucion as gestion, COUNT(*) AS value, SUM(COUNT(*)) OVER (ORDER BY  gestion_ejecucion ) AS total_acumulado
                FROM tmp_inas
                WHERE 1=1 $w$
                GROUP BY gestion_ejecucion
                ORDER BY 1`,
      ames_eg_gestion: `SELECT 
                ente_gestor_name as pila, gestion_ejecucion as ejex, COUNT(*) AS value, SUM(COUNT(*)) OVER (PARTITION BY ente_gestor_name ORDER BY ente_gestor_name, gestion_ejecucion ) AS total_acumulado
                FROM tmp_inas 
                WHERE 1=1 $w$
                GROUP BY ente_gestor_name, gestion_ejecucion
                ORDER BY 1, 2`,
      ames_dpto_eg_gestion: `SELECT departamento as pila, gestion_ejecucion as ejex,  COUNT(*) AS value,
      to_char((select max(fecha_emision) from tmp_inas),'DD/MM/YYYY') as obs
                FROM tmp_inas 
                WHERE 1=1 $w$
                GROUP BY departamento, gestion_ejecucion 
                ORDER BY 1, 2`,
      /*ames_genero:`SELECT gestion_ejecucion as pila, genero as ejex,  COUNT (*) AS value
                FROM tmp_ames
                WHERE 1=1 $w$
                GROUP BY gestion_ejecucion, genero
                ORDER BY 1,2`,
                ames_tipo_sol:`SELECT departamento as pila, tipo_solicitud as ejex,  COUNT (*) AS value, 
                SUM(COUNT(*)) OVER (PARTITION BY departamento ORDER BY departamento, tipo_solicitud ) AS total_acumulado
                FROM tmp_ames
                WHERE 1=1 $w$
                GROUP BY departamento, tipo_solicitud
                ORDER BY 1,2`,*/
      ames_emision_ini: `SELECT 
                CASE WHEN fecha_emision IS null 
				THEN 'unknown' ELSE to_char(fecha_emision,'YYYY-MM')END AS periodo,
                COUNT(*) AS value
                FROM tmp_inas
                WHERE 1=1 $w$
                GROUP BY 1 ORDER BY 1`,
      ames_emision_fin: `SELECT 
                CASE WHEN cronograma IS null 
				THEN 'unknown' 
				ELSE to_char(cronograma,'YYYY-MM')END AS periodo,
                COUNT(*) AS value
                FROM tmp_inas
                WHERE 1=1 $w$
                GROUP BY 1 ORDER BY 1`,
      /*ames_eg_arts:`SELECT
                ente_gestor_name, 
                SUM(CASE WHEN art_63='SI' THEN 1 ELSE 0 END) AS art_63,
                SUM(CASE WHEN art_642 ='SI' THEN 1 ELSE 0 END) AS "art_64.2",
                SUM(CASE WHEN art_644 ='SI' THEN 1 ELSE 0 END) AS "art_64.4"
                FROM tmp_ames
                WHERE 1=1 $w$
                GROUP BY ente_gestor_name
                ORDER BY 1`,
                ames_gestion_arts:`SELECT
                gestion_ejecucion, 
                SUM(CASE WHEN art_63='SI' THEN 1 ELSE 0 END) AS art_63,
                SUM(CASE WHEN art_642 ='SI' THEN 1 ELSE 0 END) AS "art_64.2",
                SUM(CASE WHEN art_644 ='SI' THEN 1 ELSE 0 END) AS "art_64.4"
                FROM tmp_ames
                WHERE 1=1 $w$
                GROUP BY gestion_ejecucion
                ORDER BY 1`,*/
      ames_servicio: `SELECT servicio AS ejex, COUNT(*) AS value
                FROM tmp_inas WHERE 1=1 $w$
                GROUP BY 1
                ORDER BY 1`,
    },
    referer: [],
    primal: {
      equivalencia: {
        departamento: ['departamento', 'departamento'],
        eg: ['ente_gestor_name', 'ente_gestor_name'],
        establecimiento: ['establecimiento', "ente_gestor_name||': '|| departamento ||' - ' ||establecimiento"],
        //tipo_solicitud:['tipo_solicitud', 'tipo_solicitud'],
        servicio: ['servicio', 'servicio'],
        gestion: ['gestion_ejecucion', 'gestion_ejecucion'],
        //genero:['genero', 'genero'],
        //notificacion_legitimador:['notificacion_legitimador','notificacion_legitimador'],
        //notificacion_msyd: ['notificacion_msyd','notificacion_msyd'],
        //apelacion:['apelacion','apelacion'],
        //art63:['art_63','art_63'],
        //art642:['art_642','art_642'],
        //art644:['art_644','art_644']
      },
      query: `SELECT DISTINCT 
            $a$
            FROM tmp_inas
            WHERE 1=1
            $w$
            ORDER BY 2`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },
  dash_rrame: {
    alias: 'rrame',
    campos: {
      //departamento:['DEPARTAMENTO', false, true, 'C'],
      departamento: ['CIUDAD', false, true, 'C',,,'M'],
      eg: ['ENTE GESTOR', false, true, 'C',,,'M'],
      establecimiento: ['ESTABLECIMIENTO', false, true, 'C',,,'M'],
      //tipo_solicitud:['TIPO DE SOLICITUD', false, true, 'C'],
      servicio: ['SERVICIO', false, true, 'C',,,'M'],
      gestion: ['GESTION', false, true, 'C',,,'M'],

      //genero:['GENERO', false, true, 'C'],
      //notificacion_legitimador:['NOTIFICACION INFORME A LEGITIMADORES', false, true, 'C'],
      //notificacion_msyd: ['NOTIFICACION AL MSyD', false, true, 'C'],
      //apelacion:['APELACIÓN', false, true, 'C'],
      //art63:['ART.    63', false, true, 'C'],
      //art642:['ART. 64,2', false, true, 'C'],
      //art644:['ART. 64,4', false, true, 'C']
    },
    ilogic: {
      ames_ejecutadas: `SELECT gestion_ejecucion as gestion, COUNT(*) AS value, SUM(COUNT(*)) OVER (ORDER BY  gestion_ejecucion ) AS total_acumulado
                FROM tmp_rrame
                WHERE 1=1 $w$
                GROUP BY gestion_ejecucion
                ORDER BY 1`,
      ames_eg_gestion: `SELECT 
                ente_gestor_name as pila, gestion_ejecucion as ejex, COUNT(*) AS value, SUM(COUNT(*)) OVER (PARTITION BY ente_gestor_name ORDER BY ente_gestor_name, gestion_ejecucion ) AS total_acumulado
                FROM tmp_rrame 
                WHERE 1=1 $w$
                GROUP BY ente_gestor_name, gestion_ejecucion
                ORDER BY 1, 2`,
      ames_dpto_eg_gestion: `SELECT departamento as pila, gestion_ejecucion as ejex,  COUNT(*) AS value,
      to_char((select max(fecha_emision) from tmp_rrame),'DD/MM/YYYY') as obs
                FROM tmp_rrame 
                WHERE 1=1 $w$
                GROUP BY departamento, gestion_ejecucion 
                ORDER BY 1, 2`,
      /*ames_genero:`SELECT gestion as pila, genero as ejex,  COUNT (*) AS value
                FROM tmp_ames
                WHERE 1=1 $w$
                GROUP BY gestion, genero
                ORDER BY 1,2`,
                ames_tipo_sol:`SELECT departamento as pila, tipo_solicitud as ejex,  COUNT (*) AS value, 
                SUM(COUNT(*)) OVER (PARTITION BY departamento ORDER BY departamento, tipo_solicitud ) AS total_acumulado
                FROM tmp_ames
                WHERE 1=1 $w$
                GROUP BY departamento, tipo_solicitud
                ORDER BY 1,2`,*/
      ames_emision_ini: `SELECT 
                CASE WHEN fecha_emision IS null 
				THEN 'unknown' ELSE to_char(fecha_emision,'YYYY-MM')END AS periodo,
                COUNT(*) AS value
                FROM tmp_rrame
                WHERE 1=1 $w$
                GROUP BY 1 ORDER BY 1`,
      /*ames_emision_fin:`SELECT 
                CASE WHEN cronograma IS null 
				THEN 'unknown' 
				ELSE to_char(cronograma,'YYYY-MM')END AS periodo,
                COUNT(*) AS value
                FROM tmp_rrame
                WHERE 1=1 $w$
                GROUP BY 1 ORDER BY 1`,*/
      /*ames_eg_arts:`SELECT
                ente_gestor_name, 
                SUM(CASE WHEN art_63='SI' THEN 1 ELSE 0 END) AS art_63,
                SUM(CASE WHEN art_642 ='SI' THEN 1 ELSE 0 END) AS "art_64.2",
                SUM(CASE WHEN art_644 ='SI' THEN 1 ELSE 0 END) AS "art_64.4"
                FROM tmp_ames
                WHERE 1=1 $w$
                GROUP BY ente_gestor_name
                ORDER BY 1`,
                ames_gestion_arts:`SELECT
                gestion, 
                SUM(CASE WHEN art_63='SI' THEN 1 ELSE 0 END) AS art_63,
                SUM(CASE WHEN art_642 ='SI' THEN 1 ELSE 0 END) AS "art_64.2",
                SUM(CASE WHEN art_644 ='SI' THEN 1 ELSE 0 END) AS "art_64.4"
                FROM tmp_ames
                WHERE 1=1 $w$
                GROUP BY gestion
                ORDER BY 1`,*/
      ames_servicio: `SELECT coalesce(servicio,'Unknow') AS ejex, COUNT(*) AS value
                FROM tmp_rrame WHERE 1=1 $w$
                GROUP BY 1
                ORDER BY 1`,
    },
    referer: [],
    primal: {
      equivalencia: {
        departamento: ['departamento', 'departamento'],
        eg: ['ente_gestor_name', 'ente_gestor_name'],
        establecimiento: ["ente_gestor_name||': '|| departamento", "ente_gestor_name||': '|| departamento"],
        //tipo_solicitud:['tipo_solicitud', 'tipo_solicitud'],
        servicio: ['servicio', 'servicio'],
        gestion: ['gestion_ejecucion', 'gestion_ejecucion'],
        //genero:['genero', 'genero'],
        //notificacion_legitimador:['notificacion_legitimador','notificacion_legitimador'],
        //notificacion_msyd: ['notificacion_msyd','notificacion_msyd'],
        //apelacion:['apelacion','apelacion'],
        //art63:['art_63','art_63'],
        //art642:['art_642','art_642'],
        //art644:['art_644','art_644']
      },
      query: `SELECT DISTINCT 
            $a$
            FROM tmp_rrame
            WHERE 1=1
            $w$
            ORDER BY 2`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },
  mydash: {
    alias: 'MyDasboard',
    campos: {
      gestion: ['Gestion', false, true, 'C'],
      evaluaciones: ['Evaluaciones', false, true, 'TT'],
      dptos: ['Evaluaciones por Departamento', false, true, 'TT'],
      estados: ['Estado Evaluacion por Formulario', false, true, 'TT'],
      pac_fin: ['PAC x Fecha Cumplimiento', false, true, 'TT'],
      pac_ini: ['PAC x Fecha Inicio', false, true, 'TT'],
    },
    ilogic: {
      gestion: `SELECT DISTINCT extract(year from create_date) as value, extract(year from create_date) as text            
            FROM u_frm_evaluacion
            ORDER BY 2 desc`,
      evaluaciones: `SELECT a.atributo_id, a.atributo AS estado, a.color, COUNT(e.*) AS VALUE,
            SUM(COUNT(e.*)) OVER (ORDER BY a.atributo_id )
              AS evaluaciones, 
              SUM(Sum(case when e.excelencia = true THEN 1 ELSE 0 END)) OVER (ORDER BY a.atributo_id ) AS excelencia
            FROM u_is_atributo a
            LEFT JOIN u_frm_evaluacion e ON (e.concluido =  a.atributo_id AND extract(year FROM e.create_date)='$campoForeign')
            WHERE a.grupo_atributo='ESTADO_CONCLUSION'
             AND a.atributo_id>'0' 
            GROUP BY a.atributo_id, a.atributo, a.color
            ORDER BY a.atributo_id`,
      dptos: `SELECT dpto.cod_dpto,dpto.nombre_dpto AS dpto, f.orden, f.nombre_corto AS frm, COUNT(e.*) AS value
             FROM u_frm f
             LEFT JOIN u_frm_evaluacion e   ON ( f.frm_id=e.frm_id AND extract(year from e.create_date)= '$gestion')
             left JOIN ae_institucion i ON (e.institucion_id =  i.institucion_id)
             left JOIN al_departamento dpto ON (i.cod_pais =  dpto.cod_pais AND i.cod_dpto=dpto.cod_dpto)
             WHERE
             f.codigo_root='-1'
             GROUP BY dpto.cod_dpto,dpto.nombre_dpto, f.orden, f.nombre_corto
             ORDER BY dpto.cod_dpto, f.orden `,
      estados: ` SELECT 
                f.orden, f.nombre_corto as frm, a.atributo_id, a.atributo as estado, a.color, COUNT(*) AS value,
                SUM(COUNT(*)) OVER (PARTITION BY f.nombre_corto ORDER BY a.atributo_id ) as acumulado
                FROM u_is_atributo a,
                u_frm_evaluacion e, u_frm f
                WHERE 
                a.atributo_id =  e.concluido AND e.frm_id= f.frm_id
                and extract(year from e.create_date)= '$gestion'
                GROUP BY f.orden, f.nombre_corto, a.atributo_id, a.atributo, a.color
                ORDER BY f.orden, a.atributo_id `,
      pac_fin: `SELECT 
            CASE WHEN p.fecha_complimiento IS null THEN 's/Iniciar' ELSE to_char(p.fecha_complimiento,'YYYY-MM')END AS mes,
            COUNT(*) AS value
            FROM u_frm_evaluacion e, u_frm_valores v, u_frm_plan_accion p
            WHERE 
            e.evaluacion_id = v.evaluacion_id AND v.valores_id=p.valores_id and extract(year from e.create_date)= '$gestion'
            GROUP BY 1 ORDER BY 1`,
      pac_ini: `SELECT 
            CASE WHEN p.fecha_registro IS null THEN 's/Iniciar' ELSE to_char(p.fecha_registro,'YYYY-MM')END AS mes,
            COUNT(*) AS value
            FROM u_frm_evaluacion e, u_frm_valores v, u_frm_plan_accion p
            WHERE 
            e.evaluacion_id = v.evaluacion_id AND v.valores_id=p.valores_id and extract(year from e.create_date)= '$gestion'
            GROUP BY 1 ORDER BY 1`,
    },
    referer: [],
  },
}
module.exports = PDEPENDENCIES
