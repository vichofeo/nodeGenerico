'use strict'
const PARAMETERS = {
    pai_regular: {
        alias:'tmp_pai',
        attributes:[["to_char(fecha_vacunacion, 'YYYY-MM')", 'periodo'], ['count(*)', 'registros']],
        file: ['No.','Fecha de Vacunación','Estrategia','Carnet de Identidad','Nombre Completo','Celular Paciente','Fecha de Nacimiento','Edad (Años)','Sexo','Nacionalidad','Codigo Departamento','Departamento','Codigo Municipio','Municipio','Codigo Establecimiento','Establecimiento','Subsector','Institucion','Ente Gestor','Empresa','Matricula','Nombre Vacuna','Nro. de Dosis','Proveedor','Lote Vacuna','Usuario','Celular Usuario','Estado Validación','Embarazo','Fecha Registro','Fecha Modificación','Jeringa de Administración','Lote Diluyente','Jeringa de Dilusión'],
        table: ['nro','f_vacunacion','estrategia','ci','nombre','celular','f_nacimiento','f_edad','f_genero','nacionalidad','cod_dpto','departamento','cod_mun','municipio','cod_rues','establecimiento','subsector','ente_gestor_name','ente_gestor','empresa','matricula','vacuna','nro_dosis','proveedor','lote_vacuna','usuario','cel_usr','validacion','embarazo','fecha_registro','fecha_modificacion','jeringa_administracion','lote_diluyente','jeringa_dilusion'],        
        validate: [0,1,0,0,1,0,1,1,1,0,1,1,1,1,0,1,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
        forFilter:['Fecha de Vacunación','Fecha de Nacimiento'],        
        update:[['fecha_nacimiento',"TO_DATE(f_nacimiento, 'DD/MM/YYYY')",'Verifique el formato de fecha Nacimiento DD/MM/YYYY'], ['fecha_vacunacion',"TO_DATE(f_vacunacion, 'DD/MM/YYYY')", 'Verifique el formato fecha vacunacion DD/MM/YYYY'], ['edad', 'CAST(f_edad AS NUMERIC )', 'Verifique campo Edad que sea numerico y que no este vacio']],
        superUpdate: {referer: 'tmp_equivalencia', update:[['eg','eg','Problemas con Ente gestor.'], ['dpto','dpto', 'Problemas con Dpto'], ['eess','eess']], conditional:[['ente_gestor_name','ente_gestor_name'],['departamento','departamento'],['establecimiento','establecimiento']]},
        //key:['fecha_vacunacion', "COALESCE(ci,'-1')",  'fecha_nacimiento', "COALESCE(nombre,'-1')", "COALESCE(edad, '-1')", 'f_genero', 'vacuna'],
        key:['fecha_vacunacion', "COALESCE(ci,'-1')",  'fecha_nacimiento', "COALESCE(nombre,'-1')", "COALESCE(edad, '-1')", 'f_genero', 'vacuna', 'lote_vacuna', "COALESCE(matricula, '-1')", 'idx'],
        keyAux:['fecha_vacunacion', "ci", 'fecha_nacimiento',  "nombre", "edad", 'genero', 'vacuna', 'nro_dosis','departamento', 'ente_gestor_name', 'establecimiento'],
        //gender: ['nombre', 'genero','f_genero']
        
    },  
    carmelo: {
        alias:'tmp_carmelo',
        attributes:[["to_char(fecha_dispensacion, 'YYYY-MM')", 'periodo'], ['count(*)', 'registros']],
        file: ['ENTE GESTOR','Departamento','Regional/Distrital','Nombre el Establecimiento','Nivel de atención','Fecha de dispensacion','Nombre del paciente ','N° de Matrícula Asegurado/Beneficiario','Sexo','Edad','Cantidad dispensada ','N° de receta ','Especialidad ','Diagnóstico','Observaciones'],
        table: ['ente_gestor_name','departamento','regional','establecimiento','nivel_atencion','f_dispensacion','paciente','matricula','f_genero','f_edad','cantidad_dispensada','no_receta','especialidad','diagnostico','observacion'],
        validate: [1,1,1,1,1,1,1,0,1,1,0,0,0,0,0],
        forFilter:['Fecha de dispensacion'],        
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
        superUpdate: {referer: 'tmp_equivalencia', update:[['eg','eg','Problemas con Ente gestor.'], ['dpto','dpto', 'Problemas con Dpto'], ['eess','eess']], conditional:[['ente_gestor_name','ente_gestor_name'],['departamento','departamento'],['establecimiento','establecimiento']]},            
        key:['fecha_dispensacion','paciente','ente_gestor_name','departamento','establecimiento','nivel_atencion', 'matricula', "COALESCE(no_receta,'-1')", "idx"],
        //keyAux:['fecha_dispensacion','paciente', 'matricula','genero', 'edad','ente_gestor','departamento','establecimiento','nivel_atencion','matricula','cantidad_dispensada','no_receta','especialidad','diagnostico','observacion'],
        keyAux: ['ente_gestor_name','departamento','regional','establecimiento','nivel_atencion','f_dispensacion','paciente','matricula','f_genero','f_edad','cantidad_dispensada','no_receta','especialidad','diagnostico','observacion'],
        gender: null//['paciente', 'genero','f_genero']
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
    
    nacimientos: {
        alias:'tmp_nacimientos',
        attributes:[["to_char(fecha_nacimiento, 'YYYY-MM')", 'periodo'], ['count(*)', 'registros']],
        file: ['Gestion', 'Codigo Unico Identificacion', 'Modalidad', 'Cod. departamento', 'Departamento', 'Cod. red', 'Red', 'Cod. municipio', 'Municipio', 'Cod. establecimiento', 'Establecimiento', 'Nivel', 'Subsector', 'Institucion', 'Ambito', 'Nombres', 'Primer apellido', 'Segundo apellido', 'Nro documento', 'Fecha Nacimiento', 'Departamento nac', 'Provincia nac', 'Municipio nac', 'Localidad nac', 'Producto', 'Lugar fisico', 'Sexo', 'Parto atendido', 'Edad gestacional', 'Peso', 'Talla', 'Apgar al minuto', 'Apgar 5 minutos', 'Malformaciones', 'Nombres madre', 'Segundo apellido madre', 'Tipo documento madre', 'Complemento documento madre', 'Fecha nac madre', 'Expedicion madre', 'Identificacion cultural', 'Departamento residencia', 'Provincia residencia', 'Municipio residencia', 'Localidad residencia', 'Certificador nombre completo', 'Certificador profesion', 'Certificador matricula', 'Fecha emision', 'Fecha registro', 'Estado certificado', 'Nombres usuario', 'Primer apellido usuario', 'Segundo apellido usuario'],
        table: ['gestion','codigo_unico_identificacion','modalidad','cod_dpto','departamento','cod_red','red','cod_municipio','municipio','cod_establecimiento','establecimiento','nivel','subsector','ente_gestor_name','ambito','nombres','primer_apellido','segundo_apellido','nro_documento','f_nacimiento','departamento_nac','provincia_nac','municipio_nac','localidad_nac','producto','lugar_fisico','sexo','parto_atendido','edad_gestacional','peso','talla','apgar_al_minuto','apgar_5_minutos','malformaciones','nombres_madre','segundo_apellido_madre','tipo_documento_madre','complemento_documento_madre','f_nacmadre','expedicion_madre','identificacion_cultural','departamento_residencia','provincia_residencia','municipio_residencia','localidad_residencia','certificador_nombre_completo','certificador_profesion','certificador_matricula','fecha_emision','fecha_registro','estado_certificado','nombres_usuario','primer_apellido_usuario','segundo_apellido_usuario'],        
        validate: [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        forFilter:['Fecha Nacimiento'],        
        update:[['fecha',"TO_DATE(f_nacimiento, 'DD/MM/YYYY')",'Verifique el formato de fecha Nacimiento DD/MM/YYYY'],
            ['fecha_nacimiento',"TO_DATE(f_nacimiento, 'DD/MM/YYYY')",'Verifique el formato de fecha Nacimiento DD/MM/YYYY'], 
        ['fecha_nac_madre',"TO_DATE(f_nacmadre, 'DD/MM/YYYY')", 'Verifique el formato fecha nacimiento madre DD/MM/YYYY']],
        superUpdate: {referer: 'tmp_equivalencia', update:[['eg','eg','Problemas con Ente gestor.'], ['dpto','dpto', 'Problemas con Dpto'], ['eess','eess']], conditional:[['ente_gestor_name','ente_gestor_name'],['departamento','departamento'],['establecimiento','establecimiento']]},
        //key:['fecha_vacunacion', "COALESCE(ci,'-1')",  'fecha_nacimiento', "COALESCE(nombre,'-1')", "COALESCE(edad, '-1')", 'f_genero', 'vacuna'],
        key:['fecha_nacimiento', "codigo_unico_identificacion"],
        keyAux:['gestion','codigo_unico_identificacion','modalidad','cod_dpto','departamento','cod_red','red','cod_municipio','municipio','cod_establecimiento','establecimiento','nivel','subsector','ente_gestor_name'],
        //gender: ['nombre', 'genero','f_genero']        
    },
    defunciones: {
        alias:'tmp_defunciones',
        attributes:[["to_char(fecha_defuncion, 'YYYY-MM')", 'periodo'], ['count(*)', 'registros']],
        file: ['Gestión' ,'Código' ,'Código Departamento' ,'Departamento' ,'Código Área' ,'Red' ,'Código Municipio' ,'Municipio' ,'Código Establecimiento' ,'Establecimiento' ,'Nivel' ,'Subsector' ,'Institución' ,'Ámbito' ,'Departamento Nacimiento' ,'Provincia Nacimiento' ,'Municipio Nacimiento' ,'Localidad Nacimiento' ,'Departamento Residencia' ,'Provincia Residencia' ,'Municipio Residencia' ,'Localidad Residencia' ,'Nombres' ,'Segundo Apellido' ,'Tipo Documento' ,'Complemento Documento' ,'Código Expedición' ,'Verificación SEGIP' ,'Lugar Físico Fallecimiento' ,'Fecha Nacimiento' ,'Fecha Defunción' ,'Edad Año' ,'Edad Mes' ,'Edad Día' ,'Sexo' ,'Grado Instrucción' ,'Estado Civil' ,'Origen Ciudadano' ,'Departamento Defunción' ,'Provincia Defunción' ,'Municipio Defunción' ,'Localidad Defunción' ,'Atención Médica' ,'Causa Directa' ,'CIE10 Causa Directa Código' ,'CIE10 Causa Directa Descripción' ,'Causa Antecedente 1' ,'CIE10 Causa Antecedente 1 Código' ,'CIE10 Causa Antecedente 1 Descripción' ,'Causa Antecedente 2' ,'CIE10 Causa Antecedente 2 Código' ,'CIE10 Causa Antecedente 2 Descripción' ,'Causa Antecedente 3' ,'CIE10 Causa Antecedente 3 Código' ,'CIE10 Causa Antecedente 3 Descripción' ,'Causa Contribuyente 1' ,'CIE10 Causa Contribuyente 1 Código' ,'CIE10 Causa Contribuyente 1 Descripción' ,'Causa Contribuyente 2' ,'CIE10 Causa Contribuyente 2 Código' ,'CIE10 Causa Contribuyente 2 Descripción' ,'CIE10 Causa Básica Código' ,'CIE10 Causa Básica Descripción' ,'Presunción Muerte' ,'Mecanismo Muerte' ,'Lugar Físico Lesión' ,'Procedimiento' ,'Detalle Probable Lesión' ,'Defunción Femenina' ,'Causa Fue Complicación Embarazo' ,'Causa Complicó Embarazo' ,'Certificador Nombre Completo' ,'Certificador Profesión' ,'Certificador Matrícula' ,'Fecha Emisión' ,'Fecha Registro' ,'Usuario Registro' ,'Estado'],
        table: ['gestion' ,'codigo' ,'cod_dpto' ,'departamento' ,'cod_area' ,'red' ,'cod_municipio' ,'municipio' ,'cod_establecimiento' ,'establecimiento' ,'nivel' ,'subsector' ,'ente_gestor_name' ,'ambito' ,'departamento_nacimiento' ,'provincia_nacimiento' ,'municipio_nacimiento' ,'localidad_nacimiento' ,'departamento_residencia' ,'provincia_residencia' ,'municipio_residencia' ,'localidad_residencia' ,'nombres' ,'segundo_apellido' ,'tipo_documento' ,'complemento_documento' ,'codigo_expedicion' ,'verificacion_segip' ,'lugar_fisico_fallecimiento' ,'f_nacimiento' ,'f_defuncion' ,'edad_anio' ,'edad_mes' ,'edad_dia' ,'sexo' ,'grado_instruccion' ,'estado_civil' ,'origen_ciudadano' ,'departamento_defuncion' ,'provincia_defuncion' ,'municipio_defuncion' ,'localidad_defuncion' ,'atencion_medica' ,'causa_directa' ,'cie10_causa_directa_codigo' ,'cie10_causa_directa_descripcion' ,'causa_antecedente_1' ,'cie10_causa_antecedente_1_codigo' ,'cie10_causa_antecedente_1_descripcion' ,'causa_antecedente_2' ,'cie10_causa_antecedente_2_codigo' ,'cie10_causa_antecedente_2_descripcion' ,'causa_antecedente_3' ,'cie10_causa_antecedente_3_codigo' ,'cie10_causa_antecedente_3_descripcion' ,'causa_contribuyente_1' ,'cie10_causa_contribuyente_1_codigo' ,'cie10_causa_contribuyente_1_descripcion' ,'causa_contribuyente_2' ,'cie10_causa_contribuyente_2_codigo' ,'cie10_causa_contribuyente_2_descripcion' ,'cie10_causa_b_sica_codigo' ,'cie10_causa_b_sica_descripcion' ,'presuncion_muerte' ,'mecanismo_muerte' ,'lugar_fisico_lesion' ,'procedimiento' ,'detalle_probable_lesion' ,'defuncion_femenina' ,'causa_fue_complicacion_embarazo' ,'causa_complic_embarazo' ,'certificador_nombre_completo' ,'certificador_profesion' ,'certificador_matricula' ,'fecha_emision' ,'fecha_registro' ,'usuario_registro' ,'estado'],        
        validate: [1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        forFilter:['Fecha Nacimiento', 'Fecha Defunción'],        
        update:[['fecha',"TO_DATE(f_defuncion, 'DD/MM/YYYY')", 'Verifique el formato fecha defuncion DD/MM/YYYY'],
            ['fecha_nacimiento',"TO_DATE(f_nacimiento, 'DD/MM/YYYY')",'Verifique el formato de fecha Nacimiento DD/MM/YYYY'], 
        ['fecha_defuncion',"TO_DATE(f_defuncion, 'DD/MM/YYYY')", 'Verifique el formato fecha defuncion DD/MM/YYYY']],
        superUpdate: {referer: 'tmp_equivalencia', update:[['eg','eg','Problemas con Ente gestor.'], ['dpto','dpto', 'Problemas con Dpto'], ['eess','eess']], conditional:[['ente_gestor_name','ente_gestor_name'],['departamento','departamento'],['establecimiento','establecimiento']]},
        //key:['fecha_vacunacion', "COALESCE(ci,'-1')",  'fecha_nacimiento', "COALESCE(nombre,'-1')", "COALESCE(edad, '-1')", 'f_genero', 'vacuna'],
        key:['fecha_defuncion', "codigo"],
        keyAux:['gestion' ,'codigo' ,'cod_dpto' ,'departamento' ,'cod_area' ,'red' ,'cod_municipio' ,'municipio' ,'cod_establecimiento' ,'establecimiento' ,'nivel' ,'subsector' ,'ente_gestor_name' ,'ambito' ,'departamento_nacimiento' ,'provincia_nacimiento' ,'municipio_nacimiento' ,'localidad_nacimiento' ,'departamento_residencia' ,'provincia_residencia' ,'municipio_residencia' ,'localidad_residencia' ,'nombres' ,'segundo_apellido' ,'tipo_documento' ,'complemento_documento'],
        //gender: ['nombre', 'genero','f_genero']        
    },  
    snis_301a:{
        alias:'tmp_snis301a',
        attributes:[["gestion||'-'||mes", 'periodo'], ['count(*)', 'registros']],        
        file: [[[0,0],['frm','INFORME MENSUAL DE PRODUCCIÓN DE SERVICIOS']], [[3,3], 'departamento'], [[], 'ente_gestor_name'], [[4,8], 'establecimiento'], [[4,44], 'gestion'], [[4,36],'mes'], [[3,21], 'red'], [[3,40], 'municipio'],[[2,40], 'sub_sector']],
        table: ['departamento', 'ente_gestor_name', 'establecimiento', 'gestion', 'mes', 'formulario', 'grupo', "variable", 'subvariable', 'valor'],        
        validate: [1,1,1,2,2,1,1,0,0,2],
        forFilter:  null,//[ array de campos fecha a validar],        
        update:[],
        superUpdate: {referer: 'tmp_equivalencia', update:[['eg','eg','Problemas con Ente gestor.'], ['dpto','dpto', 'Problemas con Dpto'], ['eess','eess']], conditional:[['ente_gestor_name','ente_gestor_name'],['departamento','departamento'],['establecimiento','establecimiento']]},
        key:['departamento', 'ente_gestor_name', 'establecimiento', 'gestion', 'mes', 'formulario', 'grupo', "COALESCE(variable,'-1')",'lugar_atencion' ,"COALESCE(subvariable, '-1')"],
        keyAux:['departamento', 'ente_gestor_name', 'establecimiento', 'gestion', 'mes', 'formulario', 'grupo', 'variable','lugar_atencion' ,'subvariable', 'valor'],
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

    },
    snis_301b:{
        alias:'tmp_snis301b',
        attributes:[["gestion||'-'||mes", 'periodo'], ['count(*)', 'registros']],        
        file: [[[2,1],['frm','INFORME MENSUAL DE PRODUCCIÓN DE SERVICIOS DE II Y III NIVEL']], [[5,4], 'departamento'], [[], 'ente_gestor_name'], [[6,4], 'establecimiento'], [[6,30], 'gestion'], [[6,23],'mes'], [[5,14], 'red'], [[5,23], 'municipio'],[[4,39], 'sub_sector']],
        table: ['departamento', 'ente_gestor_name', 'establecimiento', 'gestion', 'mes', 'formulario', 'grupo', "variable", 'subvariable', 'valor'],        
        validate: [1,1,1,2,2,1,1,0,0,2],
        forFilter:  null,//[ array de campos fecha a validar],        
        update:[],
        superUpdate: {referer: 'tmp_equivalencia', update:[['eg','eg','Problemas con Ente gestor.'], ['dpto','dpto', 'Problemas con Dpto'], ['eess','eess']], conditional:[['ente_gestor_name','ente_gestor_name'],['departamento','departamento'],['establecimiento','establecimiento']]},
        key:['departamento', 'ente_gestor_name', 'establecimiento', 'gestion', 'mes', 'formulario', 'grupo', "COALESCE(variable,'-1')","COALESCE(lugar_atencion,'-1')" ,"COALESCE(subvariable, '-1')"],
        keyAux:['departamento', 'ente_gestor_name', 'establecimiento', 'gestion', 'mes', 'formulario', 'grupo', 'variable','lugar_atencion' ,'subvariable', 'valor'],
        //gender: ['nombre', 'genero','f_genero']
        filterByFunc:{
            alias:'parserSnis301B' ,
            params: {                
                sections: ['CONSULTA EXTERNA POR ESPECIALIDAD', 'EMERGENCIA', 'INGRESOS Y EGRESOS POR SERVICIO DE INTERNACION', 'INTERCONSULTAS REALIZADAS EN SERVICIOS DE:',
                    'CIRUGIAS Y ANESTESIAS', 'ACTIVIDADES  DE ENFERMERÍA'
                ],               
                sectionsCol2:['REFERENCIA, TRANSFERENCIA Y CONTRARREFERENCIA HOSPITALARIAS', 'SERVICIOS COMPLEMENTARIOS'],
                sectionsCol3:['TRATAMIENTO COMPLEMENTARIOS', 'GESTION DE CALIDAD'],
                dataNoProcess: ['Continua de pag N°1  Anticoncepción,Prevención de cáncer….','M','F'],
                sectionsColumns:{
                    ['CONSULTA EXTERNA POR ESPECIALIDAD']:{pivot:3,
                                columns:[8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47],
                                valuesColumns: [' Menor de 6 meses|Nuevo|Masculino', ' Menor de 6 meses|Nuevo|Femenino', ' Menor de 6 meses|Repetido|Masculino', ' Menor de 6 meses|Repetido|Femenino', '- 6 meses a menor de 1 año|Nuevo|Masculino', '- 6 meses a menor de 1 año|Nuevo|Femenino', '- 6 meses a menor de 1 año|Repetido|Masculino', '- 6 meses a menor de 1 año|Repetido|Femenino', '1 a 4 años |Nuevo|Masculino', '1 a 4 años |Nuevo|Femenino', '1 a 4 años |Repetido|Masculino', '1 a 4 años |Repetido|Femenino', '5 a 9 años|Nuevo|Masculino', '5 a 9 años|Nuevo|Femenino', '5 a 9 años|Repetido|Masculino', '5 a 9 años|Repetido|Femenino', '10 a 14 años|Nuevo|Masculino', '10 a 14 años|Nuevo|Femenino', '10 a 14 años|Repetido|Masculino', '10 a 14 años|Repetido|Femenino', '15 a 19 años|Nuevo|Masculino', '15 a 19 años|Nuevo|Femenino', '15 a 19 años|Repetido|Masculino', '15 a 19 años|Repetido|Femenino', '20 a 39 años|Nuevo|Masculino', '20 a 39 años|Nuevo|Femenino', '20 a 39 años|Repetido|Masculino', '20 a 39 años|Repetido|Femenino', '40 a 49 años|Nuevo|Masculino', '40 a 49 años|Nuevo|Femenino', '40 a 49 años|Repetido|Masculino', '40 a 49 años|Repetido|Femenino', '50 a 59 años|Nuevo|Masculino', '50 a 59 años|Nuevo|Femenino', '50 a 59 años|Repetido|Masculino', '50 a 59 años|Repetido|Femenino', '60 y más|Nuevo|Masculino', '60 y más|Nuevo|Femenino', '60 y más|Repetido|Masculino', '60 y más|Repetido|Femenino']
                            },
                    ['EMERGENCIA']: {pivot:2,
                        columns:[8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46],
                        valuesColumns:[' Menor de 6 meses||Masculino', ' Menor de 6 meses||Femenino', '- 6 meses a menor de 1 año||Masculino', '- 6 meses a menor de 1 año||Femenino', '1 a 4 años ||Masculino', '1 a 4 años ||Femenino', '5 a 9 años||Masculino', '5 a 9 años||Femenino', '10 a 14 años||Masculino', '10 a 14 años||Femenino', '15 a 19 años||Masculino', '15 a 19 años||Femenino', '20 a 39 años||Masculino', '20 a 39 años||Femenino', '40 a 49 años||Masculino', '40 a 49 años||Femenino', '50 a 59 años||Masculino', '50 a 59 años||Femenino', '60 años y más||Masculino', '60 años y más||Femenino']
                    },
                    ['INGRESOS Y EGRESOS POR SERVICIO DE INTERNACION']:{pivot:3,
                        columns:[10,12,14,16,18,20,22,24,27,30,33,36,39,42,45],
                        valuesColumns:['1. Camas||', '2. INGRESOS||Existencia', '2. INGRESOS||Nuevos', '2. INGRESOS||Traslado Interno', '3. EGRESOS|Alta|Medica', '3. EGRESOS|Alta|Solicitada', '3. EGRESOS|Alta|Fuga', '3. EGRESOS||Defunción antes de 48 Hrs.', '3. EGRESOS||Defunción a partir de 48 Hrs.', '3. EGRESOS||Traslado Interno', '4. REFERENCIA/CONTRARREFERENCIA||Referidos', '4. REFERENCIA/CONTRARREFERENCIA||Contrareferidos', '5. Ingresos y egresos del mismo dia||', '6. Dias Cama Ocupada||', '7. Dias Cama Disp.||']
                    },
                    ['INTERCONSULTAS REALIZADAS EN SERVICIOS DE:']:{pivot:2,
                        columns:[8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46],
                        valuesColumns:[' Menor de 6 meses||Masculino', ' Menor de 6 meses||Femenino', '- 6 meses a menor de 1 año||Masculino', '- 6 meses a menor de 1 año||Femenino', '1 a 4 años ||Masculino', '1 a 4 años ||Femenino', '5 a 9 años||Masculino', '5 a 9 años||Femenino', '10 a 14 años||Masculino', '10 a 14 años||Femenino', '15 a 19 años||Masculino', '15 a 19 años||Femenino', '20 a 39 años||Masculino', '20 a 39 años||Femenino', '40 a 49 años||Masculino', '40 a 49 años||Femenino', '50 a 59 años||Masculino', '50 a 59 años||Femenino', '60 años y más||Masculino', '60 años y más||Femenino']
                    },
                    ['CIRUGIAS Y ANESTESIAS']:{pivot:2,
                        columns:[8,10],
                        valuesColumns:['||Masculino', '||Femenino'],
                        exception:{filasItem:['Nº de Quirófanos instalados', 'Nº de Quirófanos funcionantes en el periodo', 'Nº de Quirófanos en el periodo destinados a cirugias de emergencias', 'Nº de Quirófanos funcionantes en el periodo destinados a cirugias programadas'], 
                            atributos:[['variable','Cantidad']]}
                    },
                    ['ACTIVIDADES  DE ENFERMERÍA']:{pivot:2,
                        columns:[6,8,10],
                        valuesColumns:['EMERGENCIAS', 'CONSULTA EXRERNA', 'INTERNACIÓN']
                    },

                    //columna secundarias con ´pivot 14
                    ['REFERENCIA, TRANSFERENCIA Y CONTRARREFERENCIA HOSPITALARIAS']:{pivot:14,
                        columns:[20,22,24,26,28,30],
                        valuesColumns:['EMERGENCIAS||Masculino', 'EMERGENCIAS||Femenino', 'CONSULTA EXTERNA||Masculino', 'CONSULTA EXTERNA||Femenino', 'INTERNACIÓN||Masculino', 'INTERNACIÓN||Femenino']
                    },
                    ['SERVICIOS COMPLEMENTARIOS']:{pivot:14,
                        columns:[20,22,24,26,28,30,32,34],
                        valuesColumns:['EMERGENCIAS||Masculino', 'EMERGENCIAS||Femenino', 'CONSULTA EXTERNA||Masculino', 'CONSULTA EXTERNA||Femenino', 'INTERNACIÓN||Masculino', 'INTERNACIÓN||Femenino', 'QUIROFANO||Masculino', 'QUIROFANO||Femenino']
                    },
                    //columna 3 pivot:35
                    ['TRATAMIENTO COMPLEMENTARIOS']:{pivot:35,
                        columns:[44,46],
                        valuesColumns:['||Masculino', '||Femenino']

                    },
                    ['GESTION DE CALIDAD']:{pivot:35,
                        columns:[46],
                        valuesColumns:['Cantidad']
                    }


                },
                exeptionColumns: undefined
                
            }
        }

    },
    snis_302a:{
        alias:'tmp_snis302a',
        attributes:[["gestion||'-'||semana", 'periodo'], ['count(*)', 'registros']],
        //file: ['departamento', 'ente gestor', 'establecimiento', 'cue','gestion', 'semana', 'Grupo de variables', ' Menor de 6 meses|Masculino', ' Menor de 6 meses|Femenino', '6 meses a menor de 1 año|Masculino', '6 meses a menor de 1 año|Femenino', '1 - 4 años|Masculino', '1 - 4 años|Femenino', '5 - 9 años|Masculino', '5 - 9 años|Femenino', '10 - 14 años|Masculino', '10 - 14 años|Femenino', '15 - 19 años|Masculino', '15 - 19 años|Femenino', '20 - 39 años|Masculino', '20 - 39 años|Femenino', '40 - 49 años|Masculino', '40 - 49 años|Femenino', '50 - 59 años|Masculino', '50 - 59 años|Femenino', '60 años y más|Masculino', '60 años y más|Femenino'],
        file: [[[1,26],['frm','NOTIFICACIÓN PARA LA VIGILANCIA EPIDEMIOLÓGICA']], [[4,3], 'departamento'], [[], 'ente_gestor_name'], [[5,6], 'establecimiento'], [[5,35], 'gestion'], [[2,87],'semana'], [[4,28], 'red'], [[4,59], 'municipio'],[[5,57], 'sub_sector']],
        table: ['departamento', 'ente_gestor_name', 'establecimiento', 'gestion', 'semana', 'formulario', 'grupo', "variable", 'subvariable', 'valor'],        
        validate: [1,1,1,2,2,1,1,0,0,2],
        forFilter:  null,//['Fecha de Vacunación','Fecha de Nacimiento'],        
        update:[],
        superUpdate: {referer: 'tmp_equivalencia', update:[['eg','eg','Problemas con Ente gestor.'], ['dpto','dpto', 'Problemas con Dpto'], ['eess','eess']], conditional:[['ente_gestor_name','ente_gestor_name'],['departamento','departamento'],['establecimiento','establecimiento']]},
        key:['departamento', 'ente_gestor_name', 'establecimiento', 'gestion', 'semana', 'formulario', 'grupo', "COALESCE(variable,'-1')",'lugar_atencion' ,"COALESCE(subvariable, '-1')"],
        keyAux:['departamento', 'ente_gestor_name', 'establecimiento', 'gestion', 'semana', 'formulario', 'grupo', 'variable','lugar_atencion' ,'subvariable', 'valor'],
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
    snis_302b:{
        alias:'tmp_snis302b',
        attributes:[["gestion||'-'||mes", 'periodo'], ['count(*)', 'registros']],        
        file: [[[1,1],['frm','NOTIFICACIÓN MENSUAL  PARA LA VIGILANCIA EPIDEMIOLOGICA  (ENFERMEDADES NO TRANSMISIBLES Y FACTORES DE RIESGO)']], [[6,7], 'departamento'], [[], 'ente_gestor_name'], [[8,8], 'establecimiento'], [[8,44], 'gestion'], [[8,33],'mes'], [[6,18], 'red'], [[6,30], 'municipio'],[[6,43], 'sub_sector']],
        table: ['departamento', 'ente_gestor_name', 'establecimiento', 'gestion', 'mes', 'formulario', 'grupo','gvariable' ,"variable", 'subvariable', 'valor'],        
        validate: [1,1,1,2,2,1,1,0,0,2],
        forFilter:  null,//[ array de campos fecha a validar],        
        update:[],
        superUpdate: {referer: 'tmp_equivalencia', update:[['eg','eg','Problemas con Ente gestor.'], ['dpto','dpto', 'Problemas con Dpto'], ['eess','eess']], conditional:[['ente_gestor_name','ente_gestor_name'],['departamento','departamento'],['establecimiento','establecimiento']]},
        key:['departamento', 'ente_gestor_name', 'establecimiento', 'gestion', 'mes', 'formulario', 'grupo',"COALESCE(gvariable,'-1')" ,"COALESCE(variable,'-1')","COALESCE(lugar_atencion,'-1')" ,"COALESCE(subvariable, '-1')"],
        keyAux:['departamento', 'ente_gestor_name', 'establecimiento', 'gestion', 'mes', 'formulario', 'grupo', 'gvariable','variable','lugar_atencion' ,'subvariable', 'valor'],
        //gender: ['nombre', 'genero','f_genero']
        filterByFunc:{
            alias:'parserSnis302B' ,
            params: {                
                sections: ['FACTORES DE RIESGO', 'ENFERMEDADES', 'ENFERMEDADES ONCOLOGICAS', 'ENFERMEDAD Y ESTADIO RENAL',
                    'TRANSTORNOS MENTALES', 'TRANSTORNOS NEUROLOGICOS', 'MORTALIDAD','CLASIFICACIÓN'
                ],               
                sectionsCol2:['TALLA PARA LA EDAD (T/E)', 'VIGILANCIA AL DESARROLLO INFANTIL TEMPRANO'],
                
                dataNoProcess: ['Continua de pag N°1  Anticoncepción,Prevención de cáncer….','M','F'],
                sectionsColumns:{
                    ['FACTORES DE RIESGO']:{pivot:1,
                                columns:[15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53],
                                valuesColumns: ['REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES| Menor de 6 meses||Masculino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES| Menor de 6 meses||Femenino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|- 6 meses a menor de 1 año||Masculino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|- 6 meses a menor de 1 año||Femenino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|1 - 4  años||Masculino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|1 - 4  años||Femenino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|5 - 9  años||Masculino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|5 - 9  años||Femenino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|10 - 14 años||Masculino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|10 - 14 años||Femenino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|15 - 19 años||Masculino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|15 - 19 años||Femenino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|20 - 39 años||Masculino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|20 - 39 años||Femenino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|40 - 49 años||Masculino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|40 - 49 años||Femenino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|50 - 59 años||Masculino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|50 - 59 años||Femenino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|60 años y más||Masculino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|60 años y más||Femenino']
                            },
                    ['ENFERMEDADES']:{pivot:1,
                        columns:[15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54],
                        valuesColumns:['REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Masculino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Masculino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Femenino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Femenino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Masculino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Masculino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Femenino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Femenino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|1 - 4 años|Masculino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|1 - 4 años|Masculino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|1 - 4 años|Femenino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|1 - 4 años|Femenino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|5 - 9 años|Masculino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|5 - 9 años|Masculino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|5 - 9 años|Femenino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|5 - 9 años|Femenino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|10 - 14 años|Masculino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|10 - 14 años|Masculino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|10 - 14 años|Femenino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|10 - 14 años|Femenino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|15 - 19 años|Masculino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|15 - 19 años|Masculino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|15 - 19 años|Femenino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|15 - 19 años|Femenino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|20 - 39 años|Masculino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|20 - 39 años|Masculino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|20 - 39 años|Femenino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|20 - 39 años|Femenino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|40 - 49 años|Masculino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|40 - 49 años|Masculino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|40 - 49 años|Femenino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|40 - 49 años|Femenino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|50 - 59 años|Masculino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|50 - 59 años|Masculino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|50 - 59 años|Femenino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|50 - 59 años|Femenino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|60 años y más|Masculino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|60 años y más|Masculino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|60 años y más|Femenino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|60 años y más|Femenino|R']
                    },
                    ['ENFERMEDADES ONCOLOGICAS']:{pivot:1,
                        columns:[15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54],
                        valuesColumns:['REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Masculino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Masculino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Femenino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Femenino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Masculino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Masculino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Femenino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Femenino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|1 - 4 años|Masculino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|1 - 4 años|Masculino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|1 - 4 años|Femenino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|1 - 4 años|Femenino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|5 - 9 años|Masculino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|5 - 9 años|Masculino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|5 - 9 años|Femenino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|5 - 9 años|Femenino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|10 - 14 años|Masculino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|10 - 14 años|Masculino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|10 - 14 años|Femenino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|10 - 14 años|Femenino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|15 - 19 años|Masculino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|15 - 19 años|Masculino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|15 - 19 años|Femenino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|15 - 19 años|Femenino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|20 - 39 años|Masculino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|20 - 39 años|Masculino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|20 - 39 años|Femenino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|20 - 39 años|Femenino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|40 - 49 años|Masculino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|40 - 49 años|Masculino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|40 - 49 años|Femenino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|40 - 49 años|Femenino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|50 - 59 años|Masculino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|50 - 59 años|Masculino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|50 - 59 años|Femenino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|50 - 59 años|Femenino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|60 años y más|Masculino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|60 años y más|Masculino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|60 años y más|Femenino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|60 años y más|Femenino|R']
                    },
                    ['ENFERMEDAD Y ESTADIO RENAL']:{pivot:1,
                        columns:[15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54],
                        valuesColumns:['REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Masculino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Masculino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Femenino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Femenino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Masculino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Masculino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Femenino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Femenino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|1 - 4 años|Masculino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|1 - 4 años|Masculino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|1 - 4 años|Femenino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|1 - 4 años|Femenino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|5 - 9 años|Masculino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|5 - 9 años|Masculino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|5 - 9 años|Femenino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|5 - 9 años|Femenino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|10 - 14 años|Masculino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|10 - 14 años|Masculino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|10 - 14 años|Femenino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|10 - 14 años|Femenino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|15 - 19 años|Masculino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|15 - 19 años|Masculino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|15 - 19 años|Femenino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|15 - 19 años|Femenino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|20 - 39 años|Masculino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|20 - 39 años|Masculino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|20 - 39 años|Femenino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|20 - 39 años|Femenino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|40 - 49 años|Masculino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|40 - 49 años|Masculino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|40 - 49 años|Femenino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|40 - 49 años|Femenino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|50 - 59 años|Masculino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|50 - 59 años|Masculino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|50 - 59 años|Femenino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|50 - 59 años|Femenino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|60 años y más|Masculino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|60 años y más|Masculino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|60 años y más|Femenino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|60 años y más|Femenino|R']
                    },
                    ['TRANSTORNOS MENTALES']:{pivot:1,
                        columns:[15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54],
                        valuesColumns:['REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Masculino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Masculino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Femenino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Femenino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Masculino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Masculino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Femenino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Femenino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|1 - 4 años|Masculino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|1 - 4 años|Masculino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|1 - 4 años|Femenino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|1 - 4 años|Femenino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|5 - 9 años|Masculino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|5 - 9 años|Masculino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|5 - 9 años|Femenino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|5 - 9 años|Femenino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|10 - 14 años|Masculino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|10 - 14 años|Masculino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|10 - 14 años|Femenino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|10 - 14 años|Femenino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|15 - 19 años|Masculino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|15 - 19 años|Masculino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|15 - 19 años|Femenino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|15 - 19 años|Femenino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|20 - 39 años|Masculino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|20 - 39 años|Masculino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|20 - 39 años|Femenino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|20 - 39 años|Femenino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|40 - 49 años|Masculino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|40 - 49 años|Masculino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|40 - 49 años|Femenino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|40 - 49 años|Femenino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|50 - 59 años|Masculino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|50 - 59 años|Masculino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|50 - 59 años|Femenino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|50 - 59 años|Femenino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|60 años y más|Masculino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|60 años y más|Masculino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|60 años y más|Femenino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|60 años y más|Femenino|R']
                    },
                    ['TRANSTORNOS NEUROLOGICOS']:{pivot:1,
                        columns:[15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54],
                        valuesColumns:['REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Masculino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Masculino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Femenino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Femenino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Masculino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Masculino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Femenino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Femenino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|1 - 4 años|Masculino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|1 - 4 años|Masculino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|1 - 4 años|Femenino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|1 - 4 años|Femenino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|5 - 9 años|Masculino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|5 - 9 años|Masculino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|5 - 9 años|Femenino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|5 - 9 años|Femenino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|10 - 14 años|Masculino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|10 - 14 años|Masculino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|10 - 14 años|Femenino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|10 - 14 años|Femenino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|15 - 19 años|Masculino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|15 - 19 años|Masculino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|15 - 19 años|Femenino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|15 - 19 años|Femenino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|20 - 39 años|Masculino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|20 - 39 años|Masculino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|20 - 39 años|Femenino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|20 - 39 años|Femenino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|40 - 49 años|Masculino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|40 - 49 años|Masculino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|40 - 49 años|Femenino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|40 - 49 años|Femenino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|50 - 59 años|Masculino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|50 - 59 años|Masculino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|50 - 59 años|Femenino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|50 - 59 años|Femenino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|60 años y más|Masculino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|60 años y más|Masculino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|60 años y más|Femenino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|60 años y más|Femenino|R']
                    },
                    ['MORTALIDAD']:{pivot:1,
                        columns:[15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53],
                        valuesColumns:['REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES| Menor de 6 meses||Masculino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES| Menor de 6 meses||Femenino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|- 6 meses a menor de 1 año||Masculino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|- 6 meses a menor de 1 año||Femenino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|1 - 4 años||Masculino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|1 - 4 años||Femenino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|5 - 9 años||Masculino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|5 - 9 años||Femenino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|10 - 14 años||Masculino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|10 - 14 años||Femenino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|15 - 19 años||Masculino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|15 - 19 años||Femenino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|20 - 39 años||Masculino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|20 - 39 años||Femenino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|40 - 49 años||Masculino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|40 - 49 años||Femenino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|50 - 59 años||Masculino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|50 - 59 años||Femenino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|60 años y más||Masculino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|60 años y más||Femenino']
                    },
                    ['CLASIFICACIÓN']:{alias:'CLASIFICACIÓN PESO - TALLA', 
                        pivot:1,
                        columns:[15,17,19,21,23,25,27,30],
                        valuesColumns:['PESO PARA LA TALLA (P/T)| Menor de 1 año||Masculino', 'PESO PARA LA TALLA (P/T)| Menor de 1 año||Femenino', 'PESO PARA LA TALLA (P/T)|1 a menor de 2 años||Masculino', 'PESO PARA LA TALLA (P/T)|1 a menor de 2 años||Femenino', 'PESO PARA LA TALLA (P/T)|2 a menor de 5 años||Masculino', 'PESO PARA LA TALLA (P/T)|2 a menor de 5 años||Femenino', 'IMC|Embarazada||< 20 años', 'IMC|Embarazada||20 años y +']
                    },
                    //segunda columnas
                    ['TALLA PARA LA EDAD (T/E)']:{alias:'CLASIFICACIÓN TALLA - EDAD',
                        pivot:33,
                        columns:[43,45,47,49,51,53],
                        valuesColumns:['TALLA PARA LA EDAD (T/E)| Menor de 1 año||Masculino', 'TALLA PARA LA EDAD (T/E)| Menor de 1 año||Femenino', 'TALLA PARA LA EDAD (T/E)|1 a menor de 2 años||Masculino', 'TALLA PARA LA EDAD (T/E)|1 a menor de 2 años||Femenino', 'TALLA PARA LA EDAD (T/E)|2 a menor de 5 años||Masculino', 'TALLA PARA LA EDAD (T/E)|2 a menor de 5 años||Femenino']
                    },
                    ['VIGILANCIA AL DESARROLLO INFANTIL TEMPRANO']:{alias:'CLASIFICACIÓN DESARROLLO INFANTIL',
                        pivot:33,
                        columns:[43,45,47,49,51,53],
                        valuesColumns:['VIGILANCIA AL DESARROLLO INFANTIL TEMPRANO| Menor de 1 año||Masculino', 'VIGILANCIA AL DESARROLLO INFANTIL TEMPRANO| Menor de 1 año||Femenino', 'VIGILANCIA AL DESARROLLO INFANTIL TEMPRANO|1 a menor de 2 años||Masculino', 'VIGILANCIA AL DESARROLLO INFANTIL TEMPRANO|1 a menor de 2 años||Femenino', 'VIGILANCIA AL DESARROLLO INFANTIL TEMPRANO|2 a menor de 5 años||Masculino', 'VIGILANCIA AL DESARROLLO INFANTIL TEMPRANO|2 a menor de 5 años||Femenino']
                    }


                },
                exeptionColumns: undefined
                
            }
        }

    },
    /*snis_303:{
        alias:'tmp_snis302b',
        attributes:[["gestion||'-'||mes", 'periodo'], ['count(*)', 'registros']],        
        file: [[[1,1],['frm','NOTIFICACIÓN MENSUAL  PARA LA VIGILANCIA EPIDEMIOLOGICA  (ENFERMEDADES NO TRANSMISIBLES Y FACTORES DE RIESGO)']], [[6,7], 'departamento'], [[], 'ente_gestor'], [[8,8], 'establecimiento'], [[8,44], 'gestion'], [[8,33],'mes'], [[6,18], 'red'], [[6,30], 'municipio'],[[6,43], 'sub_sector']],
        table: ['departamento', 'ente_gestor', 'establecimiento', 'gestion', 'mes', 'formulario', 'grupo','gvariable' ,"variable", 'subvariable', 'valor'],        
        validate: [1,1,1,2,2,1,1,0,0,2],
        forFilter:  null,//[ array de campos fecha a validar],        
        update:[],
        key:['departamento', 'ente_gestor', 'establecimiento', 'gestion', 'mes', 'formulario', 'grupo',"COALESCE(gvariable,'-1')" ,"COALESCE(variable,'-1')","COALESCE(lugar_atencion,'-1')" ,"COALESCE(subvariable, '-1')"],
        keyAux:['departamento', 'ente_gestor', 'establecimiento', 'gestion', 'mes', 'formulario', 'grupo', 'gvariable','variable','lugar_atencion' ,'subvariable', 'valor'],
        //gender: ['nombre', 'genero','f_genero']
        filterByFunc:{
            alias:'parserSnis30311' ,
            params: {                
                sections: ['FACTORES DE RIESGO', 'ENFERMEDADES', 'ENFERMEDADES ONCOLOGICAS', 'ENFERMEDAD Y ESTADIO RENAL',
                    'TRANSTORNOS MENTALES', 'TRANSTORNOS NEUROLOGICOS', 'MORTALIDAD','CLASIFICACIÓN'
                ],               
                sectionsCol2:['TALLA PARA LA EDAD (T/E)', 'VIGILANCIA AL DESARROLLO INFANTIL TEMPRANO'],
                
                dataNoProcess: ['Continua de pag N°1  Anticoncepción,Prevención de cáncer….','M','F'],
                sectionsColumns:{
                    ['FACTORES DE RIESGO']:{pivot:1,
                                columns:[15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53],
                                valuesColumns: ['REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES| Menor de 6 meses||Masculino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES| Menor de 6 meses||Femenino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|- 6 meses a menor de 1 año||Masculino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|- 6 meses a menor de 1 año||Femenino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|1 - 4  años||Masculino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|1 - 4  años||Femenino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|5 - 9  años||Masculino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|5 - 9  años||Femenino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|10 - 14 años||Masculino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|10 - 14 años||Femenino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|15 - 19 años||Masculino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|15 - 19 años||Femenino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|20 - 39 años||Masculino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|20 - 39 años||Femenino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|40 - 49 años||Masculino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|40 - 49 años||Femenino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|50 - 59 años||Masculino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|50 - 59 años||Femenino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|60 años y más||Masculino', 'REGISTRO DE FACTORES DE RIESGO DE ENFERMEDADES NO TRANSMISIBLES|60 años y más||Femenino']
                            },
                    ['ENFERMEDADES']:{pivot:1,
                        columns:[15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54],
                        valuesColumns:['REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Masculino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Masculino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Femenino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Femenino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Masculino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Masculino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Femenino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Femenino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|1 - 4 años|Masculino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|1 - 4 años|Masculino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|1 - 4 años|Femenino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|1 - 4 años|Femenino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|5 - 9 años|Masculino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|5 - 9 años|Masculino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|5 - 9 años|Femenino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|5 - 9 años|Femenino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|10 - 14 años|Masculino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|10 - 14 años|Masculino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|10 - 14 años|Femenino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|10 - 14 años|Femenino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|15 - 19 años|Masculino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|15 - 19 años|Masculino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|15 - 19 años|Femenino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|15 - 19 años|Femenino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|20 - 39 años|Masculino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|20 - 39 años|Masculino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|20 - 39 años|Femenino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|20 - 39 años|Femenino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|40 - 49 años|Masculino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|40 - 49 años|Masculino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|40 - 49 años|Femenino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|40 - 49 años|Femenino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|50 - 59 años|Masculino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|50 - 59 años|Masculino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|50 - 59 años|Femenino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|50 - 59 años|Femenino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|60 años y más|Masculino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|60 años y más|Masculino|R', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|60 años y más|Femenino|N', 'REGISTRO DE ENFERMEDADES NO TRANSMISIBLES DE NOTIFICACIÓN MENSUAL|60 años y más|Femenino|R']
                    },
                    ['ENFERMEDADES ONCOLOGICAS']:{pivot:1,
                        columns:[15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54],
                        valuesColumns:['REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Masculino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Masculino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Femenino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Femenino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Masculino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Masculino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Femenino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Femenino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|1 - 4 años|Masculino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|1 - 4 años|Masculino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|1 - 4 años|Femenino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|1 - 4 años|Femenino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|5 - 9 años|Masculino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|5 - 9 años|Masculino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|5 - 9 años|Femenino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|5 - 9 años|Femenino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|10 - 14 años|Masculino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|10 - 14 años|Masculino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|10 - 14 años|Femenino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|10 - 14 años|Femenino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|15 - 19 años|Masculino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|15 - 19 años|Masculino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|15 - 19 años|Femenino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|15 - 19 años|Femenino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|20 - 39 años|Masculino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|20 - 39 años|Masculino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|20 - 39 años|Femenino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|20 - 39 años|Femenino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|40 - 49 años|Masculino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|40 - 49 años|Masculino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|40 - 49 años|Femenino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|40 - 49 años|Femenino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|50 - 59 años|Masculino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|50 - 59 años|Masculino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|50 - 59 años|Femenino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|50 - 59 años|Femenino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|60 años y más|Masculino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|60 años y más|Masculino|R', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|60 años y más|Femenino|N', 'REGISTRO DE ENFERMEDADES ONCOLOGICAS DE NOTIFICACIÓN MENSUAL|60 años y más|Femenino|R']
                    },
                    ['ENFERMEDAD Y ESTADIO RENAL']:{pivot:1,
                        columns:[15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54],
                        valuesColumns:['REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Masculino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Masculino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Femenino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Femenino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Masculino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Masculino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Femenino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Femenino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|1 - 4 años|Masculino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|1 - 4 años|Masculino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|1 - 4 años|Femenino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|1 - 4 años|Femenino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|5 - 9 años|Masculino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|5 - 9 años|Masculino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|5 - 9 años|Femenino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|5 - 9 años|Femenino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|10 - 14 años|Masculino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|10 - 14 años|Masculino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|10 - 14 años|Femenino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|10 - 14 años|Femenino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|15 - 19 años|Masculino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|15 - 19 años|Masculino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|15 - 19 años|Femenino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|15 - 19 años|Femenino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|20 - 39 años|Masculino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|20 - 39 años|Masculino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|20 - 39 años|Femenino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|20 - 39 años|Femenino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|40 - 49 años|Masculino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|40 - 49 años|Masculino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|40 - 49 años|Femenino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|40 - 49 años|Femenino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|50 - 59 años|Masculino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|50 - 59 años|Masculino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|50 - 59 años|Femenino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|50 - 59 años|Femenino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|60 años y más|Masculino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|60 años y más|Masculino|R', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|60 años y más|Femenino|N', 'REGISTRO DE ENFERMEDADES RENALES DE NOTIFICACIÓN MENSUAL|60 años y más|Femenino|R']
                    },
                    ['TRANSTORNOS MENTALES']:{pivot:1,
                        columns:[15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54],
                        valuesColumns:['REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Masculino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Masculino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Femenino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Femenino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Masculino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Masculino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Femenino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Femenino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|1 - 4 años|Masculino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|1 - 4 años|Masculino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|1 - 4 años|Femenino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|1 - 4 años|Femenino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|5 - 9 años|Masculino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|5 - 9 años|Masculino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|5 - 9 años|Femenino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|5 - 9 años|Femenino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|10 - 14 años|Masculino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|10 - 14 años|Masculino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|10 - 14 años|Femenino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|10 - 14 años|Femenino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|15 - 19 años|Masculino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|15 - 19 años|Masculino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|15 - 19 años|Femenino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|15 - 19 años|Femenino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|20 - 39 años|Masculino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|20 - 39 años|Masculino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|20 - 39 años|Femenino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|20 - 39 años|Femenino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|40 - 49 años|Masculino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|40 - 49 años|Masculino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|40 - 49 años|Femenino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|40 - 49 años|Femenino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|50 - 59 años|Masculino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|50 - 59 años|Masculino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|50 - 59 años|Femenino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|50 - 59 años|Femenino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|60 años y más|Masculino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|60 años y más|Masculino|R', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|60 años y más|Femenino|N', 'REGISTRO DE ENFERMEDADES y TRASTORNOS DE SALUD MENTAL DE NOTIFICACIÓN MENSUAL|60 años y más|Femenino|R']
                    },
                    ['TRANSTORNOS NEUROLOGICOS']:{pivot:1,
                        columns:[15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54],
                        valuesColumns:['REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Masculino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Masculino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Femenino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL| Menor de 6 meses|Femenino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Masculino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Masculino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Femenino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|- 6 meses a menor de 1 año|Femenino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|1 - 4 años|Masculino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|1 - 4 años|Masculino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|1 - 4 años|Femenino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|1 - 4 años|Femenino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|5 - 9 años|Masculino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|5 - 9 años|Masculino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|5 - 9 años|Femenino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|5 - 9 años|Femenino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|10 - 14 años|Masculino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|10 - 14 años|Masculino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|10 - 14 años|Femenino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|10 - 14 años|Femenino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|15 - 19 años|Masculino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|15 - 19 años|Masculino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|15 - 19 años|Femenino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|15 - 19 años|Femenino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|20 - 39 años|Masculino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|20 - 39 años|Masculino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|20 - 39 años|Femenino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|20 - 39 años|Femenino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|40 - 49 años|Masculino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|40 - 49 años|Masculino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|40 - 49 años|Femenino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|40 - 49 años|Femenino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|50 - 59 años|Masculino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|50 - 59 años|Masculino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|50 - 59 años|Femenino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|50 - 59 años|Femenino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|60 años y más|Masculino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|60 años y más|Masculino|R', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|60 años y más|Femenino|N', 'REGISTRO DE TRANSTORNOS NEUROLÓGICOS DE NOTIFICACIÓN MENSUAL|60 años y más|Femenino|R']
                    },
                    ['MORTALIDAD']:{pivot:1,
                        columns:[15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53],
                        valuesColumns:['REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES| Menor de 6 meses||Masculino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES| Menor de 6 meses||Femenino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|- 6 meses a menor de 1 año||Masculino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|- 6 meses a menor de 1 año||Femenino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|1 - 4 años||Masculino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|1 - 4 años||Femenino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|5 - 9 años||Masculino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|5 - 9 años||Femenino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|10 - 14 años||Masculino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|10 - 14 años||Femenino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|15 - 19 años||Masculino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|15 - 19 años||Femenino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|20 - 39 años||Masculino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|20 - 39 años||Femenino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|40 - 49 años||Masculino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|40 - 49 años||Femenino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|50 - 59 años||Masculino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|50 - 59 años||Femenino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|60 años y más||Masculino', 'REGISTRO DE MORTALIDAD DE ENFERMEDADES NO TRANSMISIBLES|60 años y más||Femenino']
                    },
                    ['CLASIFICACIÓN']:{alias:'CLASIFICACIÓN PESO - TALLA', 
                        pivot:1,
                        columns:[15,17,19,21,23,25,27,30],
                        valuesColumns:['PESO PARA LA TALLA (P/T)| Menor de 1 año||Masculino', 'PESO PARA LA TALLA (P/T)| Menor de 1 año||Femenino', 'PESO PARA LA TALLA (P/T)|1 a menor de 2 años||Masculino', 'PESO PARA LA TALLA (P/T)|1 a menor de 2 años||Femenino', 'PESO PARA LA TALLA (P/T)|2 a menor de 5 años||Masculino', 'PESO PARA LA TALLA (P/T)|2 a menor de 5 años||Femenino', 'IMC|Embarazada||< 20 años', 'IMC|Embarazada||20 años y +']
                    },
                    //segunda columnas
                    ['TALLA PARA LA EDAD (T/E)']:{alias:'CLASIFICACIÓN TALLA - EDAD',
                        pivot:33,
                        columns:[43,45,47,49,51,53],
                        valuesColumns:['TALLA PARA LA EDAD (T/E)| Menor de 1 año||Masculino', 'TALLA PARA LA EDAD (T/E)| Menor de 1 año||Femenino', 'TALLA PARA LA EDAD (T/E)|1 a menor de 2 años||Masculino', 'TALLA PARA LA EDAD (T/E)|1 a menor de 2 años||Femenino', 'TALLA PARA LA EDAD (T/E)|2 a menor de 5 años||Masculino', 'TALLA PARA LA EDAD (T/E)|2 a menor de 5 años||Femenino']
                    },
                    ['VIGILANCIA AL DESARROLLO INFANTIL TEMPRANO']:{alias:'CLASIFICACIÓN DESARROLLO INFANTIL',
                        pivot:33,
                        columns:[43,45,47,49,51,53],
                        valuesColumns:['VIGILANCIA AL DESARROLLO INFANTIL TEMPRANO| Menor de 1 año||Masculino', 'VIGILANCIA AL DESARROLLO INFANTIL TEMPRANO| Menor de 1 año||Femenino', 'VIGILANCIA AL DESARROLLO INFANTIL TEMPRANO|1 a menor de 2 años||Masculino', 'VIGILANCIA AL DESARROLLO INFANTIL TEMPRANO|1 a menor de 2 años||Femenino', 'VIGILANCIA AL DESARROLLO INFANTIL TEMPRANO|2 a menor de 5 años||Masculino', 'VIGILANCIA AL DESARROLLO INFANTIL TEMPRANO|2 a menor de 5 años||Femenino']
                    }


                },
                exeptionColumns: undefined
                
            }
        }

    }*/
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