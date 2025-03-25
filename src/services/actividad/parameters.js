//[label, editable, requerido, <T?:texto, C:combo, R:Radio, H:checkBox, F: fecha>, tamanio]
/**
 * objeto de configuracion para diversas pantallas
 * campos:[label, editable, requerido, <T?:texto, C:combo, R:Radio, H:checkBox, F: fecha>, tamanio, Reservado]
 * T?->TT: texto, TN: texto numero entero, TM: TextMail, TD: Texto decimal, TA: Text Area
 * use-se la opcion dual cuando la interaccion y la insercion es con tablas de bd
 * referer.condicional:['aplicacion_id,$app'] 
 * '$app', '$inst', '$dni', '$usr'
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
   
    actividad_active:{
        //'$app', '$inst', '$dni', '$usr'
        table: 'cr_actividad',
        alias: 'actividad',
        cardinalidad: "1",
        noKeyAutomatic: true,
        included: null, //para el caso de una asociacion con table
        campos: {                   
            actividad_id: ['Actividad', true, true, 'C']
        },        
        key: ['actividad_id'],        
        ilogic:null,//{},
        //keyRoot: 'enunciado_root',
        moreData:[],
        update: [],
        referer: [
            { ref: 'cr_actividad', apropiacion: 'actividad_id', campos: ['actividad_id', 'nombre_actividad'], condicion: {activo:'Y', actividad_root:null}, condicional: ['institucion_id,$inst'] },
        ],
    },
    actividad_personan: {
        //'$app', '$inst', '$dni', '$usr'
        table: 'cr_actividad a , cr_actividad_personas ap, au_persona p',
        alias: 'actividad_personan',
        cardinalidad: "n",
        linked: "actividad_active",
        campos: `p.primer_apellido, p.segundo_apellido, p.nombres, ap.mail_registro `,

        camposView: [{ value: "primer_apellido", text: "Primer Apellido" }, { value: "segundo_apellido", text: "Segundo Apellido" }, { value: "nombres", text: "Nombres" },
             { value: "mail_registro", text: "email" },
        ],
        key: ['actividad_id'],
        precondicion: ['a.actividad_id = ap.actividad_id', 'ap.dni_persona=p.dni_persona', "a.activo='Y'", "a.institucion_id='$inst'", "actividad_id=$actividad_id"],
        groupOrder: ` ORDER BY 1  `,//null string    
        update: [],
        referer: [ ],
    },
    actividad_persona:{
        table: 'au_persona',
        alias: 'ausr',
        cardinalidad: "1",
        noKeyAutomatic: true,
        included: null, //para el caso de una asociacion con table
        campos: {                   
            //tipo_dni:['Tipo Identificacion', true, true, 'C'],  
            //dni_persona: ['DNI', true, true, 'TN',50],   
            //dni_complemento: ['Complemento', true, true, 'TT',2],            
            
            primer_apellido: ['Primer Apellido', true, true, 'TT',24],
            segundo_apellido: ['Segundo Apellido', true, false, 'TT',24],
            nombres: ['Nombres', true, true, 'TT',128],
            
            mail: ['Correo Electronico', true, true, 'TM',64],
            
        },        
        key: ['dni_persona'],        
        ilogic:null,
        //keyRoot: 'enunciado_root',
        moreData:[],
        update: [],
        referer: [            
            //{ ref: 'r_is_atributo', apropiacion: 'tipo_dni', campos: ['atributo_id', 'atributo'], condicion: {grupo_atributo:'PERDNITIPO'}, condicional:null, multiple:false }
        ],
    } 
}

//const immutableObject = (obj) =>
//  typeof obj === 'object' ?  Object.values (obj).forEach (immutableObject) || Object.freeze (obj) : obj;

  //immutableObject(PARAMETROS)

module.exports = PARAMETROS
