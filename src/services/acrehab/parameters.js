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
    evaluacion:{
        table: 'evaluacion',
        alias: 'actividad',
        cardinalidad: "1",
        noKeyAutomatic: true,
        included: null, //para el caso de una asociacion con table
        campos: {                   
            frm_id: ['Formulario', true, false, 'TP', 1],
            tipo_acrehab:['Tipo', true, true, 'TP', 80],  
            
            institucion_id: ['Establecimiento Salud', true, true, 'TP',1024],   
            dni_evaluador: ['Evaluador', true, true, 'TP',1024], 
            
            concluido: ['Concluido', true, true, 'TP'], 
            
            
        },        
        key: ['evaluacion_id'],        
        ilogic:null,//{},
        //keyRoot: 'enunciado_root',
        moreData:[],
        update: [],
        referer: [],
    },
    
    evaluacionn:{
        table: 'u_frm_evaluacion e, u_frm f , r_is_atributo t, au_persona p, ae_institucion i, al_departamento d, ae_institucion eg',
        alias: 'evaluacionn',
        cardinalidad: "n",
        linked:"evaluacion",
        campos: `e.evaluacion_id as idx, 'evaluacion' as linked, 
        d.nombre_dpto, eg.nombre_corto, i.nombre_institucion,
        p.primer_apellido ||' '|| p.segundo_apellido ||' '|| p.nombres AS evaluador,
        e.concluido, e.activo,
        CASE WHEN '1'=e.dni_evaluador THEN true ELSE false  END AS ver`,

        camposView: [{ value: "nombre_dpto", text: "Dpto" }, { value: "nombre_corto", text: "E.G." }, { value: "nombre_institucion", text: "Establecimiento" },        
                    { value: "evaluador", text: "Evaluador" }, { value: "concluido", text: "Concluido" },                     
                    { value: "concluido", text: "Estado" }, { value: "activo", text: "Activo" },
                    { value: "ver", text: "Accion" }                    
        ],
        key: [],
        precondicion: ['e.frm_id =  f.frm_id', 'e.tipo_acrehab =  t.atributo_id', 'e.institucion_id =  i.institucion_id', 'e.dni_evaluador =  p.dni_persona',
            'i.cod_pais =  d.cod_pais', 'i.cod_dpto =  d.cod_dpto', 'i.institucion_root =  eg.institucion_id'],
        update: [],
        referer: [            
        ],
    },
   
 
}

//const immutableObject = (obj) =>
//  typeof obj === 'object' ?  Object.values (obj).forEach (immutableObject) || Object.freeze (obj) : obj;

  //immutableObject(PARAMETROS)

module.exports = PARAMETROS
