/**
 * Servicios para opciones de ente gestor para mapas, establecimiento de salud
 * 1. requiere cargar lo modelos
 * 2. algunos servicios requiren de parametros ubicados en el config
 * 3. requiere de un utilitario para realizar la interaccion con datos de los modelos
 * @vichofeo
 */
const { v4: uuidv4 } = require('uuid');

const QueriesUtils = require('../../models/queries/QueriesUtils')
const { QueryTypes, UUIDV4 } = require("sequelize")

const db = require('../../models/index')
const tk = require('./../utilService')

//para realizar consultas textuales
const sequelize = db.sequelize;


//varibles Json de configuracion
//por temas de mutabilidad propias del javascript se realiza esta rutina
const AUXILIAR = JSON.stringify(require('../../config/parameters'))
const PARAMETROS = JSON.parse(AUXILIAR)
const original = JSON.parse(AUXILIAR)
const { AGRUPADO } = require('../../config/agrupado')

//modelos
const eessModel = db.ae_institucion
const dptoModel = db.al_departamento

const credencialModel = db.apu_credencial
const ins_perModel = db.aep_institucion_personal
const app_instModel = db.ape_aplicacion_institucion

/**
 * obsjeto dbmodel, contiene los modelos para ser relacionados con PARAMETROS
 */
const dbmodel = {}
dbmodel.institucion = db.ae_institucion
dbmodel.eess = db.r_institucion_salud
dbmodel.propietario = dbmodel.eess
dbmodel.responsable = db.r_institucion_salud_responsable
dbmodel.infraestructura = db.r_institucion_salud_infraestructura
dbmodel.mobiliario = db.r_institucion_salud_mobiliario
dbmodel.equipamiento = db.r_institucion_salud_mobiliario
dbmodel.personal_is = db.r_institucion_salud_personal
dbmodel.servicios_basicos = dbmodel.eess
dbmodel.atencion = dbmodel.eess
dbmodel.superficie = dbmodel.eess
dbmodel.estructura = dbmodel.eess

dbmodel.acreditacion = db.r_institucion_salud_acrehab
dbmodel.habilitacion = db.r_institucion_salud_acrehab

dbmodel.personal = db.au_persona

dbmodel.infraestructuran = db.r_institucion_salud_infraestructura
dbmodel.atributos = db.r_is_atributo

dbmodel.localidad =  db.al_municipio
dbmodel.departamento = dptoModel

//modelo de rues3
dbmodel.r3estuctura =  db.r_institucion_salud_estructura
dbmodel.r3areas =  db.r_institucion_salud_areas
dbmodel.r3mobiliario =  db.r_institucion_salud_areas_mobequi
dbmodel.r3equipamiento =  db.r_institucion_salud_areas_mobequi


const verifyOptionsInsertByModel = async (nameKey, obj, modelParam, modelDb) => {
    try {
        let results = null
        switch (modelParam) {
            case 'personal':
                //busca persona
                console.log("********************* PREVIO", obj)
                obj[nameKey] = obj.dni
                if (obj.hasOwnProperty('dni_complemento') && obj.dni_complemento)
                    obj[nameKey] += '-' + obj.dni_complemento
                console.log("============================DESPUES", obj)
                results = modelDb.findID(obj[nameKey])
                if (!(results && results[nameKey])) {
                    //inserta dato            
                    await modelDb.create(obj)
                }
                break;
            default:
                //inserta datos
                obj[nameKey] = uuidv4()
                await modelDb.create(obj)
                break;
        }
        return obj
    } catch (error) {
        console.log(error);
    };

}

/**
 * servicio recursivo para obtener listado de establecimientos de salud en forma de arbol
 * 
 * @param String tipo(ASUSS, EG, EESS)  
 * @param String node: identificador padre para recorrer dato en arbol
 * @param Integer branches ; variable interna no obligatoria en la llamada principal
 * @param ArrAy resultado : array acumulativo para devolver resultado
 * @returns [{name: "nodo", children:[{name: "nodo"}]}]
 * @vichofeo
 */
