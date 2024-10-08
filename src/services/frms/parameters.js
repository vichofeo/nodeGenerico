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
    fgroup: {
        table: 'f_formulario_grupo',
        alias: 'fgroup',
        cardinalidad: "1",
        campos: {
            nombre_grupo_formulario: ['Defina nombre de grupo de formularios', true, false, 'TT', 80],
            descripcion: ['Descripcion del grupo', true, true, 'TA', 512],

        },
        key: ['grupo_formulario_id'],
        moreData: [],
        update: [],
        referer: [],
    },
    ffrm: {
        table: 'f_formulario',
        alias: 'ffrm',
        cardinalidad: "1",
        campos: {
            cod_clase: ['CLase de Formulario', true, true, 'C'],
            codigo_formulario: ['Asigne un Codigo al Formulario', true, false, 'TT', 25],
            nombre_formulario: ['Nombre del Formulario', true, true, 'TT', 120],
            descripcion: ['Descripcion del formulario', true, true, 'TA', 512],
            //tipo_opcion_id: ['Incluya formas predetermidad haciendo clic', true, false, 'H']
            ordenanza: ['Instrucciones', true, true, 'TA', 1024],
        },
        key: ['formulario_id'],
        moreData: [
            // { ref: 'f_frm_opcionales', apropiacion: 'tipo_opcion_id', campos: ['tipo_opcion_id','tipo_opcion_id'],  campoForeign: 'formulario_id',   condicion: {activo:'Y'}, condicional:null },
        ],
        update: [],
        referer: [
            //{ ref: 'f_frm_opcionales_tipo', apropiacion: 'tipo_opcion_id', campos: ['tipo_opcion_id', 'tipo_opcion'], condicion: null, condicional:null, multiple:true },
            { ref: 'f_formulario_clase', apropiacion: 'cod_clase', campos: ['cod_clase', 'nombre_clase'], condicion: null, condicional: null },
        ],
    },
    fsection: {
        table: 'f_frm_subfrm',
        alias: 'fsection',
        cardinalidad: "1",
        campos: {
            codigo: ['Codigo', true, true, 'TT', 10],
            nombre_subfrm: ['Nombre de la seccion', true, true, 'TT', 512],
            descripcion: ['Descripcion de la seccion', true, false, 'TA', 2048],
            orden: ['Orden de Aparicion', true, true, 'TN', 2],

        },
        key: ['subfrm_id'],
        moreData: [],
        update: [],
        referer: [],
    },
    fquestion: {
        table: 'f_frm_enunciado',
        alias: 'fquestion',
        cardinalidad: "1",
        included: { ref: 'answers', key: 'opcion_id', campos: ['opcion_id', 'respuesta', 'orden'], condicion: null },
        campos: {
            codigo: ['Codigo', true, true, 'TT', 10],
            enunciado: ['Formule su pregunta', true, true, 'TA', 512],
            orden: ['Orden de Aparicion', true, true, 'TN', 2],
            tipo_enunciado_id: ['Tipo de Respuesta', true, false, 'C', 80],

        },
        key: ['enunciado_id'],
        keyRoot: 'enunciado_root',
        moreData: [],
        update: [],
        referer: [
            { ref: 'f_frm_enun_tipo', apropiacion: 'tipo_enunciado_id', campos: ['tipo_enunciado_id', 'nombre_tipo_pregunta'], condicion: null, condicional: null, multiple: false }
        ],
    },
    fficnf: {
        table: 'f_formulario_institucion_cnf',
        alias: 'fficnf',
        cardinalidad: "1",
        included: null, //{}
        campos: {

            formulario_id: ['Formulario', true, true, 'C'],
            institucion_id: ['Establecimiento de salus', true, true, 'C']

        },
        key: ['institucion_id', 'formulario_id'],
        keyRoot: null,//'enunciado_root',
        moreData: [],
        update: [],
        referer: [
            { ref: 'f_frm_enun_tipo', apropiacion: 'tipo_enunciado_id', campos: ['tipo_enunciado_id', 'nombre_tipo_pregunta'], condicion: null, condicional: null, multiple: false }
        ],
    },
    fquestion100: {
        table: 'f_frm_enunciado',
        alias: 'fquestion100',
        cardinalidad: "1",
        campos: {
            row_code: ['Filas', true, true, 'C'],
            col_code: ['Columnas', true, false, 'C'],
            scol_code: ['SubColumnas', true, true, 'C'],
            row_title: ['Titulo Filas', true, true, 'TA', 512],
            col_title: ['Titulo Columnas', true, true, 'TA', 512],
            repeat_row: ['Repetir la misma Fila', true, true, 'SW'],
            repeat: ['Cuantas veces repetira fila', true, false, 'TN', 2],
        },
        key: ['formulario_id'],
        moreData: [
            // { ref: 'f_frm_opcionales', apropiacion: 'tipo_opcion_id', campos: ['tipo_opcion_id','tipo_opcion_id'],  campoForeign: 'formulario_id',   condicion: {activo:'Y'}, condicional:null },
        ],
        update: [],
        referer: [
            //{ ref: 'f_frm_opcionales_tipo', apropiacion: 'tipo_opcion_id', campos: ['tipo_opcion_id', 'tipo_opcion'], condicion: null, condicional:null, multiple:true },
            { ref: 'f_is_gr_atributo', apropiacion: 'row_code', campos: ['grupo_atributo', 'grupo'], condicion: null, condicional: null },
            { ref: 'f_is_gr_atributo', apropiacion: 'col_code', campos: ['grupo_atributo', 'grupo'], condicion: null, condicional: null },
            { ref: 'f_is_gr_atributo', apropiacion: 'scol_code', campos: ['grupo_atributo', 'grupo'], condicion: null, condicional: null },
        ],
    },
    evaluacionn: {
        //'$app', '$inst', '$dni', '$usr'
        table: 'ae_institucion i, al_departamento d, ae_institucion eg, au_persona p, f_formulario f ,f_formulario_institucion_cnf cnf, f_formulario_registro eval ',
        alias: 'evaluacionn',
        cardinalidad: "n",
        linked: "evaluacion",
        campos: `eval.registro_id as idx, 'evaluacion' as linked,

        d.nombre_dpto, eg.nombre_corto, i.nombre_institucion,
        p.primer_apellido AS evaluador,

        f.nombre_formulario as frm, eval.periodo,
        eval.concluido, eval.activo,

        CASE WHEN strpos(eval.dni_register,'$dni')>0 THEN false ELSE true END AS ver,
        TO_CHAR(eval.create_date, 'dd/mm/yyyy') as creacion , atr1.atributo as conclusion, atr1.color 
        `,

        camposView: [{ value: "nombre_dpto", text: "Dpto" }, { value: "nombre_corto", text: "E.G." }, { value: "nombre_institucion", text: "Establecimiento" },
        { value: "periodo", text: "Periodo Registro" },
        { value: "evaluador", text: "Evaluador" },
        { value: "frm", text: "FORM." },
        { value: "ver", text: "Accion" },

        { value: "creacion", text: "Creacion" },
        //{value:'creador', text:'Creado Por'},
        { value: "concluido", text: " " },

        ],
        key: ['eval.formulario_id'],
        precondicion: ['f.formulario_id = cnf.formulario_id',
            'cnf.formulario_id = eval.formulario_id ', 'cnf.institucion_id=eval.institucion_id',
            'eval.dni_register =  p.dni_persona ', 'eval.institucion_id =  i.institucion_id ',
            'i.cod_pais =  d.cod_pais ', ' i.cod_dpto =  d.cod_dpto',
            'i.institucion_root =  eg.institucion_id',
            "eval.institucion_id='$inst'"],
        groupOrder: ` ORDER BY  eval.create_date desc `,//null string    
        update: [],
        referer: [ {
                ref: 'u_is_atributo as atr1', campos: 'atr1.atributo as conclusion, atr1.color', camporef: 'atr1.atributo_id', camporefForeign: 'eval.concluido',
            }
        ],
    },
    evaluacion_todes: {
        //'$app', '$inst', '$dni', '$usr'
        table: 'ae_institucion i, al_departamento d, ae_institucion eg, au_persona p, f_formulario f ,f_formulario_institucion_cnf cnf, f_formulario_registro eval ',
        alias: 'evaluacionn',
        cardinalidad: "n",
        linked: "evaluacion",
        campos: `eval.registro_id as idx, 'evaluacion' as linked,

        d.nombre_dpto, eg.nombre_corto, i.nombre_institucion,
        p.primer_apellido AS evaluador,

        f.nombre_formulario as frm, eval.periodo,
        eval.concluido, eval.activo,

        CASE WHEN strpos(eval.dni_register,'$dni')>0 THEN false ELSE true END AS ver,
        TO_CHAR(eval.create_date, 'dd/mm/yyyy') as creacion , atr1.atributo as conclusion, atr1.color 
        `,

        camposView: [{ value: "nombre_dpto", text: "Dpto" }, { value: "nombre_corto", text: "E.G." }, { value: "nombre_institucion", text: "Establecimiento" },
        { value: "periodo", text: "Periodo Registro" },
        { value: "evaluador", text: "Evaluador" },
        { value: "frm", text: "FORM." },
        { value: "ver", text: "Accion" },

        { value: "creacion", text: "Creacion" },
        //{value:'creador', text:'Creado Por'},
        { value: "concluido", text: " " },

        ],
        key: ['eval.formulario_id'],
        precondicion: ['f.formulario_id = cnf.formulario_id',
            'cnf.formulario_id = eval.formulario_id ', 'cnf.institucion_id=eval.institucion_id',
            'eval.dni_register =  p.dni_persona ', 'eval.institucion_id =  i.institucion_id ',
            'i.cod_pais =  d.cod_pais ', ' i.cod_dpto =  d.cod_dpto',
            'i.institucion_root =  eg.institucion_id'],
        groupOrder: ` ORDER BY  eval.create_date desc `,//null string    
        update: [],
        referer: [ {
                ref: 'u_is_atributo as atr1', campos: 'atr1.atributo as conclusion, atr1.color', camporef: 'atr1.atributo_id', camporefForeign: 'eval.concluido',
            }
        ],
    },
    fregis: {
        table: 'f_formulario',
        alias: 'regis',
        cardinalidad: "1",
        campos: {
            institucion_id: ['Institucion', true, true, 'C'],
            formulario_id: ['Formulario', true, false, 'C'],
            periodo: ['Periodo', true, false, 'C']
        },
        key: ['formulario_id'],
        moreData: [
            // { ref: 'f_frm_opcionales', apropiacion: 'tipo_opcion_id', campos: ['tipo_opcion_id','tipo_opcion_id'],  campoForeign: 'formulario_id',   condicion: {activo:'Y'}, condicional:null },
        ],
        update: [],
        ilogic: {
            formulario_id: `SELECT formulario_id as value, nombre_formulario as text FROM f_formulario WHERE formulario_id = '$formulario_id' and  activo = 'Y'`,
            periodo: `SELECT TO_CHAR(current_date - interval '1 month','YYYYMM') as value, TO_CHAR(current_date - interval '1 month','YYYY-Month') as text`
            //periodo: `SELECT '202403' as value, '202403 - Marzo' as text`
        },
        referer: [
            //{ ref: 'f_frm_opcionales_tipo', apropiacion: 'tipo_opcion_id', campos: ['tipo_opcion_id', 'tipo_opcion'], condicion: null, condicional:null, multiple:true },
            { ref: 'ae_institucion', apropiacion: 'institucion_id', campos: ['institucion_id', 'nombre_institucion'], condicion: null, condicional: ['institucion_id,$inst'] },
            //{ ref: 'f_formulario', apropiacion: 'formulario_id', campos: ['formulario_id', 'nombre_formulario'], condicion: [formulario_id:], condicional:null },

        ],
    },

    monFrms: {
        table: 'f_formulario_registro',
        alias: 'monFrms',
        cardinalidad: "1",
        campos: {
            forms: ['Formularios', true, true, 'C'],            
        },
        key: ['formulario_id'],
        ilogic:{forms:`SELECT distinct f.formulario_id AS value,f.codigo_formulario ||'-'|| f.nombre_formulario||'-'||  f.descripcion AS text
            FROM f_formulario_registro fr, f_formulario f
            WHERE fr.formulario_id=f.formulario_id
            ORDER BY 2`},
        moreData: [],
        update: [],
        referer: [],
    },
}

const immutableObject = (obj) =>
    typeof obj === 'object' ? Object.values(obj).forEach(immutableObject) || Object.freeze(obj) : obj;

//immutableObject(PARAMETROS)

module.exports = PARAMETROS
