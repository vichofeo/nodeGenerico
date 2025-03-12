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
const FrmUtils = require('./FrmsUtils')
const frmUtil = new FrmUtils()

const QUtils = require('../../models/queries/Qutils')
const qUtil = new QUtils()

const ___getInfoRegistroFrm= async (dto)=>{
    const registro_id =  dto.idx

    qUtil.setTableInstance('f_formulario_registro')
        qUtil.setInclude({association: 'institucion', required: false,               
                            attributes:[['nombre_institucion', 'eess']],
                            include:[{association:'dpto', required: false,
                                        attributes:[['nombre_dpto', 'dpto']]
                            }]
                        })
        qUtil.pushInclude({association:'hospital', required: false,
                            attributes: ['codigo'],
                            include:[{association: 'inivel', required: false, attributes:[['atributo','nivel']]},
                                     {association: 'ieg', required: false, attributes:[['nombre_institucion','ente_gestor'], ['nombre_corto', 'abrev']]}]
        })
        qUtil.pushInclude({association:'form', required: false, attributes:['nombre_formulario','descripcion','version']})
        await qUtil.findID(registro_id)
        const registro  = qUtil.getResults()
        
        registro.eess =  registro.institucion.eess
        registro.dpto =  registro.institucion.dpto.dpto
        registro.nivel =  registro.hospital.inivel.nivel
        registro.eg = `${registro.hospital.ieg.ente_gestor} (${registro.hospital.ieg.abrev})`
        registro.gestion =  registro?.periodo?.substring(0,4)
        let fecha =  new Date(registro.create_date)
        registro.create_date =  `${fecha.getDate()}/${(fecha.getMonth()+1).toString().padStart(2, '0')}/${fecha.getFullYear()}`
        fecha =  new Date(registro.last_modify_date_time)
        registro.end_date =  `${fecha.getDate()}/${(fecha.getMonth()+1).toString().padStart(2, '0')}/${fecha.getFullYear()}`
        
        fecha =  new Date(registro.fecha_concluido)
        registro.fecha_concluido =  `${fecha.getDate()}/${(fecha.getMonth()+1).toString().padStart(2, '0')}/${fecha.getFullYear()}`
        fecha =  new Date(registro.fecha_revisado)
        registro.fecha_revisado =  `${fecha.getDate()}/${(fecha.getMonth()+1).toString().padStart(2, '0')}/${fecha.getFullYear()}`
        

        //1.1 obtine informacion del usuario que registro los datos
        qUtil.setTableInstance("au_persona")
        qUtil.setAttributes(['primer_apellido', 'segundo_apellido', 'nombres'])
        await qUtil.findID(registro.dni_register)
        let results = qUtil.getResults()
        registro.register =  `${results.primer_apellido} ${results.segundo_apellido} ${results.nombres}`

        registro.nombre_solicitud = `${registro.periodo}__${registro.form.nombre_formulario}_${registro.eess.toLowerCase().replaceAll(" ","-")}`

        if(registro?.dni_revisado){
            qUtil.setTableInstance("au_persona")
            qUtil.setAttributes(['primer_apellido', 'segundo_apellido', 'nombres'])
            await qUtil.findID(registro.dni_revisado)
            let results = qUtil.getResults()
            registro.revisor =  `${results.primer_apellido} ${results.segundo_apellido} ${results.nombres}`
        }
        return registro
}



const getValuesFrmWithXY = async (dto, handleError) => {
    try {
        frmUtil.setToken(dto.token)
        const obj_cnf = frmUtil.getObjSession()
    
        const registro_id =  dto.idx
        //busca datos
        //1. formulario
        const registro =  await ___getInfoRegistroFrm(dto)
        const formulario_id =  registro.formulario_id
        const nombre_solicitud =  registro.nombre_solicitud
        delete registro.nombre_solicitud
        
        //2. OBtiene totales y subtotales y complementos
        //2.1. Totales, subtotales y total vertical
        const totales =  await ___getDataTotalFrm(registro_id, formulario_id)
        //2.2 etiquetas para filas con reperticion
        const labels =  await ___getLabelRowRepeat(registro_id, formulario_id)


        //3. obtiene as respuestas del llenado y lo convierte en objeto por el id de xy
        qUtil.setTableInstance('f_formulario_llenado') 
        qUtil.setAttributes([['texto', 'valor'], 'cxy_id'])
        qUtil.setWhere({formulario_id: formulario_id, registro_id:registro_id})
        await qUtil.findTune()
        results =  qUtil.getResults()
        const respuestas = {}
        for (const element of results) 
            respuestas[element.cxy_id] =  element.valor
        
        //4. obtiene datos de configuracion de imagen con sus preguntas con corrdenadas y la imagen
        console.log("\n\n ********* SET DE IMAGENES ***** \n\n")

        qUtil.setTableInstance('f_formulario_img')
        qUtil.setAttributes(['img', 'format_page', 'orientation_page', 'img_width', 'img_heigth'])
        qUtil.setInclude({association: 'cxy', required: false,
            //attributes:['cx', 'cy', 'cxy_id', 'align'],
            where: {cx:qUtil.notNull(), cy: qUtil.notNull()}
        })
        qUtil.pushInclude({association: 'mcxy', required: false,
            attributes:['cx', 'cy', 'clave', 'align'],
            where: {cx:qUtil.notNull(), cy: qUtil.notNull()}
        })
        qUtil.setWhere({formulario_id: formulario_id})
        qUtil.setOrder(['orden'])
        await qUtil.findTune()
        results = qUtil.getResults()
        
        //4. prepara salida de datos
        for (const i in results) {
            const element = results[i]
            
            //4.1. formatea datos con corrdenadas sobre formulario
            for (const j in element.cxy) {
                const ele =  element.cxy[j]
                const xy_id =  ele.cxy_id
                //console.log("::::ELEMENTO:", ele)
                //delete results[i].cxy[j].cxy_id
                
                if(respuestas[xy_id])
                results[i].cxy[j] = {cx:ele.cx, cy:ele.cy, align: ele.align, value: respuestas[xy_id]}
              
            }
            //4.2. datos de complemento ejm cabeceras de formulario
            for (const j in element.mcxy) {
                const ele =  element.mcxy[j]
                const clave =  ele.clave
                //delete results[i].mcxy[j].clave
                //console.log("\n -----> ", clave, " ::::", registro[clave])
                if(registro[clave])
                results[i].mcxy[j].value =  registro[clave]
                else delete results[i].mcxy[j]
            }
            //reformula el array
            results[i].mcxy =  results[i].mcxy.filter(obj=> obj!=null)

        }

        return {
            ok: true,
            data: {idx: nombre_solicitud, datos:results}                        
        }

    } catch (error) {        
        //handleError.setMessage('Error de sistema: FRMPDFGET')
        //handleError.setHttpError(error.message)
        console.log(error)
        return {
            ok: false,
            data: error.message
        }
    }
}
const getInitialHeaderData = async(dto,handleError)=>{
    try {
        const registro =  await ___getInfoRegistroFrm(dto)
        return{
            ok: true,
            data: registro
        }
    } catch (error) {
        console.log(error)
        handleError.setMessage('Error de sistema consulta: FRMPDFGETHEADERs')
        handleError.setHttpError(error.message)
    }
}
module.exports={
    getValuesFrmWithXY,
    getInitialHeaderData
}