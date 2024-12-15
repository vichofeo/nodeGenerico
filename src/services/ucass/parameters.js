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
    eess: {
        table: 'uf_abastecimiento_institucion_cnf',
        alias: 'eess',
        cardinalidad: "1",
        campos: {
            eess: ['CLase de Formulario', true, true, 'C'],            
        },
        key: ['institucion_id'],
        moreData: [
            // { ref: 'f_frm_opcionales', apropiacion: 'tipo_opcion_id', campos: ['tipo_opcion_id','tipo_opcion_id'],  campoForeign: 'formulario_id',   condicion: {activo:'Y'}, condicional:null },
        ],
        update: [],
        referer: [            
            { ref: 'uf_abastecimiento_institucion_cnf', apropiacion: 'eess', campos: ['institucion_id', 'institucion_id'], condicion: {activo:'Y'}, condicional: null },
        ],
    },
    linamen: {
        //'$app', '$inst', '$dni', '$usr'
        table: 'uf_liname l',
        alias: 'linamen',
        cardinalidad: "n",
        linked: "eess",
        campos: `l.cod_liname, l.medicamento, l.forma_farmaceutica, l.concentracion, l.clasificacion_atq,
            CASE WHEN l.uso_restringido THEN 'SI' ELSE 'NO' END AS uso, l.aclaracion`,

        camposView: [
        { value: "cod_liname", text: "Codigo" }, 
        { value: "medicamento", text: "Medicamento" }, 
        { value: "forma_farmaceutica", text: "Forma Farmacéutica" }, 
        { value: "concentracion", text: "Concentración" },
        { value: "clasificacion_atq", text: "Clasific. A.T.Q." },
        { value: "uso", text: "Uso Restringido" },
        { value: "aclaracion", text: "Aclaración de Particularidades" } 
    ],
        key: [],
        precondicion: [],
        groupOrder: ` ORDER BY l.cod_liname `,//null string    
        update: [],
        referer: [ ],
    },
}

const immutableObject = (obj) =>
    typeof obj === 'object' ? Object.values(obj).forEach(immutableObject) || Object.freeze(obj) : obj;

//immutableObject(PARAMETROS)

module.exports = PARAMETROS
