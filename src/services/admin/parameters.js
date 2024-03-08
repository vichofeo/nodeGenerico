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
        noKeyAutomatic: true,
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
            component: ['Codigo Componente', false, true, 'TT',24],   
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
    },
    arole:{
        table: 'ap_aplicacion_role',
        alias: 'arole',
        cardinalidad: "1",
        noKeyAutomatic: true,
        included: null, //para el caso de una asociacion con table
        campos: {       
            aplicacion_id: ['Elija la Aplicacion', false, true, 'C'],   
            role: ['Rol cod.', false, true, 'TT',24],   
            name_role: ['Nombre del rol', true, true, 'TT',50],   
            description: ['Descripcion', true, true, 'TA',250],            
            activo: ['Activo', true, true, 'C', 2],            
            end_date : ['Fecha Finalizacion', true, true, 'F',10],                
            
        },
        key: ['role'],        
        //keyRoot: 'enunciado_root',
        moreData:[],
        update: [],
        referer: [
            { ref: 'r_is_atributo', apropiacion: 'activo', campos: ['atributo_id', 'atributo'], condicion: {grupo_atributo:'ACTIVE'}, condicional:null, multiple:false },
            { ref: 'ap_aplicacion', apropiacion: 'aplicacion_id', campos: ['aplicacion_id', 'nombre_aplicacion'], condicion: null, condicional:null, multiple:false }
        ],
    },
    arolen:{
        table: 'ap_aplicacion_role r, ap_aplicacion a',
        alias: 'Roles',
        cardinalidad: "n",
        linked:"arole",
        campos: `role as idx, 'arole' as linked, 
        a.nombre_aplicacion, r.role, r.name_role, r.end_date, r.activo`,

        camposView: [{ value: "nombre_aplicacion", text: "Aplicacion" }, { value: "role", text: "Rol" }, { value: "name_role", text: "Nombre Rol" },        
                    { value: "end_date", text: "Validez" }, { value: "activo", text: "Activo" }
        ],
        key: [],
        precondicion: ['r.aplicacion_id=a.aplicacion_id'],
        update: [],
        referer: [            
        ],
    }, 
    acnf_role:{
        table: 'ap_routes_cnf',
        alias: 'acnf_role',
        cardinalidad: "1",
        noKeyAutomatic: true,
        included: null, //para el caso de una asociacion con table
        campos: {       
            //aplicacion_id: ['Elija la Aplicacion', false, true, 'C'],   
            //role: ['Rol cod.', false, true, 'C',24],   
            module: ['Modulo', true, true, 'C',50],   
            component: ['Componente', true, true, 'C',250],            
            activo: ['Activo', true, true, 'C', 2],            
        },
        key: ['idx'],        
        //keyRoot: 'enunciado_root',
        moreData:[],
        update: [],
        referer: [
            { ref: 'r_is_atributo', apropiacion: 'activo', campos: ['atributo_id', 'atributo'], condicion: {grupo_atributo:'ACTIVE'}, condicional:null, multiple:false },
            { ref: 'ap_module', apropiacion: 'module', campos: ['module', 'name_module'], condicion: {activo:'Y'}, condicional:null, multiple:false },
            { ref: 'ap_component', apropiacion: 'component', campos: ['component', 'name_component'], condicion: {activo:'Y'}, condicional:null, multiple:false },
            
        ],
    },
    acnf_rolen:{
        table: 'ap_routes_cnf rc, ap_aplicacion a, ap_aplicacion_role ar, ap_module m, ap_component c',
        alias: 'cnf_rol',
        cardinalidad: "n",
        linked:"acnf_role",
        campos: `idx, 'acnf_role' as linked, 
        a.nombre_aplicacion, ar.name_role, m.name_module, c.name_component, rc.activo, ar.aplicacion_id, ar.role`,

        camposView: [{ value: "nombre_aplicacion", text: "Aplicacion" }, { value: "name_role", text: "Rol" }, { value: "name_module", text: "Modulo" },        
                    { value: "name_component", text: "Componente" }, { value: "activo", text: "Activo" }
        ],
        key: [],
        precondicion: ['rc.aplicacion_id=ar.aplicacion_id','rc.role=ar.role', 'rc.module=m.module' , 'rc.component=c.component', 'ar.aplicacion_id=a.aplicacion_id'],
        update: [],
        referer: [            
        ],
    }  
 
}

//const immutableObject = (obj) =>
//  typeof obj === 'object' ?  Object.values (obj).forEach (immutableObject) || Object.freeze (obj) : obj;

  //immutableObject(PARAMETROS)

module.exports = PARAMETROS
