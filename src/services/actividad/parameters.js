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
            
            sede: ['Lugar', true, true, 'TA',1024],   
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
    
    actividadn:{
        table: 'cr_actividad a, r_is_atributo a1, r_is_atributo a2',
        alias: 'actividadn',
        cardinalidad: "n",
        linked:"actividad",
        campos: `a.actividad_id as idx, 'actividad' as linked, 
        a1.atributo as clase, a2.atributo as tipo,a.virtual,  a.nombre_actividad, a.inicio_proyecto,  a.finalizacion, a.concluido,  a.activo  `,

        camposView: [{ value: "clase", text: "Clase" }, { value: "tipo", text: "Tipo" }, { value: "nombre_actividad", text: "Actividad" },        
                    { value: "inicio_proyecto", text: "Inicio" }, { value: "finalizacion", text: "Finalizacion" }, 
                    { value: "concluido", text: "Estado" },
                    { value: "activo", text: "Activo" }
        ],
        key: [],
        precondicion: ["a.institucion_id='$inst'", 'a.clase_actividad=a1.atributo_id' , 'a.tipo_actividad=a2.atributo_id', 'a.actividad_root IS not null'],
        update: [],
        referer: [            
        ],
    },
   
 
}

//const immutableObject = (obj) =>
//  typeof obj === 'object' ?  Object.values (obj).forEach (immutableObject) || Object.freeze (obj) : obj;

  //immutableObject(PARAMETROS)

module.exports = PARAMETROS
