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
        table: 'upf_file_institucion_cnf',
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
        ilogic: {
            //eess: `SELECT formulario_id as value, nombre_formulario as text FROM f_formulario WHERE formulario_id = '$formulario_id' and  activo = 'Y'`,
            //periodo: `SELECT TO_CHAR(current_date - interval '1 month','YYYYMM') as value, TO_CHAR(current_date - interval '1 month','YYYY-Month') as text`
            //periodo: `SELECT '202403' as value, '202403 - Marzo' as text`
        },
        referer: [                        
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
    regisNew: {
        table: 'upf_registro',
        alias: 'regis',
        cardinalidad: "1",
        campos: {
            institucion_id: ['Institucion', true, true, 'C'],            
            periodo: ['Periodo', true, false, 'C']
        },
        key: ['registro_id'],
        moreData: [
            // { ref: 'f_frm_opcionales', apropiacion: 'tipo_opcion_id', campos: ['tipo_opcion_id','tipo_opcion_id'],  campoForeign: 'formulario_id',   condicion: {activo:'Y'}, condicional:null },
        ],
        update: [],
        ilogic: {            
            periodo: `SELECT 
CASE WHEN sw_semana THEN TO_CHAR(current_date - interval '1 week', 'IYYY-IW') 
ELSE TO_CHAR(current_date - interval '1 month','YYYY-MM') END AS VALUE,
CASE WHEN sw_semana THEN TO_CHAR(current_date - interval '1 week', 'IYYY-IW semana') 
ELSE TO_CHAR(current_date - interval '1 month','YYYY-Month') END AS text
FROM upf_file_tipo
WHERE file_tipo_id='$idx'`
            //periodo: `SELECT '202403' as value, '202403 - Marzo' as text`
        },
        referer: [
            //{ ref: 'f_frm_opcionales_tipo', apropiacion: 'tipo_opcion_id', campos: ['tipo_opcion_id', 'tipo_opcion'], condicion: null, condicional:null, multiple:true },
            { ref: 'ae_institucion', apropiacion: 'institucion_id', campos: ['institucion_id', 'nombre_institucion'], condicion: null, condicional: ['institucion_id,$inst'] },
            

        ],
    },
    registradosn: {
        //'$app', '$inst', '$dni', '$usr'
        table: `ae_institucion i, al_departamento d, ae_institucion eg,
        upf_file_institucion_cnf cnf
        LEFT JOIN 
(SELECT eval.institucion_id, eval.registro_id AS idx, 'evaluacion' as linked,
CASE WHEN strpos(eval.dni_register,'$dni')>0 THEN true ELSE false END AS editar,
p.primer_apellido as evaluador, eval.periodo, eval.activo, eval.create_date, 
to_char(eval.create_date, 'DD/MM/YYYY') AS f_creacion,
eval.concluido, atr1.atributo AS concluido_e, atr1.color AS concluido_c, 
eval.revisado, atr2.atributo AS revisado_e, atr2.color AS revisado_c,
eval.ctype_plus AS c_plus,  atr3.atributo AS c_plus_e, atr3.color AS c_plus_c,
eval.rtype_plus AS r_plus, atr4.atributo AS r_plus_e, atr4.color AS r_plus_c,

(date(eval.create_date)<= CURRENT_DATE AND CURRENT_DATE<= eval.fecha_climite) AS fregistro,
(eval.fecha_climite< CURRENT_DATE AND CURRENT_DATE<= eval.flimite_plus) AS fregistro_plus,
(date(eval.create_date)<= CURRENT_DATE AND CURRENT_DATE<= eval.fecha_rlimite) AS frev,
(eval.fecha_rlimite< CURRENT_DATE AND CURRENT_DATE<= eval.frevisado_plus) AS frev_plus

FROM  au_persona p, upf_file_tipo tf, upf_registro eval
LEFT JOIN u_is_atributo as atr1 ON (atr1.atributo_id = eval.concluido)
LEFT JOIN u_is_atributo as atr2 ON (atr2.atributo_id = eval.revisado)

LEFT JOIN u_is_atributo as atr3 ON (atr3.atributo_id = eval.ctype_plus)
LEFT JOIN u_is_atributo as atr4 ON (atr4.atributo_id = eval.rtype_plus)
WHERE
p.dni_persona =  eval.dni_register and tf.file_tipo_id =  eval.file_tipo_id
AND (eval.file_tipo_id='$idx')
) AS eval ON ( eval.institucion_id =  cnf.institucion_id) 
        `,
        alias: 'registradosn',
        cardinalidad: "n",
        linked: "evaluacion",
        campos: `d.nombre_dpto AS dpto, eg.nombre_corto AS eg,
        i.institucion_id as institucion, i.nombre_institucion AS establecimiento, '' as glosa,
        eval.*
        `,

        camposView: [{ value: "dpto", text: "Dpto" }, { value: "eg", text: "E.G." }, { value: "establecimiento", text: "Establecimiento" },
        { value: "periodo", text: "Periodo Registro" },
        { value: "evaluador", text: "Responsable" },        
        { value: "editar", text: "Accion" },

        { value: "f_creacion", text: "Creacion" },        
        { value: "concluido", text: " " },
        { value: "revisado", text: " " },
        { value: "glosa", text: "Glosa" },

        ],
        key: ['cnf.file_tipo_id'],
        precondicion: ["cnf.institucion_id='$inst'",
            'cnf.institucion_id =  i.institucion_id', 
            'i.cod_pais =  d.cod_pais' , 'i.cod_dpto =  d.cod_dpto' ,
            'i.institucion_root =  eg.institucion_id',  "cnf.activo='Y'"
        ],
        groupOrder: ` ORDER BY  eval.create_date desc `,//null string    
        update: [],
        referer: [],
    },
    registrados_todes: {
        //'$app', '$inst', '$dni', '$usr'
        table: `ae_institucion i, al_departamento d, ae_institucion eg,
        upf_file_institucion_cnf cnf
        LEFT JOIN 
(SELECT eval.institucion_id, eval.registro_id AS idx, 'evaluacion' as linked,
CASE WHEN strpos(eval.dni_register,'$dni')>0 THEN true ELSE false END AS editar,
p.primer_apellido as evaluador, eval.periodo, eval.activo, eval.create_date, 
to_char(eval.create_date, 'DD/MM/YYYY') AS f_creacion,
eval.concluido, atr1.atributo AS concluido_e, atr1.color AS concluido_c, 
eval.revisado, atr2.atributo AS revisado_e, atr2.color AS revisado_c,
eval.ctype_plus AS c_plus,  atr3.atributo AS c_plus_e, atr3.color AS c_plus_c,
eval.rtype_plus AS r_plus, atr4.atributo AS r_plus_e, atr4.color AS r_plus_c,

(date(eval.create_date)<= CURRENT_DATE AND CURRENT_DATE<= eval.fecha_climite) AS fregistro,
(eval.fecha_climite< CURRENT_DATE AND CURRENT_DATE<= eval.flimite_plus) AS fregistro_plus,
(date(eval.create_date)<= CURRENT_DATE AND CURRENT_DATE<= eval.fecha_rlimite) AS frev,
(eval.fecha_rlimite< CURRENT_DATE AND CURRENT_DATE<= eval.frevisado_plus) AS frev_plus

FROM  au_persona p, upf_file_tipo tf, upf_registro eval
LEFT JOIN u_is_atributo as atr1 ON (atr1.atributo_id = eval.concluido)
LEFT JOIN u_is_atributo as atr2 ON (atr2.atributo_id = eval.revisado)

LEFT JOIN u_is_atributo as atr3 ON (atr3.atributo_id = eval.ctype_plus)
LEFT JOIN u_is_atributo as atr4 ON (atr4.atributo_id = eval.rtype_plus)
WHERE
p.dni_persona =  eval.dni_register and tf.file_tipo_id =  eval.file_tipo_id
AND ($paramDoms)
) AS eval ON ( eval.institucion_id =  cnf.institucion_id)`,
        alias: 'monis_todes',
        cardinalidad: "n",
        linked: "evaluacion",
        campos: `d.nombre_dpto AS dpto, eg.nombre_corto AS eg,
        i.institucion_id as institucion, i.nombre_institucion AS establecimiento, '' as glosa,
        eval.*`,

        camposView: [{ value: "dpto", text: "Dpto" }, { value: "eg", text: "E.G." }, { value: "establecimiento", text: "Establecimiento" },
        { value: "periodo", text: "Periodo Registro" },
        { value: "evaluador", text: "Responsable" },        
        { value: "editar", text: "Accion" },

        { value: "f_creacion", text: "Creacion" },        
        { value: "concluido", text: " " },
        { value: "revisado", text: " " },
        { value: "glosa", text: "Glosa" }
        ],
        key: ['cnf.file_tipo_id'],
        keySession:{replaceKey:false, campo:'i.institucion_id'}, //null or undefined
        paramDoms:[['eval.periodo',0],['eval.file_tipo_id',1]],
        precondicion: ['cnf.institucion_id =  i.institucion_id', 
            'i.cod_pais =  d.cod_pais' , 'i.cod_dpto =  d.cod_dpto' ,
            'i.institucion_root =  eg.institucion_id',  "cnf.activo='Y'"], //$paramDoms variable
        groupOrder: ` ORDER BY  eval.create_date `,//null string    
        update: [],
        referer: [],
    },
    rprte_abastecimienton:{
        //'$app', '$inst', '$dni', '$usr'
        table: 'upf_registro r, uf_abastecimiento ll, uf_liname l',
        alias: 'rprte_abastecimienton',
        cardinalidad: "n",
        linked: "evaluacion",
        campos: `l.cod_liname, 
                l.medicamento ||' '|| l.concentracion  AS descripcion, 
                l.forma_farmaceutica AS presentacion,
                to_char(ll.fecha_vencimiento,'dd/mm/yyyy') AS fvencimiento, 
    CASE  WHEN (ll.fecha_vencimiento - CURRENT_DATE)<0
                THEN 'Periodo Vigencia CONCLUIDO'
                ELSE 'Restan: '||(ll.fecha_vencimiento - CURRENT_DATE) || ' dias.'
                END AS "vigencia",
    CASE  WHEN (ll.fecha_vencimiento - CURRENT_DATE)>60
                THEN 'Vigente'
                WHEN (ll.fecha_vencimiento - CURRENT_DATE)>0 and (ll.fecha_vencimiento - CURRENT_DATE) <=60
                THEN 'Vencimiento proximo'
                WHEN (ll.fecha_vencimiento - CURRENT_DATE)<0
                THEN 'Vencido'
                ELSE 'N/A' END  AS alertax23,
                
                ll.reg_sanitario, ll.consumo_mensual,
                ll.ingresos, ll.egresos, ll.transferencias, ll.saldo_stock AS stock, 

CASE ll.consumo_mensual WHEN  0 THEN 4
ELSE CASE WHEN (ll.saldo_stock/ll.consumo_mensual)=0 THEN 3 
			 WHEN (ll.saldo_stock/ll.consumo_mensual)>0 AND  (ll.saldo_stock/ll.consumo_mensual)<= 3 THEN 2
			 WHEN (ll.saldo_stock/ll.consumo_mensual)>3 THEN 1
ELSE -1 END 
END AS alertaxs23, 
ARRAY[['success','warning','error', 'purple'],
['Normo Stock: ítems provistos hasta los 12 meses', 'Sub-Stock: ítems  dotados hasta 3 meses', 'Stock cero: ítems sin Saldos', 'Sobre Stock: ítems que sobre pasan los 12 meses']] AS alertaxs23_text,

case ll.consumo_mensual  WHEN 0 THEN 0  else round ((ll.saldo_stock/ll.consumo_mensual)::DECIMAL, 2) END as tmes

        `,

        camposView: [{ value: "cod_liname", text: "CODIGO/ ITEM" },             
            { value: "descripcion", text: "DESCRIPCIÓN DEL MEDICAMENTO/CONCENTRACION" }, 
            { value: "presentacion", text: "PRESENTACION" },
        { value: "alertax23", text: "ESTADO VIGENCIA" }, 
        { value: "vigencia", text: "VIGENCIA" }, { value: "fvencimiento", text: "FECHA VENCIMIENTO" }, 

        { value: "reg_sanitario", text: "REGISTRO SANITARIO" }, 
        {value: "alertaxs23", text: "ESTADO STOCK"},
        { value: "consumo_mensual", text: "CONSUMO MENSUAL"},
        { value: "ingresos", text: "INGRESOS"}, { value: "egresos", text: "EGRESOS"}, { value: "transferencias", text: "TRANSFERENCIAS"}, 
        { value: "stock", text: "SALDOS/STOCK"}, { value: "tmes", text: "TIEMPO EN MESES"}         
        ],
        key: ['r.registro_id'],
        precondicion: ['r.registro_id=ll.registro_id', 'll.cod_liname=l.cod_liname',
            'll.swloadend =  true', '$paramDoms' ],
        groupOrder: ` ORDER BY  l.cod_liname `,//null string    
        paramDoms:[['ll.file_id',0]],
        update: [],
        referer: [],
    },
    rprte_abas_plantillan:{
        table: 'upf_registro r, uf_abastecimiento ll, uf_liname l',
        alias: 'rprte_abas_plantillan',
        cardinalidad: "n",
        linked: "evaluacion",
        campos: `row_number() OVER (ORDER BY l.cod_liname) as nro,
        l.grupo, l.variable, l.subvariable,
                l.medicamento ||' '|| l.concentracion  AS descripcion, 
                l.forma_farmaceutica AS presentacion,
                to_char(ll.fecha_vencimiento,'DD/MM/YYYY') AS fvencimiento, ll.reg_sanitario, 
                '' as consumo_mensual,
                '' as ingresos, '' as egresos, '' as transferencias, '' as stock, saldo_stock as stock_ant
        `,

        camposView: [{ value: "nro", text: "NRO." },
            { value: "grupo", text: "GRUPO" }, { value: "variable", text: "VARIABLE" }, { value: "subvariable", text: "SUBVARIABLE" },
            { value: "descripcion", text: "DESCRIPCIÓN DEL MEDICAMENTO/CONCENTRACION" }, 
            { value: "presentacion", text: "FORMA FARMACÉUTICAS/PRESENTACION" },
        { value: "fvencimiento", text: "FECHA DE VENCIMIENTO" }, 
        { value: "reg_sanitario", text: "REGISTRO SANITARIO" }, { value: "consumo_mensual", text: "CONSUMO MENSUAL"},
        { value: "ingresos", text: "INGRESOS/ENTRADAS"}, { value: "egresos", text: "EGRESOS/SALIDAS"}, { value: "transferencias", text: "TRANSFERENCIAS"}, 
        { value: "stock", text: "STOCK / SALDOS"}, { value: "stock_ant", text: "STOCK ANTERIOR"}
        ],
        key: ['r.file_tipo_id'],
        precondicion: ['r.registro_id=ll.registro_id', 'll.cod_liname=l.cod_liname',
            'll.swloadend =  true', "r.institucion_id='$inst'",
        `r.periodo= to_char(TO_DATE('|pd-0-pd|', 'YYYY-MM-DD') - INTERVAL '1 MONTH', 'YYYY-MM')` ],
        groupOrder: ` ORDER BY  l.cod_liname `,//null string    
        paramDoms:[['ll.file_id',0]],
        update: [],
        referer: [  ],
    },
    rprte_regs301an:{
        //'$app', '$inst', '$dni', '$usr'
        table: 'upf_registro r, e_snis301a ll',
        alias: 'rprte_regs301an',
        cardinalidad: "n",
        linked: "evaluacion",
        campos: `ll.formulario, ll.grupo, ll.variable, ll.lugar_atencion, ll.subvariable, ll.valor`,

        camposView: [
            { value: "formulario", text: "FORMULARIO" }, { value: "grupo", text: "GRUPO" }, 
            { value: "variable", text: "VARIABLE" },
        { value: "lugar_atencion", text: "LUGAR ATENCION" }, { value: "subvariable", text: "SUBVARIABLE" },
        { value: "valor", text: "VALOR"},        
        ],
        key: ['r.registro_id'],
        precondicion: ['r.registro_id=ll.registro_id',
            'll.swloadend =  true', '$paramDoms' ],
        groupOrder: ` ORDER BY  ll.formulario, ll.grupo, ll.variable, ll.lugar_atencion, ll.subvariable `,//null string    
        paramDoms:[['ll.file_id',0]],
        update: [],
        referer: [  ],
    }, 
    rprte_regs301bn:{
        //'$app', '$inst', '$dni', '$usr'
        table: 'upf_registro r, e_snis301b ll',
        alias: 'rprte_regs301bn',
        cardinalidad: "n",
        linked: "evaluacion",
        campos: `ll.formulario, ll.grupo, ll.variable, ll.lugar_atencion, ll.subvariable, ll.valor`,

        camposView: [
            { value: "formulario", text: "FORMULARIO" }, { value: "grupo", text: "GRUPO" }, 
            { value: "variable", text: "VARIABLE" },
        { value: "lugar_atencion", text: "LUGAR ATENCION" }, { value: "subvariable", text: "SUBVARIABLE" },
        { value: "valor", text: "VALOR"},        
        ],
        key: ['r.registro_id'],
        precondicion: ['r.registro_id=ll.registro_id',
            'll.swloadend =  true', '$paramDoms' ],
        groupOrder: ` ORDER BY  ll.formulario, ll.grupo, ll.variable, ll.lugar_atencion, ll.subvariable `,//null string    
        paramDoms:[['ll.file_id',0]],
        update: [],
        referer: [  ],
    }, 
    rprte_regs302an:{
        //'$app', '$inst', '$dni', '$usr'
        table: 'upf_registro r, e_snis302a ll',
        alias: 'rprte_regs302an',
        cardinalidad: "n",
        linked: "evaluacion",
        campos: `ll.formulario, ll.grupo, ll.variable, ll.lugar_atencion, ll.subvariable, ll.valor`,

        camposView: [
            { value: "formulario", text: "FORMULARIO" }, { value: "grupo", text: "GRUPO" }, 
            { value: "variable", text: "VARIABLE" },
        { value: "lugar_atencion", text: "LUGAR ATENCION" }, { value: "subvariable", text: "SUBVARIABLE" },
        { value: "valor", text: "VALOR"},        
        ],
        key: ['r.registro_id'],
        precondicion: ['r.registro_id=ll.registro_id',
            'll.swloadend =  true', '$paramDoms' ],
        groupOrder: ` ORDER BY  ll.formulario, ll.grupo, ll.variable, ll.lugar_atencion, ll.subvariable `,//null string    
        paramDoms:[['ll.file_id',0]],
        update: [],
        referer: [  ],
    },
    rprte_regs302bn:{
        //'$app', '$inst', '$dni', '$usr'
        table: 'upf_registro r, e_snis302b ll',
        alias: 'rprte_regs302bn',
        cardinalidad: "n",
        linked: "evaluacion",
        campos: `ll.formulario, ll.grupo, ll.gvariable, ll.variable, ll.lugar_atencion, ll.subvariable, ll.valor`,

        camposView: [
            { value: "formulario", text: "FORMULARIO" }, { value: "grupo", text: "GRUPO" }, 
            { value: "gvariable", text: "GVARIABLE" }, { value: "variable", text: "VARIABLE" },
        { value: "lugar_atencion", text: "LUGAR ATENCION" }, { value: "subvariable", text: "SUBVARIABLE" },
        { value: "valor", text: "VALOR"},        
        ],
        key: ['r.registro_id'],
        precondicion: ['r.registro_id=ll.registro_id',
            'll.swloadend =  true', '$paramDoms' ],
        groupOrder: ` ORDER BY  ll.formulario, ll.grupo, ll.variable, ll.lugar_atencion, ll.subvariable `,//null string    
        paramDoms:[['ll.file_id',0]],
        update: [],
        referer: [  ],
    },
    rprte_carmelon:{
        //'$app', '$inst', '$dni', '$usr'
        table: 'upf_registro r, e_carmelo ll',
        alias: 'rprte_carmelon',
        cardinalidad: "n",
        linked: "evaluacion",
        campos: `ll.ente_gestor, ll.establecimiento, to_char(ll.fecha_dispensacion, 'DD/MM/YYYY') AS fecha, ll.genero, ll.edad`,

        camposView: [
            { value: "ente_gestor", text: "E.G." }, { value: "establecimiento", text: "ESTABLECIMIENTO" }, 
            { value: "fecha", text: "FECHA DISPENCIACION" }, { value: "genero", text: "SEXO" },
            { value: "edad", text: "EDAD" }        
        ],
        key: ['r.registro_id'],
        precondicion: ['r.registro_id=ll.registro_id',
            'll.swloadend =  true', '$paramDoms' ],
        groupOrder: ` ORDER BY  ll.fecha_dispensacion, ll.genero, ll.edad `,//null string    
        paramDoms:[['ll.file_id',0]],
        update: [],
        referer: [  ],
    },
    rprte_nutri_maman:{
        //'$app', '$inst', '$dni', '$usr'
        table: 'upf_registro r, e_nutri_mama ll',
        alias: 'rprte_nutri_maman',
        cardinalidad: "n",
        linked: "evaluacion",
        campos: `ll.ente_gestor, ll.establecimiento, to_char(ll.fecha_dispensacion, 'DD/MM/YYYY') AS fecha, ll.semana_gestacion, ll.edad`,

        camposView: [
            { value: "ente_gestor", text: "E.G." }, { value: "establecimiento", text: "ESTABLECIMIENTO" }, 
            { value: "fecha", text: "FECHA DISPENCIACION" }, { value: "semana_gestacion", text: "SEMANA GESTACION" },
            { value: "edad", text: "EDAD" }        
        ],
        key: ['r.registro_id'],
        precondicion: ['r.registro_id=ll.registro_id',
            'll.swloadend =  true', '$paramDoms' ],
        groupOrder: ` ORDER BY  ll.fecha_dispensacion, ll.semana_gestacion, ll.edad `,//null string    
        paramDoms:[['ll.file_id',0]],
        update: [],
        referer: [  ],
    },

    /********************para reporte horizonrtal */
    rh_mensualn:{
        table: `ae_institucion i, ae_institucion eg, al_departamento d, upf_file_institucion_cnf cnf
left join (SELECT r.institucion_id AS ints_idx,
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =1 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS ENE,
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =2 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS FEB,
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =3 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS MAR,
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =4 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS ABR,
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =5 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS MAY,
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =6 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS JUN,
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =7 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS JUL,
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =8 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS AGO,
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =9 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS SEP,
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =10 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS OCT,
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =11 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS NOV,
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =12 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS DIC
FROM  upf_registro r
LEFT JOIN u_is_atributo as a1 ON (a1.atributo_id = r.concluido)
WHERE 
substr(r.periodo,1,4)=substr('|pd-0-pd|',1,4) AND r.file_tipo_id='|pd-1-pd|'
GROUP BY 1) as tbl ON (tbl.ints_idx=cnf.institucion_id)`,
        alias: 'rh_mensualn',
        cardinalidad: "n",
        linked: "eess",
        campos: `d.cod_dpto as cdpto, d.nombre_dpto as dpto, eg.nombre_corto as eg, i.nombre_institucion as eess,
tbl.*`,

        camposView: [
        { value: "dpto", text: "Departamento" }, 
        { value: "eg", text: "Ente Gestor" }, 
        { value: "eess", text: "Establecimiento" }

    ],
        key: ['cnf.file_tipo_id'],        
        keySession:{replaceKey:false, campo:'cnf.institucion_id'},
        paramDoms:[['r.periodo',0],['r.file_tipo_id',1]],
        precondicion: ['cnf.institucion_id   = i.institucion_id', 'i.institucion_root =  eg.institucion_id',
            'i.cod_pais =  d.cod_pais',  'i.cod_dpto  =  d.cod_dpto'           
             ],
        groupOrder: ` ORDER BY 1,3,4 `,//null string    
        update: [],
        referer: [ ],

    },
    rh_semanaln:{
        table: `ae_institucion i, ae_institucion eg, al_departamento d, upf_file_institucion_cnf cnf
left join (SELECT r.institucion_id AS ints_idx,
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =1 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s01",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =2 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s02",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =3 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s03",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =4 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s04",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =5 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s05",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =6 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s06",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =7 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s07",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =8 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s08",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =9 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s09",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =10 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s10",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =11 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s11",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =12 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s12",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =13 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s13",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =14 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s14",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =15 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s15",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =16 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s16",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =17 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s17",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =18 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s18",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =19 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s19",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =20 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s20",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =21 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s21",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =22 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s22",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =23 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s23",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =24 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s24",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =25 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s25",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =26 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s26",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =27 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s27",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =28 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s28",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =29 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s29",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =30 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s30",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =31 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s31",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =32 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s32",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =33 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s33",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =34 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s34",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =35 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s35",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =36 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s36",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =37 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s37",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =38 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s38",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =39 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s39",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =40 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s40",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =41 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s41",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =42 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s42",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =43 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s43",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =44 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s44",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =45 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s45",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =46 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s46",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =47 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s47",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =48 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s48",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =49 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s49",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =50 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s50",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =51 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s51",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =52 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s52",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =53 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s53",
string_agg(CASE WHEN substr(r.periodo,6,2)::DECIMAL =54 THEN a1.atributo||'|'||a1.color ELSE null END, '|' ) AS "s54"
FROM  upf_registro r
LEFT JOIN u_is_atributo as a1 ON (a1.atributo_id = r.concluido)
WHERE 
substr(r.periodo,1,4)=substr('|pd-0-pd|',1,4) AND r.file_tipo_id='|pd-1-pd|'
GROUP BY 1) as tbl ON (tbl.ints_idx=cnf.institucion_id)`,
        alias: 'rh_semanaln',
        cardinalidad: "n",
        linked: "eess",
        campos: `d.cod_dpto as cdpto, d.nombre_dpto as dpto, eg.nombre_corto as eg, i.nombre_institucion as eess,
tbl.*`,

        camposView: [
        { value: "dpto", text: "Departamento" }, 
        { value: "eg", text: "Ente Gestor" }, 
        { value: "eess", text: "Establecimiento" }

    ],
        key: ['cnf.file_tipo_id'],
        paramDoms:[['r.periodo',0],['r.file_tipo_id',1]],
        precondicion: ['cnf.institucion_id   = i.institucion_id', 'i.institucion_root =  eg.institucion_id',
            'i.cod_pais =  d.cod_pais',  'i.cod_dpto  =  d.cod_dpto'           
             ],
        groupOrder: ` ORDER BY 1,3,4 `,//null string  ,//null string    
        update: [],
        referer: [ ],

    }
}

const immutableObject = (obj) =>
    typeof obj === 'object' ? Object.values(obj).forEach(immutableObject) || Object.freeze(obj) : obj;

//immutableObject(PARAMETROS)

module.exports = PARAMETROS
