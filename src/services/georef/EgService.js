const QueriesUtils = require('../../models/queries/QueriesUtils')
const { QueryTypes } = require("sequelize")

const db = require('../../models/index')


const eessModel = db.ae_institucion
const dptoModel = db.al_departamento


const sequelize = db.sequelize;

const tk = require('./../utilService')

const { PARAMETROS } = require('../../config/parameters')
const dbmodel = {}
dbmodel.institucion = db.ae_institucion
dbmodel.eess = db.r_institucion_salud
dbmodel.atributos = db.r_is_atributo


const dataEESS = async (data) => {
    try {
        const datos = tk.getCnfApp(data.token)
        const inst = new QueriesUtils(eessModel)
        const idx = data.idx
        const eess = await inst.findID(datos.inst)
        let query = ''
        let zoom = 6
        let center = [-16.290154, -63.588653]
        if (idx !== 'all')
            query = ` AND ins.cod_dpto= '${idx}'`

        switch (eess.tipo_institucion_id) {
            case 'EG':
                query = `SELECT ins.institucion_id as idx,
            ins.nombre_institucion, ins.telefono, ins.direccion_web, dpto.nombre_dpto,
            ins.latitud, ins.longitud, ins.avenida_calle, ins.zona_barrio,
            es.nivel_atencion, es.urbano_rural, es.clase
            FROM ae_institucion ins, al_departamento dpto,
            r_institucion_salud es
            WHERE 
            ins.cod_dpto = dpto.cod_dpto AND ins.cod_pais = dpto.cod_pais
            and ins.institucion_id = es.institucion_id  AND ins.institucion_root = '${eess.institucion_id}' ${query}`
                break;
            case 'EESS':
                query = `SELECT ins.institucion_id as idx,
                ins.nombre_institucion, ins.telefono, ins.direccion_web, dpto.nombre_dpto,
                ins.latitud, ins.longitud, ins.avenida_calle, ins.zona_barrio,
                es.nivel_atencion, es.urbano_rural, es.clase
                FROM ae_institucion ins, al_departamento dpto,
                r_institucion_salud es
                WHERE 
                ins.cod_dpto = dpto.cod_dpto AND ins.cod_pais = dpto.cod_pais
                and ins.institucion_id = es.institucion_id  AND ins.institucion_id = '${eess.institucion_id}' ${query}`
                zoom = 12
                break;
            case 'ASUSS':
                query = `SELECT ins.institucion_id as idx,
                ins.nombre_institucion, ins.telefono, ins.direccion_web, dpto.nombre_dpto,
                ins.latitud, ins.longitud, ins.avenida_calle, ins.zona_barrio,
                es.nivel_atencion, es.urbano_rural, es.clase
                FROM ae_institucion ins, al_departamento dpto,
                r_institucion_salud es
                WHERE 
                ins.cod_dpto = dpto.cod_dpto AND ins.cod_pais = dpto.cod_pais
                and ins.institucion_id = es.institucion_id   ${query}`
                break;
            default:
                query = "SELECT '' AS VALUE, '' AS text"
                break;
        }
        const result = await sequelize.query(query, { mapToModel: true, type: QueryTypes.SELECT, raw: false, });
        if (zoom > 6 || idx !== 'all') {
            const dpto = new QueriesUtils(dptoModel)
            const r = await dpto.findTune({ attributes: ['latitud', 'longitud'], where: { cod_pais: 'BO', cod_dpto: idx } })
            center = [r[0].latitud, r[0].longitud]
            zoom = 8
        }


        return {
            ok: true,
            data: result,
            cnf: { zoom: zoom, center: center },
            message: 'Resultado exitoso'
        }

    } catch (error) {
        return {
            ok: false,
            message: "Error de sistema: GEOREESSSRV",
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
            message: "Error de sistema: GEOREESSSRV",
            error: error.message
        }
    }

}

const getDataFrm = async (dto) => {
    try {
        const modelo = dto.modelo
        const idx = dto.idx
        const parametros = {}

        parametros.campos = PARAMETROS[modelo].campos

        const query = new QueriesUtils(dbmodel[modelo])

        let result = await query.findID(idx)
        parametros.valores = result

        console.log("==============================================", result)
        
        //obtiene referencias
        for (let i = 0; i < PARAMETROS[modelo].referer.length; i++) {
            const tablaRef = PARAMETROS[modelo].referer[i].ref
            const campoRef = PARAMETROS[modelo].referer[i].camporef
            const campoForeign = PARAMETROS[modelo].referer[i].camporefForeign
            const alias = PARAMETROS[modelo].referer[i].alias
            const condicion = PARAMETROS[modelo].referer[i].condicion

            const where = PARAMETROS[modelo].referer[i].condicion ? {[alias]: condicion} : {}
            
            const objModel = new QueriesUtils(dbmodel[tablaRef])
            const cnfData = {}
            cnfData.attributes = parametros.campos[campoForeign][3] == 'T' ? PARAMETROS[modelo].referer[i].campos : objModel.transAttribByComboBox(PARAMETROS[modelo].referer[i].campos.toString())
            cnfData.where = parametros.campos[campoForeign][3] == 'T' ? { [campoRef]: result[campoForeign] } : {...where}
            
            const r = objModel.modifyResultToArray(await objModel.findTune(cnfData))

           
            if (parametros.campos[campoForeign][3] == 'T')
                parametros.valores[campoForeign] = r[0][PARAMETROS[modelo].referer[i].campos]
            else {
                const aux = parametros.valores[campoForeign]              
                parametros.valores[campoForeign] = {
                selected: objModel.searchBySelectedComboDataNotransform(r, { value: aux }),
                items: r }
            
        }
        }

        return {
            ok: true,
            data: parametros,
            message: 'Resultado exitoso. Parametros obtenidos'
        }

        //realiza consulta
    } catch (error) {
        return {
            ok: false,
            message: "Error de sistema: GEOREESSSRV",
            error: error.message
        }
    };

}
module.exports = {
    dataEESS, saveDataEESS, getDataFrm
}