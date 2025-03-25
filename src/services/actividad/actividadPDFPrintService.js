/**
 * metodos para extraer datos para impresion de PDF v001
 * notas: esta asociado a la tabla f_formulario_img_cnf (x,y)
 * tiene tipos de registros:
 *  + sw_tipo = 0 : registro normal 
 *  TOTALES HORIZONTALES
 *  + sw_tipo = 11: suma de subtotales con scol not null (no suma columnas q admiten subcolumnas sw_sg = true)
 *      + sw_tipo =  11.1 suma subtotales con scol not null (subcolumnas con sw_sg= false)
 *  + sw_tipo = 12: suma totales q tengan mas de una columna sw_sg = true
 *      + sw_tipo = 12.1 suma totales cn mas de una columna pero q no admiten subcolumnas sw_sg = false
 *  TOTALES VERTICALES O POR COLUMNA
 *  + sw_tipo = 13 suma totales  cuando no hay subcolumna
 *  + sw_tipo = 14 suma totales por columna cuando existe subcolumna sw_sg=true
 *      + sw_tipo = 14.1 suma totales por columna cuando sw_sg=false
 *  OTROS
 *  $ sw_tipo = 20 para obtener labels cuando son filas por repeticion o irow>=0 
 */
const FrmUtils = require('./../frms/FrmsUtils')
const frmUtil = new FrmUtils()

const QUtils = require('./../../models/queries/Qutils')
const qUtil = new QUtils()

const QRUtils = require('../utils/QrUtils')
const qRutils = new QRUtils()

/**
 * 
 * @param {*} dto {token, idx, [personas]}
 * @returns 
 */
const ___getInfoAct = async (dto) => {
    const actividad_id = dto.idx
    const personas = dto.personas

    qUtil.setTableInstance('cr_actividad')
    qUtil.setInclude({
        association: 'act_img', required: true,
        attributes: ['img_id', 'img', 'format_page', 'orientation_page', 'img_width', 'img_heigth'],
        include: [{
            association: 'act_img_cnf', required: false,
            attributes: ['clave', 'cx', 'cy', 'align', 'tipo_obj']
        }]
    })
    qUtil.pushInclude({
        association: 'act_per', required: true,
        attributes: ['mail_registro', 'dni_persona'],
        where: { dni_persona: personas },
        include: [{
            association: 'act_people', required: true,
            attributes: ['dni_persona', 'primer_apellido', 'segundo_apellido', 'nombres']
        }]
    })

    qUtil.setOrder([qUtil.col('act_img.orden')])
    await qUtil.findID(actividad_id)
    const registro = qUtil.getResults()

    return registro
}


/**
 * 
 * @param {*} dto {token, idx, [personas]}
 * @param {*} handleError :function errors
 * @returns 
 */
const getValuesActWithXY = async (dto, handleError) => {
    try {
        frmUtil.setToken(dto.token)
        const obj_cnf = frmUtil.getObjSession()

        //busca datos
        //1. formulario
        const registro = await ___getInfoAct(dto)

        //2. recontruye datos para enviar
        const certificados = []
        for (const persona of registro.act_per) {
            //settings
            registro.persona = `${persona.act_people.primer_apellido} ${persona.act_people.segundo_apellido} ${persona.act_people.nombres}`

            qRutils.setLinkUrl(`http://localhost:8080/${persona.dni_persona}/${btoa(dto.idx)}`)
            
            await qRutils.generateQrLink()
            registro.qr = qRutils.getQrResult()
            registro.fecha = `${registro.inicio_proyecto} al ${registro.finalizacion}`
            //constuye info de imagen
            const imgs = []
            for (const img of registro.act_img) {
                const result = { idx: img.img_id, cnf: [] }
                for (const ele of img.act_img_cnf) {
                    if (registro[ele.clave]) {
                        result.cnf.push({ cx: ele.cx, cy: ele.cy, align: ele.align, tipo: ele.tipo_obj, value: registro[ele.clave] })
                    }
                }
                imgs.push(result)
            }
            certificados.push({ mail: persona.mail_registro, certs: imgs })
        }
        const imgs = {}
        for (const img of registro.act_img) {
            const idx = img.img_id
            delete img.act_img_cnf
            delete img.img_id
            imgs[idx] = img
        }
        return {
            ok: true,
            data: { personas: certificados, certificados: imgs },
        }

    } catch (error) {
        //handleError.setMessage('Error de sistema: ACTPDFGET')
        //handleError.setHttpError(error.message)
        console.log(error)
        return {
            ok: false,
            data: error.message
        }
    }
}

/**
 * 
 * @param {*} dto {token, idx, [personas]}
 * @param {*} handleError 
 * @returns 
 */
const sendCertificadoMail = async (dto, handleError) => {
    try {
        const datos = await getValuesActWithXY(dto, handleError)
        const PdfUtils = require('../utils/PdfUtils')
        const MailerUtils = require('../utils/MailerUtils')
        const pdfUtil = new PdfUtils()
        const mailer =  new MailerUtils()
        pdfUtil.getCertificadoBlobPdf(datos)
        const result = pdfUtil.getResults()
        const registro = []
        if(result.ok){            
            for (const element of result.data) {                
                mailer.setFromMail('vichofeo@yahoo.com')
                mailer.setToMail(element.mail)
                mailer.setSubjet('mail de prueba desde con su certificado del seminario')
                mailer.setMessagePlain("Mensaje de prueba de su servidor con su certificado")
                mailer.setAdjunto(element.blob, 'myfile.pdf')
                //await mailer.sendMail()
                mailer.sendMailwLogTable()
                console.log(mailer.getResults())
                registro.push(mailer.getResults())
            }
            return {
                ok: true,
                data: registro
            }
        }else return result
        
    } catch (error) {
        console.log(error)
        handleError.setMessage('Error de sistema consulta: FRMPDFGETHEADERs')
        handleError.setHttpError(error.message)
    }
}
module.exports = {
    getValuesActWithXY,
    sendCertificadoMail
}