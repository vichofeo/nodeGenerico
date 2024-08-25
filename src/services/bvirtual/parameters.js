//[label, editable, requerido, <T?:texto, C:combo, R:Radio, H:checkBox, F: fecha>, tamanio]
/**
 * objeto de configuracion para diversas pantallas
 * campos:[label, editable, requerido, <T?:texto, C:combo, R:Radio, H:checkBox, F: fecha>, tamanio, Reservado, FilasTamTextAreaVmultiple]
 * T?->TT: texto, TN: texto numero entero, TM: TextMail, TD: Texto decimal, TA: Text Area
 * use-se la opcion dual cuando la interaccion y la insercion es con tablas de bd
 * referer.condicional:['aplicacion_id,$app'] 
 * referer.condicion: {a:1,b:5}
 */
"use strict"
const PARAMETROS = {
    bvirtual: {
        table: 'bv_files',
        alias: 'bvirtual',
        cardinalidad: "1",
        noKeyAutomatic: true,
        included: null, //para el caso de una asociacion con table
        campos: {
            //tipo_documento: ['Tipos de Documentos', true, true, 'C', 50],
            //tipo_componente: ['Tipo de componente', true, true, 'C', 50],
            //area_tematica: ['Áreas Temáticas', true, true, 'C', 50],            
            //codigo: ['Codigo', false, true, 'TT', 24],
            titulo: ['Nombre oficial completo de la norma', true, true, 'TA', 2048,,2],
            anio_publicacion: ['Fecha de Publicación', true, true, 'TN', 10],
            anios_actualizacion: ['Fecha de Actualización', true, false, 'TT', 10],
            autores: ['Autor/es', true, true, 'TA', 2048,,2],
            organismo_emisor:['Entidad o institución responsable de la emisión de la norma', true, true, 'MS', 1024],
            resumen: ['Breve descripción del contenido y alcance de la norma', true, true, 'TA',,,7],
            palabras_clave: ['Términos clave que describen el contenido y facilitan la búsqueda. Separado por comas (,)', true, true, 'MH', 2048],
            //ambito_aplicacion: ['Ámbito de aplicación', true, true, 'TT', 64],
            ciudad_publicacion: ['Ciudad de Publicacion', true, false, 'MS', 1024],
            url: ['URL de procedencia (Si Existiese)', true, false, 'TT', 1024],

        },
        key: ['file_id'],
        ilogic: {
            organismo_emisor:`SELECT distinct organismo_emisor  as value, organismo_emisor as text FROM bv_files WHERE organismo_emisor is not null and trim(organismo_emisor)!='' order by 1`,
            ciudad_publicacion:`SELECT distinct ciudad_publicacion  as value, ciudad_publicacion as text FROM bv_files WHERE ciudad_publicacion is not null and trim(ciudad_publicacion)!='' order by 1`
        },//null
        //keyRoot: 'enunciado_root',
        moreData: [],
        update: [],
        referer: [
           // { ref: 'f_is_atributo', apropiacion: 'tipo_documento', campos: ['atributo_id', 'atributo'], condicion: {grupo_atributo:'BV_TIPO_DOCUMENTO'}, condicional:null, multiple:false },
            //{ ref: 'f_is_atributo', apropiacion: 'area_tematica', campos: ['atributo_id', 'atributo'], condicion: {grupo_atributo:'BV_AREA_TEMATICA'}, condicional:null, multiple:false },
            //{ ref: 'f_is_atributo', apropiacion: 'tipo_componente', campos: ['atributo_id', 'atributo'], condicion: {grupo_atributo:'BV_TIPO_COMPONENTE'}, condicional:null, multiple:false }
        ],
    },

    opsBvirtual: {
        table: 'bv_files',
        alias: 'opsBvirtual',
        cardinalidad: "1",
        noKeyAutomatic: true,
        included: null, //para el caso de una asociacion con table
        campos: {
            
            anio_publicacion: ['Por Año de Publicacion', true, false, 'HV', 2048,,'M'],
            tipo_documento: ['Por Tipo Documento', true, false, 'HV', 10,,'M'],
            tipo_componente: ['Por su Aplicacion', true, false, 'HV', 10,,'M'],
            ambito_aplicacion: ['Por Ambito Aplicacion', true, false, 'HV', 2048,,'M'],
            organismo_emisor: ['Por Entidad Responsable', true, false, 'HV', 2048,,'M'],
            

        },
        key: ['file_id'],
        ilogic: {
            anio_publicacion: `SELECT distinct anio_publicacion  as value, anio_publicacion||' ('||count(*)||')' as text FROM bv_files WHERE anio_publicacion is not null group by 1 order by 1 desc`,
            tipo_documento:`SELECT distinct tipo_documento  as value, tipo_documento||' ('||count(*)||')' as text FROM bv_files WHERE tipo_documento is not null group by 1 order by 1`,
            tipo_componente:`SELECT distinct tipo_componente  as value, tipo_componente||' ('||count(*)||')' as text FROM bv_files WHERE tipo_componente is not null group by 1 order by 1`,
            ambito_aplicacion: `SELECT DISTINCT f.ambito_aplicacion  as VALUE, a.atributo ||' ('||count(f.*)||')' as text FROM bv_files f, f_is_atributo a WHERE f.ambito_aplicacion is not NULL 
                                AND f.ambito_aplicacion =  a.atributo_id group by f.ambito_aplicacion,a.atributo order BY 2`,
            organismo_emisor: `SELECT 'asuss' AS VALUE, 'ASUSS ('||(SELECT COUNT(*) FROM bv_files WHERE organismo_emisor ILIKE '%asuss%')||')' AS TEXT
                                UNION
                                SELECT 'ministerio' AS VALUE, 'MSyD ('||(SELECT COUNT(*) FROM bv_files WHERE organismo_emisor ILIKE '%ministerio%')||')' AS TEXT
                                UNION 
                                SELECT 'otros_b' AS VALUE, 'OTROS ('||(SELECT COUNT(*) FROM bv_files WHERE organismo_emisor not ILIKE '%asuss%' and organismo_emisor not ILIKE '%ministerio%')||')' AS TEXT
                                ORDER BY 1`                    
        },//null
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
