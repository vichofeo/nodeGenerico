//[label, editable, requerido, <T?:texto, C:combo, R:Radio, H:checkBox, F: fecha>, tamanio]
/**
 * objeto de configuracion para diversas pantallas
 * campos:[label, editable, requerido, <T?:texto, C:combo, R:Radio, H:checkBox, F: fecha>, tamanio, Reservado]
 * T?->TT: texto, TN: texto numero entero, TM: TextMail, TD: Texto decimal, TA: Text Area
 * SW
 * use-se la opcion dual cuando la interaccion y la insercion es con tablas de bd
 * referer.condicional:['aplicacion_id,$app'] 
 * referer.condicion: {a:1,b:5}
 */
"use strict"
const PARAMETROS = {    
    tmp_cancern:{
        table: `tmp_cancer tc
                LEFT JOIN ae_institucion eess ON (eess.institucion_root =  tc.eg AND eess.institucion_id =  tc.eess AND eess.cod_dpto = tc.dpto)
                LEFT JOIN ae_institucion eg ON (eg.institucion_id =  tc.eg )
                LEFT JOIN al_departamento dpto ON (dpto.cod_dpto =  tc.dpto )`,
        alias: 'tmp_cancern',
        cardinalidad: "n",
        linked:"tmp_cancer",
        campos: `tc.ente_gestor_name, tc.departamento, tc.establecimiento,
                eg.nombre_institucion as eg_n, dpto.nombre_dpto as dpto_n, eess.nombre_institucion as eess_n,
                tc.eg, tc.dpto, tc.eess
                `,

        camposView: [{ value: "ente_gestor_name", text: "Reg: Ente Gestor" }, { value: "departamento", text: "Reg: Dpto" }, { value: "establecimiento", text: "Reg: Establecimiento" },        
            { value: "eg_n", text: "Equivale: Ente Gestor" }, { value: "dpto_n", text: "Equivale: Dpto" }, { value: "eess_n", text: "Equivale: eess" },        
           ],
        key: [],
        precondicion: [],
        groupOrder: ` GROUP BY tc.ente_gestor_name, tc.departamento, tc.establecimiento,
                    eg.nombre_institucion, dpto.nombre_dpto, eess.nombre_institucion,
                    tc.eg, tc.dpto, tc.eess
                    ORDER BY (eg.nombre_institucion, dpto.nombre_dpto, eess.nombre_institucion) DESC, 
                    tc.ente_gestor_name, tc.departamento, tc.establecimiento
                    `,
        update: [],
        referer: []
    },
    tmp_carmelon:{
        table: `tmp_carmelo tc
                LEFT JOIN ae_institucion eess ON (eess.institucion_root =  tc.eg AND eess.institucion_id =  tc.eess AND eess.cod_dpto = tc.dpto)
                LEFT JOIN ae_institucion eg ON (eg.institucion_id =  tc.eg )
                LEFT JOIN al_departamento dpto ON (dpto.cod_dpto =  tc.dpto )`,
        alias: 'tmp_carmelon',
        cardinalidad: "n",
        linked:"tmp_carmelo",
        campos: `tc.ente_gestor_name, tc.departamento, tc.establecimiento,
                eg.nombre_institucion as eg_n, dpto.nombre_dpto as dpto_n, eess.nombre_institucion as eess_n,
                tc.eg, tc.dpto, tc.eess
                `,

        camposView: [{ value: "ente_gestor_name", text: "Reg: Ente Gestor" }, { value: "departamento", text: "Reg: Dpto" }, { value: "establecimiento", text: "Reg: Establecimiento" },        
            { value: "eg_n", text: "Equivale: Ente Gestor" }, { value: "dpto_n", text: "Equivale: Dpto" }, { value: "eess_n", text: "Equivale: eess" },        
           ],
        key: [],
        precondicion: [],
        groupOrder: ` GROUP BY tc.ente_gestor_name, tc.departamento, tc.establecimiento,
                    eg.nombre_institucion, dpto.nombre_dpto, eess.nombre_institucion,
                    tc.eg, tc.dpto, tc.eess
                    ORDER BY (eg.nombre_institucion, dpto.nombre_dpto, eess.nombre_institucion) DESC, 
                    tc.ente_gestor_name, tc.departamento, tc.establecimiento
                    `,
        update: [],
        referer: []
    },
    tmp_pain:{
        table: `tmp_pai tc
                LEFT JOIN ae_institucion eess ON (eess.institucion_root =  tc.eg AND eess.institucion_id =  tc.eess AND eess.cod_dpto = tc.dpto)
                LEFT JOIN ae_institucion eg ON (eg.institucion_id =  tc.eg )
                LEFT JOIN al_departamento dpto ON (dpto.cod_dpto =  tc.dpto )`,
        alias: 'tmp_pain',
        cardinalidad: "n",
        linked:"tmp_pai",
        campos: `tc.ente_gestor_name, tc.departamento, tc.establecimiento,
                eg.nombre_institucion as eg_n, dpto.nombre_dpto as dpto_n, eess.nombre_institucion as eess_n,
                tc.eg, tc.dpto, tc.eess
                `,

        camposView: [{ value: "ente_gestor_name", text: "Reg: Ente Gestor" }, { value: "departamento", text: "Reg: Dpto" }, { value: "establecimiento", text: "Reg: Establecimiento" },        
            { value: "eg_n", text: "Equivale: Ente Gestor" }, { value: "dpto_n", text: "Equivale: Dpto" }, { value: "eess_n", text: "Equivale: eess" },        
           ],
        key: [],
        precondicion: [],
        groupOrder: ` GROUP BY tc.ente_gestor_name, tc.departamento, tc.establecimiento,
                    eg.nombre_institucion, dpto.nombre_dpto, eess.nombre_institucion,
                    tc.eg, tc.dpto, tc.eess
                    ORDER BY (eg.nombre_institucion, dpto.nombre_dpto, eess.nombre_institucion) DESC, 
                    tc.ente_gestor_name, tc.departamento, tc.establecimiento
                    `,
        update: [],
        referer: []
    },
}


module.exports = PARAMETROS
