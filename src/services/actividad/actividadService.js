const HandleErrors = require('../../utils/handleErrors')
const QUtils = require('./../../models/queries/Qutils')
const qUtil = new QUtils()

const handleJwt = require('./../../utils/handleJwt')


const parametros = JSON.stringify(require('./parameters'))
const PARAMETROS = JSON.parse(parametros)

const pcboxs = JSON.stringify(require('./params_cboxs'))
const PCBOXS = JSON.parse(pcboxs)

const FrmUtils = require('./../frms/FrmsUtils')
const { actividad } = require('./parameters')
const frmUtil = new FrmUtils()

const MailerUtils = require('../utils/MailerUtils')
const sendMail =  new MailerUtils()

const cronograma = async (dto, handleError) => {
    try {

    } catch (error) {
        console.log(error)
        handleError.setMessage("Error de sistema: CRODATSRV")
        handleError.setHttpError(error.message)
    };

}

const getDataModelN = async (dto, handleError) => {
    try {
        dto.modelos = [dto.modelo]
        frmUtil.setParametros(PARAMETROS)
        await frmUtil.getDataParams(dto)
        const result = frmUtil.getResults()

        return {
            ok: true,
            data: result,
            message: "Requerimiento Exitoso"
        }
    } catch (error) {
        //console.log(error)
        console.log("\n\nerror::: EN SERVICES\n")
        handleError.setMessage("Error de sistema: CRODATNSRV")
        handleError.setHttpError(error.message)
    };

}

const getDataModelNew = async (dto, handleError) => {
    try {
        dto.modelos = [dto.modelo]
        frmUtil.setParametros(PARAMETROS)
        await frmUtil.getDataParams(dto)
        const result = frmUtil.getResults()

        if (dto.new) {
            for (const key in result) {
                for (const index in result[key].campos) {
                    if (!result[key].campos[index][1])
                        result[key].campos[index][1] = true
                }
            }
        }

        return {
            ok: true,
            data: result,
            message: "Requerimiento Exitoso. Parametros Obtenidos"
        }

    } catch (error) {
        console.log("\n\n ?????????????????????????????????error en GetNew ACTIVIDAD?????????????????????? \n\n");
        console.log(error);
        handleError.setMessage("Error de sistema: CRODATNEWSRV")
        handleError.setHttpError(error.message)
    };

}

const getDataCboxLigado = async (dto, handleError) => {
    try {
        dto.modelos = [dto.modelo]
        frmUtil.setParametros(PCBOXS)
        await frmUtil.makerDataComboDependency(dto)
        const result = frmUtil.getResults()
        return {
            ok: true,
            data: result,
            message: "Requerimiento Exitoso. Parametros Obtenidos"
        }

    } catch (error) {
        console.log("\n\n ?????????????????????????????????********error en COMBOX LIGADO *******?????????????????????? \n\n");
        console.log(error);
        handleError.setMessage("Error de sistema: CRODATCBOXSRV")
        handleError.setHttpError(error.message)
    };

}

/**
 * Salva datos de programacion para cronograma en la forma included
 * @param {*} dto 
 * @param {*} handleError 
 * @returns 
 */
