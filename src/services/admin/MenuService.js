const PARAMETROS = require('../../config/parameters')
const { AGRUPADO } = require('../../config/agrupado')
const { REPORTS } = require('../../config/reports')

const QueriesUtils = require('../../models/queries/QueriesUtils')


const handleToken = require("./../../utils/handleToken")
const QUtils = require('./../../models/queries/Qutils')
const qUtil =  new QUtils()

const FrmUtils = require('./../frms/FrmsUtils')
const frmUtil = new FrmUtils()

const srveg = require("../georef/EgService")
const { version } = require('uuid')

const getDataTree = async (parent_id = '-1', root, resultado = [], module="ssepi", component="sssscp") => {

    qUtil.setTableInstance('ae_institucion')
    qUtil.setAttributes(['institucion_id', [qUtil.literal("'sepi'"), 'atributo'], ['cod_dpto', 'valor']])
    let cnf = {
        //required: false,
        association: 'dpto',
        attributes: qUtil.transAttribByComboBox([qUtil.literal("'/"+module+"/"+component+"/'||dpto.cod_dpto"), 'nombre_dpto'])
    }
    qUtil.setInclude(cnf)
    //qUtil.setWhere({ formulario_id: idx })
    root == '-1' ? qUtil.setWhere({ institucion_root: parent_id, es_unidad:false }) : qUtil.setWhere({ parent_grp_id: parent_id, es_unidad:false})
    qUtil.setOrder([qUtil.col('dpto.nombre_dpto')])
    await qUtil.findTune()
    
    const result = qUtil.getResults()
    console.log("\n\n ****** result:",resultado , "\n\n")
    qUtil.setResetVars()


    if (result.length > 0) {
        for (const i in result) {
            const tmp = result[i].dpto
            if (tmp) {
                resultado[tmp.text] = { value: tmp.value, text: tmp.text, atributo: result[i].atributo, valor: result[i].valor, }
            }
            await getDataTree(result[i].institucion_id, root, resultado, module, component)
        }

        //return resultado
    } //else return resultado

    return resultado
}
const getDataGeoreferencia = async (module="ssepi", component="sssscp") => {
    
    const ids = await frmUtil.getGroupIdsInstitucion() //frmUtil.getResults()
    const institucion_where = ids.length>0? {institucion_id: ids} : null
    
    

    console.log("\n\n #### IDS*****:", ids,"\n\n")
    qUtil.setTableInstance('ae_institucion')
    qUtil.setAttributes([[qUtil.literal("'sepi'"), 'atributo'], ['cod_dpto', 'valor']])
    let cnf = {
        //required: false,
        association: 'dpto',
        attributes: qUtil.transAttribByComboBox([qUtil.literal("'/"+module+"/"+component+"/'||dpto.cod_dpto"), 'nombre_dpto'])
    }
    qUtil.setInclude(cnf)
    qUtil.setWhere({ tipo_institucion_id: 'EESS',  ...institucion_where})    
    qUtil.setGroupBy(['atributo','valor', qUtil.col('dpto.cod_pais'), qUtil.col('dpto.cod_dpto'), qUtil.col('dpto.nombre_dpto')])
    qUtil.setOrder([qUtil.col('dpto.nombre_dpto')])
    
    await qUtil.findTune()
    
    const result = qUtil.getResults()
    console.log("\n\n ****** results:", result,"\n\n")
    qUtil.setResetVars()
    const resultado ={}
    for (const i in result) {
        const tmp = result[i].dpto
        if (tmp) {
            resultado[tmp.text] = { value: tmp.value, text: tmp.text, atributo: result[i].atributo, valor: result[i].valor, }
        }
    }


    return resultado
}
const menuGeoreferencia = async (token, handleError=HandleErrors) => {
    try {
        frmUtil.setToken(token)
        const obj_cnf =  frmUtil.getObjSession()
        
        //const datos = handleToken.filterHeaderTokenVerify(token)

        qUtil.setTableInstance('ae_institucion')
        
        qUtil.setWhere({institucion_id: obj_cnf.institucion_id})
        let cnf = {
            association: 'appis',
            attributes:['nombre_aplicacion', 'nombre_comercial'],
            through: {attributes: []}
        }
        qUtil.setInclude(cnf)
        await qUtil.findTune()//findID(datos.inst)
        
        let result = qUtil.getResults()[0]
        result = await srveg._buscaPadreUnidad(result)
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

                menuAcreHab = []
                    for (const key of AGRUPADO.acre_hab) {
                        menuAcreHab.push({ value: `/ucass/acrehab/${key}`, text: PARAMETROS[key].alias })
                    }

                if (result.institucion_root == '-1') {
                    frmMenu = { value: '/frm/config', text: 'Config Formularios' } 
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

        result2 = Object.values(await getDataGeoreferencia())
       
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

/**
 * Metodo para obteneer las opciones de acceso segun el rol: extrae modulo-componente
 * @param {*} dto 
 * @param {*} handleError 
 */
const getMenuOpsRole = async (dto, handleError) => {
    try {
        // obtiene datos de session
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()
    
    //obtiene nombre de aplicacion
    qUtil.setTableInstance('ap_aplicacion')
    qUtil.setAttributes(['nombre_aplicacion', 'version', 'descripcion'])
    await qUtil.findID(obj_cnf.aplicacion_id)
    const dAplicacion =  qUtil.getResults()

    //obtiene datos de la institucion
    qUtil.setTableInstance('ae_institucion')
    await qUtil.findID(obj_cnf.institucion_id)
    const dInstitucion =  qUtil.getResults()

    //obtiene datos del usuario
    qUtil.setTableInstance('au_persona')
    await qUtil.findID(obj_cnf.dni_register)
    const dPersona =  qUtil.getResults()

    const moreData =  {
        persona: dPersona.primer_apellido+' '+dPersona.nombres,
        aplicacion: dAplicacion.nombre_aplicacion,
        version: dAplicacion.version,
        adesc: dAplicacion.descripcion,
        institucion: dInstitucion.nombre_institucion,
        tipo: dInstitucion.tipo_institucion_id,
        mail: dInstitucion.correo_electronico
    }
    //busca institucion root si es unidad

    //obtiene rol y modulos
    qUtil.setTableInstance('apu_credencial')    
    qUtil.setInclude({
        association: 'rol', required: true,
        attributes: ['role'],
        where: {activo:'Y'},
        include:[{
            association: 'app_rolex', required: true,
            //where: {aplicacion_id: obj_cnf.aplicacion_id},
            attributes:['name_role','description'],
            where: {activo:'Y'},
            include:[{
                association: 'routes', required: true,
                attributes:['module','component', 'variable'],
                where: {activo:'Y'},
                include:[{
                    association: 'modulo', required: true,
                    attributes:['name_module', 'icon','layout', 'description', 'orden','full_image']
                },{
                    association: 'componente', required: true,
                    attributes:['route_access', 'name_component', 'base_folder', 'prop', 'description']
                }]
            }]            
        }]
    })
    qUtil.setOrder([qUtil.col('rol.app_rolex.routes.modulo.orden'), qUtil.col('rol.app_rolex.routes.modulo.name_module')])
    

    await qUtil.findID(obj_cnf.login)
    result =  qUtil.getResults()

    const icons = {}
    const rutas = {}
    const modulos = {}
    let tcmQueryDat = null
    

    for (const element of result.rol) {
        for(const e of element.app_rolex.routes){
            console.log("\n\n\n ::::::::::::Ruta:", e.module)
            if(!rutas[e.module]) rutas[e.module] = []

            console.log("\n\n\n ............Modulo:", e.componente)
            
            icons[e.module] =  e.modulo.icon
            modulos[e.module] =  {name: e.modulo.name_module, description: e.modulo.description, rol: element.app_rolex.name_role, rol_desc: element.app_rolex.description, full_image: e.modulo.full_image }

            //verifica si se trata de enlaces dinamiccos del tipo var/:idx
            if(e.componente.prop){
                //llama a equivalencia en agrupado de parametros
                if(AGRUPADO[e.component]){
                    const variable_control =  e.variable ? e.variable.split('') : "111111111111111111111111111111111111111".split('')

                   for (const index in AGRUPADO[e.component]) {
                    const opcion = AGRUPADO[e.component][index]
                    const icon = AGRUPADO[e.component+'_icons'][index]

                    //empareja con opciones de BD para su disposicion
                    if(variable_control[index]>0){
                        rutas[e.module].push({
                            value:`/${e.module}/${e.component}/${opcion}`,
                            text: PARAMETROS[opcion]?.alias ? PARAMETROS[opcion].alias: REPORTS[opcion].alias,
                            icon: icon
                        })
                    }
                    
                   }//fin for de sub accesos por agrupado
                }else{
                    console.log("\n\n !!!!!!!", e.module ,"!!!!!! \n\n")
                    /*********************
                     * ************* HAY Q OPTIMIZAR ESTA SECCION DE CODIGO OJO NABITO *******************
                     * ********************
                     */
                    //busca por query solo valido para mapas y snis y cargado exceles
                    const tmod='!*!'
                    const tcom='|&|'
                    //e.module, e.component
                    if(e.module == 'ssepi' || e.module == 'ssnipi'){
                        if(!tcmQueryDat) tcmQueryDat = await __menuGeoOpsRoles(tmod, tcom, dInstitucion)
                    
                            rutas[e.module] =JSON.parse(JSON.stringify(tcmQueryDat)).map(obj=>{
                                obj.value = obj.value.replaceAll(tmod, e.module)
                                obj.value = obj.value.replaceAll(tcom, e.component)
                                return obj
                            })
                    }else if(e.module == 'frm'){
                        qUtil.setTableInstance('f_formulario_institucion_cnf')
                        qUtil.setInclude({
                            association: 'frms', required: false,
                            attributes:['nombre_formulario']
                        })
                        qUtil.setWhere({ institucion_id: obj_cnf.institucion_id })
                        await qUtil.findTune()
                        const rfrms = qUtil.getResults()
                        qUtil.setResetVars()

                        rutas[e.module] = rfrms.map((obj, i) => ({ value: `/frm/ll/${obj.formulario_id}`, text: obj.frms.nombre_formulario}))
                    }else if(e.module == 'uctrlabasxls'){//modulo para ucass
                        qUtil.setTableInstance('upf_file_institucion_cnf')
                        qUtil.setInclude({
                            association: 'uffiletipo', required: true,
                            attributes:['nombre_tipo_archivo'],
                            include:{association: 'ufgroup', required: true,
                                attributes: ['nombre_grupo_file'],
                                where:{aplicacion_id:'2d3b2461-876e-499d-bb05-42dbf5fbea5a'}
                            }
                        })
                        qUtil.setWhere({ institucion_id: obj_cnf.institucion_id, activo:'Y' })
                        await qUtil.findTune()
                        const rfrms = qUtil.getResults()
                        qUtil.setResetVars()
                        rutas[e.module] = rutas[e.module].concat(rfrms.map((obj, i) => ({ value: `/uctrlabasxls/ctrlu/${obj.file_tipo_id}`, text: obj.uffiletipo.nombre_tipo_archivo})))
                    } else if(e.module == 'mupfs'){//modulo para ucass
                        console.log("\n\n ENTRANDO A MUPFS \n\n")
                        qUtil.setTableInstance('upf_file_institucion_cnf')
                        qUtil.setInclude({
                            association: 'uffiletipo', required: true,
                            attributes:['nombre_tipo_archivo'],
                            include:{association: 'ufgroup', required: true,
                                attributes: ['nombre_grupo_file'],
                                where:{aplicacion_id:'21f19d11-b069-4b0d-9fee-f6dba302e3ac'}
                            }
                        })
                        qUtil.setWhere({ institucion_id: obj_cnf.institucion_id, activo:'Y' })
                        await qUtil.findTune()
                        const rfrms = qUtil.getResults()
                        console.log("\n\n ", rfrms ," \n\n")
                        qUtil.setResetVars()
                        rutas[e.module] = rutas[e.module].concat(rfrms.map((obj, i) => ({ value: `/mupfs/upfsa/${obj.file_tipo_id}`, text: obj.uffiletipo.nombre_tipo_archivo})))
                    }
                    
                }
            }else{
                rutas[e.module].push({
                    value: `/${e.module}/${e.component}`,
                    text: e.componente.name_component,
                    desc: e.componente.description                    
                })
                //console.log(e.module, "\n\n\n !!!!!!!!!!!!!!!!!!!!!!!!",  rutas[e.module],"!!!!!!!!!!!!!!!!!!!!!!!!!!!! \n\n\n")
            }
            
        }
    }//end for recorrido

    return {
        ok: true,
        data2: result,
        more_data: moreData,
        rutas: {rutas: rutas, icons: icons, modules: modulos},
        xx: tcmQueryDat,
        
        message: "Requerimiento Exitoso"
    }
    } catch (error) {
        console.log(error)
    handleError.setMessage('Error de sistema: MENUGEOOPS__SRV')
    handleError.setHttpError(error.message)
    }
}
/**
 * Metodo Interno para obtener submenu para mapas
 * @param {*} dIntitucion 
 * @returns 
 */
const __menuGeoOpsRoles = async (module, component, dIntitucion) => {
        
        let result = await srveg._buscaPadreUnidad(dIntitucion)        
        
        let whereAux = null
        
        switch (result.tipo_institucion_id) {
            case 'EG':                
                whereAux = {institucion_root: result.institucion_id}
                break;
            case 'EESS':                
                whereAux = {institucion_id: result.institucion_id}                
                break;
        
            default:
              whereAux =  -1
                break;
        }
        let result2 = null

        if (result.tipo_institucion_id == 'ASUSS'){
            console.log("\n\n sonnnnnnnnnnnnnnnnnnnnnnn ", module)
            result2 = Object.values(await getDataTree(result.institucion_id, result.institucion_root, [], module, component))
            
        }else {
            
            qUtil.setTableInstance('ae_institucion')
            qUtil.setAttributes([[qUtil.literal("'"+ module +"'"), 'atributo'], ['cod_dpto', 'valor']])
            cnf = {
                association: 'dpto',
                attributes: qUtil.transAttribByComboBox([qUtil.literal("'/"+module+"/"+component+"/'||dpto.cod_dpto"), 'nombre_dpto'])
            }
            qUtil.setInclude(cnf)
            
            qUtil.setWhere(whereAux)
            qUtil.setOrder([qUtil.col('dpto.nombre_dpto')])
                        
            await qUtil.findTune()
            result2 = qUtil.getResults()   
            let set = new Set( result2.map( JSON.stringify ) )
            result2 = Array.from( set ).map( JSON.parse );
            
            
            qUtil.setResetVars()
            result2 = result2.map(obj => ({ ...obj.dpto, atributo: obj.atributo, valor: obj.valor }))
        }

        //procesando Results
        if (result2.length > 1) {
            result2.unshift({ value: '/'+ module+'/'+ component +'/all', text: 'Todos', atributo: 'ssepi', valor: 'all' })            
        } 
        
        return result2

    

}

module.exports = {
    menuGeoreferencia, getMenuOpsRole
}