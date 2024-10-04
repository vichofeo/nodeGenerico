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
        qUtil.pushInclude({association:'form', required: false, attributes:['nombre_formulario']})
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
        

        //1.1 obtine informacion del usuario que registro los datos
        qUtil.setTableInstance("au_persona")
        qUtil.setAttributes(['primer_apellido', 'segundo_apellido', 'nombres'])
        await qUtil.findID(registro.dni_register)
        let results = qUtil.getResults()
        registro.register =  `${results.primer_apellido} ${results.segundo_apellido} ${results.nombres}`

        registro.nombre_solicitud = `${registro.periodo}__${registro.form.nombre_formulario}_${registro.eess.toLowerCase().replaceAll(" ","-")}`
        return registro
}

const ___getDataTotalFrm =  async (registro_id, formulario_id, insert=false)=>{
    const totales = {}
    //parametros , este mismo metodo se usa en la insercion BULK de configuracion xy
    const opcion_id = 'opcion_id' //insert ? 'opcion_id' : [qUtil.literal("coalesce(opcion_id,'-1')"), 'opcion_id'] 
    const irow_ll = 'irow_ll' // insert ? 'irow_ll' : [qUtil.literal("coalesce(irow_ll,'-1')"), 'irow_ll']
    const row_ll = qUtil.literal("CASE WHEN irow_ll < 0 THEN coalesce(row_ll,'-1') ELSE null END")// insert ?  qUtil.literal("CASE WHEN irow_ll < 0 THEN coalesce(row_ll,'-1') ELSE null END") : qUtil.literal("CASE WHEN irow_ll < 0 THEN coalesce(row_ll,'-1') ELSE '-1' END")

    //1. informacion de subtotales
    console.log("\n\n SUBTOTALES\n\n")
    /*qUtil.setTableInstance('f_formulario_llenado')
    qUtil.setWhere({registro_id: registro_id, formulario_id: formulario_id, scol_ll:qUtil.notNull()})
    qUtil.setAttributes(['subfrm_id',  'enunciado_id', 
                    opcion_id,                     
                    irow_ll, 
                    [row_ll, 'row_ll'],
                    'scol_ll', [qUtil.literal("SUM(texto::DECIMAL)"), 'stotal']
                ])
    qUtil.setGroupBy(['subfrm_id',  'enunciado_id', 'opcion_id', 'irow_ll', 'row_ll', 'scol_ll'])            
    qUtil.setOrder(['subfrm_id',  'enunciado_id', 'opcion_id', 'irow_ll'])
    await qUtil.findTune()*/
    //por query hasta q haya una nueva idea por la columna con subculuna independiente
    let query = `SELECT subfrm_id, enunciado_id, opcion_id, irow_ll, 
            CASE WHEN irow_ll < 0 THEN coalesce(row_ll,'-1') ELSE null END AS row_ll, 
            scol_ll,
            SUM(CASE WHEN fa.sw_sg THEN texto::DECIMAL ELSE 0 END) AS stotal,
            SUM(CASE WHEN fa.sw_sg=false THEN texto::DECIMAL ELSE 0 END)  AS stotal_diferenciado
            FROM f_formulario_llenado fll
            LEFT JOIN f_is_atributo fa ON (fa.atributo_id=fll.col_ll)
            WHERE scol_ll IS NOT NULL  
            AND registro_id = '${registro_id}' 
            AND formulario_id = '${formulario_id}' 
            GROUP BY subfrm_id, enunciado_id, opcion_id, irow_ll, row_ll, scol_ll 
            ORDER BY subfrm_id, enunciado_id, 
            opcion_id, irow_ll`
    qUtil.setQuery(query)
    await qUtil.excuteSelect()

    if(insert) totales.subtotales = qUtil.getResults()
    else{
        totales.subtotales = {}
        for (const obj of qUtil.getResults()) {            
            if(!totales.subtotales[obj.subfrm_id]) totales.subtotales[obj.subfrm_id]={}
            if(!totales.subtotales[obj.subfrm_id][obj.enunciado_id]) totales.subtotales[obj.subfrm_id][obj.enunciado_id]={}
            if(!totales.subtotales[obj.subfrm_id][obj.enunciado_id][obj.opcion_id]) totales.subtotales[obj.subfrm_id][obj.enunciado_id][obj.opcion_id]={}
            if(!totales.subtotales[obj.subfrm_id][obj.enunciado_id][obj.opcion_id][obj.irow_ll]) totales.subtotales[obj.subfrm_id][obj.enunciado_id][obj.opcion_id][obj.irow_ll]={}
            if(!totales.subtotales[obj.subfrm_id][obj.enunciado_id][obj.opcion_id][obj.irow_ll][obj.row_ll]) totales.subtotales[obj.subfrm_id][obj.enunciado_id][obj.opcion_id][obj.irow_ll][obj.row_ll]={}
            totales.subtotales[obj.subfrm_id][obj.enunciado_id][obj.opcion_id][obj.irow_ll][obj.row_ll][obj.scol_ll]= {subtotal: obj.stotal, sdiferenciado: obj.stotal_diferenciado}
        }
    }     
        
    //2. totales
    console.log("\n\n TOTALES\n\n")
    /*qUtil.setTableInstance('f_formulario_llenado')
    qUtil.setWhere({registro_id: registro_id, formulario_id: formulario_id})
    qUtil.setAttributes(['subfrm_id',  'enunciado_id', opcion_id, 
                    irow_ll, 
                    [row_ll, 'row_ll'],
                    [qUtil.literal("SUM(texto::DECIMAL)"), 'total']
                ])
    qUtil.setGroupBy(['subfrm_id',  'enunciado_id', 'opcion_id', 'irow_ll', 'row_ll'])            
    qUtil.setHaving(qUtil.literal("COUNT(col_ll)>1"))
    qUtil.setOrder(['subfrm_id',  'enunciado_id', 'opcion_id', 'irow_ll'])
    await qUtil.findTune()*/
    //va por query hasta q el programadorcito pienese en algo innovador
    query = `SELECT subfrm_id, enunciado_id, opcion_id, irow_ll, 
            CASE WHEN irow_ll < 0 THEN coalesce(row_ll,'-1') ELSE null END AS row_ll,
            SUM(CASE WHEN fa.sw_sg THEN texto::DECIMAL ELSE 0 END)  AS total,
            SUM(CASE WHEN fa.sw_sg=false THEN texto::DECIMAL ELSE 0 END)  AS total_diferenciado 
            FROM f_formulario_llenado fll 
            LEFT JOIN f_is_atributo fa ON (fa.atributo_id=fll.col_ll)
            WHERE registro_id = '${registro_id}' 
            AND formulario_id = '${formulario_id}' 
            GROUP BY subfrm_id, enunciado_id, opcion_id, irow_ll, row_ll
            HAVING COUNT(col_ll)>1 
            ORDER BY subfrm_id, enunciado_id, 
            opcion_id, irow_ll`
    qUtil.setQuery(query)        
    await qUtil.excuteSelect()

    if(insert) totales.totales =  qUtil.getResults()
    else{
        totales.totales = {}
        for (const obj of qUtil.getResults()) {
            if(!totales.totales[obj.subfrm_id]) totales.totales[obj.subfrm_id]={}
            if(!totales.totales[obj.subfrm_id][obj.enunciado_id]) totales.totales[obj.subfrm_id][obj.enunciado_id]={}
            if(!totales.totales[obj.subfrm_id][obj.enunciado_id][obj.opcion_id]) totales.totales[obj.subfrm_id][obj.enunciado_id][obj.opcion_id]={}
            if(!totales.totales[obj.subfrm_id][obj.enunciado_id][obj.opcion_id][obj.irow_ll]) totales.totales[obj.subfrm_id][obj.enunciado_id][obj.opcion_id][obj.irow_ll]={}
            
            totales.totales[obj.subfrm_id][obj.enunciado_id][obj.opcion_id][obj.irow_ll][obj.row_ll] = {total: obj.total, diferenciado: obj.total_diferenciado}
        }
    }   
          
    //3. totales verticales por columna vtotal
    console.log("\n\n TOTALES VERTICALES\n\n")
    qUtil.setTableInstance('f_formulario_llenado')
    qUtil.setWhere({registro_id: registro_id, formulario_id: formulario_id, scol_ll: null})
    qUtil.setAttributes(['subfrm_id',  'enunciado_id', 
                    opcion_id,                     
                    [qUtil.literal('null'), 'irow_ll'],                     
                    'col_ll', [qUtil.literal("SUM(texto::DECIMAL)"), 'vtotal']
                ])
    qUtil.setGroupBy(['subfrm_id',  'enunciado_id', 'opcion_id', 'col_ll'])            
    qUtil.setOrder(['subfrm_id',  'enunciado_id', 'opcion_id'])
    await qUtil.findTune()
    if(insert) totales.vtotales = qUtil.getResults()
    else{
        totales.vtotales = {}
        for (const obj of qUtil.getResults()) {            
            if(!totales.vtotales[obj.subfrm_id]) totales.vtotales[obj.subfrm_id]={}
            if(!totales.vtotales[obj.subfrm_id][obj.enunciado_id]) totales.vtotales[obj.subfrm_id][obj.enunciado_id]={}
            if(!totales.vtotales[obj.subfrm_id][obj.enunciado_id][obj.opcion_id]) totales.vtotales[obj.subfrm_id][obj.enunciado_id][obj.opcion_id]={}
            if(!totales.vtotales[obj.subfrm_id][obj.enunciado_id][obj.opcion_id][obj.irow_ll]) totales.vtotales[obj.subfrm_id][obj.enunciado_id][obj.opcion_id][obj.irow_ll]={}
            
            totales.vtotales[obj.subfrm_id][obj.enunciado_id][obj.opcion_id][obj.irow_ll][obj.col_ll]= obj.vtotal
            
        }
    }   
   
    //4. Totales por columna cuando exste subcolumnas
    query = `SELECT subfrm_id, enunciado_id, opcion_id, irow_ll,
            CASE WHEN irow_ll < 0 THEN coalesce(row_ll,'-1') ELSE null END AS row_ll,
            col_ll,
            SUM(CASE WHEN fa.sw_sg THEN texto::DECIMAL ELSE 0 END) AS ctotal,
            SUM(CASE WHEN fa.sw_sg=false THEN texto::DECIMAL ELSE 0 END)  AS ctotal_diferenciado
            FROM f_formulario_llenado fll
            LEFT JOIN f_is_atributo fa ON (fa.atributo_id=fll.col_ll)
            WHERE scol_ll IS NOT NULL
            AND registro_id = '${registro_id}'
            AND formulario_id = '${formulario_id}'
            GROUP BY subfrm_id, enunciado_id, opcion_id, irow_ll, row_ll, col_ll
            ORDER BY subfrm_id, enunciado_id,
            opcion_id, col_ll`
    qUtil.setQuery(query)
    await qUtil.excuteSelect()

    if(insert) totales.ctotales = qUtil.getResults()
        else{
            totales.ctotales = {}
            for (const obj of qUtil.getResults()) {            
                if(!totales.ctotales[obj.subfrm_id]) totales.ctotales[obj.subfrm_id]={}
                if(!totales.ctotales[obj.subfrm_id][obj.enunciado_id]) totales.ctotales[obj.subfrm_id][obj.enunciado_id]={}
                if(!totales.ctotales[obj.subfrm_id][obj.enunciado_id][obj.opcion_id]) totales.ctotales[obj.subfrm_id][obj.enunciado_id][obj.opcion_id]={}
                if(!totales.ctotales[obj.subfrm_id][obj.enunciado_id][obj.opcion_id][obj.irow_ll]) totales.ctotales[obj.subfrm_id][obj.enunciado_id][obj.opcion_id][obj.irow_ll]={}
                
                totales.ctotales[obj.subfrm_id][obj.enunciado_id][obj.opcion_id][obj.irow_ll][obj.col_ll]= {ctotal: obj.ctotal, cdiferenciado: obj.ctotal_diferenciado}
            }
        } 

    return totales
}
const ___getLabelRowRepeat =  async (registro_id, formulario_id)=>{
    console.log("\n\n ETIQUETASS\n\n")
    
    const query =  `SELECT 
distinct f.subfrm_id, f.enunciado_id, f.irow_ll, a.atributo
FROM f_formulario_llenado f
LEFT JOIN f_is_atributo a ON a.atributo_id= f.row_ll
WHERE irow_ll>=0
AND f.formulario_id ='${formulario_id}' AND f.registro_id='${registro_id}'
ORDER BY 1,2,3`
qUtil.setQuery(query)
    await qUtil.excuteSelect()
    
    const results = {}
    for (const obj of qUtil.getResults()) {
        if(!results[obj.subfrm_id]) results[obj.subfrm_id]={}
        if(!results[obj.subfrm_id][obj.enunciado_id]) results[obj.subfrm_id][obj.enunciado_id]={}
        results[obj.subfrm_id][obj.enunciado_id][obj.irow_ll] = obj.atributo ? obj.atributo : ''
    }

//    console.log(results)
    return results

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
                else {
                    //[obj.subfrm_id]:{[obj.enunciado_id]:{[obj.opcion_id]:{[obj.irow_ll]:{[obj.row_ll]:{[obj.scol_ll]: obj.stotal}}}}}
                    results[i].cxy[j] = {cx:ele.cx, cy:ele.cy, align: ele.align,  max_length: ele.max_length, value: '-SinDato-'}
                    try {
                        switch (Number(ele.sw_tipo)) {
                            case 11: 
                            results[i].cxy[j].value = totales.subtotales[ele.subfrm_id][ele.enunciado_id][ele.opcion_id][ele.irow_ll][ele.row_ll][ele.scol_ll].subtotal                                
                                break;
                            case 11.1: 
                            results[i].cxy[j].value = totales.subtotales[ele.subfrm_id][ele.enunciado_id][ele.opcion_id][ele.irow_ll][ele.row_ll][ele.scol_ll].sdiferenciado
                            break;    
                            case 12: 
                            results[i].cxy[j].value = totales.totales[ele.subfrm_id][ele.enunciado_id][ele.opcion_id][ele.irow_ll][ele.row_ll].total
                            break;
                            case 12.1:
                            results[i].cxy[j].value = totales.totales[ele.subfrm_id][ele.enunciado_id][ele.opcion_id][ele.irow_ll][ele.row_ll].diferenciado
                                break;
                            case 13:
                                results[i].cxy[j].value = totales.vtotales[ele.subfrm_id][ele.enunciado_id][ele.opcion_id][ele.irow_ll][ele.col_ll]
                                break;
                            case 14:
                                results[i].cxy[j].value = totales.ctotales[ele.subfrm_id][ele.enunciado_id][ele.opcion_id][ele.irow_ll][ele.col_ll].ctotal
                                break;    
                            case 14.1:
                                results[i].cxy[j].value = totales.ctotales[ele.subfrm_id][ele.enunciado_id][ele.opcion_id][ele.irow_ll][ele.col_ll].cdiferenciado
                                break;
                            case 20:
                                results[i].cxy[j].value = labels[ele.subfrm_id][ele.enunciado_id][ele.irow_ll]
                                break;        
                        
                            default:
                                results[i].cxy[j].value = '-TYPENoDEFINED-'
                                break;
                        }
                    } catch (error) {
                        console.log("\n ERROR EN EMPAREJAMIENTO: \n", error)
                        results[i].cxy[j].value = '-NoCNF-'
                    }
                    
                    /*if( ele.sw_tipo ==11 && totales.subtotales.hasOwnProperty(ele.subfrm_id) && totales.subtotales[ele.subfrm_id].hasOwnProperty(ele.enunciado_id) && typeof totales.subtotales[ele.subfrm_id][ele.enunciado_id][ele.opcion_id][ele.irow_ll][ele.row_ll][ele.scol_ll] != 'undefined')
                        results[i].cxy[j].value = totales.subtotales[ele.subfrm_id][ele.enunciado_id][ele.opcion_id][ele.irow_ll][ele.row_ll][ele.scol_ll].stotal
                    else if( ele.sw_tipo ==12 && totales.totales.hasOwnProperty(ele.subfrm_id) && totales.totales[ele.subfrm_id].hasOwnProperty(ele.enunciado_id) && typeof totales.totales[ele.subfrm_id][ele.enunciado_id][ele.opcion_id][ele.irow_ll][ele.row_ll] != 'undefined')
                        results[i].cxy[j].value = totales.totales[ele.subfrm_id][ele.enunciado_id][ele.opcion_id][ele.irow_ll][ele.row_ll].total
                    else if( ele.sw_tipo ==13 && totales.vtotales.hasOwnProperty(ele.subfrm_id) && totales.vtotales[ele.subfrm_id].hasOwnProperty(ele.enunciado_id) && typeof totales.vtotales[ele.subfrm_id][ele.enunciado_id][ele.opcion_id][ele.irow_ll][ele.col_ll] != 'undefined')
                        results[i].cxy[j].value = totales.vtotales[ele.subfrm_id][ele.enunciado_id][ele.opcion_id][ele.irow_ll][ele.col_ll]
                    else if( ele.sw_tipo ==20 && labels.hasOwnProperty(ele.subfrm_id) && labels[ele.subfrm_id].hasOwnProperty(ele.enunciado_id) && typeof labels[ele.subfrm_id][ele.enunciado_id][ele.irow_ll] != 'undefined')
                        results[i].cxy[j].value = labels[ele.subfrm_id][ele.enunciado_id][ele.irow_ll]
                    */

                }
            
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
//            total:totales,
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

module.exports={
    getValuesFrmWithXY
}