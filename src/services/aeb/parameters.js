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
const paramsTmps = require("./parametersTmps.js")
const PARAMETROS = {
    opciones:{
        campos:{
            list: ['Lista de Formularios Disponibles en Sistema:', true, true, 'C']
        },
        valores:{
            list:{
                selected: {value:'snis301an', text:'SNIS - F.301A' },
			    items: [{value:'snis301an', text:'SNIS - F.301A' }, {value:'snis301bn', text:'SNIS - F.301B' },
                {value:'snis302an', text:'SNIS - F.302A' }, {value:'snis302bn', text:'SNIS - F.302B' }
            ],
			dependency: false
            }            
        }

    },
     snis301an: {
        //'$app', '$inst', '$dni', '$usr'
        table: 'tmp_snis301a t, au_persona p, ae_institucion eg',
        alias: 'snis301an',
        cardinalidad: "n",
        linked: "snis",
        campos: `t.gestion, t.departamento, eg.nombre_institucion AS ente, t.establecimiento,
        string_agg(distinct t.mes, ', ' ORDER BY t.mes) AS meses,
        p.primer_apellido||' '||p.nombres AS usr  `,

        camposView: [{ value: "gestion", text: "Gestion" }, { value: "departamento", text: "Departamento" }, { value: "ente", text: "Ente Gestor" }, { value: "establecimiento", text: "Establecimiento de Salud" },
        { value: "meses", text: "Periodos" },
        { value: "usr", text: "Usuario" } ],
        key: [],
        precondicion: ['t.dni_register = p.dni_persona',
            't.ente_gestor = eg.institucion_id'],
        groupOrder: `GROUP BY t.gestion, t.departamento, eg.nombre_institucion , t.establecimiento, usr 
                    ORDER BY 1 desc, 2,3,4 `,//null string    
        update: [],
        referer: [ ],
    },
    snis301bn: {
        //'$app', '$inst', '$dni', '$usr'
        table: 'tmp_snis301b t, au_persona p, ae_institucion eg',
        alias: 'snis301bn',
        cardinalidad: "n",
        linked: "snis",
        campos: `t.gestion, t.departamento, eg.nombre_institucion AS ente, t.establecimiento,
        string_agg(distinct t.mes, ', ' ORDER BY t.mes) AS meses,
        p.primer_apellido||' '||p.nombres AS usr  `,

        camposView: [{ value: "gestion", text: "Gestion" }, { value: "departamento", text: "Departamento" }, { value: "ente", text: "Ente Gestor" }, { value: "establecimiento", text: "Establecimiento de Salud" },
        { value: "meses", text: "Periodos" },
        { value: "usr", text: "Usuario" } ],
        key: [],
        precondicion: ['t.dni_register = p.dni_persona',
            't.ente_gestor = eg.institucion_id'],
        groupOrder: `GROUP BY t.gestion, t.departamento, eg.nombre_institucion , t.establecimiento, usr 
                    ORDER BY 1 desc, 2,3,4 `,//null string    
        update: [],
        referer: [ ],
    },
    snis302an: {
        //'$app', '$inst', '$dni', '$usr'
        table: 'tmp_snis302a t, au_persona p, ae_institucion eg',
        alias: 'snis302an',
        cardinalidad: "n",
        linked: "snis",
        campos: `t.gestion, t.departamento, eg.nombre_institucion AS ente, t.establecimiento,
        string_agg(distinct t.semana||'', ', ' ORDER BY semana||'') AS semana,
        p.primer_apellido||' '||p.nombres AS usr  `,

        camposView: [{ value: "gestion", text: "Gestion" }, { value: "departamento", text: "Departamento" }, { value: "ente", text: "Ente Gestor" }, { value: "establecimiento", text: "Establecimiento de Salud" },
        { value: "semana", text: "Semana Epidemiologica" },
        { value: "usr", text: "Usuario" } ],
        key: [],
        precondicion: ['t.dni_register = p.dni_persona',
            't.ente_gestor = eg.institucion_id'],
        groupOrder: `GROUP BY t.gestion, t.departamento, eg.nombre_institucion , t.establecimiento, usr 
                    ORDER BY 1 desc, 2,3,4 `,//null string    
        update: [],
        referer: [ ],
    },
    snis302bn: {
        //'$app', '$inst', '$dni', '$usr'
        table: 'tmp_snis302b t, au_persona p, ae_institucion eg',
        alias: 'snis302bn',
        cardinalidad: "n",
        linked: "snis",
        campos: `t.gestion, t.departamento, eg.nombre_institucion AS ente, t.establecimiento,
        string_agg(distinct t.mes, ', ' ORDER BY t.mes) AS meses,
        p.primer_apellido||' '||p.nombres AS usr  `,

        camposView: [{ value: "gestion", text: "Gestion" }, { value: "departamento", text: "Departamento" }, { value: "ente", text: "Ente Gestor" }, { value: "establecimiento", text: "Establecimiento de Salud" },
        { value: "meses", text: "Periodos" },
        { value: "usr", text: "Usuario" } ],
        key: [],
        precondicion: ['t.dni_register = p.dni_persona',
            't.ente_gestor = eg.institucion_id'],
        groupOrder: `GROUP BY t.gestion, t.departamento, eg.nombre_institucion , t.establecimiento, usr 
                    ORDER BY 1 desc, 2,3,4 `,//null string    
        update: [],
        referer: [ ],
    },
    ...paramsTmps
    
}

const immutableObject = (obj) =>
    typeof obj === 'object' ? Object.values(obj).forEach(immutableObject) || Object.freeze(obj) : obj;

//immutableObject(PARAMETROS)

module.exports = PARAMETROS
