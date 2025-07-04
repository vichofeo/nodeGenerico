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
        table: 'ae_institucion i, al_departamento d, ae_institucion eg, au_persona p, upf_file_institucion_cnf cnf, upf_registro eval ',
        alias: 'registradosn',
        cardinalidad: "n",
        linked: "evaluacion",
        campos: `eval.registro_id as idx, 'evaluacion' as linked,

        d.nombre_dpto, eg.nombre_corto, i.nombre_institucion,
        p.primer_apellido AS evaluador,

         eval.periodo,
        
        eval.concluido AS concluido_estado, eval.revisado as revision_estado,
        eval.activo,

        CASE WHEN strpos(eval.dni_register,'$dni')>0 AND eval.institucion_id ='$inst' THEN false ELSE true END AS ver,
        TO_CHAR(eval.create_date, 'dd/mm/yyyy') as creacion, 0 as hab_conclusion, 0 as hab_revision,
CASE 
WHEN (eval.concluido::DECIMAL<7 AND (CURRENT_DATE <= eval.fecha_climite )) THEN  atr1.atributo       
WHEN (eval.concluido::DECIMAL<7 AND (CURRENT_DATE <= eval.flimite_plus AND eval.ctype_plus <> 'c0' )) THEN  atr1.atributo ||'\n'|| atr3.atributo     

WHEN (eval.concluido::DECIMAL<7 AND (CURRENT_DATE > eval.fecha_climite AND CURRENT_DATE <= eval.flimite_plus AND eval.ctype_plus = 'c0')) THEN 'El formulario esta llenado de manera incompleta y no se entregó aun'
WHEN (eval.concluido::DECIMAL<7 AND CURRENT_DATE>  eval.flimite_plus) THEN 'El formulario esta llenado de manera incompleta y no se entregó aun. <span class="red--text">En demora indefinida.</span>'

WHEN (eval.revisado::DECIMAL=8 AND (CURRENT_DATE<= eval.fecha_rlimite OR(CURRENT_DATE <= eval.frevisado_plus AND eval.rtype_plus <>'r0'))) THEN 'Formulario debidamente llenado para revision departamental.'
WHEN (eval.revisado::DECIMAL=8 AND (CURRENT_DATE> eval.fecha_rlimite AND  CURRENT_DATE <= eval.frevisado_plus AND eval.rtype_plus = 'r0')) THEN 'Formulario debidamente llenado con demora en la verificacion.'
WHEN (eval.revisado::DECIMAL=8 AND CURRENT_DATE> eval.frevisado_plus ) THEN 'Formulario debidamente llenado. <span class="red--text">En demora indefinida.</span>'

WHEN (eval.concluido::DECIMAL=7 AND eval.revisado::DECIMAL=15) THEN '<span class="teal--text">El formulario esta llenado de forma completa. El consolidado departamental se ha enviado/entregado satisfactoriamente  </span>'
|| CASE WHEN eval.ctype_plus<> 'c0' THEN '\n Obs.: '||atr3.atributo ELSE '' END
|| CASE WHEN eval.rtype_plus<> 'r0' THEN '\n Obs.: '||atr4.atributo ELSE '' END
ELSE case when eval.concluido::DECIMAL<7 then '' else 
'<span class="error">!!Estado de registro no Declarado.</span>' end
END AS glosa        
        `,

        camposView: [{ value: "nombre_dpto", text: "Dpto" }, { value: "nombre_corto", text: "E.G." }, { value: "nombre_institucion", text: "Establecimiento" },
        { value: "periodo", text: "Periodo Registro" },
        { value: "evaluador", text: "Responsable" },        
        { value: "ver", text: "Accion" },

        { value: "creacion", text: "Creacion" },
        //{value:'creador', text:'Creado Por'},
        { value: "conclusion", text: " " },
        { value: "revisado", text: " " },
        { value: "glosa", text: "Glosa" },

        ],
        key: ['cnf.file_tipo_id'],
        precondicion: [
             'eval.dni_register =  p.dni_persona',
            'cnf.institucion_id =  eval.institucion_id ', 'cnf.file_tipo_id=eval.file_tipo_id ',
            'cnf.institucion_id =  i.institucion_id',
            ' i.cod_pais= d.cod_pais', 'i.cod_dpto=d.cod_dpto',
            'i.institucion_root =  eg.institucion_id',
            "eval.institucion_id='$inst'"],
        groupOrder: ` ORDER BY  eval.create_date desc `,//null string    
        update: [],
        referer: [ 
            {ref: 'u_is_atributo as atr1', campos: 'atr1.atributo as conclusion, atr1.color as conclusion_color', camporef: 'atr1.atributo_id', camporefForeign: 'eval.concluido'},
            {ref: 'u_is_atributo as atr2', campos: 'atr2.atributo as revisado, atr2.color as revisado_color', camporef: 'atr2.atributo_id', camporefForeign: 'eval.revisado'},
            {ref: 'u_is_atributo as atr3', campos: 'atr3.atributo as cglosa', camporef: 'atr3.atributo_id', camporefForeign: 'eval.ctype_plus'},
            {ref: 'u_is_atributo as atr4', campos: 'atr4.atributo as rglosa', camporef: 'atr4.atributo_id', camporefForeign: 'eval.rtype_plus'}
        ],
    },
    registrados_todes: {
        //'$app', '$inst', '$dni', '$usr'
        table: `ae_institucion i, al_departamento d, ae_institucion eg, 
        
        upf_file_institucion_cnf cnf
                    LEFT JOIN (SELECT eval.registro_id as idx, eval.file_tipo_id, tf.sw_semana,
                eval.institucion_id,  eval.periodo,
                p.primer_apellido AS evaluador, 
                eval.concluido, eval.activo,
                CASE WHEN strpos(eval.dni_register,'$dni')>0 THEN false ELSE true END AS ver,
                TO_CHAR(eval.create_date, 'dd/mm/yyyy') as creacion, 
                eval.concluido AS concluido_estado, eval.revisado as revision_estado,
                atr1.atributo as conclusion, atr1.color AS conclusion_color,
                atr2.atributo as revisado, atr2.color AS revisado_color,
                eval.create_date, 

        (eval.concluido::DECIMAL<7 AND (CURRENT_DATE > eval.fecha_climite AND CURRENT_DATE <= eval.flimite_plus AND eval.ctype_plus = 'c0')) AS cdemora,
        (eval.revisado::DECIMAL=8 AND (CURRENT_DATE<= eval.fecha_rlimite OR(CURRENT_DATE <= eval.frevisado_plus AND eval.rtype_plus <>'r0'))) as prevision,
        (eval.revisado::DECIMAL=8 AND (CURRENT_DATE> eval.fecha_rlimite AND  CURRENT_DATE <= eval.frevisado_plus AND eval.rtype_plus = 'r0')) as hab_revision,
  
        CASE
WHEN (eval.concluido::DECIMAL<7 AND (CURRENT_DATE <= eval.fecha_climite )) THEN  atr1.atributo       
WHEN (eval.concluido::DECIMAL<7 AND (CURRENT_DATE <= eval.flimite_plus AND eval.ctype_plus <> 'c0' )) THEN  atr1.atributo ||'\n'|| atr3.atributo     

WHEN (eval.concluido::DECIMAL<7 AND (CURRENT_DATE > eval.fecha_climite AND CURRENT_DATE <= eval.flimite_plus AND eval.ctype_plus = 'c0')) THEN 'El formulario esta llenado de manera incompleta y no se entregó aun.'
WHEN (eval.concluido::DECIMAL<7 AND CURRENT_DATE>  eval.flimite_plus) THEN 'El formulario esta llenado de manera incompleta y no se entregó aun. <span class="red--text">En demora indefinida.</span>'

WHEN (eval.revisado::DECIMAL=8 AND (CURRENT_DATE<= eval.fecha_rlimite OR(CURRENT_DATE <= eval.frevisado_plus AND eval.rtype_plus <>'r0'))) THEN 'El formulario esta llenado de forma completa, para revision departamental.' ||'\n'|| atr3.atributo
WHEN (eval.revisado::DECIMAL=8 AND (CURRENT_DATE> eval.fecha_rlimite AND  CURRENT_DATE <= eval.frevisado_plus AND eval.rtype_plus = 'r0')) THEN 'El formulario esta llenado de forma completa, con demora en la verificacion.'
WHEN (eval.revisado::DECIMAL=8 AND CURRENT_DATE> eval.frevisado_plus ) THEN 'El formulario debidamente llenado, pero no ha sido verificado por el departamental. <span class="red--text">En demora indefinida.</span>'

WHEN (eval.concluido::DECIMAL=7 AND eval.revisado::DECIMAL=15) THEN '<span class="teal--text">Formulario debidamente llenado y consolidado departamental, se ha enviado/entregado satisfactoriamente .</span>'
|| CASE WHEN eval.ctype_plus<> 'c0' THEN ' Obs.: '||atr3.atributo ELSE '' END
|| CASE WHEN eval.rtype_plus<> 'r0' THEN ' Obs.: '||atr4.atributo ELSE '' END
ELSE '<span class="error">!!Estado de registro no Declarado.</span>'
END AS glosa

                FROM  au_persona p, upf_file_tipo tf, upf_registro eval
                LEFT JOIN u_is_atributo as atr1 ON (atr1.atributo_id = eval.concluido) 
                LEFT JOIN u_is_atributo as atr2 ON (atr2.atributo_id = eval.revisado)
            
                LEFT JOIN u_is_atributo as atr3 ON (atr3.atributo_id = eval.ctype_plus)
                LEFT JOIN u_is_atributo as atr4 ON (atr4.atributo_id = eval.rtype_plus)
                WHERE 
                p.dni_persona =  eval.dni_register and tf.file_tipo_id =  eval.file_tipo_id 
                AND ($paramDoms) ) AS eval 
                ON ( eval.institucion_id =  cnf.institucion_id 
            )` ,
        alias: 'monis_todes',
        cardinalidad: "n",
        linked: "evaluacion",
        campos: `eval.idx, 'evaluacion' as linked,

        d.nombre_dpto, eg.nombre_corto, 
        i.institucion_id as institucion, i.nombre_institucion,
        
         
        eval.evaluador, eval.periodo, 
        eval.concluido, eval.activo,
        eval.ver,

        eval.creacion, 
        eval.concluido_estado, eval.revision_estado,
(eval.prevision AND (SELECT COUNT(*) FROM ae_institucion i3 WHERE i3.parent_grp_id= '$inst' AND i3.tipo_institucion_id= 'EESS')>0 ) AS prevision,
        eval.conclusion, eval.conclusion_color , 
        eval.revisado, eval.revisado_color, '|pd-0-pd|' as prdo, 
CASE
  WHEN  (( COALESCE(eval.idx,'-1')!='-1' AND  not eval.sw_semana) AND  $primal AND eval.ver IS NULL AND ((CURRENT_DATE <= to_date('|pd-0-pd|','YYYY-MM') + CAST(cnf.limite_plus-1 ||'days' AS INTERVAL)+ INTERVAL '1 month')) ) AND 
        (SELECT i2.es_unidad AND i2.tipo_institucion_id='ASUSS' AND i2.parent_grp_id IS NULL AND i2.root IS NULL 
        FROM ae_institucion i2
        WHERE i2.institucion_id='$inst') 
    THEN 1
WHEN  (( COALESCE(eval.idx,'-1')!='-1' AND  eval.sw_semana) AND $primal AND eval.ver IS NULL AND ((CURRENT_DATE <= to_date('|pd-0-pd|','IYYY-IW') +  INTERVAL '1 WEEK' + INTERVAL '1 day')) ) AND 
        (SELECT i2.es_unidad AND i2.tipo_institucion_id='ASUSS' AND i2.parent_grp_id IS NULL AND i2.root IS NULL 
        FROM ae_institucion i2
        WHERE i2.institucion_id='$inst') 
    THEN 1
 WHEN eval.cdemora AND (SELECT i2.es_unidad AND i2.tipo_institucion_id='ASUSS' AND i2.parent_grp_id IS NULL AND i2.root IS NULL FROM ae_institucion i2 WHERE i2.institucion_id='$inst') 
 THEN 2  
 ELSE 0 END AS hab_conclusion, 

 CASE WHEN $primal AND hab_revision AND (SELECT COUNT(*) FROM ae_institucion i2 WHERE i2.institucion_id='$inst' AND i2.es_unidad AND i2.tipo_institucion_id='ASUSS' AND i2.parent_grp_id IS NULL AND i2.root IS NULL) >0
THEN 1 ELSE 0 END  AS hab_revision, eval.glosa, cnf.opening_delay as delay
        `,

        camposView: [{ value: "nombre_dpto", text: "Dpto" }, { value: "nombre_corto", text: "E.G." }, { value: "nombre_institucion", text: "Establecimiento" },
        { value: "periodo", text: "Periodo Registro" },
        { value: "evaluador", text: "Evaluador" },
        
        { value: "ver", text: "Accion" },
        { value: "creacion", text: "Creacion" },        
        { value: "conclusion", text: " " },
        { value: "revisado", text: " " },
        { value: "glosa", text: "Glosa" },

        ],
        key: ['cnf.file_tipo_id'],
        keySession:{replaceKey:false, campo:'i.institucion_id'}, //null or undefined
        paramDoms:[['eval.periodo',0],['eval.file_tipo_id',1]],
        precondicion: [
             'cnf.institucion_id =  i.institucion_id',            
            'i.cod_pais =  d.cod_pais ', ' i.cod_dpto =  d.cod_dpto',
            'i.institucion_root =  eg.institucion_id'], //$paramDoms variable
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
        campos: `l.grupo, l.variable, l.subvariable,
                l.medicamento ||' '|| l.concentracion  AS descripcion, 
                l.forma_farmaceutica AS presentacion,
                to_char(ll.fecha_vencimiento,'dd/mm/yyyy') AS fvencimiento, ll.reg_sanitario, 
                '' as consumo_mensual,
                '' as ingresos, '' as egresos, '' as transferencias, '' as stock, saldo_stock as stock_ant
        `,

        camposView: [
            { value: "grupo", text: "GRUPO" }, { value: "variable", text: "VARIABLE" }, { value: "subvariable", text: "SUBVARIABLE" },
            { value: "descripcion", text: "DESCRIPCIÓN DEL MEDICAMENTO/CONCENTRACION" }, 
            { value: "presentacion", text: "PRESENTACION" },
        { value: "fvencimiento", text: "FECHA VENCIMIENTO" }, { value: "reg_sanitario", text: "REGISTRO SANITARIO" }, { value: "consumo_mensual", text: "CONSUMO MENSUAL"},
        { value: "ingresos", text: "INGRESOS"}, { value: "egresos", text: "EGRESOS"}, { value: "transferencias", text: "TRANSFERENCIAS"}, 
        { value: "stock", text: "SALDOS/STOCK"}, { value: "stock_ant", text: "STOCK ANTERIOR"}
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
    }
}

const immutableObject = (obj) =>
    typeof obj === 'object' ? Object.values(obj).forEach(immutableObject) || Object.freeze(obj) : obj;

//immutableObject(PARAMETROS)

module.exports = PARAMETROS
