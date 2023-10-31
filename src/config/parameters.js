//[label,editable,requerido,<T:texto, C:combo, R:Radio, H:checkBox>]
const PARAMETROS = {
    eess: {
        table: "r_institucion_salud",
        campos: {
            codigo: ['Codigo Institucion', false, true,'T'],
            ente_gestor_id: ['Ente Gestor', false, true, 'T'],
            tipo_red_id: ['Red', true, false, 'C'],
            clase: ['Clase Institucion', true, true, 'C'],
            nivel_atencion: ['Nivel de Atencion', true, true, 'C'],
            subsector: ['Sub Sector', false, true, 'C'],
            urbano_rural: ['Area', true, true, 'C'],
            nit: ['NIT', true, false, 'T'],
            no_ra: ['No. Resolucion Administrativa', true, false, 'T'],
            accesibilidad_eess: ['Accesibilidad', true, false, 'C'],
            carretera_eess: ['Via de Acceso', true, false, 'C'],
        },
        key: ['institucion_id'],
        update: [],
        referer:[
            {ref: "institucion", camporef:"institucion_id", camporefForeign:"ente_gestor_id", alias: "ente_gestor", campos:['nombre_institucion'], condicion:{institucion_id: 'xx'}},
            {ref: "atributos", camporef:"atributo_id", camporefForeign:"clase", alias: "grupo_atributo", campos:['atributo_id','atributo'], condicion:'CLASE'},
            {ref: "atributos", camporef:"atributo_id", camporefForeign:"nivel_atencion", alias: "grupo_atributo", campos:['atributo_id','atributo'], condicion:'NIVELATENCION'},
            {ref: "atributos", camporef:"atributo_id", camporefForeign:"subsector", alias: "grupo_atributo", campos:['atributo_id','atributo'], condicion:'SUBSECTOR'},
            {ref: "atributos", camporef:"atributo_id", camporefForeign:"urbano_rural", alias: "grupo_atributo", campos:['atributo_id','atributo'], condicion:'AREA'},
            {ref: "atributos", camporef:"atributo_id", camporefForeign:"accesibilidad_eess", alias: "grupo_atributo", campos:['atributo_id','atributo'], condicion:'06ACCESIBILIDAD'},
            {ref: "atributos", camporef:"atributo_id", camporefForeign:"carretera_eess", alias: "grupo_atributo", campos:['atributo_id','atributo'], condicion:'06CARRETERA'},
        ]
    },
    inst: {
        table: "r_institucion",
        campos: {
            codigo: ['Codigo Institucion', false, true],
            ente_gestor_id: ['Ente Gestor', false, true],
            tipo_red_id: ['Red', true, false],
            clase: ['Clase Institucion', true, true],
            nivel_atencion: ['Nivel de Atencion', true, true],
            subsector: ['Sub Sector', false, true],
            urbano_rural: ['Area', true, true],
            nit: ['NIT', true, false],
            no_ra: ['No. Resolucion Administrativa', true, false],
            accesibilidad_eess: ['Accesibilidad', true, false],
            carretera_eess: ['Via de Acceso', true, false],
        },
        key: ['institucion_id'],
        update: []
    },
    attrib: {

    }

}

module.exports = {
    PARAMETROS
}
