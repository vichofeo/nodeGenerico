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
        },
        key: ['grupo_formulario_id'],
        update: [],
        referer: [{ ref: 'f_formulario_clase', apropiacion: 'cod_clase', campos: ['cod_clase', 'nombre_clase'], condicion: null, condicional:null },],
    },
}

const immutableObject = (obj) =>
  typeof obj === 'object' ?  Object.values (obj).forEach (immutableObject) || Object.freeze (obj) : obj;

  //immutableObject(PARAMETROS)

module.exports = PARAMETROS
