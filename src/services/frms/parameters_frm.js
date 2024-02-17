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
    fgroup: {
        table: 'f_formulario_grupo',
        alias: 'fgroup',
        cardinalidad: "1",
        campos: {
            nombre_grupo_formulario: ['Defina nombre de grupo de formularios', true, false, 'TT',80],
            descripcion: ['Descripcion del grupo', true, true, 'TA',512],            

        },
        key: ['grupo_formulario_id'],
        moreData:[],
        update: [],
        referer: [],
    },
    ffrm: {
        table: 'f_formulario',
        alias: 'ffrm',
        cardinalidad: "1",
        campos: {
            cod_clase:['CLase de Formulario', true, false, 'C'],
            codigo_formulario: ['Asigne un Codigo al Formulario', true, false, 'TT',25],
            nombre_formulario: ['Nombre del Formulario', true, true, 'TT',80],            
            descripcion:['Descripcion del formulario', true, true, 'TA',512],            
            tipo_opcion_id: ['Incluya formas predetermidad haciendo clic', true, true, 'H']
        },
        key: ['formulario_id'],
        moreData:[{ ref: 'f_frm_opcionales', apropiacion: 'tipo_opcion_id', campos: ['tipo_opcion_id','tipo_opcion_id'],  campoForeign: 'formulario_id',   condicion: {activo:'Y'}, condicional:null },],
        update: [],
        referer: [{ ref: 'f_frm_opcionales_tipo', apropiacion: 'tipo_opcion_id', campos: ['tipo_opcion_id', 'tipo_opcion'], condicion: null, condicional:null, multiple:true },
            { ref: 'f_formulario_clase', apropiacion: 'cod_clase', campos: ['cod_clase', 'nombre_clase'], condicion: null, condicional:null },],
    },
    fsection:{
        table: 'f_frm_subfrm',
        alias: 'fsection',
        cardinalidad: "1",
        campos: {
            nombre_subfrm: ['Nombre de la seccion', true, true, 'TT',80],
            descripcion: ['Descripcion de la seccion', true, false, 'TA',512],            
            orden: ['Orden de Aparicion', true, true, 'TN',2],            

        },
        key: ['subfrm_id'],
        moreData:[],
        update: [],
        referer: [],
    },
    fquestion:{
        table: 'f_frm_enunciado',
        alias: 'fquestion',
        cardinalidad: "1",
        included: {ref:'answers',key:'opcion_id' ,campos:['opcion_id','respuesta', 'orden'], condicion:  null},
        campos: {
            
            enunciado: ['Formule su pregunta', true, true, 'TA',512],            
            orden: ['Orden de Aparicion', true, true, 'TN',2],            
            tipo_enunciado_id: ['Tipo de Respuesta', true, false, 'C',80],

        },
        key: ['enunciado_id'],        
        keyRoot: 'enunciado_root',
        moreData:[],
        update: [],
        referer: [
            { ref: 'f_frm_enun_tipo', apropiacion: 'tipo_enunciado_id', campos: ['tipo_enunciado_id', 'nombre_tipo_pregunta'], condicion: null, condicional:null, multiple:false}
        ],
    },
    fficnf:{
        table: 'f_formulario_institucion_cnf',
        alias: 'fficnf',
        cardinalidad: "1",
        included: null, //{}
        campos: {
            
            formulario_id: ['Formulario', true, true, 'C'],
            institucion_id: ['Establecimiento de salus', true, true, 'C']

        },
        key: ['institucion_id','formulario_id'],        
        keyRoot: null,//'enunciado_root',
        moreData:[],
        update: [],
        referer: [
            { ref: 'f_frm_enun_tipo', apropiacion: 'tipo_enunciado_id', campos: ['tipo_enunciado_id', 'nombre_tipo_pregunta'], condicion: null, condicional:null, multiple:false}
        ],
    }
}

const immutableObject = (obj) =>
  typeof obj === 'object' ?  Object.values (obj).forEach (immutableObject) || Object.freeze (obj) : obj;

  //immutableObject(PARAMETROS)

module.exports = PARAMETROS