const display_full_tree = async (tipo, node = '-1', branches = 0, resultado = []) => {

    let condicion = (tipo == 'EG') ? `i.institucion_root = '${node}'` : `i.parent_grp_id = '${node}'`


    let qs = `SELECT d.cod_dpto, d.nombre_dpto, d.latitud, d.longitud,
    i.institucion_id, i.nombre_institucion as "name", i.nombre_corto, 
    i.parent_grp_id, i.institucion_root, i.tipo_institucion_id, 
    p.nombre_institucion as padre, p.nombre_corto as padre_corto, p.tipo_institucion_id as ptype, p.cod_dpto as pdpto,
    eg.nombre_institucion as eg, eg.nombre_corto as eg_corto, eg.tipo_institucion_id as egtype, eg.cod_dpto as egdpto
    FROM ae_institucion i
    LEFT JOIN  al_departamento d ON (d.cod_pais = i.cod_pais AND d.cod_dpto=i.cod_dpto)
    LEFT JOIN  ae_institucion p ON (p.institucion_id=i.parent_grp_id)
    LEFT JOIN  ae_institucion eg ON (eg.institucion_id=i.institucion_root)
    WHERE ${condicion}
    ORDER BY i.tipo_institucion_id, i.parent_grp_id        
    `;

    const rc = await sequelize.query(qs, { mapToModel: true, type: QueryTypes.SELECT, raw: false, });

    // conteo de ramas
    if (branches == 0) { branches = 1 }
    // recorre resulst
    let sweess = 0

    const dpto = {}
    for (const key in rc) {
        const ar = rc[key]
        ar.branch = key//branches
        //ar.children = []

        const link_node = ar.institucion_id
        const parent = ar.parent_grp_id
        const tipo_institucion = ar.tipo_institucion_id

        if (tipo_institucion == "EESS") {
            sweess = 1

            //if(!Object.is(dpto[ar.cod_dpto], dpto[ar.cod_dpto])) dpto[ar.cod_dpto]={}
            //if(!Object.is(dpto[ar.cod_dpto][ar.name], dpto[ar.cod_dpto][ar.name])) dpto[ar.cod_dpto][ar.name]=[]            
            dpto[ar.cod_dpto] = { ...dpto[ar.cod_dpto], name: ar.nombre_dpto, cod_dpto: ar.cod_dpto, type: 'dpto', idx: ar.cod_dpto, lat: ar.latitud, lng: ar.longitud }
            dpto[ar.cod_dpto][ar.eg_corto] = { ...dpto[ar.cod_dpto][ar.eg_corto], name: ar.eg_corto, nombre_corto: ar.eg_corto, nombre_institucion: ar.eg, idx: ar.institucion_root, parent: ar.parent_grp_id, add: true, type: ar.egtype }
            dpto[ar.cod_dpto][ar.eg_corto][ar.name] = {
                name: ar.name, nombre_corto: ar.nombre_corto, nombre_institucion: ar.name,
                idx: ar.institucion_id,
                type: ar.tipo_institucion_id,
                eg: ar.eg_corto,
                dpto: ar.nombre_dpto,
                cod_dpto: ar.cod_dpto
            }

            !dpto[ar.cod_dpto].children ? dpto[ar.cod_dpto].children = [ar.eg_corto] : dpto[ar.cod_dpto].children.push(ar.eg_corto)
            !dpto[ar.cod_dpto][ar.eg_corto].children ? dpto[ar.cod_dpto][ar.eg_corto].children = [ar.name] : dpto[ar.cod_dpto][ar.eg_corto].children.push(ar.name)
        }



        // recorre consulta
        if (tipo_institucion != "EESS") {
            sweess = 0
            resultado.push({ id: `${branches}-${tipo_institucion}-${key}-${link_node}`, name: ar.name, nombre_corto: ar.nombre_corto, nombre_institucion: ar.name, idx: ar.institucion_id, type: ar.ptype })
            branches++;
            resultado[resultado.length - 1].children = []
            await display_full_tree(tipo, link_node, branches, resultado[resultado.length - 1].children)
            //branches = branches - 1
        }
    }//fin recorrido de resultados de query
    if (sweess == 1) {
        //pasa los valores
        let indice = 9000
        const temp = Object.values(dpto)
        for (const dpto of temp) {
            indice++

            //filtrado elementos unicos para dpto
            let result = dpto.children.filter((item, index) => {
                return dpto.children.indexOf(item) === index;
            })
            dpto.children = [] //`${branches}-${tipo_institucion}-${link_node}`
            dpto.id = `${indice}-${dpto.type}-${dpto.idx}`
            console.log("################## DPTO INDEX:", dpto.id)
            for (const eg of result) {
                indice++
                //filtrado elementos EG
                let reess = dpto[eg].children.filter((item, index) => {
                    return dpto[eg].children.indexOf(item) === index;
                })
                dpto[eg].children = []
                dpto[eg].id = `${indice}-${branches}-${dpto[eg].type}-${dpto[eg].idx}`
                dpto[eg].egdpto = dpto.cod_dpto
                dpto[eg].lat = dpto.lat
                dpto[eg].lng = dpto.lng
                console.log("$$$$$$$$$$$$$$$$$ EG INDEX:", dpto[eg].id)
                for (const eess of reess) {
                    indice++
                    dpto[eg][eess].id = dpto[eg][eess].idx//`${indice}-${dpto[eg][eess].type}-${dpto[eg][eess].idx}`
                    console.log("%%%%%%%%%%%%%%%%%% EESS INDEX:", dpto[eg][eess].id)
                    dpto[eg].children.push(dpto[eg][eess])
                    delete dpto[eg][eess]
                }

                dpto.children.push(dpto[eg])
                delete dpto[eg]

            }
            resultado.push(dpto)

        }

    }
    //console.log("###############################################", resultado.length)

    return resultado
}
/**
 * Servicio que obtiene dato de los establecimientos de salud por usuario autentificado
 * @param String dpto: <all,cod_dpto> codigo del departamento; all flag acordado para mostrar todos los dptos
 * @param String tipo: ASUSS, EG, EESS
 * @param String root: si es igual a -1 es el dato raiz del grupo de establecimientos por usuario autentificado
 * @param String parent_id: nodo padre para el grupo de datos ASUSS + regionales
 * @param Array resultado : [{}] array de objetos para contener datos de consultas antes de ser retornados 
 * @returns Array de objetos con datos de los establecimientos de salud 
 */
