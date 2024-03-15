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
    actividad:{
        table: 'cr_actividad',
        alias: 'actividad',
        cardinalidad: "1",
        noKeyAutomatic: true,
        included: null, //para el caso de una asociacion con table
        campos: {                   
            virtual: ['Es Virtual', true, false, 'SW', 1],
            nombre_actividad:['Nombre Actividad', true, true, 'TT', 80],  
            
            objetivo: ['Objetivo de la Actividad', true, true, 'TA',1024],   
            narrativa: ['Observaciones', true, true, 'TA',1024], 
            
            inicio_proyecto: ['Fecha Inicio', true, true, 'FT'], 
            finalizacion: ['Fecha Finalizacion', true, true, 'FT', 2],  
            
        },        
        key: ['dni_persona'],        
        ilogic:null,//{},
        //keyRoot: 'enunciado_root',
        moreData:[],
        update: [],
        referer: [],
    },
    
   
 
}

//const immutableObject = (obj) =>
//  typeof obj === 'object' ?  Object.values (obj).forEach (immutableObject) || Object.freeze (obj) : obj;

  //immutableObject(PARAMETROS)

module.exports = PARAMETROS
