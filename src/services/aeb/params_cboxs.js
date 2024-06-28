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
                WHERE 1=1 
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
      car_dpto_eg: `SELECT departamento as pila,  ente_gestor AS ejex, COUNT(*) AS value					 
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
                FROM tmp_pai
                WHERE 1=1 $w$
                GROUP BY genero`,
      pai_periodo: `SELECT TO_CHAR(fecha_vacunacion, 'YYYY-MM') as ejex,  COUNT (*) AS value
                FROM tmp_pai
                WHERE 1=1 $w$
                GROUP BY 1
                ORDER BY 1`,
      pai_day: `SELECT TO_CHAR(fecha_vacunacion, 'YYYY-MM-DD') as ejex,  COUNT (*) AS value
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
      cancer_recoleccion: `SELECT tecnica_recoleccion as pila,  COUNT(*) AS value,
                SUM(COUNT(*)) OVER (ORDER BY tecnica_recoleccion ) AS total_acumulado					 
                        FROM tmp_cancer
                        WHERE 1=1 $w$
                        GROUP BY 1
                        ORDER BY 1`,          
      cancer_cie10: `SELECT  cie_grupo as pila ,COUNT(*) AS value
                FROM tmp_cancer WHERE 1=1 $w$
                GROUP BY 1
                ORDER BY 2 `,
      cancer_fallecidos_g: `SELECT  TO_CHAR(fecha_defuncion, 'YYYY') as ejex,  COUNT (*) AS value
                FROM tmp_cancer WHERE fecha_defuncion is not null $w$
                GROUP BY 1
                ORDER BY 1 `,
      cancer_fallecidos: `SELECT  TO_CHAR(fecha_defuncion, 'YYYY-MM-DD') as ejex,  COUNT (*) AS value
                FROM tmp_cancer WHERE fecha_defuncion is not null $w$
                GROUP BY 1
                ORDER BY 1 `,  
      cancer_diagnostico:`SELECT diagnostico_histopatologico as ejex,  COUNT(*) AS value,
        SUM(COUNT(*)) OVER (PARTITION BY diagnostico_histopatologico ORDER BY diagnostico_histopatologico ) AS total_acumulado					 
                FROM tmp_cancer
                WHERE 1=1 $w$
                GROUP BY 1
                ORDER BY 2 desc`          

    },
    referer: [],
    primal: {
      equivalencia: {
        departamento: ['departamento', 'departamento'],       
        eg: ['ente_gestor', 'ente_gestor'],
        establecimiento: ['establecimiento', 'establecimiento'],
        genero: ['genero', 'genero'],
        tecnica: ['tecnica_recoleccion', 'tecnica_recoleccion'],
        gestion: ['gestion','gestion'],
        diagnostico: ["diagnostico_histopatologico", "diagnostico_histopatologico"],
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
}
module.exports = PDEPENDENCIES
