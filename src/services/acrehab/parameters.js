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
    usrs_inst:{
        table: 'u_frm_evaluacion',
        alias: 'usrs_inst',
        cardinalidad: "1",
        noKeyAutomatic: true,
        included: null, //para el caso de una asociacion con table
        campos: {                   
            dni_evaluador:['Evaluador', false, true, 'C'],
        },        
        key: ['evaluacion_id'],        
        ilogic:{dni_evaluador: `SELECT p.dni_persona AS VALUE,   p.primer_apellido || ' ' || p.segundo_apellido ||' '|| p.nombres ||' ('||apu.login||')' AS TEXT
        FROM aep_institucion_personal ip, au_persona p, apu_credencial apu
        WHERE ip.dni_persona = p.dni_persona
        AND  ip.institucion_id =  apu.institucion_id AND ip.dni_persona=apu.dni_persona
        AND ip.institucion_id = '$inst'
        ORDER BY 2`},
        //keyRoot: 'enunciado_root',
        moreData:[],
        update: [],
        referer: [],
    },

    evaluacion:{
        table: 'u_frm_evaluacion',
        alias: 'evaluacion',
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
        table: 'u_frm f , r_is_atributo t, ae_institucion i, al_departamento d, ae_institucion eg, u_frm_evaluadores v, au_persona p, au_persona cre, u_frm_evaluacion e',
        alias: 'evaluacionn',
        cardinalidad: "n",
        linked:"evaluacion",
        campos: `e.evaluacion_id as idx, 'evaluacion' as linked, 
        d.nombre_dpto, eg.nombre_corto, i.nombre_institucion,
        string_agg(distinct p.primer_apellido, ',' ORDER BY p.primer_apellido) AS evaluadores,
        f.parametro as frm,
        e.concluido, e.activo,
        cre.primer_apellido as creador,
        CASE WHEN strpos(string_agg(DISTINCT v.dni_evaluador, ',' ),'$dni')>0 THEN false ELSE true END AS ver,
        TO_CHAR(e.create_date, 'dd/mm/yyyy') as creacion`,

        camposView: [{ value: "nombre_dpto", text: "Dpto" }, { value: "nombre_corto", text: "E.G." }, { value: "nombre_institucion", text: "Establecimiento" },        
                    { value: "evaluadores", text: "Evaluador(es)" }, 
                    { value: "frm", text: "FORM." }, 
                    { value: "ver", text: "Accion" },                   
                    
                    { value: "creacion", text: "Creacion" },
                    {value:'creador', text:'Creado Por'},
                    { value: "concluido", text: " " },                     
                    
        ],
        key: [],
        precondicion: ['e.frm_id =  f.frm_id', 'e.tipo_acrehab =  t.atributo_id', 'e.institucion_id =  i.institucion_id', 
        'e.evaluacion_id =  v.evaluacion_id', 'v.dni_evaluador =  p.dni_persona',
            'i.cod_pais =  d.cod_pais', 'i.cod_dpto =  d.cod_dpto', 'i.institucion_root =  eg.institucion_id',
        'e.dni_register=cre.dni_persona'],
        groupOrder: `GROUP BY e.evaluacion_id, 
                        d.nombre_dpto, eg.nombre_corto, i.nombre_institucion,
                        f.parametro,
                        e.concluido, 
                        atr1.atributo, atr1.color,
                        e.activo,
                        e.create_date, cre.primer_apellido
                        ORDER BY  e.create_date desc `,//null string    
        update: [],
        referer: [ 
            { ref: 'u_is_atributo as atr1', campos: 'atr1.atributo as conclusion, atr1.color', camporef: 'atr1.atributo_id', camporefForeign: 'e.concluido',


}           
        ],
    },
   
    mydash:{
        table: 'u_frm_evaluacion',
        alias: 'dashboardUcass',
        cardinalidad: "1",
        noKeyAutomatic: true,
        included: null, //para el caso de una asociacion con table
        campos: {                   
            nro_evals:['Evaluaciones', false, true, 'TT'],
        },        
        key: ['evaluacion_id'],        
        ilogic:{nro_evals: `SELECT COUNT(*)  as evaluaciones
        FROM u_frm_evaluacion`},
        //keyRoot: 'enunciado_root',
        moreData:[],
        update: [],
        referer: [],
    },

    cf_camas:{
        table: 'cf_evento',
        alias: 'reportecamas',
        cardinalidad: "1",
        noKeyAutomatic: true,
        included: null, //para el caso de una asociacion con table
        campos: {                        
            total_camas_disp: ['Total camas', true, true, 'TN'],
            total_camas_disp_uti: ['Total camas UTI', true, true, 'TN'],
            total_camas_disp_uci: ['Total camas UCI', true, true, 'TN'],
            total_camas_disp_eme: ['Total camas EMERGENCIAS', true, true, 'TN'],
            
            m_camas_disp: ['# Camas Disponibles - Mañana', true, true, 'TN'], 
            m_camas_disp_uti: ['# Camas Disponibles UTI - Mañana', true, true, 'TN'], 
            m_camas_disp_uci: ['# Camas Disponibles UCI - Mañana', true, true, 'TN'], 
            m_camas_dis_eme: ['# Camas Disponibles Emergencia - Mañana', true, true, 'TN'],
            t_camas_disp: ['# Camas Disponibles - Tarde', true, true, 'TN'],  
            t_camas_disp_uti: ['# Camas Disponibles UTI - Tarde', true, true, 'TN'],  
            t_camas_disp_uci: ['# Camas Disponibles UCI - Tarde', true, true, 'TN'],
            t_camas_disp_eme: ['# Camas Disponibles Emergencia - Tarde', true, true, 'TN'], 
            n_camas_disp: ['# Camas Disponibles - Noche', true, true, 'TN'],  
            n_camas_disp_uti: ['# Camas Disponibles UTI - Noche', true, true, 'TN'],  
            n_camas_disp_uci: ['# Camas Disponibles - UCI - Noche', true, true, 'TN'],   
            n_camas_disp_eme: ['# Camas Disponibles - Emergencia - Noche', true, true, 'TN']
            
        },        
        key: ['idx'],        
        ilogic:{},
        //keyRoot: 'enunciado_root',
        moreData:[],
        update: [],
        referer: [],
    },

    cf_camasn:{
        table: 'cf_evento e, ae_institucion i, ae_institucion h',
        alias: 'reportecamasn',
        cardinalidad: "n",
        linked:"cf_camas",
        campos: `e.idx, 'cf_camas' as linked, 
         to_char(e.fecha_registro, 'YYYY-MM-DD') AS registro, i.nombre_corto, h.nombre_institucion, e.nivel`,

        camposView: [{ value: "registro", text: "Fecha Registro" }, { value: "nombre_corto", text: "Ente Gestor" }, { value: "nombre_institucion", text: "Establecimiento Salud" },        
                    { value: "nivel", text: "NIvel" }   ],
        key: [],
        precondicion: ["e.ente_gestor_id =  i.institucion_id", "e.establecimiento_id = h.institucion_id",
            "e.dni_register='$dni'", "e.fecha_registro::date BETWEEN (CURRENT_DATE- INTERVAL '1 day')::date AND CURRENT_DATE::date" 
        ],
        update: [],
        referer: [            
        ],
    },
 
}

//const immutableObject = (obj) =>
//  typeof obj === 'object' ?  Object.values (obj).forEach (immutableObject) || Object.freeze (obj) : obj;

  //immutableObject(PARAMETROS)

module.exports = PARAMETROS