const cronogramaSave = async (dto, handleError) => {

    try {
        // obtiene datos de session
        frmUtil.setToken(dto.token)
        const obj_cnf = frmUtil.getObjSession()


        //prepara datsos en formato
        const datos = dto.data
        const datosAux = JSON.parse(JSON.stringify(datos))
        delete datosAux.hrs
        datos.subactividad = []
        for (const obj of datos.hrs) {
            const [dd, mm, aaaa] = obj.fecha.split('/')
            obj.fecha = `${aaaa}-${mm}-${dd}`

            //console.log("\n\n *****************HRS obj:",obj,"\n\n")
            if (!obj.full_dia) {
                //parcea fechas
                const tmp = obj.rhrs.split('|')
                for (let iterator of tmp) {
                    iterator =  iterator.replaceAll(' ','')
                    const tmp2 = iterator.split('-')                    
                    let ax0 = tmp2[0].split(':')
                     
                    //ax0.replace(/\d{2}:\d{2}/,"$1:$2")
                    tmp2[0] = ax0[0].padStart(2, "0") + ':' + (ax0[1] ? ax0[1].padStart(2, "0") : '00')
                    
                    ax0 = tmp2[1].split(':')
                    tmp2[1] = ax0[0].padStart(2, "0") + ':' + (ax0[1] ? ax0[1].padStart(2, "0") : '00')
  
                    //console.log("\n\n ***************** rango horas:", tmp2,"\n\n")
                    const aux1 = {
                        nombre_actividad: obj.titulo,
                        inicio_proyecto: `${obj.fecha} ${tmp2[0]}`,
                        finalizacion: `${obj.fecha} ${tmp2[1]}`,
                        full_dia: obj.full_dia,
                        sede: obj.sede
                    }
                    
                    obj_cnf.create_date = new Date()
                    datos.subactividad.push({ ...aux1, ...obj_cnf })
                }
            } else {
                const aux2 = {
                    nombre_actividad: obj.titulo,
                    inicio_proyecto: `${obj.fecha}`,
                    finalizacion: `${obj.fecha}`,
                    full_dia: obj.full_dia,
                    sede: obj.sede
                }
                obj_cnf.create_date = new Date()
                datos.subactividad.push({ ...aux2, ...obj_cnf })
            }
        }
        obj_cnf.create_date = new Date()
        const payload = Object.assign(datos, obj_cnf)

        //instancia tabla
        qUtil.setTableInstance('cr_actividad')
        //inicia transaccion
        await qUtil.startTransaction()

        //guarda datos
        qUtil.setDataset(payload)
        qUtil.setInclude('subactividad')
        await qUtil.create()

        //termina transaccion
        await qUtil.commitTransaction()

        return {
            ok: true,
            data: payload,
            message: "Requerimiento Exitoso. Parametros Obtenidos"
        }

    } catch (error) {
        await qUtil.rollbackTransaction()
        console.log(error);
        handleError.setMessage("Error de sistema: CRODATSAVESRV")
        handleError.setHttpError(error.message)
    };

}
/**
 * obtiene datos de programacion activos de la session
 * @param {*} dto 
 * @param {*} handleError 
 */
const getProgramacion = async (dto, handleError) => {
    try {
        frmUtil.setToken(dto.token)
        const obj_cnf = frmUtil.getObjSession()

        //instancia tabla
        qUtil.setTableInstance('cr_actividad')

        //atributos (SELECT)
        qUtil.setAttributes([['actividad_id', 'id'], ['inicio_proyecto', 'start'], ['finalizacion', 'end'], ['nombre_actividad', 'grp'], [qUtil.literal("clase.atributo ||' - '|| tipo.atributo ||': '||cr_actividad.nombre_actividad"), 'title'], [qUtil.literal("clase.atributo ||' - '|| tipo.atributo ||': '||cr_actividad.nombre_actividad"), 'content'], [qUtil.literal("1"), 'treeLevel']])
        //included
        let cnf = {
            association: 'subactividad',
            required: false,
            attributes: [['actividad_id', 'id'], ['inicio_proyecto', 'start'], ['finalizacion', 'end'], ['nombre_actividad', 'title'], ['nombre_actividad', 'content'], ['actividad_root', 'groupId'], ['actividad_root', 'group'], 'full_dia'],
            where: { activo: 'Y' }
        }
        qUtil.setInclude(cnf)
        cnf = {
            association: 'clase',
            attributes: [['atributo', 'clase']],
            required: false,
        }
        qUtil.pushInclude(cnf)
        cnf = {
            association: 'tipo',
            attributes: [['atributo', 'tipo']],
            required: false,
        }
        qUtil.pushInclude(cnf)

        //condiciones
        qUtil.setWhere({ activo: 'Y', institucion_id: obj_cnf.institucion_id, actividad_root: null })
        //order 
        qUtil.setOrder(['inicio_proyecto'])
        //ejecuta query
        await qUtil.findTune()


        const result = qUtil.getResults()
        console.log("###########", result)
        return {

            ok: true,
            data: result,
            message: 'Resultado exitoso. Parametros obtenidos',
        }


    } catch (error) {
        console.log(error);
        handleError.setMessage("Error de sistema: PRODATSRV")
        handleError.setHttpError(error.message)
    };

}