const getDataTreeEntidades = async (dpto = 'all', tipo = 'ASUSS', root, parent_id = '-1', resultado = []) => {

    let query = ''
    if (dpto !== 'all')
        query = ` AND ins.cod_dpto= '${dpto}'`

    if (tipo == "ASUSS" && root == '-1')
        query = ` AND root='${parent_id}' ${query} `
    else if (tipo == "ASUSS")
        query = ` AND ins.parent_grp_id='${parent_id}' ${query} `
    else if (tipo == "EG") query = ` AND ins.institucion_root='${parent_id}' ${query} `
    else query = ` AND ins.institucion_id='${parent_id}' ${query} `
 
    query = `SELECT ins.institucion_id as idx,
    ins.nombre_institucion, ins.telefono, ins.direccion_web, dpto.nombre_dpto,
    ins.latitud, ins.longitud, ins.avenida_calle, ins.zona_barrio,
    ins.tipo_institucion_id,
    es.nivel_atencion||es.snis as nivel_atencion, 
    es.urbano_rural, cl.atributo as clase,
    es.nivel 
    FROM  al_departamento dpto,  ae_institucion ins
    LEFT JOIN (
	 SELECT es.institucion_id , es.nivel_atencion, es.urbano_rural, es.clase,  
     aa.atributo||CASE es.snis WHEN 'N' THEN ' s/cr' ELSE '' END AS nivel, es.snis
	 FROM r_is_atributo aa, r_institucion_salud es
	 WHERE es.nivel_atencion = aa.atributo_id
	 ) AS es ON ins.institucion_id = es.institucion_id  
     LEFT JOIN r_is_atributo cl ON (es.clase=cl.atributo_id AND cl.grupo_atributo='CLASE')
    WHERE
    ins.cod_dpto = dpto.cod_dpto AND ins.cod_pais = dpto.cod_pais         
    ${query}
    order by es.nivel`

    const result = await sequelize.query(query, { mapToModel: true, type: QueryTypes.SELECT, raw: false, });

    if (result.length > 0) {
        for (const i in result) {
            //console.log(result[i].tipo_institucion_id,'**********', i)
            if (result[i].tipo_institucion_id == 'EESS')
                resultado.push(result[i])
            if (tipo != 'EESS')
                await getDataTreeEntidades(dpto, tipo, root, result[i].idx, resultado);
        }
        return resultado
    } else return resultado

}

/**
 * servicio que obtiene datos de establecimientos de salud para el dibjado del mapa
 * @param {token, idx:cod_dpto} data 
 * @returns {data:[{resultData}], cnf:{zoom:Double, center:{lat, lng}}, niveles:[{}]}
 * @vichofeo
 */
const dataEESS = async (data) => {
    try {
        const datos = tk.getCnfApp(data.token)
        const inst = new QueriesUtils(eessModel)
        const idx = data.idx
        const eess = await inst.findID(datos.inst)

        let zoom = 6
        let center = [-16.290154, -63.588653]

        const result = await getDataTreeEntidades(idx, eess.tipo_institucion_id, eess.institucion_root, eess.institucion_id)
        if (idx !== 'all' || eess.tipo_institucion_id == 'EESS') {
            let idxAux = eess.tipo_institucion_id == 'EESS' ? eess.cod_dpto : idx
            const dpto = new QueriesUtils(dptoModel)
            const r = await dpto.findTune({ attributes: ['latitud', 'longitud'], where: { cod_pais: 'BO', cod_dpto: idxAux } })
            center = [r[0].latitud, r[0].longitud]
            zoom = 8
        }

        const niveles = {}
        const labels = {}
        for (const key in result) {
            //console.log("sigiendo:", niveles.hasOwnProperty(result[key].nivel_atencion))
            if (!niveles.hasOwnProperty(result[key].nivel_atencion)) {
                niveles[result[key].nivel_atencion] = []
                labels.niveles = { ...labels.niveles, [result[key].nivel_atencion]: result[key].nivel }
            }
            niveles[result[key].nivel_atencion].push({ ...result[key] })
        }

        return {
            ok: true,
            data: result,
            cnf: { zoom: zoom, center: center },
            inst: eess,
            niveles: niveles,
            labels: labels,
            message: 'Resultado exitoso'
        }

    } catch (error) {
        return {
            ok: false,
            message: "Error de sistema: GEOREESSSRVDATA",
            error: error.message
        }
    };

}

/**
 * Funcion servicio para guardar informacion de modificacion de latitud y longitid en mapa
 * @param {idx:Identificador Institucion, coordenadas:{lat,lng}} data 
 * @returns ok or nok
 */
const saveDataEESS = async (data) => {
    try {

        const inst = new QueriesUtils(eessModel)
        const cnfData = {
            set: { latitud: data.coordenadas.lat, longitud: data.coordenadas.lng },
            where: { institucion_id: data.idx }
        }
        const result = await inst.modify(cnfData)

        return {
            ok: true,
            data: result,
            message: 'Resultado exitoso.'
        }

    } catch (error) {
        return {
            ok: false,
            message: "Error de sistema: GEOREESSSRVSAVE",
            error: error.message
        }
    }

}

/**
 * Funcion interna para cambiar posicion 5 de PARAMETROS.campos segun tipo de session:ASUSS,EG,EESS
 * @param {PARAMETROS} parametros 
 * @param String tipo 
 * @param {PARAMETROS} original 
 * @param Boolean noverify 
 * @returns {PARAMETROS}
 */
