const QueriesUtils = require('../../models/queries/QueriesUtils')
const { QueryTypes } = require("sequelize")

const db = require('../../models/index')
const sequelize = db.sequelize;

const { REPORTS } = require('../../config/reports')
const tk = require('./../utilService')
const srveg =  require('./EgService')

//modelos
const eessModel = db.ae_institucion
const dbmodel = {}

/**
 * funcion interna: obtiene datos de institucion de la session
 * @param String token 
 * @returns {institucion} 
 */
async function getDataCnf(token) {
    const datos = tk.getCnfApp(token)
    const eess = new QueriesUtils(eessModel)
    return await eess.findID(datos.inst)
}
/**
 * funcion interna recursiva para extraer datos de institucion dependientes por el parent_id
 * @param Object obj 
 * @param String parent_id 
 * @param Array resultado 
 * @returns [{instituciones}]
 */
async function RecorreTree(obj, parent_id = '-1', resultado = []) {
    const cnf = {
        attributes: ['institucion_id', 'cod_dpto'],
        where: {
            parent_grp_id: parent_id, tipo_institucion_id: 'ASUSS'
        }
    }
    const result = obj.modifyResultToArray(await obj.findTune(cnf))
    if (result.length > 0) {
        for (const i in result) {
            resultado.push(result[i].cod_dpto)
            await RecorreTree(obj, result[i].institucion_id, resultado);
        }
        return resultado
    } else return resultado
}
/**
 * Funcion de servicio de datos, recibe un objeto json con el token y el modelo de reporte a desplegar segun json REPORTS
 * @param {token:String, modelo:String} dto 
 * @returns {
 *           data:{values:[resultado], 
 *          headers:[camposreporte], 
 *          cnf:{configuracion reporte}}   }
 * @vichofeo
 */
const reports = async (dto) => {
    try {

        let institucion = await getDataCnf(dto.token)
        const modelo = dto.modelo
        
        const inst = new QueriesUtils(eessModel)                
        //busca padre de institucion es es_unidad        
        institucion =  await srveg._buscaPadreUnidad(institucion)
        
        //obtiene instituciones relacionadas con la institucion de la session
        const instResults = await RecorreTree(inst, institucion.institucion_id)
        const datosResult = {}

        //verifica q tipo de institucion pertenece usuario de la session
        let condicion = ''
        if(!REPORTS[modelo].sw){
        
        if (institucion.tipo_institucion_id == 'EG')
            condicion = ` aei.institucion_root= '${institucion.institucion_id}'`
        else if (institucion.tipo_institucion_id == 'ASUSS') {
            if (instResults.length <= 0)
                condicion = ` aei.cod_dpto IN ('${institucion.cod_dpto}')`
            else
                condicion = ` aei.cod_dpto IN ('${instResults.join("','")}')`
        }else if(institucion.tipo_institucion_id == 'EESS') {
            condicion = ` aei.institucion_id= '${institucion.institucion_id}'`
        }
    }else condicion = '1=1'

        //construye query de datos
        console.log("*****************************************::::::::::::::", REPORTS[modelo].referer.length)
        let campos = REPORTS[modelo].campos
        let from = REPORTS[modelo].table
        let where = condicion
        let leftjoin = ''
        for (let i = 0; i < REPORTS[modelo].referer.length; i++) {
            console.log(i)
            if (REPORTS[modelo].referer[i].tabla) {
                leftjoin = `${leftjoin} ,
                     ${REPORTS[modelo].referer[i].tabla}`
            } else {
                campos = ` ${campos} , ${REPORTS[modelo].referer[i].campos}`
                //from  = `${from}, ${REPORTS[modelo].referer[i].ref}`
                //where = `${where} AND ${REPORTS[modelo].referer[i].camporef} = ${REPORTS[modelo].referer[i].camporefForeign}`
                leftjoin = `${leftjoin} 
                    LEFT JOIN ${REPORTS[modelo].referer[i].ref} ON (${REPORTS[modelo].referer[i].camporef} = ${REPORTS[modelo].referer[i].camporefForeign})`
            }
        }
        if (REPORTS[modelo].precondicion && REPORTS[modelo].precondicion.length)
            where = `${where} AND ${REPORTS[modelo].precondicion.join(' AND ')}`

//ejecuta query construido
        let result = await sequelize.query(`SELECT ${campos} FROM ${from} ${leftjoin} WHERE ${where}`, { mapToModel: true, type: QueryTypes.SELECT, raw: false, });
        let headers = []
        //convierte en array resultados
        if (result.length > 0) {            
            headers = Object.keys(result[0])
            result = result.map((obj, index) => Object.values(obj))
            result.unshift(headers)
        }

        //construye datos de configuracion para reporte dinamico
        const cnf={
            tipo_agregacion: REPORTS[modelo].tipo, 
            campos_ocultos: REPORTS[modelo].camposOcultos,
            diferencia: headers.filter(x => REPORTS[modelo].camposOcultos.indexOf(x) === -1),
            rows: REPORTS[modelo].rows,
            cols: REPORTS[modelo].cols,
            vals: REPORTS[modelo].camposOcultos,
            mdi: REPORTS[modelo].mdi
        }
        datosResult[REPORTS[modelo].alias] = {values: result, headers: headers, cnf}

        return {
            ok: true,
            data: {...datosResult, model: REPORTS[modelo].alias,},
            institucion: institucion,
            message: 'Resultado exitoso. Parametros obtenidos'
        }

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: "Error de sistema: RPTGRALSRV",
            error: error.message
        }
    };

}

module.exports = {
    reports
}