const PARAMETROS = require('../../config/parameters')
const { AGRUPADO } = require('../../config/agrupado')
const { REPORTS } = require('../../config/reports')

const QueriesUtils = require('../../models/queries/QueriesUtils')

const { QueryTypes } = require("sequelize")

const db = require('../../models/index')

const tk = require('./../utilService')


const appModel = db.ae_institucion
const sequelize = db.sequelize

const getDataTree = async (parent_id = '-1', root, resultado = []) => {

    let query = `SELECT 
    DISTINCT ins.institucion_id, '/ssepi/sssscp/'||dpto.cod_dpto AS value, dpto.nombre_dpto AS text, 'sepi' as atributo, dpto.cod_dpto as valor 
    FROM ae_institucion ins
    LEFT JOIN al_departamento dpto ON (ins.cod_dpto =  dpto.cod_dpto)
    WHERE 
    ins.parent_grp_id = '${parent_id}'    
    -- and dpto.nombre_dpto is not null
    ORDER BY 2`

    if (root == '-1') {
        query = `SELECT 
      DISTINCT ins.institucion_id, '/ssepi/sssscp/'||dpto.cod_dpto AS value, dpto.nombre_dpto AS text, 'sepi' as atributo, dpto.cod_dpto as valor
    FROM ae_institucion ins
    LEFT JOIN al_departamento dpto ON (ins.cod_dpto =  dpto.cod_dpto)
    WHERE 
    ins.institucion_root = '${parent_id}'    
    -- and dpto.nombre_dpto is not null
    ORDER BY 2`
    }


    const result = await sequelize.query(query, { mapToModel: true, type: QueryTypes.SELECT, raw: false, });

    if (result.length > 0) {
        for (const i in result) {
            if (result[i].text)
                resultado[result[i].text] = { value: result[i].value, text: result[i].text, atributo: result[i].atributo, valor: result[i].valor }
            //resultado = { ...resultado, [result[i].text]: { value: result[i].value, text: result[i].text }, index:i }

            await getDataTree(result[i].institucion_id, root, resultado);


        }

        return resultado
    } else return resultado

}

const menuGeoreferencia = async (token) => {
    try {
        const datos = tk.getCnfApp(token)


        const app = new QueriesUtils(appModel)
        //verifica si es usuario por tipo de institucion
        let result = await app.findID(datos.inst)


        let query = `SELECT 
        DISTINCT '/ssepi/sssscp/'||dpto.cod_dpto AS value, dpto.nombre_dpto AS text, 'sepi' as atributo, dpto.cod_dpto as valor
        FROM ae_institucion ins
        LEFT JOIN al_departamento dpto ON (ins.cod_dpto =  dpto.cod_dpto)
        WHERE         
        `
        let menuMiEstablecimiento = {}
        let misEstablecimientos = {}
        let menuReportes = []
        let menuAcreHab = []

        switch (result.tipo_institucion_id) {
            case 'EG':
                misEstablecimientos = { value: '/ssepi/miseess', text: 'Mis Establecimientos' }
                query = ` ${query} ins.institucion_root = '${result.institucion_id}' order by 2`
                break;
            case 'EESS':
                query = ` ${query} ins.institucion_id = '${result.institucion_id}'`
                menuMiEstablecimiento = []
                for (const key of AGRUPADO.all) {
                    console.log("key: ", key)
                    menuMiEstablecimiento.push({ value: `/ssepi/eess/${key}`, text: PARAMETROS[key].alias })
                }
                break;
            case 'ASUSS':
                misEstablecimientos = { value: '/ssepi/miseess', text: 'Mis Establecimientos' }
                if(result.institucion_root == '-1'){
                    menuAcreHab = []
                    for (const key of AGRUPADO.acre_hab) {                        
                        menuAcreHab.push({ value: `/ssepi/acrehab/${key}`, text: PARAMETROS[key].alias })
                    }
                }
                break;
            default:
                query = "SELECT '' AS VALUE, '' AS text"
                break;
        }

        //menu REPORTES
        for (const key in REPORTS)
            menuReportes.push({ value: `/ssepi/report/${key}`, text: REPORTS[key].alias, atributo: 'reports', valor: key })

        //const tmp = await getDataTree(result.institucion_id, result.institucion_root)

        let result2 =
            result.tipo_institucion_id == 'ASUSS' ? Object.values(await getDataTree(result.institucion_id, result.institucion_root)) :
                await sequelize.query(query, { mapToModel: true, type: QueryTypes.SELECT, raw: false, });


        let result3 = result2 
        if (result2.length > 1){
            result2.unshift({ value: '/ssepi/sssscp/all', text: 'Todos', atributo: 'ssepi', valor: 'all' })
            result3 = result2.map(obj => ({ ...obj, value: obj.value.replaceAll('/ssepi/sssscp/', '/ssepi/snis/') }))
        }else if (result2.length == 1){
            result2 = result2[0]
            result3 = {...result2, value : result2.value.replaceAll('/ssepi/sssscp/', '/ssepi/snis/')}
        }
            

         
        //menusss
        const dataMenu = {}
        dataMenu.georeferencia = result2
        dataMenu.usuarios = { value: "/ssepi/weusers", text: "Usuario" }
        Object.keys(menuMiEstablecimiento).length > 0 ? dataMenu['Mi Establecimiento'] = menuMiEstablecimiento : ""
        dataMenu["Reportes"] = menuReportes
        Object.keys(misEstablecimientos).length > 0 ? dataMenu['Mis Establecimientos'] = misEstablecimientos : ""
        Object.keys(menuAcreHab).length > 0 ? dataMenu['Acreditacion / Habilitacion'] = menuAcreHab : ""

        dataMenu["Frms Snis"] = result3

        return {
            ok: true,
            data: {
                ...dataMenu,
                R_prueba: [
                    {
                        "value": "/hl7",
                        "text": "report H"
                    }],

            },
            moredata: { institucion: result.nombre_corto },
            message: 'Resultado exitoso'
        }

    } catch (error) {
        console.log(error)
        return {
            ok: false,
            message: "Error de sistema: MNGEOSRV",
            error: error.message
        }
    };

}


module.exports = {
    menuGeoreferencia
}