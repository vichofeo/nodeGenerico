/** 
 * SERVICIO DE UTILITARIOS PARA SERVICIOS DE ACREDITACION Y HABILITACION
 * 
 */
const { v4: uuidv4 } = require('uuid');

const QueriesUtils = require('../../models/queries/QueriesUtils')
const { QueryTypes, UUIDV4 } = require("sequelize")

const db = require('../../models/index')
const tk = require('./../utilService')
const srveg = require('./EgService');

//modelos
const sequelize = db.sequelize;
const snisModel = db.s301
const eessModel = db.ae_institucion

//json de configuracion para la construccion de combodenpendencias
const COMBOS = {}
//combos acreditacion
COMBOS.acrehab = {
    campos_db: [['eg.institucion_id', 'eg.nombre_corto'], 
                ['dpto.cod_dpto','dpto.nombre_dpto'],
                ['ente.institucion_id', 'ente.nombre_institucion']],
    labels: ['Ente Gestor', 'Departamento', 'Establecimeinto'],
    name_cbo: ['eg', 'dpto' ,'eess'],
    default_cbo: [false, false, false, true, false, false],
    pre_query: `FROM  r_institucion_salud isld, ae_institucion ente, ae_institucion eg,
    r_is_atributo n, al_departamento dpto
    WHERE 
     isld.institucion_id =  ente.institucion_id
    AND  isld.ente_gestor_id =  eg.institucion_id
    AND n.atributo_id=isld.nivel_atencion
    AND dpto.cod_pais= ente.cod_pais AND dpto.cod_dpto= ente.cod_dpto `
}
//para obtener datos de tablaVisual
COMBOS.repo_acrehab = {
    campos_db: [['eg.institucion_id', 'eg.nombre_corto'], 
                ['dpto.cod_dpto','dpto.nombre_dpto'],
                ['ente.institucion_id', 'ente.nombre_institucion'],
                ['ah.tipo_registro', 'ah.tipo_registro']],
    labels: ['Ente Gestor', 'Departamento', 'Establecimiento', 'Tipo'],
    name_cbo: ['eg', 'dpto' ,'eess', 'tipo'],
    default_cbo: [true, true, true, true, true, false],
    pre_query: `FROM r_institucion_salud_acrehab ah, r_institucion_salud isld, ae_institucion ente, ae_institucion eg,
    r_is_atributo n, al_departamento dpto,  r_is_atributo a2, r_is_atributo a3
    WHERE ah.institucion_id =  isld.institucion_id
    AND isld.institucion_id =  ente.institucion_id
    AND  isld.ente_gestor_id =  eg.institucion_id
    AND n.atributo_id=isld.nivel_atencion
    AND dpto.cod_pais= ente.cod_pais AND dpto.cod_dpto= ente.cod_dpto 
    AND a2.atributo_id=ah.estado_acrehab AND a3.atributo_id=ah.activo `
}

//esta funcion es su gemelo de report.... comentario: debo de volverlo objeto
function convertCampoValueText(campo = Array) {
    return ` ${campo[0]} as value, ${campo[1]} as text `
}
//esta funcion es su gemelo de report.... comentario: debo de volverlo objeto
function convertCampoGroupBy(campo) {
    return ` ${campo[0]}, ${campo[1]} `
}
//esta funcion es su gemelo de report.... comentario: debo de volverlo objeto
function buscaOpDefaultCbox(vectordatos, objSearch) {    
    let i = 0
    for (const ii in vectordatos) {
        if (vectordatos[ii].value == objSearch?.value) {
            i = ii
            break
        }
    }
    return i
}

/**
 * funcion interna construye datos para los combos dependientes en forma {items, selecteds}
 * @param {selected:[{value:String, text:String}], idx:id_dpto, token:String, model:String} dto 
 * @returns {cboxData:[{items,selected, label}], where:String, pre_query:String}
 * @vichofeo
 */
