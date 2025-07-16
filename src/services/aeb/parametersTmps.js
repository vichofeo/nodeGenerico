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
        vtmp_nacimientosn: {
                table: `tmp_nacimientos tc
                        LEFT JOIN ae_institucion eess ON (eess.institucion_root =  tc.eg AND eess.institucion_id =  tc.eess AND eess.cod_dpto = tc.dpto)
                        LEFT JOIN ae_institucion eg ON (eg.institucion_id =  tc.eg )
                        LEFT JOIN al_departamento dpto ON (dpto.cod_dpto =  tc.dpto )`,
                alias: 'vtmp_nacimientosn',
                cardinalidad: "n",
                linked: "tmp_nacimientos",
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
        vtmp_defuncionesn: {
                table: `tmp_defunciones tc
                        LEFT JOIN ae_institucion eess ON (eess.institucion_root =  tc.eg AND eess.institucion_id =  tc.eess AND eess.cod_dpto = tc.dpto)
                        LEFT JOIN ae_institucion eg ON (eg.institucion_id =  tc.eg )
                        LEFT JOIN al_departamento dpto ON (dpto.cod_dpto =  tc.dpto )`,
                alias: 'vtmp_defuncionesn',
                cardinalidad: "n",
                linked: "tmp_defunciones",
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
        tmp_cancern: {
                table: `tmp_cancer tc
                LEFT JOIN ae_institucion eess ON (eess.institucion_root =  tc.eg AND eess.institucion_id =  tc.eess AND eess.cod_dpto = tc.dpto)
                LEFT JOIN ae_institucion eg ON (eg.institucion_id =  tc.eg )
                LEFT JOIN al_departamento dpto ON (dpto.cod_dpto =  tc.dpto )`,
                alias: 'tmp_cancern',
                cardinalidad: "n",
                linked: "tmp_cancer",
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
        tmp_carmelon: {
                table: `tmp_carmelo tc
                LEFT JOIN ae_institucion eess ON (eess.institucion_root =  tc.eg AND eess.institucion_id =  tc.eess AND eess.cod_dpto = tc.dpto)
                LEFT JOIN ae_institucion eg ON (eg.institucion_id =  tc.eg )
                LEFT JOIN al_departamento dpto ON (dpto.cod_dpto =  tc.dpto )`,
                alias: 'tmp_carmelon',
                cardinalidad: "n",
                linked: "tmp_carmelo",
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
        tmp_pain: {
                table: `tmp_pai tc
                LEFT JOIN ae_institucion eess ON (eess.institucion_root =  tc.eg AND eess.institucion_id =  tc.eess AND eess.cod_dpto = tc.dpto)
                LEFT JOIN ae_institucion eg ON (eg.institucion_id =  tc.eg )
                LEFT JOIN al_departamento dpto ON (dpto.cod_dpto =  tc.dpto )`,
                alias: 'tmp_pain',
                cardinalidad: "n",
                linked: "tmp_pai",
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
        tmp_inasn: {
                table: `tmp_inas tc
                LEFT JOIN ae_institucion eess ON (eess.institucion_root =  tc.eg AND eess.institucion_id =  tc.eess AND eess.cod_dpto = tc.dpto)
                LEFT JOIN ae_institucion eg ON (eg.institucion_id =  tc.eg )
                LEFT JOIN al_departamento dpto ON (dpto.cod_dpto =  tc.dpto )`,
                alias: 'tmp_inasn',
                cardinalidad: "n",
                linked: "tmp_inas",
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
        tmp_amesn: {
                table: `tmp_ames tc
                LEFT JOIN ae_institucion eess ON (eess.institucion_root =  tc.eg AND eess.institucion_id =  tc.eess AND eess.cod_dpto = tc.dpto)
                LEFT JOIN ae_institucion eg ON (eg.institucion_id =  tc.eg )
                LEFT JOIN al_departamento dpto ON (dpto.cod_dpto =  tc.dpto )`,
                alias: 'tmp_amesn',
                cardinalidad: "n",
                linked: "tmp_ames",
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
        tmp_rramen: {
                table: `tmp_rrame tc
                        LEFT JOIN ae_institucion eg ON (eg.institucion_id =  tc.eg )
                        LEFT JOIN al_departamento dpto ON (dpto.cod_dpto =  tc.dpto )`,
                alias: 'tmp_rramen',
                cardinalidad: "n",
                linked: "tmp_rrame",
                campos: `tc.ente_gestor_name, tc.departamento,
                        eg.nombre_institucion as eg_n, dpto.nombre_dpto as dpto_n, 
                        tc.eg, tc.dpto
                `,

                camposView: [{ value: "ente_gestor_name", text: "Reg: Ente Gestor" }, { value: "departamento", text: "Reg: Dpto" }, 
                { value: "eg_n", text: "Equivale: Ente Gestor" }, { value: "dpto_n", text: "Equivale: Dpto" },
                ],
                key: [],
                precondicion: [],
                groupOrder: ` GROUP BY tc.ente_gestor_name, tc.departamento,
                    eg.nombre_institucion, dpto.nombre_dpto,
                    tc.eg, tc.dpto
                    ORDER BY (eg.nombre_institucion, dpto.nombre_dpto) DESC, 
                    tc.ente_gestor_name, tc.departamento
                    `,
                update: [],
                referer: []
        },
        acrebhabn: {
                table: `u_acrehab tc
                LEFT JOIN ae_institucion eess ON (eess.institucion_root =  tc.eg AND eess.institucion_id =  tc.eess AND eess.cod_dpto = tc.dpto)
                LEFT JOIN ae_institucion eg ON (eg.institucion_id =  tc.eg )
                LEFT JOIN al_departamento dpto ON (dpto.cod_dpto =  tc.dpto )`,
                alias: 'acrebhabn',
                cardinalidad: "n",
                linked: "u_acrehab",
                campos: `tc.ente_gestor_name, tc.departamento, tc.establecimiento,
                eg.nombre_institucion as eg_n, dpto.nombre_dpto as dpto_n, eess.nombre_institucion as eess_n,
                tc.eg, tc.dpto, tc.eess
                `,

                camposView: [{ value: "ente_gestor_name", text: "Reg: Ente Gestor" }, { value: "departamento", text: "Reg: Dpto" }, { value: "establecimiento", text: "Reg: Establecimiento" },
                { value: "eg_n", text: "Equivale: Ente Gestor" }, { value: "dpto_n", text: "Equivale: Dpto" }, { value: "eess_n", text: "Equivale: eess" },
                ],
                key: [],
                precondicion: ["tc.tipo = 'O'"],
                groupOrder: ` GROUP BY tc.ente_gestor_name, tc.departamento, tc.establecimiento,
                    eg.nombre_institucion, dpto.nombre_dpto, eess.nombre_institucion,
                    tc.eg, tc.dpto, tc.eess
                    ORDER BY (eg.nombre_institucion, dpto.nombre_dpto, eess.nombre_institucion) DESC, 
                    tc.ente_gestor_name, tc.departamento, tc.establecimiento
                    `,
                update: [],
                referer: []
        },
        vtmp_snis301an: {
                table: `tmp_snis301a tc
                LEFT JOIN ae_institucion eess ON (eess.institucion_root =  tc.eg AND eess.institucion_id =  tc.eess AND eess.cod_dpto = tc.dpto)
                LEFT JOIN ae_institucion eg ON (eg.institucion_id =  tc.eg )
                LEFT JOIN al_departamento dpto ON (dpto.cod_dpto =  tc.dpto )`,
                alias: 'vtmp_snis301an',
                cardinalidad: "n",
                linked: "tmp_snis301a",
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
        vtmp_snis301bn: {
                table: `tmp_snis301b tc
                LEFT JOIN ae_institucion eess ON (eess.institucion_root =  tc.eg AND eess.institucion_id =  tc.eess AND eess.cod_dpto = tc.dpto)
                LEFT JOIN ae_institucion eg ON (eg.institucion_id =  tc.eg )
                LEFT JOIN al_departamento dpto ON (dpto.cod_dpto =  tc.dpto )`,
                alias: 'vtmp_snis301bn',
                cardinalidad: "n",
                linked: "tmp_snis301b",
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
        vtmp_snis302an: {
                table: `tmp_snis302a tc
                LEFT JOIN ae_institucion eess ON (eess.institucion_root =  tc.eg AND eess.institucion_id =  tc.eess AND eess.cod_dpto = tc.dpto)
                LEFT JOIN ae_institucion eg ON (eg.institucion_id =  tc.eg )
                LEFT JOIN al_departamento dpto ON (dpto.cod_dpto =  tc.dpto )`,
                alias: 'vtmp_snis302an',
                cardinalidad: "n",
                linked: "tmp_snis302a",
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
        vtmp_snis302bn: {
                table: `tmp_snis302b tc
                LEFT JOIN ae_institucion eess ON (eess.institucion_root =  tc.eg AND eess.institucion_id =  tc.eess AND eess.cod_dpto = tc.dpto)
                LEFT JOIN ae_institucion eg ON (eg.institucion_id =  tc.eg )
                LEFT JOIN al_departamento dpto ON (dpto.cod_dpto =  tc.dpto )`,
                alias: 'vtmp_snis302bn',
                cardinalidad: "n",
                linked: "tmp_snis302b",
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
