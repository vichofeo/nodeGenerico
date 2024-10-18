'use strict'
const PARAMETERS = {
    pai_regular: {
        alias:'tmp_pai',
        attributes:[["to_char(fecha_vacunacion, 'YYYY-MM')", 'periodo'], ['count(*)', 'registros']],
        file: ['No.','Fecha de Vacunación','Estrategia','Carnet de Identidad','Nombre Completo','Celular Paciente','Fecha de Nacimiento','Edad (Años)','Sexo','Nacionalidad','Codigo Departamento','Departamento','Codigo Municipio','Municipio','Codigo Establecimiento','Establecimiento','Subsector','Institucion','Ente Gestor','Empresa','Matricula','Nombre Vacuna','Nro. de Dosis','Proveedor','Lote Vacuna','Usuario','Celular Usuario','Estado Validación','Embarazo','Fecha Registro','Fecha Modificación','Jeringa de Administración','Lote Diluyente','Jeringa de Dilusión'],
        table: ['nro','f_vacunacion','estrategia','ci','nombre','celular','f_nacimiento','f_edad','f_genero','nacionalidad','cod_dpto','departamento','cod_mun','municipio','cod_rues','establecimiento','subsector','ente_gestor_name','ente_gestor','empresa','matricula','vacuna','nro_dosis','proveedor','lote_vacuna','usuario','cel_usr','validacion','embarazo','fecha_registro','fecha_modificacion','jeringa_administracion','lote_diluyente','jeringa_dilusion'],        
        validate: [0,1,0,1,1,0,1,1,1,0,1,1,1,1,0,1,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
        forFilter:['Fecha de Vacunación','Fecha de Nacimiento'],        
        update:[['fecha_nacimiento',"TO_DATE(f_nacimiento, 'DD/MM/YYYY')",'Verifique el formato de fecha Nacimiento DD/MM/YYYY'], ['fecha_vacunacion',"TO_DATE(f_vacunacion, 'DD/MM/YYYY')", 'Verifique el formato fecha vacunacion DD/MM/YYYY'], ['edad', 'CAST(f_edad AS NUMERIC )', 'Verifique campo Edad que sea numerico y que no este vacio']],
        key:['fecha_vacunacion', "COALESCE(ci,'-1')",  'fecha_nacimiento', "COALESCE(nombre,'-1')", "COALESCE(edad, '-1')", 'f_genero', 'vacuna'],
        keyAux:['fecha_vacunacion', "ci", 'fecha_nacimiento',  "nombre", "edad", 'genero', 'vacuna', 'nro_dosis','departamento', 'ente_gestor_name', 'establecimiento'],
        //gender: ['nombre', 'genero','f_genero']
        
    },  
    carmelo: {
        alias:'tmp_carmelo',
        attributes:[["to_char(fecha_dispensacion, 'YYYY-MM')", 'periodo'], ['count(*)', 'registros']],
        file: ['No.','ENTE GESTOR','Departamento','Regional/Distrital','Nombre el Establecimiento','Nivel de atención','Fecha de dispensacion  (dd/mm/año)','Nombre del paciente ','N° de Matrícula Asegurado/Beneficiario','Sexo','EDAD','Cantidad dispensada ','N° de receta ','Especialidad ','Diagnóstico','Observaciones'],
        table: ['nro','ente_gestor_name','departamento','regional','establecimiento','nivel_atencion','f_dispensacion','paciente','matricula','f_genero','f_edad','cantidad_dispensada','no_receta','especialidad','diagnostico','observacion'],
        validate: [0,1,1,0,1,1,1,1,1,1,0,1,0,1,0],
        forFilter:['Fecha de dispensacion  (dd/mm/año)'],        
        update:[['fecha_dispensacion',"COALESCE(CASE  WHEN  textregexeq(f_dispensacion,'^[[:digit:]]+(\.[[:digit:]]+)?$') THEN TO_TIMESTAMP(trunc(f_dispensacion::NUMERIC - (25567 + 2)) * 86400) ELSE TO_DATE(f_dispensacion, 'DD/MM/YYYY') END,'1900-01-01') ",'Verifique el formato de fecha Dispensacion DD/MM/YYYY, que no sea vacio o nulo'],
                ['matricula', "COALESCE(matricula, '-Sin Matricula-')",'error en matricula'],
                ['paciente', "COALESCE(paciente, '-Sin Nombre-')",'error en matricula'],
                ['edad',"CASE  WHEN  textregexeq(f_edad,'^[[:digit:]]+(\.[[:digit:]]+)?$') THEN f_edad ELSE 'Unknown' END ",''],
                ['ente_gestor_name', "Upper(COALESCE(ente_gestor_name, 'Unknown'))",''],
                ['departamento', "upper(COALESCE(departamento, 'Unknown'))",''],
                ['establecimiento', "upper(COALESCE(establecimiento, 'Unknown'))",''],
                ['nivel_atencion', "upper(COALESCE(nivel_atencion, 'Unknown'))",''],
                ['ente_gestor', `CASE WHEN ente_gestor_name IS NULL  THEN 'Unknown' ELSE CASE ente_gestor_name WHEN 'CAJA NACIONAL DE SALUD' THEN 'CNS'
                                WHEN 'CAJA DE SALUD DE LA BANCA PRIVADA' THEN 'CSBP'
                                WHEN 'CAJA PETROLERA DE SALUD' THEN 'CPS'
                                WHEN 'CAJA BANCARIA ESTATAL DE SALUD' THEN 'CBES'
                                WHEN 'CAJA DE SALUD DE CAMINOS Y R.A.' THEN 'CSCyRA'
                                WHEN 'SEGURO SOCIAL UNIVERSITARIO' THEN 'SSU'
                                WHEN 'SINEC' THEN 'SINEC'
                                WHEN 'CAJA DE SALUD CORDES' THEN 'CORDES'
                                ELSE ente_gestor_name
                                END  END `, ''],
                ['genero', "upper(COALESCE(upper(trim(f_genero)),'Unknown'))",''],
                ['edad', 'CAST(f_edad AS NUMERIC )', 'Verifique campo Edad que sea numerico y que no este vacio']
                

            ],
        key:['fecha_dispensacion','paciente','ente_gestor_name','departamento','establecimiento','nivel_atencion', 'matricula'],
        //keyAux:['fecha_dispensacion','paciente', 'matricula','genero', 'edad','ente_gestor','departamento','establecimiento','nivel_atencion','matricula','cantidad_dispensada','no_receta','especialidad','diagnostico','observacion'],
        keyAux: ['ente_gestor_name','departamento','regional','establecimiento','nivel_atencion','f_dispensacion','paciente','matricula','f_genero','f_edad','cantidad_dispensada','no_receta','especialidad','diagnostico','observacion'],
        gender: ['paciente', 'genero','f_genero']
    }, 
    pacientes_oncologicos: {
        alias:'tmp_cancer',
        attributes:[["to_char(fecha_diagnostico, 'YYYY-MM')", 'periodo'], ['count(*)', 'registros']],
        file: ['DEPARTAMENTO','SECTOR','ENTE GESTOR','ESTABLECIMIENTO / INSTITUCION','N° HISTORIA CLÍNICA','APELLIDOS Y NOMBRES','CI','FECHA DE NACIMIENTO','EDAD','EDAD RECODIFICADA','SEXO','RESIDENCIA','PROCEDENCIA','TECNICA DE RECOLECCIÒN 1:LAB, 2:EH,3:DF','GESTION','FECHA DE DIAGNÓSTICO','N° DE INFORME DE PATOLOGIA','DIAGNÓSTICO  HISTOPATOLOGICO , CLINICO Y/O IMAGENOLOGICO','CODIGO MORFOLOGICO','LOCALIZACIÓN','CODIGO TOPOGRAFICO','SITIO PRIMARIO','CODIGO TOPOGRAFICO CIE','CIE GRUPOS','LATERALIDAD','EXTENSION','TNM','ESTADIO','LOCALIZACION DE METASTASIS','DEFUNCION ','FECHA DE DEFUNCIÓN','OBSERVACIONES'],        
        table: ['departamento','sector','ente_gestor_name','establecimiento','no_historia_clinica','apellidos_nombres','ci','fecha_nacimiento','edad','edad_recodificada','f_genero','residencia','procedencia','tecnica_recoleccion','gestion','f_diagnostico','no_informe_patologia','diagnostico_histopatologico','cod_morfologico','localizacion','cod_topografico_loc','sitio_primario','codigo_topografico_pri','cie_grupo','lateridad','extension','tnm','estadio','localizacion_metastasis','gestion_defuncion','f_defuncion','observacion'],        
        validate: [1,0,1,1,0,1,1,0,1,0,1,0,0,0,0,1,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
        forFilter:['FECHA DE NACIMIENTO', 'FECHA DE DIAGNÓSTICO', 'FECHA DE DEFUNCIÓN'],
        update:[['fecha_diagnostico',"COALESCE(CASE  WHEN  textregexeq(f_diagnostico,'^[[:digit:]]+(\.[[:digit:]]+)?$') THEN TO_TIMESTAMP(trunc(f_diagnostico::NUMERIC - (25567 + 2)) * 86400) ELSE TO_DATE(f_diagnostico, 'DD/MM/YYYY') END,'1900-01-01')",'Verifique el formato de Fecha Diagnostico DD/MM/YYYY, que no sea vacio o nulo'], 
        ['fecha_defuncion',"COALESCE(CASE  WHEN  textregexeq(f_defuncion,'^[[:digit:]]+(\.[[:digit:]]+)?$') THEN TO_TIMESTAMP(trunc(f_defuncion::NUMERIC - (25567 + 2)) * 86400) ELSE TO_DATE(f_defuncion, 'DD/MM/YYYY') END,'1900-01-01')", 'Verifique el formato fecha defuncion DD/MM/YYYY']],
        key:['fecha_diagnostico', "COALESCE(ci,'-1')",  "COALESCE(fecha_nacimiento,'-1')", "COALESCE(apellidos_nombres,'-1')", "COALESCE(edad, '-1')", 'genero'],
        keyAux:['fecha_diagnostico', "ci", 'fecha_nacimiento',  "apellidos_nombres", "edad", 'genero',  'cie_grupo','departamento', 'ente_gestor_name', 'establecimiento'],
        gender: ['apellidos_nombres', 'genero','f_genero']
    },
    snis_302a:{
        alias:'tmp_snis302a',
        attributes:[["gestion||'-'||semana", 'periodo'], ['count(*)', 'registros']],
        //file: ['departamento', 'ente gestor', 'establecimiento', 'cue','gestion', 'semana', 'Grupo de variables', ' Menor de 6 meses|Masculino', ' Menor de 6 meses|Femenino', '6 meses a menor de 1 año|Masculino', '6 meses a menor de 1 año|Femenino', '1 - 4 años|Masculino', '1 - 4 años|Femenino', '5 - 9 años|Masculino', '5 - 9 años|Femenino', '10 - 14 años|Masculino', '10 - 14 años|Femenino', '15 - 19 años|Masculino', '15 - 19 años|Femenino', '20 - 39 años|Masculino', '20 - 39 años|Femenino', '40 - 49 años|Masculino', '40 - 49 años|Femenino', '50 - 59 años|Masculino', '50 - 59 años|Femenino', '60 años y más|Masculino', '60 años y más|Femenino'],
        file: [[[1,26],['frm','NOTIFICACIÓN PARA LA VIGILANCIA EPIDEMIOLÓGICA']], [[4,3], 'departamento'], [[], 'ente_gestor'], [[5,6], 'establecimiento'], [[5,35], 'gestion'], [[2,87],'semana'], [[4,28], 'red'], [[4,59], 'municipio'],[[5,57], 'sub_sector']],
        table: ['departamento', 'ente_gestor', 'establecimiento', 'gestion', 'semana', 'formulario', 'grupo', "variable", 'subvariable', 'valor'],        
        validate: [1,1,1,2,2,1,1,0,0,2],
        forFilter:  null,//['Fecha de Vacunación','Fecha de Nacimiento'],        
        update:[],
        key:['departamento', 'ente_gestor', 'establecimiento', 'gestion', 'semana', 'formulario', 'grupo', "COALESCE(variable,'-1')",'lugar_atencion' ,"COALESCE(subvariable, '-1')"],
        keyAux:['departamento', 'ente_gestor', 'establecimiento', 'gestion', 'semana', 'formulario', 'grupo', 'variable','lugar_atencion' ,'subvariable', 'valor'],
        //gender: ['nombre', 'genero','f_genero']
        filterByFunc:{
            alias:'parserSnis302A' ,
            params: {
                columnsPrincipal: ['  Menor de 6 meses|Masculino', '  Menor de 6 meses|Femenino', ' Mayor de 6 meses a menor de 1 año|Masculino', ' Mayor de 6 meses a menor de 1 año|Femenino', '1 - 4 años|Masculino', '1 - 4 años|Femenino', '5 - 9 años|Masculino', '5 - 9 años|Femenino', '10 - 14 años|Masculino', '10 - 14 años|Femenino', '15 - 19 años|Masculino', '15 - 19 años|Femenino', '20 - 39 años|Masculino', '20 - 39 años|Femenino', '40 - 49 años|Masculino', '40 - 49 años|Femenino', '50 - 59 años|Masculino', '50 - 59 años|Femenino', '60 años y más|Masculino', '60 años y más|Femenino'],
                dataValid: ['Sospecha diagnóstica', 'INMUNOPREVENIBLES', 'INFECCIONES DE TRANSMISIÓN SEXUAL', 'OTRAS INFECCIONES', 'ENFERMEDADES TRANSMITIDAS POR VECTORES (ETV)', 'TUBERCULOSIS Y LEPRA', 'VIOLENCIA, HECHOS DE TRANSITO Y ACCIDENTES', 'INTOXICACIONES', 'Evento', 'MORTALIDAD MATERNA', 'SALUD SEXUAL Y REPRODUCTIVA', 'MORTALIDAD', 'SOSPECHA DE ENFERMEDADES CONGÉNITAS DEL METABOLISMO'],
                dataNoProcess: ['Evento', 'MORTALIDAD MATERNA', 'SALUD SEXUAL Y REPRODUCTIVA', 'MORTALIDAD', 'SOSPECHA DE ENFERMEDADES CONGÉNITAS DEL METABOLISMO', 'MORTALIDAD PERINATAL, NEONATAL E INFANTIL'],
                columnsSecundary:{
                    ['Evento']:{alias: 'REGISTRO DE EVENTOS AMBIENTALES DE NOTIFICACIÓN INMEDIATA',
                                columns:[[0,13,25,37],[54,67,79,91]],
                                valuesColumns: ['No. de Eventos', 'No. de personas afectadas', 'No. de personas fallecidas'] },
                    ['MORTALIDAD MATERNA']:{
                            columns:[27,31,35,39,43,47,51,55,59,63],
                            valuesColumns: ['10 - 14 años|Dentro', '10 - 14 años|Fuera', '15 - 19 años|Dentro', '15 - 19 años|Fuera', '20 - 39 años|Dentro', '20 - 39 años|Fuera', '40 - 49 años|Dentro', '40 - 49 años|Fuera', '50 - 59 años|Dentro', '50 - 59 años|Fuera']                        
                            },
                    ['MORTALIDAD']:{
                            columns:[27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 65, 67, 69, 71, 73, 75, 77, 79, 81, 83, 85, 87, 89, 91, 93, 95, 97, 99, 101, 103, 105],
                            valuesColumns:['  Menor de 6 meses|Dentro|Masculino', '  Menor de 6 meses|Dentro|Femenino', '  Menor de 6 meses|Fuera|Masculino', '  Menor de 6 meses|Fuera|Femenino', ' Mayor de 6 meses a menor de 1 año|Dentro|Masculino', ' Mayor de 6 meses a menor de 1 año|Dentro|Femenino', ' Mayor de 6 meses a menor de 1 año|Fuera|Masculino', ' Mayor de 6 meses a menor de 1 año|Fuera|Femenino', '1 - 4 años|Dentro|Masculino', '1 - 4 años|Dentro|Femenino', '1 - 4 años|Fuera|Masculino', '1 - 4 años|Fuera|Femenino', '5 - 9 años|Dentro|Masculino', '5 - 9 años|Dentro|Femenino', '5 - 9 años|Fuera|Masculino', '5 - 9 años|Fuera|Femenino', '10 - 14 años|Dentro|Masculino', '10 - 14 años|Dentro|Femenino', '10 - 14 años|Fuera|Masculino', '10 - 14 años|Fuera|Femenino', '15 - 19 años|Dentro|Masculino', '15 - 19 años|Dentro|Femenino', '15 - 19 años|Fuera|Masculino', '15 - 19 años|Fuera|Femenino', '20 - 39 años|Dentro|Masculino', '20 - 39 años|Dentro|Femenino', '20 - 39 años|Fuera|Masculino', '20 - 39 años|Fuera|Femenino', '40 - 49 años|Dentro|Masculino', '40 - 49 años|Dentro|Femenino', '40 - 49 años|Fuera|Masculino', '40 - 49 años|Fuera|Femenino', '50 - 59 años|Dentro|Masculino', '50 - 59 años|Dentro|Femenino', '50 - 59 años|Fuera|Masculino', '50 - 59 años|Fuera|Femenino', '60 años y más|Dentro|Masculino', '60 años y más|Dentro|Femenino', '60 años y más|Fuera|Masculino', '60 años y más|Fuera|Femenino']
                            },
                    ['SOSPECHA DE ENFERMEDADES CONGÉNITAS DEL METABOLISMO']:{
                            columns:[27, 29, 31, 33],
                            valuesColumns:[' < 7 días||Masculino', ' < 7 días||Femenino', '7 a 28 días||Masculino', '7 a 28 días||Femenino']
                            },
                    ['MORTALIDAD PERINATAL, NEONATAL E INFANTIL']:{
                            columns:[95, 98, 101, 104],
                            valuesColumns:['|Dentro|Masculino', '|Dentro|Femenino', '|Fuera|Masculino', '|Fuera|Femenino']
                    }
                }
                
            }
        }

    },
    snis_301a:{
        alias:'tmp_snis301a',
        attributes:[["gestion||'-'||mes", 'periodo'], ['count(*)', 'registros']],        
        file: [[[0,0],['frm','INFORME MENSUAL DE PRODUCCIÓN DE SERVICIOS']], [[3,3], 'departamento'], [[], 'ente_gestor'], [[4,8], 'establecimiento'], [[4,44], 'gestion'], [[4,36],'mes'], [[3,21], 'red'], [[3,40], 'municipio'],[[2,40], 'sub_sector']],
        table: ['departamento', 'ente_gestor', 'establecimiento', 'gestion', 'mes', 'formulario', 'grupo', "variable", 'subvariable', 'valor'],        
        validate: [1,1,1,2,2,1,1,0,0,2],
        forFilter:  null,//[ array de campos fecha a validar],        
        update:[],
        key:['departamento', 'ente_gestor', 'establecimiento', 'gestion', 'mes', 'formulario', 'grupo', "COALESCE(variable,'-1')",'lugar_atencion' ,"COALESCE(subvariable, '-1')"],
        keyAux:['departamento', 'ente_gestor', 'establecimiento', 'gestion', 'mes', 'formulario', 'grupo', 'variable','lugar_atencion' ,'subvariable', 'valor'],
        //gender: ['nombre', 'genero','f_genero']
        filterByFunc:{
            alias:'parserSnis301A' ,
            params: {                
                sections: ['CONSULTA  EXTERNA', 'REFERENCIAS Y CONTRAREFERENCIAS', 'ATENCIÓN ODONTOLÓGICA', 'CONSULTAS PRENATALES', 'ATENCIÓN DE PARTO Y PUERPERIO EN SERVICIO Y DOMICILIO, OTRO TIPO DE ATENCIONES LIGADAS AL PARTO',
                    'INTERRUPCION LEGAL DEL EMBARAZO', 'ANTICONCEPCIÓN, PREVENCIÓN DE CÁNCER DE CUELLO UTERINO Y MAMA', 'RECIÉN NACIDOS EN SERVICIO Y DOMICILIO', 'CONTROL DE CRECIMIENTO INFANTIL', 'INTERNACIONES', 'VACUNACIONES EN MENORES DE 5 AÑOS', 
                    'OTRAS VACUNACIONES', 'MALARIA Número de tratamientos específicos entregados al paciente confirmado', 'RABIA', 'CHAGAS', 'ACCIDENTES POR OFIDIOS Y ANIMALES PONZOÑOSOS',
                    'TELESALUD', 'TELEEDUCACIÓN' 
                ],               
                sectionsCol2:['MICRONUTRIENTES Y LACTANCIA MATERNA', 'OTRAS ACTIVIDADES  DE ENFERMERÍA', 'CIRUGIAS Y ANESTESIAS', 'ENFERMEDADES CONGÉNITAS DEL METABOLISMO',
                    'ACTIVIDADES  DEL ESTABLECIMIENTO Y CON LA  COMUNIDAD','VIH - SIFILIS', 'LEISHMANIASIS', 'TUBERCULOSIS Y LEPRA'
                ],
                dataNoProcess: ['Continua de pag N°1  Anticoncepción,Prevención de cáncer….','M','F'],
                sectionsColumns:{
                    ['CONSULTA  EXTERNA']:{
                                columns:[11,14,17,20,23,26],
                                valuesColumns: [' PRIMERA||Masculino', ' PRIMERA||Femenino', 'NUEVA||Masculino', 'NUEVA||Femenino', 'REPETIDA||Masculino', 'REPETIDA||Femenino'] },
                    ['REFERENCIAS Y CONTRAREFERENCIAS']:{
                            columns:[23],
                            valuesColumns: ['NÚMERO']                        
                            },
                    ['ATENCIÓN ODONTOLÓGICA']:{
                            columns:[23,26,29,32,35,38,41,44,47,50,53,56],
                            valuesColumns:[' < de 5 Años||Masculino', ' < de 5 Años||Femenino', '5 a 13 Años||Masculino', '5 a 13 Años||Femenino', '14 a 19 Años||Masculino', '14 a 19 Años||Femenino', '20 a 59 Años||Masculino', '20 a 59 Años||Femenino', '60 Años y Mas||Masculino', '61 Años y Mas||Femenino', 'Emba-razada', 'Post-Parto']
                            },
                    ['CONSULTAS PRENATALES']:{
                            columns:[23,26,29,32,35,38,41,44,47,50,53,56],
                            valuesColumns:[' < a 10|Dentro', ' < a 10|Fuera', '10 a 14|Dentro', '10 a 14|Fuera', '15 a 19|Dentro', '15 a 19|Fuera', '20 a 34|Dentro', '20 a 34|Fuera', '35 a 49|Dentro', '35 a 49|Fuera', '50 y +|Dentro', '50 y +|Fuera']
                            },
                    ['ATENCIÓN DE PARTO Y PUERPERIO EN SERVICIO Y DOMICILIO, OTRO TIPO DE ATENCIONES LIGADAS AL PARTO']:{
                            columns:[23,26,29,32,35,38,41,44,47,50,53,56],
                            valuesColumns:[' < a 10|Servicio', ' < a 10|Domicilio', '10 a 14|Servicio', '10 a 14|Domicilio', '15 a 19|Servicio', '15 a 19|Domicilio', '20 a 34|Servicio', '20 a 34|Domicilio', '35 a 49|Servicio', '35 a 49|Domicilio', '50 y +|Servicio', '50 y +|Domicilio']
                    },
                    ['INTERRUPCION LEGAL DEL EMBARAZO']:{
                        columns:[35,39,43,47,51,55],
                        valuesColumns:[' < a 10', '10 a 14', '15 a 19', '20 a 34', '35 a 49', '50 y +']
                    },
                    ['ANTICONCEPCIÓN, PREVENCIÓN DE CÁNCER DE CUELLO UTERINO Y MAMA']:{
                        columns:[23,29,35,41,47,53],
                        valuesColumns:[' < a 10','10 a 14','15 a 19','20 a 34','35 a 49','50 y +']
                    },
                    ['RECIÉN NACIDOS EN SERVICIO Y DOMICILIO']:{
                        columns:[21,25],
                        valuesColumns:['|Servicio','|Domicilio']
                    },
                    ['CONTROL DE CRECIMIENTO INFANTIL']:{
                        columns:[21,23,25,27],
                        valuesColumns:['NUEVOS||Masculino', 'NUEVOS||Femenino', 'REPETIDOS||Masculino', 'REPETIDOS||Femenino']
                    },
                    ['INTERNACIONES']:{
                        columns:[21,25], 
                        valuesColumns:['||Masculino', '||Femenino'],
                        exception:{filasItem:['7.  Días camas ocupadas maternidad', '8.  Días camas ocupadas otros servicios', '9. Dias camas disponibles maternidad', '10. Días camas disponibles otros servicios'], 
                                    atributos:[['variable','No.']]}
                    },
                    ['VACUNACIONES EN MENORES DE 5 AÑOS']:{
                        columns:[19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57],
                        valuesColumns:[' Menor de  1 año|Dentro|Masculino', ' Menor de  1 año|Dentro|Femenino', ' Menor de  1 año|Fuera|Masculino', ' Menor de  1 año|Fuera|Femenino', '- 12 a 23 meses|Dentro|Masculino', '- 12 a 23 meses|Dentro|Femenino', '- 12 a 23 meses|Fuera|Masculino', '- 12 a 23 meses|Fuera|Femenino', '2 años|Dentro|Masculino', '2 años|Dentro|Femenino', '2 años|Fuera|Masculino', '2 años|Fuera|Femenino', '3 años|Dentro|Masculino', '3 años|Dentro|Femenino', '3 años|Fuera|Masculino', '3 años|Fuera|Femenino', '4 años|Dentro|Masculino', '4 años|Dentro|Femenino', '4 años|Fuera|Masculino', '4 años|Fuera|Femenino'],                        
                    }, 
                    ['OTRAS VACUNACIONES']:{
                        columns:[11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57],
                        valuesColumns:['5 a 9 años|Dentro|Masculino', '5 a 9 años|Dentro|Femenino', '5 a 9 años|Fuera|Masculino', '5 a 9 años|Fuera|Femenino', '10 años|Dentro|Masculino', '10 años|Dentro|Femenino', '10 años|Fuera|Masculino', '10 años|Fuera|Femenino', '11 años|Dentro|Masculino', '11 años|Dentro|Femenino', '11 años|Fuera|Masculino', '11 años|Fuera|Femenino', '12 a 20 años|Dentro|Masculino', '12 a 20 años|Dentro|Femenino', '12 a 20 años|Fuera|Masculino', '12 a 20 años|Fuera|Femenino', '21 a 59 años|Dentro|Masculino', '21 a 59 años|Dentro|Femenino', '21 a 59 años|Fuera|Masculino', '21 a 59 años|Fuera|Femenino', '60 y +|Dentro|Masculino', '60 y +|Dentro|Femenino', '60 y +|Fuera|Masculino', '60 y +|Fuera|Femenino']
                    },
                    ['MALARIA Número de tratamientos específicos entregados al paciente confirmado']:{
                        columns:[21,23,25,27],
                        valuesColumns:[' Vivax||Masculino', ' Vivax||Femenino', 'Falciparum||Masculino', 'Falciparum||Femenino']
                    },
                    ['RABIA']:{ 
                        columns:[21,25], 
                        valuesColumns:['||Masculino','||Femenino'],
                        exception:{filasItem:['5.  N° de perros y gatos con vacuna antirrábica'], 
                                    atributos:[['variable','No.']]}   
                    },
                    ['CHAGAS']:{
                        columns:[21,23,25,27], 
                        valuesColumns:['INICIADO||Masculino', 'INICIADO||Femenino', 'CONCLUIDO||Masculino', 'CONCLUIDO||Femenino'],
                        exception:{filasItem:['6. Viviendas Evaluadas', '7. Viviendas Positivas', '8. Viviendas Rociadas'], 
                            atributos:[['variable','No.']]}   
                    }, 
                    ['ACCIDENTES POR OFIDIOS Y ANIMALES PONZOÑOSOS']:{
                        columns:[21,25],
                        valuesColumns:['||Masculino','||Femenino']
                    },
                    //['TELESALUD']:{columns:[], valuesColumns:[]}, 
                    ['TELEEDUCACIÓN']:{
                        columns:[15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57],
                        valuesColumns:['MEDICOS||Masculino', 'MEDICOS||Femenino', 'ENFERMERA||Masculino', 'ENFERMERA||Femenino', 'AUX. ENF.||Masculino', 'AUX. ENF.||Femenino', 'ODONTO.||Masculino', 'ODONTO.||Femenino', 'OTRO PERSONAL||Masculino"', '"OTRO PERSONAL||Femenino"', 'ESCOLAR||Masculino', 'ESCOLAR||Femenino', 'JOVENES||Masculino', 'JOVENES||Femenino', 'ADULTOS||Masculino', 'ADULTOS||Femenino', 'DIRIGENTE||Masculino', 'DIRIGENTE||Femenino', 'PROMOTORES||Masculino', 'PROMOTORES||Femenino', 'OTROS||Masculino', 'OTROS||Femenino']
                    },

                    //columna secundarias con ´pivot 30
                    ['MICRONUTRIENTES Y LACTANCIA MATERNA']:{
                        columns:[55],
                        valuesColumns:['CANTIDAD']
                    },
                    ['OTRAS ACTIVIDADES  DE ENFERMERÍA']:{
                        columns:[51],
                        valuesColumns:['CANTIDAD']
                    },
                    ['CIRUGIAS Y ANESTESIAS']:{
                        columns:[51,55],
                        valuesColumns:['||Masculino','||Femenino']
                    },
                    ['ENFERMEDADES CONGÉNITAS DEL METABOLISMO']:{
                        columns:[51,55],
                        valuesColumns:['||Masculino','||Femenino']
                    },
                    ['ACTIVIDADES  DEL ESTABLECIMIENTO Y CON LA  COMUNIDAD']:{
                        columns:[55],
                        valuesColumns:['No.']
                    },
                    ['VIH - SIFILIS']:{
                        columns:[51,55],
                        valuesColumns:['||Masculino','||Femenino']
                    },
                    ['LEISHMANIASIS']:{
                        columns:[51,53,55,57],
                        valuesColumns:['INICIADO||Masculino', 'INICIADO||Femenino', 'CONCLUIDO||Masculino', 'CONCLUIDO||Femenino']
                    },
                    ['TUBERCULOSIS Y LEPRA']:{
                        columns:[51,55],
                        valuesColumns:['||Masculino','||Femenino']
                    }

                },
                exeptionColumns:{
                    ['TELESALUD']:{
                        pivots:[0,6,7],
                        filas:[1,2,3,4,5,6,7,8,9,10,11,12],
                        columns:[19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57], 
                        valuesColumns:[' < 6 meses||Masculino', ' < 6 meses||Femenino', '- 6 meses < 1 año||Masculino', '- 6 meses < 1 año||Femenino', '1 a 4 años||Masculino', '1 a 4 años||Femenino', '5 a 9 años||Masculino', '5 a 9 años||Femenino', '10 a 14 años||Masculino', '10 a 14 años||Femenino', '15 a 19 años||Masculino', '15 a 19 años||Femenino', '20 a 39 años||Masculino', '20 a 39 años||Femenino', '40 a 49 años||Masculino', '40 a 49 años||Femenino', '50 a 59 años||Masculino', '50 a 59 años||Femenino', '60 años +||Masculino', '60 años +||Femenino']
                    },
                }
                
            }
        }

    }
    /*camas: {
        alias:'tmp_camas',
        attributes:[["to_char(fecha_registro, 'YYYY-MM-DD')", 'periodo'], ['count(*)', 'registros']],
        file: ['Marca temporal','Dirección de correo electrónico','ENTE GESTOR','NOMBRE DEL ESTABLECIMIENTO DE SALUD','NIVEL DE ATENCIÓN','SERVICIOS DEL EESS PRIMER NIVEL','SERVICIOS DEL EESS SEGUNDO NIVEL','SERVICIOS EESS TERCER NIVEL','TOTAL CAMAS HOSPITALIZACIÓN','NÚMERO DE CAMAS DISPONIBLES HOSPITALIZACIÓN','TOTAL CAMAS UREGENCIAS/EMERGENCIAS','NÚMERO DE CAMAS DISPONIBLES URGENCIAS/EMERGENCIAS'],
        table: ['f_registro', 'mail_origen', 'ente_gestor', 'establecimieno', 'nivel_atencion', 'servicios_primer', 'servicios_segundo', 'servicios_tercer', 'total_camas', 'camas_disponibles', 'total_camas_emergencia', 'camas_emergencia_disponibles'],
        validate: [1,1,1,1,1,0,0,0,0,0,0,0],
        forFilter:['Marca temporal'],        
        update:[['fecha_registro',"COALESCE(CASE  WHEN  textregexeq(f_registro,'^[[:digit:]]+(\.[[:digit:]]+)?$') THEN TO_TIMESTAMP(trunc(f_registro::NUMERIC - (25567 + 2)) * 86400) ELSE TO_DATE(f_registro, 'DD/MM/YYYY') END,'1900-01-01') ",'Verifique el formato de fecha registro DD/MM/YYYY, que no sea vacio o nulo'],                
                            ],
        key:['mail_origen', 'ente_gestor', 'establecimieno', 'nivel_atencion'],
        //keyAux:['fecha_dispensacion','paciente', 'matricula','genero', 'edad','ente_gestor','departamento','establecimiento','nivel_atencion','matricula','cantidad_dispensada','no_receta','especialidad','diagnostico','observacion'],
        keyAux: ['f_registro', 'mail_origen', 'ente_gestor', 'establecimieno', 'nivel_atencion', 'servicios_primer', 'servicios_segundo', 'servicios_tercer', 'total_camas', 'camas_disponibles', 'total_camas_emergencia', 'camas_emergencia_disponibles'],
        gender: null,
        metodo: function (dato) {
            let sentencia =  ""
            if(!dato) sentencia =  "1=2"
            else sentencia = `to_char(fecha_registro, 'YYYY-MM-DD')='${dato}'`
            return sentencia
          },
    }, 
    pacientes_conflicto: {
        alias:'tmp_pacientes',
        attributes:[["to_char(fecha_registro, 'YYYY-MM-DD')", 'periodo'], ['count(*)', 'registros']],
        file: ['Marca temporal', 'Dirección de correo electrónico', '1. SEGURO AL QUE PERTENECE', '2. APELLIDO Y NOMBRE', '3. EDAD', '4. CARNET DE IDENTIDAD', '5. DIAGNÓSTICO', '6. CONDUCTA', '7. CENTRO DE REFERENCIA'],
        table: ['f_registro', 'mail_origen', 'ente_gestor', 'paciente', 'f_edad', 'ci', 'diagnostico', 'conducta', 'establecimiento'],
        validate: [1,1,1,1,1,1,1,1,1],
        forFilter:['Marca temporal'],        
        update:[['fecha_registro',"COALESCE(CASE  WHEN  textregexeq(f_registro,'^[[:digit:]]+(\.[[:digit:]]+)?$') THEN TO_TIMESTAMP(trunc(f_registro::NUMERIC - (25567 + 2)) * 86400) ELSE TO_DATE(f_registro, 'DD/MM/YYYY') END,'1900-01-01') ",'Verifique el formato de fecha registro DD/MM/YYYY, que no sea vacio o nulo'],
                ['edad', 'CAST(f_edad AS NUMERIC )', 'Verifique campo Edad que sea numerico y que no este vacio']                
                            ],
        key:['mail_origen', 'ente_gestor', 'paciente','establecimiento'],
        //keyAux:['fecha_dispensacion','paciente', 'matricula','genero', 'edad','ente_gestor','departamento','establecimiento','nivel_atencion','matricula','cantidad_dispensada','no_receta','especialidad','diagnostico','observacion'],
        keyAux: ['f_registro', 'mail_origen', 'ente_gestor', 'paciente', 'edad', 'ci', 'diagnostico', 'conducta', 'establecimiento'],
        gender: null,
        metodo: function (dato) {
            let sentencia =  ""
            if(!dato) sentencia =  "1=2"
            else sentencia = `to_char(fecha_registro, 'YYYY-MM-DD')='${dato}'`
            return sentencia
          },
    }, */


}

module.exports = PARAMETERS