const getAllProg = async (dto, handleError) => {
    try {
        frmUtil.setToken(dto.token)
        const obj_cnf = frmUtil.getObjSession()

        //const cnf_actividad = 

        const idx = dto.idx
        qUtil.setTableInstance('ae_institucion')
        qUtil.setAttributes([['institucion_id', 'id'], ['nombre_institucion', 'content'], [qUtil.literal("1"), 'treeLevel']],)

        //qUtils.setOrder([qUtils.getGestor().col('sections.orden'), qUtils.getGestor().col('sections.questions.orden'), qUtils.getGestor().col('sections.questions.answers.orden'), qUtils.getGestor().col('sections.questions.questions.orden')])
        qUtil.setOrder(['tipo_institucion_id', qUtil.col('children.tipo_institucion_id')])

        let cnf = {
            association: 'children',
            attributes: [['institucion_id', 'id'], ['nombre_institucion', 'content'], [qUtil.literal("2"), 'treeLevel']],
            required: false,
            where: { tipo_institucion_id: qUtil.distinto('EESS') },
            include: [
                {
                    association: 'children',
                    attributes: [['institucion_id', 'id'], ['nombre_institucion', 'content'], [qUtil.literal("3"), 'treeLevel']],
                    required: false,
                    where: { tipo_institucion_id: qUtil.distinto('EESS') },
                    include: [{
                        required: false,
                        association: 'actividad',
                        attributes: [['actividad_id', 'id'], ['inicio_proyecto', 'start'], ['finalizacion', 'end'], ['nombre_actividad', 'title'], ['nombre_actividad', 'content'], [qUtil.literal("4"), 'treeLevel'], ['institucion_id', 'group']],
                        where: { actividad_root: null },
                        include: [{
                            association: 'subactividad',
                            required: false,
                            attributes: [['actividad_id', 'id'], ['inicio_proyecto', 'start'], ['finalizacion', 'end'], ['nombre_actividad', 'title'], ['nombre_actividad', 'content'], ['actividad_root', 'groupId'], ['actividad_root', 'group'], 'full_dia'],
                            where: { activo: 'Y' }
                        }]
                    }]

                },
                {
                    required: false,
                    association: 'actividad',
                    attributes: [['actividad_id', 'id'], ['inicio_proyecto', 'start'], ['finalizacion', 'end'], ['nombre_actividad', 'title'], ['nombre_actividad', 'content'], [qUtil.literal("2"), 'treeLevel']],
                    where: { actividad_root: null },
                    include: [{
                        association: 'subactividad',
                        required: false,
                        attributes: [['actividad_id', 'id'], ['inicio_proyecto', 'start'], ['finalizacion', 'end'], ['nombre_actividad', 'title'], ['nombre_actividad', 'content'], ['actividad_root', 'groupId'], ['actividad_root', 'group'], 'full_dia'],
                        where: { activo: 'Y' }
                    }]
                }
            ],
        }
        qUtil.setInclude(cnf)
        //included Actvidades
        cnf = {
            required: false,
            association: 'actividad',
            attributes: [['actividad_id', 'id'], ['inicio_proyecto', 'start'], ['finalizacion', 'end'], ['nombre_actividad', 'title'], ['nombre_actividad', 'content'], [qUtil.literal("1"), 'treeLevel']],
            where: { actividad_root: null },
            include: [{
                association: 'subactividad',
                required: false,
                attributes: [['actividad_id', 'id'], ['inicio_proyecto', 'start'], ['finalizacion', 'end'], ['nombre_actividad', 'title'], ['nombre_actividad', 'content'], ['actividad_root', 'groupId'], ['actividad_root', 'group'], 'full_dia'],
                where: { activo: 'Y' }
            }]
        }
        qUtil.pushInclude(cnf)

        qUtil.setWhere({ institucion_root: idx })

        await qUtil.findTune()
        const r = qUtil.getResults()
        return {
            ok: true,
            data: r,
            message: 'Resultado exitoso. Parametros obtenidos',
        }


    } catch (error) {
        console.log(error);
        handleError.setMessage("Error de sistema: PRODATSRV")
        handleError.setHttpError(error.message)
    };

}

/**envio de mails */
const enviarMail = async(dto,handleError)=>{
    try{
        const Mailer = require('../utils/MailerUtils')
        const mailer = new Mailer()
        mailer.setFromMail('vichofeo@yahoo.com')
        mailer.setToMail('bottyfeo@gmail.com')
        mailer.setSubjet('mail de prueba desde nodin')
        mailer.setMessagePlain("Mensaje de vico condori")
        mailer.sendMail()

        return {
            ok: true,            
            message: 'Resultado exitoso. MAiL enviado',
        }

    }catch(error){
        console.log(error);
        handleError.setMessage("Error de sistema: MAILSENDSRV")
        handleError.setHttpError(error.message)
    }
}

module.exports = {
    getDataModelN,
    getDataModelNew,
    getDataCboxLigado, cronogramaSave,
    getProgramacion, getAllProg,
    enviarMail
}