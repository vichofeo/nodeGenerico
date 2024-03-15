const PARAMETROS = require('../../config/parameters')
const { AGRUPADO } = require('../../config/agrupado')
const { REPORTS } = require('../../config/reports')

const QueriesUtils = require('../../models/queries/QueriesUtils')






const handleToken = require("./../../utils/handleToken")
const QUtils = require('./../../models/queries/Qutils')
const qUtil =  new QUtils()





const getDataTree = async (parent_id = '-1', root, resultado = []) => {

    qUtil.setTableInstance('ae_institucion')
    qUtil.setAttributes(['institucion_id', [qUtil.literal("'sepi'"), 'atributo'], ['cod_dpto', 'valor']])
    let cnf = {
        //required: false,
        association: 'dpto',
        attributes: qUtil.transAttribByComboBox([qUtil.literal("'/ssepi/sssscp/'||dpto.cod_dpto"), 'nombre_dpto'])
    }
    qUtil.setInclude(cnf)
    //qUtil.setWhere({ formulario_id: idx })
    root == '-1' ? qUtil.setWhere({ institucion_root: parent_id }) : qUtil.setWhere({ parent_grp_id: parent_id })
    qUtil.setOrder([qUtil.col('dpto.nombre_dpto')])
    await qUtil.findTune()
    const result = qUtil.getResults()
    qUtil.setResetVars()


    if (result.length > 0) {
        for (const i in result) {
            const tmp = result[i].dpto?.dataValues
            if (tmp) {
                resultado[tmp.text] = { value: tmp.value, text: tmp.text, atributo: result[i].atributo, valor: result[i].valor, }
            }
            await getDataTree(result[i].institucion_id, root, resultado)
        }

        return resultado
    } else return resultado

}

const menuGeoreferencia = async (token, handleError=HandleErrors) => {
    try {
        const datos = handleToken.filterHeaderTokenVerify(token)

        qUtil.setTableInstance('ae_institucion')
        
        qUtil.setWhere({institucion_id: datos.inst})
        let cnf = {
            association: 'appis',
            attributes:['nombre_aplicacion', 'nombre_comercial'],
            through: {attributes: []}
        }
        qUtil.setInclude(cnf)
        await qUtil.findTune()//findID(datos.inst)
        
        let result = qUtil.getResults()[0]
        qUtil.setResetVars()

        
        
        
        let menuMiEstablecimiento = {}
        let misEstablecimientos = {}
        let menuReportes = []
        let menuAcreHab = []
        let frmMenu = {}
        let frmEess = {}

        let actividadMenu = {}

        let whereAux = null

        switch (result.tipo_institucion_id) {
            case 'EG':
                misEstablecimientos = { value: '/ssepi/miseess', text: 'Mis Establecimientos' }                
                whereAux = {institucion_root: result.institucion_id}
                break;
            case 'EESS':                
                whereAux = {institucion_id: result.institucion_id}
                menuMiEstablecimiento = []
                for (const key of AGRUPADO.all) {
                    console.log("key: ", key) 
                    menuMiEstablecimiento.push({ value: `/ssepi/eess/${key}`, text: PARAMETROS[key].alias })
                }
                
                qUtil.setTableInstance('f_formulario_institucion_cnf')
                qUtil.setWhere({ institucion_id: result.institucion_id })
                await qUtil.findTune()
                const rfrms = qUtil.getResults()
                qUtil.setResetVars()

                frmEess = rfrms.map((obj, i) => ({ value: `/frm/ll/${obj.formulario_id}`, text: 'FoRMuLario_' + i }))

                break;
            case 'ASUSS':
                misEstablecimientos = { value: '/ssepi/miseess', text: 'Mis Establecimientos' }
                actividadMenu = { value: '/actividad/cronograma', text: 'Cronograma Actividades' }

                if (result.institucion_root == '-1') {
                    frmMenu = { value: '/frm/config', text: 'Config Formularios' }                   

                    menuAcreHab = []
                    for (const key of AGRUPADO.acre_hab) {
                        menuAcreHab.push({ value: `/ssepi/acrehab/${key}`, text: PARAMETROS[key].alias })
                    }
                }
                break;
            default:
                let query = "SELECT '' AS VALUE, '' AS text"
                break;
        }

        //menu REPORTES
        for (const key in REPORTS)
            menuReportes.push({ value: `/ssepi/report/${key}`, text: REPORTS[key].alias, atributo: 'reports', valor: key })


        let result2 = null

        if (result.tipo_institucion_id == 'ASUSS')
            result2 = Object.values(await getDataTree(result.institucion_id, result.institucion_root))
        else {
            
            qUtil.setTableInstance('ae_institucion')
            qUtil.setAttributes([[qUtil.literal("'sepi'"), 'atributo'], ['cod_dpto', 'valor']])
            cnf = {
                association: 'dpto',
                attributes: qUtil.transAttribByComboBox([qUtil.literal("'/ssepi/sssscp/'||dpto.cod_dpto"), 'nombre_dpto'])
            }
            qUtil.setInclude(cnf)
            
            qUtil.setWhere(whereAux)
            qUtil.setOrder([qUtil.col('dpto.nombre_dpto')])
                        
            await qUtil.findTune()
            result2 = qUtil.getResults()   
            
            qUtil.setResetVars()
            result2 = result2.map(obj => ({ ...obj.dpto.dataValues, atributo: obj.atributo, valor: obj.valor }))
        }

        //procesando Results
        let result3 = result2
        if (result2.length > 1) {
            result2.unshift({ value: '/ssepi/sssscp/all', text: 'Todos', atributo: 'ssepi', valor: 'all' })
            result3 = result2.map(obj => ({ ...obj, value: obj.value.replaceAll('/ssepi/sssscp/', '/ssepi/snis/') }))
        } else if (result2.length == 1) {
            result2 = result2[0]
            result3 = { ...result2, value: result2.value.replaceAll('/ssepi/sssscp/', '/ssepi/snis/') }
        }



        //menusss
        const dataMenu = {}
        dataMenu.georeferencia = result2
        dataMenu.usuarios = { value: "/ssepi/weusers", text: "Usuario" }
        Object.keys(menuMiEstablecimiento).length > 0 ? dataMenu['Mi Establecimiento'] = menuMiEstablecimiento : ""
        dataMenu["Reportes"] = menuReportes
        Object.keys(misEstablecimientos).length > 0 ? dataMenu['Mis Establecimientos'] = misEstablecimientos : ""
        Object.keys(menuAcreHab).length > 0 ? dataMenu['Acreditacion / Habilitacion'] = menuAcreHab : ""
        Object.keys(frmMenu).length > 0 ? dataMenu['Mis Formularios'] = frmMenu : ""
        Object.keys(frmEess).length > 0 ? dataMenu['Formularios'] = frmEess : ""

        dataMenu["Frms Snis"] = result3
        Object.keys(actividadMenu).length > 0 ? dataMenu['Actividades'] = actividadMenu : ""

        return {
            ok: true,
            data: {
                ...dataMenu,
                /*R_prueba: [
                    {
                        "value": "/hl7",
                        "text": "report H"
                    }],*/

            },
            moredata: result,
            message: 'Resultado exitoso'
        }

    } catch (error) {   
        console.log("erorrrr", error)     
        handleError.setMessage("Error de sistema: MENUGEOSRV")
        handleError.handleHttpError(error.message) 
    };

}


module.exports = {
    menuGeoreferencia
}