function verificaParamEdicion(parametros, tipo, original, noverify = false) {

    let claves = Object.keys(parametros.campos);
    if (tipo != 'EESS') {
        for (const element of claves) {
            let clave = element
            if (noverify) {
                parametros.campos[clave][1] = true
                parametros.campos[clave][5] = false
            } else {
                parametros.campos[clave][1] = original[clave][1]
                parametros.campos[clave][5] = true
            }
        }
        return parametros
    } else {
        for (const element of claves) {
            let clave = element
            if (noverify)
                parametros.campos[clave][1] = true
            else parametros.campos[clave][1] = original[clave][1]

            parametros.campos[clave][5] = false;
        }

        return parametros
    }
}
/**
 * extrae informaion segun modelo de parametros valido para mis "Mi establecimiento"
 * idx: identificador segun modelo de paremetros que puede ser id de establecimiento como de personal u otro ver idx de PRAMETROS
 * @param {token, idx} dto 
 * @returns {data:{datos segun parametros}, institucion:{datos institucion logueada}}
 * @vichofeo
 */
const getDataParams = async (dto) => {
    try {
        const datos = tk.getCnfApp(dto.token)
        const app = new QueriesUtils(eessModel)
        const institucion = await app.findID(datos.inst)
        const tipo_institucion = institucion.tipo_institucion_id
        const idxLogin = institucion.institucion_id

        let idx = null
        if (dto.idx)
            idx = dto.idx
        else idx = datos.inst

        const modelos = dto.modelos //['institucion', dto.modelo, 'propietario', 'servicios_basicos', 'atencion', 'superficie', 'estructura', 'infraestructuran', 'mobiliarion', 'equipamienton', 'personaln']
        //datos identificacions
        const datosResult = {}

        for (let i = 0; i < modelos.length; i++) {
            console.log("modelo::::::::", i, "--->", modelos[i])
            const modelo = modelos[i]
            const parametros = {}

            if (PARAMETROS[modelo].cardinalidad == '1') {
                parametros.campos = Object.assign({}, PARAMETROS[modelo].campos)
                //pregunta si se trata de un modelo dual de datos
                let result = {}
                if (PARAMETROS[modelo].dual) {
                    
                    const tmp = PARAMETROS[modelo].dual//PARAMETROS[modelo].dual.split(',')
                    const keys = PARAMETROS[modelo].keyDual
                    let idxAux = idx                    
                    for (const i in tmp) {
                        const element = tmp[i]
                        console.log("0000000000000000000000 DUAL ::=>", element, '1111111111111111 IDX==> ', idxAux)
                        //alterna idx, el primer idx es de la tabla principal
                        const query = new QueriesUtils(dbmodel[element])
                        const aux = await query.findID(idxAux)
                        if (aux) {
                            idxAux = aux[keys[i]]
                            result = { ...result, ...aux }
                        }
                    }

                } else {
                    const query = new QueriesUtils(dbmodel[modelo])
                    const aux = await query.findID(idx)
                    if (aux)
                        result = aux
                }

                parametros.valores = result
                parametros.exito = Object.keys(parametros.valores).length ? true : false

                console.log("$$$$$$$$$$$$$$$::::::: RESULtS", result)

                //obtiene referencias PARA LOS COMBOS Y OTROS
                for (const element of PARAMETROS[modelo].referer) {
                    console.log(":::: REFERER modelo", modelo, '--', element)
                    const tablaRef = element.ref
                    const campoRef = element.camporef
                    const campoForeign = element.camporefForeign
                    const campoLink = element.campoLink ? element.campoLink: element.camporefForeign
                    const alias = element.alias
                    const condicion = element.condicion

                    const where = element.condicion ? { [alias]: condicion } : {}
                    element.campoLink ? where[campoRef] = result[campoLink] : ""

                    const objModel = new QueriesUtils(dbmodel[tablaRef])
                    const cnfData = {}
                    cnfData.attributes = parametros.campos[campoForeign][3].slice(0,1) == 'T' ? element.campos : objModel.transAttribByComboBox(element.campos.toString())
                    cnfData.where = parametros.campos[campoForeign][3].slice(0,1) == 'T' ? { [campoRef]: result[campoLink] ? result[campoLink] : "-1" } : { ...where }
                    cnfData.order = [element.campos[element.campos.length - 1]]

                    console.log("******", campoForeign)
                    console.log("***!!!!!!!", parametros.campos[campoForeign][3])
                    console.log("!!!!!!!!!!!!!!!!!!!", cnfData)


                    let r = null
                    let dependency= false
                    if (element.linked) {//hace el link con la referencia de definicion en model segun cfn de parametros
                        //console.log("=================",cnfData.order)
                        //console.log("=================",cnfData.attributes)
                        cnfData.include = [{ model: dbmodel[element.linked.ref], as: element.linked.alias  , ...cnfData }]
                        cnfData.attributes = element.linked.campos
                        cnfData.alias = element.linked.alias
                        //console.log("=================",element.linked.campos)
                        cnfData.order.push([sequelize.col(element.linked.alias+'.'+element.campos[element.campos.length - 1])])
                        delete cnfData.where
                        dependency= element.linked.dependency
                        r = await objModel.findData1toNForCbx(cnfData)
                    } else
                        r = await objModel.findTune(cnfData)

console.log("////////////////////////////////////////////////////////////Parametors caja html",parametros.campos[campoForeign][3].slice(0,1))
                    if (parametros.campos[campoForeign][3].slice(0,1) == 'T') {
                        parametros.valores[campoForeign] = r[0] ? r[0][element.campos] : ""
                    } else {
                        const aux = parametros.valores[campoForeign]
                        if(dependency) console.log("aki es", dependency, "matis datis::::::::::::::::::::::::::::::::::::::::::", parametros.valores[dependency].selected.value)
                        parametros.valores[campoForeign] = {
                            selected: dependency ? objModel.searchBySelectedComboDataNotransform(r[parametros.valores[dependency].selected.value], { value: aux }) :objModel.searchBySelectedComboDataNotransform(r, { value: aux }),
                            items: r,
                            dependency: dependency
                        }

                    }
                }
                //complementa referencia si existe el campo ilogic que contiene querys textuales q solo funcionan con el id instutucion logueado
                if(PARAMETROS[modelo].ilogic){
                    for (const key in PARAMETROS[modelo].ilogic) {
                        console.log("!!!!!!!!!!!!EXISTE ILOGIC!!!!!!! llave:", key)
                        const queryIlogic = PARAMETROS[modelo].ilogic[key].replaceAll('idxLogin',idxLogin)
                        console.log("************** almacen ilogic", parametros.valores[key])
                        const tempo = parametros.valores[key]                        
                        const result = await sequelize.query(queryIlogic, { mapToModel: true, type: QueryTypes.SELECT, raw: false, });
                        parametros.valores[key] = {
                            selected: app.searchBySelectedComboDataNotransform(result, { value: tempo }),
                            items: result,
                            dependency: false
                        }
                    }
                    
                }

                datosResult[PARAMETROS[modelo].alias] = verificaParamEdicion(parametros, tipo_institucion, original[modelo].campos, dto.noverify)
            } else { //>-- FIN CARDINALIDAD ==1
                //tabla de datos
                //CONSTRUYE SENTENCIA SELECT
                console.log("*****************************************::::::::::::::", PARAMETROS[modelo].referer.length)
                let campos = PARAMETROS[modelo].campos
                let from = PARAMETROS[modelo].table
                let where = `${PARAMETROS[modelo].key[0]} = '${idx}'`
                let leftjoin = ''
                for (let i = 0; i < PARAMETROS[modelo].referer.length; i++) {
                    console.log(i)
                    if (PARAMETROS[modelo].referer[i].tabla) {
                        leftjoin = `${leftjoin} ,
                     ${PARAMETROS[modelo].referer[i].tabla}`
                    } else {
                        campos = ` ${campos} , ${PARAMETROS[modelo].referer[i].campos}`
                        //from  = `${from}, ${PARAMETROS[modelo].referer[i].ref}`
                        //where = `${where} AND ${PARAMETROS[modelo].referer[i].camporef} = ${PARAMETROS[modelo].referer[i].camporefForeign}`
                        leftjoin = `${leftjoin} 
                    LEFT JOIN ${PARAMETROS[modelo].referer[i].ref} ON (${PARAMETROS[modelo].referer[i].camporef} = ${PARAMETROS[modelo].referer[i].camporefForeign})`
                    }


                }

                if (PARAMETROS[modelo].precondicion && PARAMETROS[modelo].precondicion.length) {
                    for (let i = 0; i < PARAMETROS[modelo].precondicion.length; i++)
                        where = `${where} AND ${PARAMETROS[modelo].precondicion[i]}`
                }

                const result = await sequelize.query(`SELECT ${campos} FROM ${from} ${leftjoin} WHERE ${where}`, { mapToModel: true, type: QueryTypes.SELECT, raw: false, });

                datosResult[PARAMETROS[modelo].alias] = { campos: PARAMETROS[modelo].camposView, valores: result, linked: PARAMETROS[modelo].linked }
            }
        }

        return {
            ok: true,
            data: datosResult,
            institucion: institucion,
            message: 'Resultado exitoso. Parametros obtenidos'
        }

        //realiza consulta
    } catch (error) {
        console.log(error)
        return {
            ok: false,
            message: "Error de sistema: GEOREESSSRVPARAMS",
            error: error.message
        }
    };

}
/**
 * Funcion de servicio que entrega datos de establecimiento segun modelo de PARAMETROS AGRUPADOS
 * principalmente para añadir nuevo establecimiento de salud: Identificacion, Propietario, Responsable
 * @param {modelo: String, token:String} dto 
 * @returns {data:{datos segun parametros}, institucion:{datos institucion logueada}}
 * @vichofeo
 */
