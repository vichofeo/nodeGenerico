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
    amodulo:{
        table: 'ap_module',
        alias: 'amodulo',
        cardinalidad: "1",
        included: null, //para el caso de una asociacion con table
        campos: {            
            module: ['Codigo Modulo', false, true, 'TT',24],   
            name_module:['Nombre Modulo', true, true, 'TT', 32],
            layout:['Nombre Layout.vue', true, false, 'TT', 24],
            icon:['icono Seleccione un archivo', true, false, 'FA', 50],
            description:['Descripcion Modulo', true, false, 'TA', 300],                     
            orden: ['Orden de Aparicion', true, true, 'TN',2],            
            activo: ['Activo', true, true, 'C', 2],
        },
        key: ['module'],        
        //keyRoot: 'enunciado_root',
        moreData:[],
        update: [],
        referer: [
            { ref: 'r_is_atributo', apropiacion: 'activo', campos: ['atributo_id', 'atributo'], condicion: {grupo_atributo:'ACTIVE'}, condicional:null, multiple:false }
        ],
    },
    amodulon:{
        table: 'ap_module',
        alias: 'Modulos',
        cardinalidad: "n",
        linked:"amodulo",
        campos: `module as idx, 'amodulo' as linked, 
        module, name_module, layout, orden, activo`,

        camposView: [{ value: "module", text: "Cod." }, { value: "name_module", text: "Nombre modulo" }, { value: "layout", text: "plantilla" },        
                    { value: "orden", text: "Orden Aparicion" }, { value: "activo", text: "Activo" }
        ],
        key: [],
        precondicion: [],
        update: [],
        referer: [            
        ],
    },
    acomponente:{
        table: 'ap_component',
        alias: 'acomponente',
        cardinalidad: "1",
        noKeyAutomatic: true,
        included: null, //para el caso de una asociacion con table
        campos: {            
            component: ['Codigo Componente', true, true, 'TT',24],   
            route_access:['Ruta de acceso', true, true, 'TT', 32],
            name_component:['Nombre componente', true, false, 'TT', 50],
            base_folder:['Ruta Folder', true, false, 'TT', 80],
            prop:['Requiere props (solo /:id)', true, false, 'SW', 1],                     
            description: ['Descripcion', true, true, 'TA',250],            
            activo: ['Activo', true, true, 'C', 2],
        },
        key: ['component'],        
        //keyRoot: 'enunciado_root',
        moreData:[],
        update: [],
        referer: [
            { ref: 'r_is_atributo', apropiacion: 'activo', campos: ['atributo_id', 'atributo'], condicion: {grupo_atributo:'ACTIVE'}, condicional:null, multiple:false }
        ],
    },
    acomponenten:{
        table: 'ap_component',
        alias: 'Componentes',
        cardinalidad: "n",
        linked:"acomponente",
        campos: `component as idx, 'acomponente' as linked, 
        route_access, name_component, base_folder,activo`,

        camposView: [{ value: "component", text: "Cod." }, { value: "name_component", text: "Nombre componente" }, { value: "route_access", text: "Ruta" },        
                    { value: "base_folder", text: "Folder" }, { value: "activo", text: "Activo" }
        ],
        key: [],
        precondicion: [],
        update: [],
        referer: [            
        ],
    }   
 
}

//const immutableObject = (obj) =>
//  typeof obj === 'object' ?  Object.values (obj).forEach (immutableObject) || Object.freeze (obj) : obj;

  //immutableObject(PARAMETROS)

module.exports = PARAMETROS
