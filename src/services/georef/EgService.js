

const QueriesUtils = require('../../models/queries/QueriesUtils')
const { QueryTypes } = require("sequelize")

const db = require('../../models/index')


const eessModel = db.ae_institucion
const dptoModel = db.al_departamento

const credencialModel = db.apu_credencial
const ins_perModel = db.aep_institucion_personal
const app_instModel = db.ape_aplicacion_institucion

const sequelize = db.sequelize;

const tk = require('./../utilService')

const { PARAMETROS } = require('../../config/parameters')


const dbmodel = {}
dbmodel.institucion = db.ae_institucion
dbmodel.eess = db.r_institucion_salud
dbmodel.propietario = dbmodel.eess
dbmodel.servicios_basicos = dbmodel.eess
dbmodel.atencion = dbmodel.eess
dbmodel.superficie = dbmodel.eess
dbmodel.estructura = dbmodel.eess

dbmodel.personal = db.au_persona


dbmodel.infraestructuran = db.r_institucion_salud_infraestructura
dbmodel.atributos = db.r_is_atributo


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
    es.nivel_atencion, es.urbano_rural, es.clase,
    es.nivel
    FROM  al_departamento dpto,  ae_institucion ins
    LEFT JOIN (
	 SELECT es.institucion_id , es.nivel_atencion, es.urbano_rural, es.clase,  aa.atributo AS nivel
	 FROM r_is_atributo aa, r_institucion_salud es
	 WHERE es.nivel_atencion = aa.atributo_id
	 ) AS es ON ins.institucion_id = es.institucion_id  
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
function verificaParamEdicion(parametros, tipo) {
    let claves = Object.keys(parametros.campos);
    if (tipo != 'EESS') {        
        for (let i = 0; i < claves.length; i++) {
            let clave = claves[i]
            parametros.campos[clave][5] = true;
        }
        return parametros
    } else {
        for (let i = 0; i < claves.length; i++) {
            let clave = claves[i]
            parametros.campos[clave][5] = false;
        }
        return parametros
    }
}

const getDataParams = async (dto) => {
    try {
        const datos = tk.getCnfApp(dto.token)
        const app = new QueriesUtils(eessModel)
        const institucion = await app.findID(datos.inst)
        const tipo_institucion = institucion.tipo_institucion_id

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
                parametros.campos = PARAMETROS[modelo].campos

                const query = new QueriesUtils(dbmodel[modelo])
                const result = await query.findID(idx)
                parametros.valores = result
                parametros.exito = Object.keys(parametros.valores).length ? true : false




                //obtiene referencias
                for (let key = 0; key < PARAMETROS[modelo].referer.length; key++) {
                    console.log("::::", modelo, '--', key)
                    const tablaRef = PARAMETROS[modelo].referer[key].ref
                    const campoRef = PARAMETROS[modelo].referer[key].camporef
                    const campoForeign = PARAMETROS[modelo].referer[key].camporefForeign
                    const alias = PARAMETROS[modelo].referer[key].alias
                    const condicion = PARAMETROS[modelo].referer[key].condicion

                    const where = PARAMETROS[modelo].referer[key].condicion ? { [alias]: condicion } : {}

                    const objModel = new QueriesUtils(dbmodel[tablaRef])
                    const cnfData = {}
                    cnfData.attributes = parametros.campos[campoForeign][3] == 'T' ? PARAMETROS[modelo].referer[key].campos : objModel.transAttribByComboBox(PARAMETROS[modelo].referer[key].campos.toString())
                    cnfData.where = parametros.campos[campoForeign][3] == 'T' ? { [campoRef]: result[campoForeign] } : { ...where }

                    console.log("******", campoForeign)
                    console.log("***!!!!!!!", parametros.campos[campoForeign][3])
                    console.log("!!!!!!!!!!!!!!!!!!!", cnfData)

                    const r = objModel.modifyResultToArray(await objModel.findTune(cnfData))


                    if (parametros.campos[campoForeign][3] == 'T') {
                        parametros.valores[campoForeign] = r[0][PARAMETROS[modelo].referer[key].campos]
                    } else {
                        const aux = parametros.valores[campoForeign]
                        parametros.valores[campoForeign] = {
                            selected: objModel.searchBySelectedComboDataNotransform(r, { value: aux }),
                            items: r
                        }

                    }
                }

                datosResult[PARAMETROS[modelo].alias] = verificaParamEdicion(parametros, tipo_institucion)
            } else {
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

                datosResult[PARAMETROS[modelo].alias] = { campos: PARAMETROS[modelo].camposView, valores: result }
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

const getDataFrm = async (dto) => {
    dto.modelos = ['institucion', dto.modelo, 'propietario', 'responsablen' ,'servicios_basicos', 'atencion', 'superficie', 'estructura', 'infraestructuran', 'mobiliarion', 'equipamienton', 'personaln']
    const result = getDataParams(dto)
    delete result.institucion
    return result
}

const getDataModelParam = async (dto) => {
    dto.modelos = [dto.modelo]
    const result = getDataParams(dto)
    delete result.institucion
    return result
}

const weUsersget = async (dto) => {
    try {
        //idx, token, modelos
        dto.modelos = ['personal']
        const result = await getDataParams(dto)
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
            if (result.data['Personal'].exito) {
                //busca si esta registrado
                const credencial = new QueriesUtils(credencialModel)
                let cnf = {
                    attributes: ['dni_persona'],
                    where: { dni_persona: result.data['Personal'].valores.dni_persona, activo: 'Y' }
                }
                const dataCredencial = await credencial.findTune(cnf)

                if (!dataCredencial || dataCredencial.length > 0) {
                    result.data['Personal'].exito = false
                    result.data['Personal'].mensaje = `El usuario ${result.data['Personal'].valores.dni_persona} :: Ya se encuentra habilitado en otra institucion`
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
                    result.data['Personal'].instituciones = {
                        selected: instituciones,
                        items: datos
                    }
                }

            } else {
                result.data['Personal'].mensaje = "No se encontro Registro"
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
                await app_instModel.create({ institucion_id: dto.data.institucion.value, aplicacion_id: appData[0].aplicacion_id, create_date: Date(), dni_register: inst.dni })
            console.log("*************** apliacon_institucion exito")


            //institucion persona
            await ins_perModel.create({ dni_persona: tmp.dni_persona, institucion_id: dto.data.institucion.value, create_date: Date(), dni_register: inst.dni })
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
                create_date: Date(),
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
        return {
            ok: false,
            message: "Error de sistema: GEOWEUSRSAVESRV",
            error: error.message
        }
    };

}
module.exports = {
    dataEESS, saveDataEESS, getDataFrm,
    weUsersget, weUserSave,
    getDataModelParam
}