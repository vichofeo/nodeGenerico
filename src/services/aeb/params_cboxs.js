const SS_CBOXSS = require('./params_cboxsSS')
//extraCondicion:[[campo, valor], [campo2, valor]...]
'use strict'
const PDEPENDENCIES = {
  dash_hemofilia: {
    alias: 'hemofilia',
    campos: {
      departamento: ['DEPARTAMENTO', false, true, 'C'],
      establecimiento_o: ['ESTABLECIMIENTO CAPTO CASO', false, true, 'C'],
      nivel_o: ['NIVEL EESS. CAPTO CASO', false, true, 'C'],
      eg: ['ENTE GESTOR', false, true, 'C'],
      establecimiento_t: [
        'ESTABLECIMIENTO REALIZA TRATAMIENTO',
        false,
        true,
        'C',
      ],
      nivel_t: ['NIVEL EESS TRATAMIENTO', false, true, 'C'],

      gestion: ['GESTION', false, true, 'C'],
      genero: ['GENERO', false, true, 'C'],

      tipo_registro: ['NUEVO / REPETIDO', false, true, 'C'],
    },
    ilogic: {
      hemo_casos: `SELECT
        sum(CASE WHEN h_leve IS NOT NULL THEN 1 ELSE 0 END ) AS Leve,
        sum(CASE WHEN h_moderada IS NOT NULL THEN 1 ELSE 0 END ) AS Moderada,
        sum(CASE WHEN h_severa IS NOT NULL THEN 1 ELSE 0 END ) AS Severa, 
        sum(CASE WHEN tratamiento_ambulatorio IS NOT NULL THEN 1 ELSE 0 END ) AS "T. Ambul.",
        sum(CASE WHEN tratamiento_hospitalario IS NOT NULL THEN 1 ELSE 0 END ) AS "T. Hospi.", 
        COUNT(*) AS total 
        FROM tmp_hemofilia
        WHERE 1=1 $w$`,
      hemo_eg: `SELECT 
                ente_gestor as pila, 
                tipo_hemofilia AS  ejex, 
					 COUNT(*) AS value, 
					 SUM(COUNT(*)) OVER (PARTITION BY ente_gestor ORDER BY ente_gestor ) AS total_acumulado
                FROM tmp_hemofilia
                WHERE 1=1 $w$
                GROUP BY 1,2
                ORDER BY 1, 2`,
      hemo_tipo: `SELECT 
                ente_gestor as pila,                 
              tipo_hemofilia AS grupo,
              CASE WHEN h_leve ='X' THEN tipo_hemofilia ||' - Leve' 
              WHEN h_moderada ='X' THEN tipo_hemofilia ||' - Moderada' 
              WHEN h_severa ='X' THEN tipo_hemofilia ||' - Severa' 
              ELSE tipo_hemofilia ||' - Unknown' END  AS  ejex,
              COUNT(*) AS value					 
                FROM tmp_hemofilia
                WHERE 1=1 $w$
                GROUP BY 1,2,3
                ORDER BY 1, 2,3 `,
      hemo_dpto: `SELECT departamento as pila,  tipo_hemofilia AS ejex, COUNT(*) AS value					 
                FROM tmp_hemofilia
                WHERE 1=1 $w$
                GROUP BY 1,2
                ORDER BY 1, 2`,
      hemo_genero: `SELECT tipo_hemofilia as pila,genero AS ejex, COUNT(*) AS value					 
                FROM tmp_hemofilia
                WHERE 1=1 $w$
                GROUP BY 1,2
                ORDER BY 1, 2`,
      hemo_hetario: `SELECT 
        genero as ejex,
        SUM(CASE WHEN cast(edad as decimal) >=0 and cast(edad as decimal)<=5 THEN 1 ELSE 0 END)as "0-5",
        SUM(CASE WHEN cast(edad as decimal) >5 and cast(edad as decimal)<=10 THEN 1 ELSE 0 END) as "5-10",
        SUM(CASE WHEN cast(edad as decimal) >10 and cast(edad as decimal)<=15 THEN 1 ELSE 0 END) as "10-15",
        SUM(CASE WHEN cast(edad as decimal) >15 and cast(edad as decimal)<=20 THEN 1 ELSE 0 END) as "15-20",
        SUM(CASE WHEN cast(edad as decimal) >20 and cast(edad as decimal)<=25 THEN 1 ELSE 0 END) as "20-25",
        SUM(CASE WHEN cast(edad as decimal) >25 and cast(edad as decimal)<=30 THEN 1 ELSE 0 END) as "25-30",
        SUM(CASE WHEN cast(edad as decimal) >30 and cast(edad as decimal)<=35 THEN 1 ELSE 0 END) as "30-35",
        SUM(CASE WHEN cast(edad as decimal) >35 and cast(edad as decimal)<=40 THEN 1 ELSE 0 END) as "35-40",
        SUM(CASE WHEN cast(edad as decimal) >40 and cast(edad as decimal)<=45 THEN 1 ELSE 0 END) as "40-45",
        SUM(CASE WHEN cast(edad as decimal) >45 and cast(edad as decimal)<=50 THEN 1 ELSE 0 END) as "45-50",
        SUM(CASE WHEN cast(edad as decimal) >50 and cast(edad as decimal)<=55 THEN 1 ELSE 0 END) as "50-55",
        SUM(CASE WHEN cast(edad as decimal) >55 and cast(edad as decimal)<=60 THEN 1 ELSE 0 END) as "55-60",
        SUM(CASE WHEN cast(edad as decimal) >60 and cast(edad as decimal)<=65 THEN 1 ELSE 0 END) as "60-65",
        SUM(CASE WHEN cast(edad as decimal) >65 and cast(edad as decimal)<=70 THEN 1 ELSE 0 END) as "65-70",
        SUM(CASE WHEN cast(edad as decimal) >70 and cast(edad as decimal)<=75 THEN 1 ELSE 0 END) as "70-75",
        SUM(CASE WHEN cast(edad as decimal) >75 and cast(edad as decimal)<=80 THEN 1 ELSE 0 END) as "75-80",
        SUM(CASE WHEN cast(edad as decimal) >80 and cast(edad as decimal)<=85 THEN 1 ELSE 0 END) as "80-85",
        SUM(CASE WHEN cast(edad as decimal) >85  THEN 1 ELSE 0 END) as "85++"
        FROM tmp_hemofilia
        WHERE 1=1 $w$
        GROUP BY genero`,
      hemo_severidad: `SELECT 
                ente_gestor ,                 
                SUM(CASE WHEN h_leve ='X' THEN 1 ELSE 0 END) AS "Leve",
                SUM(CASE WHEN h_moderada ='X' THEN 1 ELSE 0 END) AS "Moderada",
                SUM(CASE WHEN h_severa ='X' THEN 1 ELSE 0 END) AS "Severa",
                SUM( CASE WHEN h_leve ='X' THEN 0 
                    WHEN h_moderada ='X' THEN 0
                    WHEN h_severa ='X' THEN 0
                    ELSE 1 END)  AS  Unknown              
                FROM tmp_hemofilia
                WHERE 1=1  $w$
                GROUP BY 1
                ORDER BY 1`,
      hemo_dpto_tipo: `SELECT departamento as pila,   tipo_registro as ejex, COUNT(*) AS value,
              SUM(COUNT(*)) OVER (PARTITION BY departamento ORDER BY departamento, tipo_registro ) AS total_acumulado					 
                FROM tmp_hemofilia
                WHERE 1=1 $w$
                GROUP BY 1,2
                ORDER BY 1, 2 `,
      hemo_tipo_registro: `SELECT tipo_registro AS pila, COUNT(*) AS value,
      SUM(COUNT(*)) OVER (PARTITION BY tipo_registro ORDER BY tipo_registro ) AS total_acumulado
                FROM tmp_hemofilia
                WHERE 1=1 $w$
                GROUP BY 1
					 ORDER BY 1`,
    },
    referer: [],
    primal: {
      equivalencia: {
        departamento: ['departamento', 'departamento'],
        establecimiento_o: ['establecimiento_origen', 'establecimiento_origen'],
        nivel_o: ['nivel_atencion_origen', 'nivel_atencion_origen'],
        eg: ['ente_gestor', 'ente_gestor'],
        establecimiento_t: [
          'establecimiento_tratamiento',
          'establecimiento_tratamiento',
        ],
        nivel_t: ['nivel_atencion_tratamiento', 'nivel_atencion_tratamiento'],
        gestion: ['gestion', 'gestion'],
        genero: ['genero', 'genero'],
        tipo_registro: ['tipo_registro', 'tipo_registro'],
      },
      query: `SELECT DISTINCT $a$
            FROM tmp_hemofilia
            WHERE 1=1
            $w$
            ORDER BY 2`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },

  dash_carmelo: {
    alias: 'hemofilia',
    campos: {
      departamento: ['DEPARTAMENTO', false, true, 'C'],
      eg: ['ENTE GESTOR', false, true, 'C'],
      establecimiento: ['ESTABLECIMIENTO', false, true, 'C'],
      nivel: ['NIVEL ATENCION', false, true, 'C'],

      gestion: ['GESTION', false, true, 'C'],
      genero: ['GENERO', false, true, 'C'],
      especialidad: ['ESPECIALIDAD', false, true, 'C'],
    },
    ilogic: {
      car_eg: `SELECT  ente_gestor  AS pila ,COUNT(*) AS value
        FROM tmp_carmelo WHERE 1=1 $w$
        GROUP BY 1
        ORDER BY 2 `,
      car_dpto: `SELECT  departamento as pila ,COUNT(*) AS value
        FROM tmp_carmelo WHERE 1=1 $w$
        GROUP BY 1
        ORDER BY 2 `,
      car_nivel: `SELECT  nivel_atencion as pila ,COUNT(*) AS value
        FROM tmp_carmelo WHERE 1=1 $w$
        GROUP BY 1
        ORDER BY 2 `,
      car_genero_eg: `SELECT ente_gestor as pila, genero AS ejex, COUNT(*) AS value					 
                FROM tmp_carmelo
                WHERE 1=1 $w$
                GROUP BY 1,2
                ORDER BY 3 DESC,1,2`,
      car_genero_dpto: `SELECT departamento as pila, genero AS ejex, COUNT(*) AS value					 
                FROM tmp_carmelo
                WHERE 1=1 $w$
                GROUP BY 1,2
                ORDER BY 3 DESC,1,2`,
      car_genero: `SELECT genero as pila,  COUNT(*) AS value,
        SUM(COUNT(*)) OVER (PARTITION BY genero ORDER BY genero ) AS total_acumulado					 
                FROM tmp_carmelo
                WHERE 1=1 $w$
                GROUP BY 1
                ORDER BY 1`,
      car_etario: `SELECT 
        genero as ejex,        
        SUM(CASE WHEN cast(edad as decimal) >100  THEN 1 ELSE 0 END) as "100++",
        SUM(CASE WHEN cast(edad as decimal) >90 and cast(edad as decimal)<=99 THEN 1 ELSE 0 END) as "90-99",
        SUM(CASE WHEN cast(edad as decimal) >80 and cast(edad as decimal)<=89 THEN 1 ELSE 0 END) as "80-89",
        SUM(CASE WHEN cast(edad as decimal) >70 and cast(edad as decimal)<=79 THEN 1 ELSE 0 END) as "70-79",
        SUM(CASE WHEN cast(edad as decimal) >60 and cast(edad as decimal)<=69 THEN 1 ELSE 0 END) as "60-69",
        SUM(CASE WHEN cast(edad as decimal)<=59 THEN 1 ELSE 0 END) as "--59",
        SUM(CASE WHEN edad is null THEN 1 ELSE 0 END) as "Unknown"
        FROM tmp_carmelo
        WHERE 1=1 $w$
        GROUP BY genero`,
      car_dpto_eg: `SELECT departamento as pila,  ente_gestor AS ejex, COUNT(*) AS value, 
                  TO_CHAR((SELECT MAX(fecha_dispensacion)FROM tmp_carmelo),'dd/mm/YYYY') AS obs
                FROM tmp_carmelo
                WHERE 1=1 $w$
                GROUP BY 1,2
                ORDER BY 3, 1, 2`,
      car_gestion_eg: `SELECT ente_gestor as pila,  extract(year from fecha_dispensacion) AS ejex, COUNT(*) AS value					 
                FROM tmp_carmelo
                WHERE 1=1 $w$
                GROUP BY 1,2
                ORDER BY 1, 2`,
      car_gestion_dpto: `SELECT departamento as pila,  extract(year from fecha_dispensacion) AS ejex, COUNT(*) AS value					 
                FROM tmp_carmelo
                WHERE 1=1 $w$
                GROUP BY 1,2
                ORDER BY 1, 2`,
      car_especialidad: `SELECT especialidad as ejex,  COUNT(*) AS value,
        SUM(COUNT(*)) OVER (PARTITION BY especialidad ORDER BY especialidad ) AS total_acumulado					 
                FROM tmp_carmelo
                WHERE 1=1 $w$
                GROUP BY 1
                ORDER BY 2 desc
        `,
    },
    referer: [],
    primal: {
      equivalencia: {
        departamento: ['departamento', 'departamento'],
        eg: ['ente_gestor', 'ente_gestor'],
        establecimiento: ['establecimiento', 'establecimiento'],
        nivel: ['nivel_atencion', 'nivel_atencion'],
        gestion: [
          'extract(year from fecha_dispensacion)',
          'extract(year from fecha_dispensacion)',
        ],
        genero: ['genero', 'genero'],
        especialidad: ['especialidad', 'especialidad'],
      },
      query: `SELECT DISTINCT $a$
                FROM tmp_carmelo
                WHERE 1=1
                $w$
                ORDER BY 2`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },

  dash_pai: {
    alias: 'pai',
    campos: {
      departamento: ['DEPARTAMENTO', false, true, 'C'],
      municipio: ['MUNICIPIO', false, true, 'C'],
      eg: ['ENTE GESTOR', false, true, 'C'],
      establecimiento: ['ESTABLECIMIENTO', false, true, 'C'],

      gestion: ['GESTION', false, true, 'C'],
      periodo: ['MES', false, true, 'C'],
      genero: ['GENERO', false, true, 'C'],
      vacuna: ['VACUNA', false, true, 'C'],
      dosis: ['DOSIS', false, true, 'C'],
    },
    ilogic: {
      pai_eg: `SELECT  ente_gestor  AS pila ,COUNT(*) AS value
      FROM tmp_pai WHERE 1=1 $w$
      GROUP BY 1
      ORDER BY 2 `,
      pai_dpto: `SELECT  departamento as pila ,COUNT(*) AS value
      FROM tmp_pai WHERE 1=1 $w$
      GROUP BY 1
      ORDER BY 2 `,
      pai_dpto_eg: `SELECT  departamento as pila, ente_gestor as ejex, COUNT(*) AS value
      FROM tmp_pai WHERE 1=1 $w$
      GROUP BY 1,2
      ORDER BY 1,2`,
      pai_vacun_eg: `SELECT  ente_gestor as pila, vacuna as ejex, COUNT(*) AS value
      FROM tmp_pai WHERE 1=1 $w$
      GROUP BY 1,2
      ORDER BY 1,2`,
      pai_vacun_dosis: `SELECT  vacuna as pila, nro_dosis as ejex, COUNT(*) AS value
      FROM tmp_pai WHERE 1=1 $w$
      GROUP BY 1,2
      ORDER BY 1,2`,
      pai_vacun_dosis_pie: `SELECT  vacuna as pila, nro_dosis as ejex, COUNT(*) AS value,
      SUM(COUNT(*)) OVER (PARTITION BY vacuna ORDER BY vacuna ) AS total_acumulado
      FROM tmp_pai WHERE 1=1 $w$
      GROUP BY 1,2
      ORDER BY 1,2`,
      pai_genero_eg: `SELECT departamento as pila, genero as ejex,  COUNT (*) AS value
                FROM tmp_pai
                WHERE 1=1 $w$
                GROUP BY 1,2
                ORDER BY 3 desc,1,2
                `,
      pai_genero_dpto: `SELECT ente_gestor as pila, genero as ejex,  COUNT (*) AS value
                FROM tmp_pai
                WHERE 1=1 $w$
                GROUP BY 1,2
                ORDER BY 3 desc, 1,2
                `,
      pai_hetario: `SELECT 
                genero as ejex,
                SUM(CASE WHEN cast(edad as DECIMAL) >=0 and cast(edad as DECIMAL)<=0.25 THEN 1 ELSE 0 END)as "0m-3m",
                SUM(CASE WHEN cast(edad as DECIMAL) >0.25 and cast(edad as DECIMAL)<=0.50 THEN 1 ELSE 0 END)AS "4m-6m",
                SUM(CASE WHEN cast(edad as DECIMAL) >0.50 and cast(edad as DECIMAL)<=0.75 THEN 1 ELSE 0 END)AS "7m-9m",
                SUM(CASE WHEN cast(edad as DECIMAL) >0.75 and cast(edad as DECIMAL)<=1 THEN 1 ELSE 0 END)AS "10m-12m",

                SUM(CASE WHEN cast(edad as decimal) >1 and cast(edad as decimal)<=5 THEN 1 ELSE 0 END)as "1-5",
                SUM(CASE WHEN cast(edad as decimal) >5 and cast(edad as decimal)<=10 THEN 1 ELSE 0 END) as "5-10",
                SUM(CASE WHEN cast(edad as decimal) >10 and cast(edad as decimal)<=15 THEN 1 ELSE 0 END) as "10-15",
                SUM(CASE WHEN cast(edad as decimal) >15 and cast(edad as decimal)<=20 THEN 1 ELSE 0 END) as "15-20",
                SUM(CASE WHEN cast(edad as decimal) >20 and cast(edad as decimal)<=25 THEN 1 ELSE 0 END) as "20-25",
                SUM(CASE WHEN cast(edad as decimal) >25 and cast(edad as decimal)<=30 THEN 1 ELSE 0 END) as "25-30",
                SUM(CASE WHEN cast(edad as decimal) >30 and cast(edad as decimal)<=35 THEN 1 ELSE 0 END) as "30-35",
                SUM(CASE WHEN cast(edad as decimal) >35 and cast(edad as decimal)<=40 THEN 1 ELSE 0 END) as "35-40",
                SUM(CASE WHEN cast(edad as decimal) >40 and cast(edad as decimal)<=45 THEN 1 ELSE 0 END) as "40-45",
                SUM(CASE WHEN cast(edad as decimal) >45 and cast(edad as decimal)<=50 THEN 1 ELSE 0 END) as "45-50",
                SUM(CASE WHEN cast(edad as decimal) >50 and cast(edad as decimal)<=55 THEN 1 ELSE 0 END) as "50-55",
                SUM(CASE WHEN cast(edad as decimal) >55 and cast(edad as decimal)<=60 THEN 1 ELSE 0 END) as "55-60",
                SUM(CASE WHEN cast(edad as decimal) >60 and cast(edad as decimal)<=65 THEN 1 ELSE 0 END) as "60-65",
                SUM(CASE WHEN cast(edad as decimal) >65 and cast(edad as decimal)<=70 THEN 1 ELSE 0 END) as "65-70",
                SUM(CASE WHEN cast(edad as decimal) >70 and cast(edad as decimal)<=75 THEN 1 ELSE 0 END) as "70-75",
                SUM(CASE WHEN cast(edad as decimal) >75 and cast(edad as decimal)<=80 THEN 1 ELSE 0 END) as "75-80",
                SUM(CASE WHEN cast(edad as decimal) >80 and cast(edad as decimal)<=85 THEN 1 ELSE 0 END) as "80-85",
                SUM(CASE WHEN cast(edad as decimal) >85  THEN 1 ELSE 0 END) as "85++"
                FROM tmp_pai
                WHERE 1=1 $w$
                GROUP BY genero`,
      pai_periodo: `SELECT TO_CHAR(fecha_vacunacion, 'YYYY-MM') as ejex,  COUNT (*) AS value
                FROM tmp_pai
                WHERE 1=1 $w$
                GROUP BY 1
                ORDER BY 1`,
      pai_day: `SELECT TO_CHAR(fecha_vacunacion, 'YYYY-MM-DD') as ejex,  COUNT (*) AS value,
                TO_CHAR((select MAX(fecha_vacunacion) FROM tmp_pai),'DD/MM/YYYY') AS obs
                FROM tmp_pai
                WHERE 1=1 $w$
                GROUP BY 1
                ORDER BY 1`,
    },
    referer: [],
    primal: {
      equivalencia: {
        departamento: ['departamento', 'departamento'],
        municipio: [
          "departamento||' - '||municipio",
          "departamento||'-'||municipio",
        ],
        eg: ['ente_gestor', 'ente_gestor'],
        establecimiento: ['establecimiento', 'establecimiento'],

        gestion: [
          'extract(year from fecha_vacunacion)',
          'extract(year from fecha_vacunacion)',
        ],
        periodo: [
          "TO_CHAR(fecha_vacunacion, 'YYYY-MM')",
          "TO_CHAR(fecha_vacunacion, 'YYYY-MM')",
        ],

        genero: ['genero', 'genero'],
        vacuna: ['vacuna', 'vacuna'],
        dosis: ['nro_dosis', 'nro_dosis'],
      },
      query: `SELECT DISTINCT $a$
                FROM tmp_pai
                WHERE 1=1
                $w$
                ORDER BY 2`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },
  dash_cancer: {
    alias: 'cancer',
    campos: {
      departamento: ['DEPARTAMENTO', false, true, 'C'],
      eg: ['ENTE GESTOR', false, true, 'C'],
      establecimiento: ['ESTABLECIMIENTO', false, true, 'C'],

      genero: ['GENERO', false, true, 'C'],
      tecnica: ['TECNICA RECOLECCION', false, true, 'C'],
      gestion: ['GESTION REGISTRO', false, true, 'C'],
      diagnostico: ['DIAGNOSTICO HISTOPATOLOGICO', false, true, 'C'],
      cie10: ['CIE10 - GRUPO', false, true, 'C'],
    },
    ilogic: {
      cancer_1000: `SELECT '' as pila,tt.ente_gestor AS ejex, CASE WHEN p.ente_gestor IS null THEN 0 
                  ELSE  ROUND((1000*tt.pacientes::numeric/p.poblacion_afiliada::NUMERIC),1)
                  END  AS value
                  FROM (
                  SELECT t.ente_gestor , 
                  COUNT(*) AS pacientes
                  FROM tmp_cancer t
                  WHERE 1=1 $w$
                  GROUP BY 1) AS tt
                  LEFT JOIN tmp_cancer_poblacion p ON (tt.ente_gestor = p.ente_gestor)
                  order by 3 
`,
      cancer_casos: `SELECT 'Registrados' as pivot ,gestion as ejex ,COUNT(*) AS value, TO_CHAR((SELECT MAX(fecha_diagnostico) FROM tmp_cancer),'dd/mm/YYYY') AS obs
      FROM tmp_cancer WHERE 1=1 $w$
      GROUP BY  1,2
      union all
      (SELECT
      case when tecnica_recoleccion='DF' then 'Defuncion'
      when tecnica_recoleccion='EH' then 'Egreso Hospitalario'
      when tecnica_recoleccion='LAB' then 'Laboratorio'
      else tecnica_recoleccion end as pivot ,
      gestion as periodo ,COUNT(*) AS value, TO_CHAR((SELECT MAX(fecha_diagnostico) FROM tmp_cancer),'dd/mm/YYYY') AS obs
      FROM tmp_cancer WHERE 1=1 $w$
      GROUP BY  1,2
      ORDER BY 1,2)
      `,
      /*cancer_casos:`SELECT 'Registros' as grupo, 
gestion as pila, 'Registrados' AS ejex,  COUNT(*) AS value
      FROM tmp_cancer WHERE 1=1 
      GROUP BY  1,2
      union all
      (SELECT 'Varios' AS grupo,
      gestion as pila, 
      case when tecnica_recoleccion='DF' then 'Defuncion'
      when tecnica_recoleccion='EH' then 'Egreso Hospitalario'
      when tecnica_recoleccion='LAB' then 'Laboratorio'
      else tecnica_recoleccion end as ejex,
    COUNT(*) AS value
      FROM tmp_cancer WHERE 1=1 
      GROUP BY  1,2,3
      ORDER BY 1,2,3)`,*/

      cancer_dpto: `SELECT  departamento as pila ,COUNT(*) AS value
      FROM tmp_cancer WHERE 1=1 $w$
      GROUP BY 1
      ORDER BY 2 `,
      cancer_eg: `SELECT  ente_gestor  AS pila ,COUNT(*) AS value
      FROM tmp_cancer WHERE 1=1 $w$
      GROUP BY 1
      ORDER BY 2 `,
      cancer_dpto_eg: `SELECT  departamento as pila, ente_gestor as ejex, COUNT(*) AS value
      FROM tmp_cancer WHERE 1=1 $w$
      GROUP BY 1,2
      ORDER BY 1,2`,
      cancer_genero_eg: `SELECT departamento as pila, genero as ejex,  COUNT (*) AS value
                FROM tmp_cancer
                WHERE 1=1 $w$
                GROUP BY 1,2
                ORDER BY 3 desc,1,2
                `,
      cancer_genero_dpto: `SELECT ente_gestor as pila, genero as ejex,  COUNT (*) AS value
                FROM tmp_cancer
                WHERE 1=1 $w$
                GROUP BY 1,2
                ORDER BY 3 desc, 1,2
                `,
      cancer_hetario: `SELECT edad_recodificada as pila,
                genero as ejex, COUNT (*) AS value
                FROM tmp_cancer
                WHERE 1=1 $w$
                GROUP BY 1,2 order by 1`,
      /*cancer_recoleccion: `SELECT tecnica_recoleccion as pila,  COUNT(*) AS value,
                SUM(COUNT(*)) OVER (ORDER BY tecnica_recoleccion ) AS total_acumulado					 
                        FROM tmp_cancer
                        WHERE 1=1 $w$
                        GROUP BY 1
                        ORDER BY 1`,*/
      cancer_cie10: `SELECT  cie_grupo as pila , 
CASE WHEN genero='F' THEN 'Femenino' WHEN genero='M' THEN 'Masculino' ELSE genero END  as ejex, COUNT(*) AS VALUE,
SUM(COUNT(*)) OVER (PARTITION BY cie_grupo ORDER BY cie_grupo, CASE WHEN genero='F' THEN 'Femenino' WHEN genero='M' THEN 'Masculino' ELSE genero END  ) AS total
                FROM tmp_cancer WHERE 1=1 $w$
                GROUP BY 1,2
                ORDER BY 4 desc `,
      cancer_cie10_tipo: `SELECT
      case when tecnica_recoleccion='DF' then 'Defuncion'
      when tecnica_recoleccion='EH' then 'Egreso Hospitalario'
      when tecnica_recoleccion='LAB' then 'Laboratorio'
      else tecnica_recoleccion end as pila ,
      case when tecnica_recoleccion='DF' then 'Defuncion'
      when tecnica_recoleccion='EH' then 'Egreso Hospitalario'
      when tecnica_recoleccion='LAB' then 'Laboratorio'
      else tecnica_recoleccion end as pivot ,
      cie_grupo as ejex ,COUNT(*) AS value
      FROM tmp_cancer WHERE 1=1 $w$
      GROUP BY  1,2,3
      ORDER BY 4 desc,3`,
      cancer_cie10_hetario: `SELECT   edad_recodificada  as pila , 
        cie_grupo as ejex, COUNT(*) AS VALUE
                FROM tmp_cancer WHERE 1=1 $w$
                GROUP BY 1,2
                ORDER BY 1,2 `,

      /*cancer_diagnostico: `SELECT diagnostico_histopatologico as ejex,  COUNT(*) AS value,
        SUM(COUNT(*)) OVER (PARTITION BY diagnostico_histopatologico ORDER BY diagnostico_histopatologico ) AS total_acumulado					 
                FROM tmp_cancer
                WHERE 1=1 $w$
                GROUP BY 1
                ORDER BY 2 desc`,*/
    },
    referer: [],
    primal: {
      equivalencia: {
        departamento: ['departamento', 'departamento'],
        eg: ['ente_gestor', 'ente_gestor'],
        establecimiento: ['establecimiento', 'establecimiento'],
        genero: ['genero', 'genero'],
        tecnica: ['tecnica_recoleccion', 'tecnica_recoleccion'],
        gestion: ['gestion', 'gestion'],
        diagnostico: [
          'diagnostico_histopatologico',
          'diagnostico_histopatologico',
        ],
        cie10: ['cie_grupo', 'cie_grupo'],
      },
      query: `SELECT DISTINCT $a$
                FROM tmp_cancer
                WHERE 1=1
                $w$
                ORDER BY 2`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },
  dash_neumonia: {
    alias: 'Neumonia',
    campos: {
      departamento: ['DEPARTAMENTO', false, true, 'C'],
      gestion: ['GESTION', false, true, 'C'],
      semana: ['SEMANA EPIDEMIOLOGICA', false, true, 'C'],
    },
    ilogic: {
      infec_casos: `SELECT gestion, SUM(valor) AS VALUE, 
      'Semana ' || max(CASE WHEN  habilitado=FALSE  AND (valor IS NULL OR valor=0) THEN 0 ELSE semana END) ||'/'||gestion AS obs,
      SUM(SUM(valor)) OVER (ORDER BY  gestion ) AS total_acumulado
      
                FROM tmp_infecciones
                WHERE infeccion ='NEUMONIA' $w$ 
                GROUP BY gestion
                ORDER BY 1`,
      infec_dpto: `SELECT 
                departamento as pila, 
                gestion AS  ejex, 
					 sum(CASE WHEN valor IS null THEN 0 ELSE valor END ) AS value,
           SUM(sum(CASE WHEN valor IS null THEN 0 ELSE valor END )) OVER (PARTITION BY departamento ORDER BY  departamento,gestion ) AS total
                FROM tmp_infecciones
                WHERE infeccion ='NEUMONIA' $w$ 
                GROUP BY 1,2
                ORDER BY 4 desc, 1, 2`,
      infec_gestion: `SELECT 
                gestion as pila, 
                departamento AS  ejex, 
					 sum(CASE WHEN valor IS null THEN 0 ELSE valor END ) AS value,
           SUM(sum(CASE WHEN valor IS null THEN 0 ELSE valor END )) OVER (PARTITION BY gestion ORDER BY  gestion, departamento ) AS total
                FROM tmp_infecciones
                WHERE infeccion ='NEUMONIA' $w$ 
                GROUP BY 1,2
                ORDER BY 4 desc, 1 , 2`,
      infec_frecuencia: `SELECT 
                to_char(TO_DATE(gestion||'-'||semana, 'YYYY-WW'), 'YYYY-MM-DD') as ejex,  
                semana||'/'||gestion AS semana,
                sum(case when valor is null then 0 else  valor end ) AS value
                FROM tmp_infecciones 
                WHERE infeccion='NEUMONIA' $w$
                GROUP BY 1,2
                ORDER BY 1`,
      infec_quartil: `SELECT 
                gestion AS pila,
                semana AS ejex,
                habilitado as sw,
                sum(valor) AS value
                FROM tmp_infecciones 
                WHERE infeccion='NEUMONIA' 
                $w$
                GROUP BY 1,2,3
                ORDER BY 1,2,3`,
      infec_dpto_q: `SELECT 
                departamento AS pivot,
                gestion AS pila,
                semana AS ejex, habilitado as sw,
                sum(valor) AS value
                FROM tmp_infecciones 
                WHERE infeccion='NEUMONIA' 
                $w$
                GROUP BY 1,2,3,4
                ORDER BY 1,2,3,4`,
      infec_torta: `SELECT departamento AS pila, SUM(case when valor is null then 0 else valor end ) AS value,
                    SUM(SUM(case when valor is null then 0 else valor end )) OVER (PARTITION BY departamento ORDER BY departamento ) AS total_acumulado
                    FROM tmp_infecciones
                    WHERE infeccion='NEUMONIA' $w$
                    GROUP BY 1
                    ORDER BY 2`,
    },
    referer: [],
    primal: {
      equivalencia: {
        departamento: ['departamento', 'departamento'],
        gestion: ['gestion', 'gestion'],
        semana: ["gestion || '-' || semana", "gestion || '-' || semana"],
      },
      query: `SELECT DISTINCT $a$
            FROM tmp_infecciones
            WHERE infeccion ='NEUMONIA' 
            $w$
            ORDER BY 2`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },
  dash_iras: {
    alias: 'Iras',
    campos: {
      departamento: ['DEPARTAMENTO', false, true, 'C'],
      gestion: ['GESTION', false, true, 'C'],
      semana: ['SEMANA EPIDEMIOLOGICA', false, true, 'C'],
    },
    ilogic: {
      infec_casos: `SELECT gestion, SUM(valor) AS VALUE, 
      'Semana ' || max(CASE WHEN  habilitado=FALSE  AND (valor IS NULL OR valor=0) THEN 0 ELSE semana END) ||'/'||gestion AS obs,
      SUM(SUM(valor)) OVER (ORDER BY  gestion ) AS total_acumulado
                FROM tmp_infecciones
                WHERE infeccion ='IRAS' $w$ 
                GROUP BY gestion
                ORDER BY 1`,
      infec_dpto: `SELECT 
                departamento as pila, 
                gestion AS  ejex, 
					 sum(CASE WHEN valor IS null THEN 0 ELSE valor END ) AS value,
           SUM(sum(CASE WHEN valor IS null THEN 0 ELSE valor END )) OVER (PARTITION BY departamento ORDER BY  departamento,gestion ) AS total					 
                FROM tmp_infecciones
                WHERE infeccion ='IRAS' $w$ 
                GROUP BY 1,2
                ORDER BY 4 desc, 1, 2`,
      infec_gestion: `SELECT 
                gestion as pila, 
                departamento AS  ejex, 
					 sum(CASE WHEN valor IS null THEN 0 ELSE valor END ) AS value,
           SUM(sum(CASE WHEN valor IS null THEN 0 ELSE valor END )) OVER (PARTITION BY gestion ORDER BY  gestion, departamento ) AS total					 
                FROM tmp_infecciones
                WHERE infeccion ='IRAS' $w$ 
                GROUP BY 1,2
                ORDER BY 4 desc, 1, 2`,
      infec_frecuencia: `SELECT 
                to_char(TO_DATE(gestion||'-'||semana, 'YYYY-WW'), 'YYYY-MM-DD') as ejex,  
                semana||'/'||gestion AS semana,
                sum(case when valor is null then 0 else  valor end ) AS value
                FROM tmp_infecciones 
                WHERE infeccion='IRAS' $w$
                GROUP BY 1,2
                ORDER BY 1`,
      infec_quartil: `SELECT 
                gestion AS pila,
                semana AS ejex,
                habilitado as sw,
                sum(valor) AS value
                FROM tmp_infecciones 
                WHERE infeccion='IRAS' 
                $w$
                GROUP BY 1,2,3
                ORDER BY 1,2,3`,
      infec_dpto_q: `SELECT 
                departamento AS pivot,
                gestion AS pila,
                semana AS ejex,
                habilitado as sw,
                sum(valor) AS value
                FROM tmp_infecciones 
                WHERE infeccion='IRAS' 
                $w$
                GROUP BY 1,2,3,4
                ORDER BY 1,2,3,4`,
      infec_torta: `SELECT departamento AS pila, SUM(case when valor is null then 0 else valor end ) AS value,
                SUM(SUM(case when valor is null then 0 else valor end )) OVER (PARTITION BY departamento ORDER BY departamento ) AS total_acumulado
                FROM tmp_infecciones
                WHERE infeccion='IRAS' $w$
                GROUP BY 1
                ORDER BY 2`,
    },
    referer: [],
    primal: {
      equivalencia: {
        departamento: ['departamento', 'departamento'],
        gestion: ['gestion', 'gestion'],
        semana: ["gestion || '-' || semana", "gestion || '-' || semana"],
      },
      query: `SELECT DISTINCT $a$
            FROM tmp_infecciones
            WHERE infeccion ='IRAS'
            $w$
            ORDER BY 2`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },
  dash_edas: {
    alias: 'EDAS',
    campos: {
      departamento: ['DEPARTAMENTO', false, true, 'C'],
      gestion: ['GESTION', false, true, 'C'],
      semana: ['SEMANA EPIDEMIOLOGICA', false, true, 'C'],
    },
    ilogic: {
      infec_casos: `SELECT gestion, SUM(valor) AS VALUE, 
      'Semana ' || max(CASE WHEN  habilitado=FALSE  AND (valor IS NULL OR valor=0) THEN 0 ELSE semana END) ||'/'||gestion AS obs,
      SUM(SUM(valor)) OVER (ORDER BY  gestion ) AS total_acumulado
                FROM tmp_infecciones
                WHERE infeccion ='EDAS' $w$ 
                GROUP BY gestion
                ORDER BY 1`,
      infec_dpto: `SELECT 
                departamento as pila, 
                gestion AS  ejex, 
					 sum(CASE WHEN valor IS null THEN 0 ELSE valor END ) AS value,
           SUM(sum(CASE WHEN valor IS null THEN 0 ELSE valor END )) OVER (PARTITION BY departamento ORDER BY  departamento,gestion ) AS total					 
                FROM tmp_infecciones
                WHERE infeccion ='EDAS' $w$ 
                GROUP BY 1,2
                ORDER BY 4 desc, 1, 2`,
      infec_gestion: `SELECT 
                gestion as pila, 
                departamento AS  ejex, 
					 sum(CASE WHEN valor IS null THEN 0 ELSE valor END ) AS value					 
                FROM tmp_infecciones
                WHERE infeccion ='EDAS' $w$ 
                GROUP BY 1,2
                ORDER BY 1 DESC, 2`,
      infec_frecuencia: `SELECT 
                to_char(TO_DATE(gestion||'-'||semana, 'YYYY-WW'), 'YYYY-MM-DD') as ejex,  
                semana||'/'||gestion AS semana,
                sum(case when valor is null then 0 else  valor end ) AS value
                FROM tmp_infecciones 
                WHERE infeccion='EDAS' $w$
                GROUP BY 1,2
                ORDER BY 1`,
      infec_quartil: `SELECT 
                gestion AS pila,
                semana AS ejex,
                habilitado as sw,
                sum(valor) AS value
                FROM tmp_infecciones 
                WHERE infeccion='EDAS' 
                $w$
                GROUP BY 1,2,3
                ORDER BY 1,2,3`,
      infec_dpto_q: `SELECT 
                departamento AS pivot,
                gestion AS pila,
                semana AS ejex,
                habilitado as sw,
                sum(valor) AS value
                FROM tmp_infecciones 
                WHERE infeccion='EDAS' 
                $w$
                GROUP BY 1,2,3,4
                ORDER BY 1,2,3,4`,
      infec_torta: `SELECT departamento AS pila, SUM(case when valor is null then 0 else valor end ) AS value,
                SUM(SUM(case when valor is null then 0 else valor end )) OVER (PARTITION BY departamento ORDER BY departamento ) AS total_acumulado
                FROM tmp_infecciones
                WHERE infeccion='EDAS' $w$
                GROUP BY 1
                ORDER BY 2`,
    },
    referer: [],
    primal: {
      equivalencia: {
        departamento: ['departamento', 'departamento'],
        gestion: ['gestion', 'gestion'],
        semana: ["gestion || '-' || semana", "gestion || '-' || semana"],
      },
      query: `SELECT DISTINCT $a$
            FROM tmp_infecciones
            WHERE infeccion ='EDAS'
            $w$
            ORDER BY 2`,
      headers: [{}],
      attributes: null,
    },
    withInitial: true,
  },
  //cBox for sala situacional 
  ss_eess:{        
    alias: 'ss_eess',
    campos: {      
      gestion: ['GESTION', false, true, 'C'],
      periodo: ['MES', false, true, 'C',,,'M'],
      eg: ['Ente Gestor', false, true, 'C',,,'M'],
      dpto:['Departamento', false, true, 'C',,,'M'],
      eess: ['Establecimiento de Salud', false, true, 'C',,,'M'],
  }, 
  
  ilogic: {
    eg:`SELECT DISTINCT eg.institucion_id AS value, eg.nombre_institucion AS text
      FROM  ae_institucion i, al_departamento d, ae_institucion eg
      WHERE i.tipo_institucion_id='EESS'
      AND i.cod_dpto =  d.cod_dpto
      AND i.institucion_root =  eg.institucion_id 
      ORDER BY 2`,

      dpto:`SELECT DISTINCT d.cod_dpto AS VALUE, d.nombre_dpto AS text
      FROM  ae_institucion i, al_departamento d, ae_institucion eg
      WHERE i.tipo_institucion_id='EESS'
      AND i.cod_dpto =  d.cod_dpto
      AND i.institucion_root =  eg.institucion_id
      $iqw$
      ORDER BY 2`,
      
      eess: `SELECT DISTINCT i.institucion_id AS value, eg.nombre_corto||': '||d.nombre_dpto ||' - '||  i.nombre_institucion||' - '||e.nivel_atencion text
      FROM  r_institucion_salud e, ae_institucion i, al_departamento d, ae_institucion eg
      WHERE i.tipo_institucion_id='EESS' AND e.institucion_id =  i.institucion_id
      AND i.cod_dpto =  d.cod_dpto
      AND i.institucion_root =  eg.institucion_id 
      $iqw$
      ORDER BY 2`,
  },
  ilogicMultiple:{eg:'eg.institucion_id', dpto:'d.cod_dpto', eess:'i.institucion_id' },
  primal: {
    equivalencia: {      
      gestion: ['extract(year from fecha_vacunacion)', 'extract(year from fecha_vacunacion)'],
      periodo: ["TO_CHAR(fecha_vacunacion, 'YYYY-MM')", "TO_CHAR(fecha_vacunacion, 'YYYY-MM')"],
    },
    query: `SELECT DISTINCT $a$
              FROM tmp_pai
              WHERE 1=1
              $w$
              ORDER BY 2`,
    headers: [{}],
    attributes: null,
  },
    referer: [],
    withInitial: true,
},
equivalencias:{        
  alias: 'equivalencias',
  campos: {          
    eg: ['Ente Gestor', false, true, 'C'],
    dpto:['Departamento', false, true, 'C'],
    eess: ['Establecimiento de Salud', false, true, 'C'],
  }, 
  ilogic: null,
  ilogicMultiple: null,
  primal: {
    equivalencia: {      
      eg: ['eg.institucion_id', 'eg.nombre_institucion'],
      dpto: ['d.cod_dpto', 'd.nombre_dpto'],
      eess: ['i.institucion_id', " i.nombre_institucion||' ('||e.nivel_atencion||')'"]
    },
    query: `SELECT DISTINCT $a$            
            FROM  r_institucion_salud e, ae_institucion i, al_departamento d, ae_institucion eg
            WHERE i.tipo_institucion_id='EESS' AND e.institucion_id =  i.institucion_id
            AND i.cod_dpto =  d.cod_dpto
            AND i.institucion_root =  eg.institucion_id 
            $w$
            ORDER BY 2`,
    headers: [{}],
    attributes: null,
  },
    referer: [],
    withInitial: false,
},
...SS_CBOXSS
}
module.exports = PDEPENDENCIES