const baseDataForCbx = async (dto) => {
    try {
        let selected_cbos = dto?.selected ? dto.selected : []
        const idx = dto.idx //cod de dpto seleccionado por menu principal
        const model = dto.model

        //obtiene los identificadores de eess validos para los comboBox segun logueo
        const datos = tk.getCnfApp(dto.token)
        const inst = new QueriesUtils(eessModel)        
        let eess = await inst.findID(datos.inst)
        //busca padre de institucion es es_unidad
        console.log("\n\n aki en medio ENTRO ESTO \n\n", eess)
        eess =  await srveg._buscaPadreUnidad(eess)

        console.log("\n\n SALIDA ES \n\n", eess)

        const combox =  COMBOS[model]
//obtiene indentificadores de las instituciones segun session
        const result = await srveg.getDataTreeEntidades(idx, eess.tipo_institucion_id, eess.institucion_root, eess.institucion_id)
        let ids =  result.map(obj=>obj.idx)
        ids =  ` AND  isld.institucion_id  IN ('${ids.join("','")}')`

        const pre_query = ` 
        ${COMBOS[model].pre_query} ${ids} 
        `

        //parametros iniciales de los combos
        const initial = { value: '-1', text: '-Todos-' }
        const sd= { value: '-999'  , text: '-Sin Dato-' }
        

        const selects = combox.campos_db
        let wheres =  ""
        const cboxData = {}
        
        console.log("00000000000000000000000000IINICIA00000000000000000000000", selects)

        //recorres json de configuracion para obtencion de items para los combos en forma secuencial
        for (let control = 0; control < selects.length; control++) {
            //index: 0
            console.log(control, '*************************: ',control)            
            let campos = convertCampoValueText(selects[control])
            let group =  convertCampoGroupBy(selects[control])           


            const query =  `SELECT ${campos} ${pre_query}  ${wheres} GROUP BY ${group} ORDER BY ${combox.name_cbo[control] =='gestion' ? ' 2 DESC' : '2' }`
            const aux =  inst.modifyResultToArray(await sequelize.query(query, { mapToModel: true, type: QueryTypes.SELECT, raw: false, }))
        
                        //agrena opcion inicial solo si procede
            if(combox.default_cbo[control] && aux.length>0)
            aux.unshift(initial)

            if(aux.length<=0) aux.unshift(sd)

            //comprueba opcion seleccionada
            //selected_cbos[control] ? 
            const indexResult =  buscaOpDefaultCbox(aux, selected_cbos[control])
            selected_cbos[control] =  aux[indexResult]
            //wheres
            if(selected_cbos  && selected_cbos[control] && selected_cbos[control].value != '-1')
            wheres =  ` ${wheres} AND ${selects[control][0]}='${selected_cbos[control].value}' `
        
            cboxData[combox.name_cbo[control]] = {items: aux, selected: selected_cbos[control], label: combox.labels[control]}
        }
        
        return {
            ok: true,
            cboxData: cboxData,  
            //ids: ids.join("','"),
            wheres: wheres,
            pre_query: pre_query,
            //dx: results,
            message: 'Resultado exitoso. Parametros obtenidos'
        }
    } catch (e) {
        console.log(e);
        return {
            ok: false,
            message: "Error de sistema: CBOXGETPARAMSRV",
            error: e.message
        }
    }
}
/**
 * funcion servicio para obtener los datos de tabla acreditacion/habilitacion con alertas: Vigente, vencimiento proximo, vencido
 * @param {selected:[{value:String, text:String}], idx:id_dpto, token:String, model:String} dto 
 * @returns {data: [{resultDataTable}], label:[{value, text}], cbox:[{datos comboBox}]}
 * @vichofeo
 */
