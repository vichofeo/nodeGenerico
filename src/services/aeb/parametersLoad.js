'use strict'
const PARAMETERS = {
    pai_regular: {
        alias:'tmp_pai',
        file: ['No.','Fecha de Vacunación','Estrategia','Carnet de Identidad','Nombre Completo','Celular Paciente','Fecha de Nacimiento','Edad (Años)','Sexo','Nacionalidad','Codigo Departamento','Departamento','Codigo Municipio','Municipio','Codigo Establecimiento','Establecimiento','Subsector','Institucion','Ente Gestor','Empresa','Matricula','Nombre Vacuna','Nro. de Dosis','Proveedor','Lote Vacuna','Usuario','Celular Usuario','Estado Validación','Embarazo','Fecha Registro','Fecha Modificación','Jeringa de Administración','Lote Diluyente','Jeringa de Dilusión'],
        table: ['nro','f_vacunacion','estrategia','ci','nombre','celular','f_nacimiento','f_edad','genero','nacionalidad','cod_dpto','departamento','cod_mun','municipio','cod_rues','establecimiento','subsector','ente_gestor_name','ente_gestor','empresa','matricula','vacuna','nro_dosis','proveedor','lote_vacuna','usuario','cel_usr','validacion','embarazo','fecha_registro','fecha_modificacion','jeringa_administracion','lote_diluyente','jeringa_dilusion'],
        validate: [0,1,0,1,1,0,1,1,1,0,1,1,1,1,0,1,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
        key:['fecha_nacimiento', "COALESCE(ci,'-1')", 'fecha_vacunacion', "COALESCE(nombre,'-1')", "COALESCE(edad, '-1')", 'genero', 'vacuna'],
        keyAux:['fecha_nacimiento', "ci", 'fecha_vacunacion', "nombre", "edad", 'genero', 'vacuna', 'nro_dosis','departamento', 'ente_gestor_name', 'establecimiento'],
        update:[['fecha_nacimiento',"TO_DATE(f_nacimiento, 'DD/MM/YYYY')",'Verifique el formato de fecha Nacimiento DD/MM/YYYY'], ['fecha_vacunacion',"TO_DATE(f_vacunacion, 'DD/MM/YYYY')", 'Verifique el formato fecha vacunacion DD/MM/YYYY'], ['edad', 'CAST(f_edad AS NUMERIC )', 'Verifique campo Edad que sea numerico y que no este vacio']],
    },
  
    /*infraestructuras: {
        file: ['Departamento', 'Red', 'Municipio', 'Código', 'Establecimiento', 'Subsector', 'Institucion ', 'Nivel', 'Clase', 'Servicio', 'Descripcion', 'Cantidad', 'Estado', 'Funcionamiento', 'Observaciones', 'Gestion'],
        table: ['departamento', 'red', 'municipio', 'codigo', 'establecimiento', 'subsector', 'institucion', 'nivel', 'clase', 'servicio', 'descripcion', 'cantidad', 'estado', 'funcionamiento', 'observaciones', 'gestion'],
        editable: [0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        key:['id'],
        update:[['servicio','INITCAP(servicio)'],['estado','UPPER(estado)'], ['descripcion','INITCAP(descripcion)'], ['nivel','INITCAP(nivel)']]
    },*/
    


}

module.exports = PARAMETERS