const getDataFrmAgrupado = async (dto) => {
    //['eess_corto', 'propietario', 'responsable']
    //['institucion', dto.modelo, 'propietario', 'responsablen', 'servicios_basicos', 'atencion', 'superficie', 'estructura', 'infraestructuran', 'mobiliarion', 'equipamienton', 'personaln']
    if (AGRUPADO[dto.modelo])
        dto.modelos = AGRUPADO[dto.modelo]
    else dto.modelos = [dto.modelo]
    const result = getDataParams(dto)
    delete result.institucion
    return result
}
/**
 * Funcion de servicio que entrega datos de establecimiento segun modelo de PARAMETROS
 * @param {modelo: String, token:String} dto 
 * @returns {data:{datos segun parametros}, institucion:{datos institucion logueada}}
 * @vichofeo
 */
const getDataModelParam = async (dto) => {
    dto.modelos = [dto.modelo]
    const result = getDataParams(dto)
    delete result.institucion
    return result
}

/**
 * Funcion de servicio para guardar datos de modelos 
 * los datos a guardar depende de los resultados que otroga la funcion "getDataFrmAgrupado" y la configuracion de AGRUPADO
 * @param {token: String, modelo:String, eg:{ente gestor}, data:[{datos}]} dto 
 * @returns ok or nok
 */
