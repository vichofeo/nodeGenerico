//[label, editable, requerido, <T?:texto, C:combo, R:Radio, H:checkBox, F: fecha>, tamanio]
/**
 * objeto de configuracion para diversas pantallas
 * campos:[label, editable, requerido, <T?:texto, C:combo, R:Radio, H:checkBox, F: fecha>, tamanio, Reservado]
 * T?->TT: texto, TN: texto numero entero, TM: TextMail, TD: Texto decimal, TA: Text Area
 * use-se la opcion dual cuando la interaccion y la insercion es con tablas de bd
 * referer.condicional:['aplicacion_id,$app'] 
 * referer.condicion: {a:1,b:5}
 */
"use strict"
const PARAMETROS = {
    bvirtual: {
        table: 'u_frm_evaluacion',
        alias: 'bvirtual',
        cardinalidad: "1",
        noKeyAutomatic: true,
        included: null, //para el caso de una asociacion con table
        campos: {
            //tipo_documento: ['Tipos de Documentos', true, true, 'C', 50],
            //tipo_componente: ['Tipo de componente', true, true, 'C', 50],
            //area_tematica: ['Áreas Temáticas', true, true, 'C', 50],            
            //codigo: ['Codigo', false, true, 'TT', 24],
            titulo: ['Nombre oficial completo de la norma', true, true, 'TA', 2048],
            fecha_publicacion: ['Fecha de Publicación', true, true, 'F', 10],
            fecha_actualizacion: ['Fecha de Actualización', true, true, 'F', 10],
            autores: ['Autor/es', true, true, 'TA', 2048],
            organismo_emisor:['Entidad o institución responsable de la emisión de la norma', true, true, 'TT', 1024],
            resumen: ['Breve descripción del contenido y alcance de la norma', true, true, 'TA'],
            palabras_clave: ['Términos clave que describen el contenido y facilitan la búsqueda', true, true, 'TT', 2048],
            //ambito_aplicacion: ['Ámbito de aplicación', true, true, 'TT', 64],
            ciudad_publicacion: ['Ciudad de Publicacion', true, true, 'TT', 1024],
            url: ['URL de procedencia (Si Existiese)', true, true, 'TT', 1024],

        },
        key: ['file_id'],
        ilogic: null,//{},
        //keyRoot: 'enunciado_root',
        moreData: [],
        update: [],
        referer: [
           // { ref: 'f_is_atributo', apropiacion: 'tipo_documento', campos: ['atributo_id', 'atributo'], condicion: {grupo_atributo:'BV_TIPO_DOCUMENTO'}, condicional:null, multiple:false },
            //{ ref: 'f_is_atributo', apropiacion: 'area_tematica', campos: ['atributo_id', 'atributo'], condicion: {grupo_atributo:'BV_AREA_TEMATICA'}, condicional:null, multiple:false },
            //{ ref: 'f_is_atributo', apropiacion: 'tipo_componente', campos: ['atributo_id', 'atributo'], condicion: {grupo_atributo:'BV_TIPO_COMPONENTE'}, condicional:null, multiple:false }
        ],
    },





}

//const immutableObject = (obj) =>
//  typeof obj === 'object' ?  Object.values (obj).forEach (immutableObject) || Object.freeze (obj) : obj;

//immutableObject(PARAMETROS)

module.exports = PARAMETROS