const repoAcreHab = async (dto)=>{
try {
    const results =  await baseDataForCbx(dto)

    const query =  `SELECT eg.nombre_corto, dpto.nombre_dpto, ente.nombre_institucion, 
    n.atributo AS nivel, 
    ah.eess_nombre, 
    a2.atributo AS estado, 
    ah.gestion_registro, ah.nro_ra, ah.fecha_ra, ah.vigencia_anios, 
    ( ah.fecha_ra + (ah.vigencia_anios * '1 year'::INTERVAL))::date AS fecha_vencimiento,    
    CASE  WHEN (( ah.fecha_ra + (ah.vigencia_anios * '1 year'::INTERVAL))::DATE - NOW()::DATE)<0
        THEN 'Periodo Vigencia CONCLUIDO' 
        ELSE 'Restan: '||(( ah.fecha_ra + (ah.vigencia_anios * '1 year'::INTERVAL))::DATE - NOW()::DATE) || ' dias.'
        END AS "vigencia", 
        CASE  WHEN (( ah.fecha_ra + (ah.vigencia_anios * '1 year'::INTERVAL))::DATE - NOW()::DATE)>60 
        THEN 'Vigente' 
        WHEN (( ah.fecha_ra + (ah.vigencia_anios * '1 year'::INTERVAL))::DATE - NOW()::DATE)>0 and (( ah.fecha_ra + (ah.vigencia_anios * '1 year'::INTERVAL))::DATE - NOW()::DATE) <=60  
        THEN 'Vencimiento proximo' 
        WHEN (( ah.fecha_ra + (ah.vigencia_anios * '1 year'::INTERVAL))::DATE - NOW()::DATE)<0
        THEN 'Vencido' 
        ELSE 'N/A' END  AS alertax23,
    ah.puntaje, ah.tipo_registro, 
    a3.atributo AS estado_activo 
    ${results.pre_query} ${results.wheres} ORDER BY 1,2,3`    
    const aux =  await sequelize.query(query, { mapToModel: true, type: QueryTypes.SELECT, raw: false, })

    const labels = [
        {value: 'nombre_corto', text: 'Ente Gestor'}, 
        {value: 'nombre_dpto', text:'Dpto'}, 
        {value: 'nombre_institucion', text:'Establecimiento'}, 
        {value: 'nivel', text: 'Nivel'}, 
        {value: 'eess_nombre', text:'Nombre Registrado'}, 
        {value: 'estado', text:'Estado' }, 
        {value: 'gestion_registro', text:'Gestion Registro'}, 
        {value: 'nro_ra', text: "Nro. R.A."}, 
        {value: 'fecha_ra', text: 'Fecha de Resolucion'}, 
        {value: 'vigencia_anios', text:'Vigencia (Años)'}, 
        {value: 'fecha_vencimiento', text:'Fecha de Vencimiento'}, 
        {value: 'vigencia', text:'Vigencia'}, 
        {value: 'alertax23', text:'Estado de Vigencia'}, 

        {value: 'puntaje', text: 'Puntaje'}, 
        {value: 'tipo_registro', text:'Tipo'}, 
        {value: 'estado_activo', text: 'Activo' }
    ]
    return {
        ok: true,
        data: aux,          
        labels: labels,
        cboxs: results.cboxData, 
        //dx: results,
        message: 'Resultado exitoso. Parametros obtenidos'
    }
} catch (e) {
    console.log(e);
    return {
        ok: false,
        message: "Error de sistema: CBOXGETPARAMSRV",
        error: e.message
    }
} 
}
/**
 * Funcion servicio que obtiene informacion de combos segun parametos json COMBOS
 * @param {*} dto 
 * @returns {cboxData:[{items,selected, label}]}
 */
const getDataForCbx = async (dto) =>{
    try {
        const results =  await baseDataForCbx(dto)
        return {
            ok: true,
            data: results.cboxData,                                              
            message: 'Resultado exitoso. Parametros obtenidos'
        }
    } catch (e) {
        console.log(e);
        return {
            ok: false,
            message: "Error de sistema: CBOXGETPARAMSRV",
            error: e.message
        }
    };
    
}
module.exports = {
    getDataForCbx, repoAcreHab
}