const saveDataModelByIdxParam = async (dto) => {
    try {
        const session = tk.getCnfApp(dto.token)
        const modelos = AGRUPADO[dto.modelo]//['eess_corto', 'propietario', 'responsable']
        const eg = dto.eg
        const datos = dto.data
        const uid = uuidv4()
        let tmp = { nad: -99 }
        //reccorre modelos
        for (const element of modelos) {
            const obj = datos[PARAMETROS[element].alias]
            if (element == 'eess_corto' || element == 'institucion') {
                console.log("--------ingresando-------")

                //busca ente maestro
                let o = new QueriesUtils(dbmodel.institucion)
                const cnf = { where: { parent_grp_id: '-1', institucion_root: '-1', root: '-1' } }
                tmp = await o.findTune(cnf)
                if (tmp && tmp.length > 0) {
                    console.log("--------:::::::::::::::::::::", tmp)
                    obj.root = tmp[0].institucion_id
                }

                //reformula objeto de creacion
                obj.tipo_institucion_id = 'EESS'
                obj.parent_grp_id = eg.parent
                obj.institucion_root = eg.idx
                obj.cod_dpto = eg.egdpto
                obj.institucion_id = uid
                obj.create_date = new Date()
                obj.dni_register = session.dni
                obj.latitud = eg.lat
                obj.longitud = eg.lng
                //inserta institucion                
                tmp = await o.create(obj)

                obj.ente_gestor_id = eg.idx

                //insert ubicacion
                o = new QueriesUtils(dbmodel.eess)
                await o.create(obj)
            } else if (element == 'propietario') {
                //update propietario
                let o = new QueriesUtils(dbmodel.propietario)
                const result = await o.modify({ set: obj, where: { institucion_id: uid } })
                console.log("-----------luego de modificar ------------", result)
            } else if (element == 'responsable') {
                console.log("-----------=======================RESPONSABLE========================== ------------")
                //inserta otros 
                obj.responsable_id = uuidv4()
                obj.institucion_id = uid
                obj.create_date = new Date()
                obj.dni_register = session.dni

                const dni = obj.dni + (obj.dni_complemento ? "-" + obj.dni_complemento : "")
                obj.dni_persona = dni
                //busca en persona si existe no hace nada
                const persona = new QueriesUtils(dbmodel.personal)
                const result = await persona.findID(dni)

                if (!result || !result?.dni_persona) {
                    console.log("::::::::::::::::::::::::: ENTRANDO POR PERSONA:", result.dni_persona)
                    //inserta nuevo registro                    
                    await persona.create(obj)
                }
                //registra responsbale
                let o = new QueriesUtils(dbmodel.responsable)
                await o.create(obj)

            }

        }


        return {
            ok: true,
            message: 'Resultado exitoso. Parametros Guardados'
        }
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: "Error de sistema: EESSSVPARAMSRV",
            error: error.message
        }
    };

}
/**
 * servicio que guarda datos segun parametros por modelo (simple y dual)
 * @param {toke: String, modelo:String, sw:Boolean, data:{datos de modelo por parametro}} dto 
 * @returns {ok: boolean, message: String}
 */
const saveDataModifyInsertByModel = async (dto) => {
    try {
        const session = tk.getCnfApp(dto.token) //dni
        const modelo = dto.modelo //['eess_corto', 'propietario', 'responsable']
        const swModify = dto.sw
        let idx = dto.idx
        const uid = uuidv4()
        const app = new QueriesUtils(eessModel)
        const institucion = await app.findID(session.inst)

        const parametros = PARAMETROS[modelo]
        const indexObj = parametros.alias        
        let obj = dto.data[indexObj]
        delete obj?.create_date
        
        //tipo_registro='MOBILIARIO'|'EQUIPAMIENTO'
        if (modelo == 'mobiliario'|| modelo=='r3mobiliario') obj.tipo_registro = 'MOBILIARIO'
        if (modelo == 'equipamiento' || modelo=='r3equipamiento') obj.tipo_registro = 'EQUIPAMIENTO'
        if (modelo == 'acreditacion') obj.tipo_registro = 'ACREDITACION'
        if (modelo == 'habilitacion') obj.tipo_registro = 'HABILITACION'

        if(institucion.institucion_root != '-1')obj.institucion_id = session.inst        
        obj.dni_register = session.dni
        
        //si es modificacion y no existe idx
        if(idx=='-1' && swModify && !parametros.dual) {            
            idx =  obj[parametros.key[0]]
            console.log("----------->ENTRANDO POR MODIFICACION CON ESTE IDX.", idx)
            delete obj[parametros.key[0]]
        }

        //verifica si es un modelo dual
        if (parametros.dual) {
            console.log("-----> Entro por dual", parametros.dual.length)
            let ii = 0
            let idxAux = idx
            for (let i = parametros.dual.length - 1; i >= 0; i--) {
                const auxModel = parametros.dual[i]
                const nameKey = parametros.keyDual[ii]
                console.log("--------> Corriendo por: ", ii, " .-" , auxModel, ':::', nameKey)
                //verifica si es actualizacion o modificacion
                const tblModel = new QueriesUtils(dbmodel[auxModel])
                if (swModify) {
                    //modificacion
                    console.log("-->INGRESANDO A MODIFICAR DUAL ",ii)
                    obj.last_modify_date_time = new Date()
                    const cnf = { where: { [nameKey]: obj[nameKey] } }
                    //delete obj[nameKey]
                    cnf.set = obj
                    await tblModel.modify(cnf)
                } else {
                    //insercion - creacion           
                    obj.create_date = new Date()

                    if (auxModel == 'personal') {
                        //SEGMENTO SOLO PARA CASO PERSONA :busca persona                                                
                        obj[nameKey] = obj.dni
                        if (obj.hasOwnProperty('dni_complemento') && obj.dni_complemento)
                            obj[nameKey] += '-' + obj.dni_complemento
                        const results = tblModel.findID(obj[nameKey])
                        console.log("222222222222222222222222222222222:::", obj)
                        if (Object.keys(results).length <= 0) {
                            //inserta dato            
                            await tblModel.create(obj)
                        }
                    } else {                        
                        obj[nameKey] = uid
                        console.log("3333333333333333333333333333333:::", obj)
                        await tblModel.create(obj)
                    }
                }
                ii++
            }
        } else {//NODUAL
            //verifica si es actualizacion o modificacion
            const tblModel = new QueriesUtils(dbmodel[modelo])
            if (swModify) {
                //modificacion
                obj.last_modify_date_time = new Date()
                const cnf = { set: obj, where: { [parametros.key[0]]: idx } }
                await tblModel.modify(cnf)
            } else {
                if (modelo == 'acreditacion' || modelo == 'habilitacion') {
                    //inactiva a los demas registros                    
                    const cnf = { set: {last_modify_date_time: new Date(), activo:'N', dni_register: session.dni }, where: { institucion_id: obj.institucion_id } }
                    await tblModel.modify(cnf)
                }
                
                //insercion
                obj[parametros.key[0]] = uid
                obj.create_date = new Date()
                await tblModel.create(obj)
            }
        }
        return {
            ok: true,
            message: 'Resultado exitoso. Parametros Guardados'
        }
    } catch (error) {
        console.log("FALLO EN EL PROCESO EDIT-INSERT")
        console.log(error);
        return {
            ok: false,
            message: "Error de sistema: EESSSVDTABYMODELSRV",
            error: error.message
        }
    };

}

