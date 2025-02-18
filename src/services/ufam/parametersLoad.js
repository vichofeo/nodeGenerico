'use strict'
const PARAMETERS = {
    
    lames: {
        alias:'tmp_ames',
        attributes:[["to_char(fecha_nacimiento, 'YYYY-MM')", 'periodo'], ['count(*)', 'registros']],
        file: ['Gestion', 'Codigo Unico Identificacion', 'Modalidad', 'Cod. departamento', 'Departamento', 'Cod. red', 'Red', 'Cod. municipio', 'Municipio', 'Cod. establecimiento', 'Establecimiento', 'Nivel', 'Subsector', 'Institucion', 'Ambito', 'Nombres', 'Primer apellido', 'Segundo apellido', 'Nro documento', 'Fecha Nacimiento', 'Departamento nac', 'Provincia nac', 'Municipio nac', 'Localidad nac', 'Producto', 'Lugar fisico', 'Sexo', 'Parto atendido', 'Edad gestacional', 'Peso', 'Talla', 'Apgar al minuto', 'Apgar 5 minutos', 'Malformaciones', 'Nombres madre', 'Segundo apellido madre', 'Tipo documento madre', 'Complemento documento madre', 'Fecha nac madre', 'Expedicion madre', 'Identificacion cultural', 'Departamento residencia', 'Provincia residencia', 'Municipio residencia', 'Localidad residencia', 'Certificador nombre completo', 'Certificador profesion', 'Certificador matricula', 'Fecha emision', 'Fecha registro', 'Estado certificado', 'Nombres usuario', 'Primer apellido usuario', 'Segundo apellido usuario'],
        table: ['gestion','codigo_unico_identificacion','modalidad','cod_dpto','departamento','cod_red','red','cod_municipio','municipio','cod_establecimiento','establecimiento','nivel','subsector','ente_gestor_name','ambito','nombres','primer_apellido','segundo_apellido','nro_documento','f_nacimiento','departamento_nac','provincia_nac','municipio_nac','localidad_nac','producto','lugar_fisico','sexo','parto_atendido','edad_gestacional','peso','talla','apgar_al_minuto','apgar_5_minutos','malformaciones','nombres_madre','segundo_apellido_madre','tipo_documento_madre','complemento_documento_madre','f_nacmadre','expedicion_madre','identificacion_cultural','departamento_residencia','provincia_residencia','municipio_residencia','localidad_residencia','certificador_nombre_completo','certificador_profesion','certificador_matricula','fecha_emision','fecha_registro','estado_certificado','nombres_usuario','primer_apellido_usuario','segundo_apellido_usuario'],        
        validate: [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        forFilter:['Fecha Nacimiento'],        
        update:[['fecha_nacimiento',"TO_DATE(f_nacimiento, 'DD/MM/YYYY')",'Verifique el formato de fecha Nacimiento DD/MM/YYYY'], ['fecha_nac_madre',"TO_DATE(f_nacmadre, 'DD/MM/YYYY')", 'Verifique el formato fecha nacimiento madre DD/MM/YYYY']],
        superUpdate: {referer: 'tmp_equivalencia', update:[['eg','eg','Problemas con Ente gestor.'], ['dpto','dpto', 'Problemas con Dpto'], ['eess','eess']], conditional:[['ente_gestor_name','ente_gestor_name'],['departamento','departamento'],['establecimiento','establecimiento']]},
        //key:['fecha_vacunacion', "COALESCE(ci,'-1')",  'fecha_nacimiento', "COALESCE(nombre,'-1')", "COALESCE(edad, '-1')", 'f_genero', 'vacuna'],
        key:['fecha_nacimiento', "codigo_unico_identificacion"],
        keyAux:['gestion','codigo_unico_identificacion','modalidad','cod_dpto','departamento','cod_red','red','cod_municipio','municipio','cod_establecimiento','establecimiento','nivel','subsector','ente_gestor_name'],
        //gender: ['nombre', 'genero','f_genero']        
    },
   


}

module.exports = PARAMETERS