/**
 * Funcion servicio que busca datos de los usuarios registrados segun session
 * swAll= true obtener todos los usuarios
 * swAll= false obtener dato de usuario para edicion o solo obtener cifiguracion para objetos del HTML
 * @param {toke:String, swAll:Boolean} dto 
 * @returns {[dataResult]}
 */
const weUsersget = async (dto) => {
    try {
        //idx, token, modelos
        const modeloPersona = 'personal'
        const modeloAlias =  PARAMETROS[modeloPersona].alias
        dto.modelos = [modeloPersona]
        //llama procedimiento generico de datos
        const result = await getDataParams(dto)
        //elimina restriccion de Atributos para usuarios logueados        
        for (const key in result.data[modeloAlias].campos) 
            result.data[modeloAlias].campos[key][5] =  false
        
        
        console.log("camposs",result.data[modeloAlias].campos)
        const institucionLogeada = result.institucion

        if (dto.swAll) {
            //obtiene los usuarios del establecimiento
            let query = `SELECT ai.nombre_institucion, p.dni_persona ,p.primer_apellido, p.nombres, 
                        cre.login
                        FROM ae_institucion ai, ape_aplicacion_institucion app, 
                        aep_institucion_personal ape, au_persona p, apu_credencial cre
                        WHERE 
                        ai.institucion_id =app.institucion_id
                        and ai.institucion_id = ape.institucion_id
                        AND ape.dni_persona = p.dni_persona
                        AND cre.institucion_id = app.institucion_id AND cre.aplicacion_id = app.aplicacion_id
                        AND cre.institucion_id = ape.institucion_id AND cre.dni_persona = ape.dni_persona
 `
            let queryAux = ''
            switch (institucionLogeada.tipo_institucion_id) {
                case 'ASUSS':
                    queryAux = `  and ai.parent_grp_id='${institucionLogeada.institucion_id}'`
                    break;
                case 'EG':
                    queryAux = `  and ai.institucion_root='${institucionLogeada.institucion_id}'`
                    break
                case 'EESS':
                    queryAux = `  and ai.institucion_id='${institucionLogeada.institucion_id}'`
                    break;
                default:
                    break;
            }

            if (institucionLogeada.tipo_institucion_id == 'ASUSS' && institucionLogeada.institucion_root == '-1')
                query = ` ${query} and ai.institucion_root='${institucionLogeada.institucion_id}'`
            else query = ` ${query} ${queryAux}`
            query = ` ${query} order by ai.nombre_institucion`

            const datos = await sequelize.query(query, { mapToModel: true, type: QueryTypes.SELECT, raw: false, });

            return {
                ok: true,
                data: result.data,
                items: datos,
                institucion: institucionLogeada,
                message: 'Resultado exitoso. Parametros obtenidos'
            }
        } else {
            //solo el regstro para edicion o insercion
            if (result.data[modeloAlias].exito) {
                //busca si esta registrado
                const credencial = new QueriesUtils(credencialModel)
                let cnf = {
                    attributes: ['dni_persona'],
                    where: { dni_persona: result.data[modeloAlias].valores.dni_persona, activo: 'Y' }
                }
                const dataCredencial = await credencial.findTune(cnf)

                if (!dataCredencial || dataCredencial.length > 0) {
                    result.data[modeloAlias].exito = false
                    result.data[modeloAlias].mensaje = `El usuario ${result.data[modeloAlias].valores.dni_persona} :: Ya se encuentra habilitado en otra institucion`
                } else {
                    //obtine datos de institucion
                    const eess = new QueriesUtils(eessModel)
                    cnf = {
                        attributes: eess.transAttribByComboBox('institucion_id,nombre_institucion'),
                        order: ['nombre_institucion']
                    }

                    switch (institucionLogeada.tipo_institucion_id) {
                        case 'ASUSS':
                            cnf.where = { parent_grp_id: institucionLogeada.institucion_id }
                            break;
                        case 'EG':
                            cnf.where = { institucion_root: institucionLogeada.institucion_id }
                            break
                        case 'EESS':
                            cnf.where = { institucion_id: institucionLogeada.institucion_id }
                            break;
                        default:
                            break;
                    }

                    //obtiene instituciones para combo 
                    let datos = await eess.findTune(cnf)

                    if (institucionLogeada.tipo_institucion_id == 'ASUSS' && institucionLogeada.institucion_root == '-1') {
                        //obtiene entes gestores
                        //datos.unshift({ value: institucionLogeada.institucion_id, text: institucionLogeada.nombre_institucion })
                        cnf.where = { institucion_root: institucionLogeada.institucion_id }
                        const datosAux = await eess.findTune(cnf)
                        datos = datos.concat(datosAux)
                    }
                    const instituciones = credencial.searchBySelectedComboDataNotransform(datos, { value: "-1" })
                    result.data[modeloAlias].instituciones = {
                        selected: instituciones,
                        items: datos
                    }
                }

            } else {
                result.data[modeloAlias].mensaje = "No se encontro Registro"
            }

            return {
                ok: true,
                data: result.data,
                message: 'Resultado exitoso. Parametros obtenidos'
            }

        }


    } catch (error) {
        console.log(error)
        return {
            ok: false,
            message: "Error de sistema: GEOWEUSRGETSRV",
            error: error.message
        }
    }

}

/**
 * Funcion servicio q almacena datos segun lo entregado por weUsersget
 * insert =  true se trata de una insercion 
 * insert =  false se trata de una modificacion
 * @param {token:String, data:[{}], insert:Boolean} dto 
 * @returns ok or nok
 */
const weUserSave = async (dto) => {
    try {

        //obtiene app_id de la session
        const inst = tk.getCnfApp(dto.token)
        const app = new QueriesUtils(app_instModel)
        const appData = await app.findTune({
            attributes: ['aplicacion_id'],
            where: { institucion_id: inst.inst },
        })

        //PERSONA
        const tmp = dto.data.data
        if (dto.data.insert) {
            //inserta
            //await dbmodel.personal.create(tmp)
            await dbmodel.personal.update(tmp, {
                where: {
                    dni_persona: tmp.dni_persona,
                },
            });
            //institucion aplicacion

            //verifica si existe aplicacion institucion
            const app_institucion = await app_instModel.findOne({ where: { institucion_id: dto.data.institucion.value, aplicacion_id: appData[0].aplicacion_id } })
            if (!(app_institucion && app_institucion.institucion_id))
                await app_instModel.create({ institucion_id: dto.data.institucion.value, aplicacion_id: appData[0].aplicacion_id, create_date: new Date(), dni_register: inst.dni })
            console.log("*************** apliacon_institucion exito")


            //institucion persona
            await ins_perModel.create({ dni_persona: tmp.dni_persona, institucion_id: dto.data.institucion.value, create_date: new Date(), dni_register: inst.dni })
            console.log("================= intitucion persona exito")
            //credencial            
            const hash = await tk.genPass(tmp.login, tmp.passs)
            await credencialModel.create({
                dni_persona: tmp.dni_persona, institucion_id:
                    dto.data.institucion.value,
                aplicacion_id: appData[0].aplicacion_id,
                login: tmp.login,
                password: 'hiloss',
                hash: hash,
                create_date: new Date(),
                dni_register: inst.dni
            })
            console.log("================= LOGIN")

        } else {
            //actualiza       datos de la persona     
            await dbmodel.personal.update(tmp, {
                where: {
                    dni_persona: tmp.dni_persona,
                },
            });
            //actualiza login... pass *****
        }

        return {
            ok: true,
            message: "Usuario creado exitosamente"
        }
    } catch (error) {
        console.log("*********************************************************\n\n\n", error)
        return {
            ok: false,
            message: "Error de sistema: GEOWEUSRSAVESRV",
            error: error.message
        }
    };

}

/**
 * Funcion de servicio para entregar datos de establecimientos de datos para formar el arbol de establecimientos
 * @param {token:String, modelo:String} dto 
 * @returns {data:[{result:{children:[{}]}}]}
 */
const misEess = async (dto) => {
    try {
        const datos = tk.getCnfApp(dto.token)
        const inst = new QueriesUtils(eessModel)
        const eess = await inst.findID(datos.inst)

        const conf = {
            attributes: []
        }

        let result = await display_full_tree(eess.tipo_institucion_id, eess.institucion_id)
        //add root
        result = [
            {
                id: 1,
                name: eess.nombre_corto,
                nombre_corto: eess.nombre_corto,
                nombre_institucion: eess.nombre_institucion,
                idx: eess.institucion_id,
                children: result
            }
        ]

        return {
            ok: true,
            data: result,
            inst: eess,
            message: "Datos entregados"
        }
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: "Error de sistema: GEOMYsEESSSRV",
            error: error.message
        }
    };

}

module.exports = {
    dataEESS, saveDataEESS, getDataFrmAgrupado,
    weUsersget, weUserSave,
    getDataModelParam, saveDataModelByIdxParam, saveDataModifyInsertByModel,
    misEess,

    getDataTreeEntidades

}