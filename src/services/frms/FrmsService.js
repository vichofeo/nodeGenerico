const handleJwt = require('./../../utils/handleJwt')

const cnf_cboxs = JSON.stringify(require('./params_cboxs'))
const PCBOXS = JSON.parse(cnf_cboxs)

const parametros =  JSON.stringify(require('./parameters'))
const PARAMETROS = JSON.parse(parametros)

const FrmUtils = require('./FrmsUtils')
const frmUtil = new FrmUtils()

const QUtils = require('../../models/queries/Qutils')
const qUtil = new QUtils()

const { v4: uuidv4 } = require('uuid')
const { text } = require('express')

const getfrmsConstuct = async (dto) => {
  try {
    dto.modelos = [dto.modelo]
    frmUtil.setParametros(PCBOXS)
    await frmUtil.makerDataComboDependency(dto)
    const CboxResult = frmUtil.getResults()

    return {
      ok: true,
      data: {
        ...CboxResult,
      },
      message: 'Resultado exitoso. Parametros obtenidos',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error de sistema: OBJFRMCBOXDEP',
      error: error.message,
    }
  }
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
      handleError.setMessage("Error de sistema: UFAMDATCBOXSRV")
      handleError.setHttpError(error.message)
  };

}

const getFrmsInfo = async (dto) => {
  try {
    console.log("***** OBTENIENDO TODA INFORMACION DEL FORMULARIO **********")
    const idx = dto.idx
    const qUtils = new QUtils()
    qUtils.setResetVars()
    
    qUtils.setTableInstance('f_formulario')
    qUtils.setAttributes([
      ['codigo_formulario','frm_cod'],['formulario_id','frm'],['nombre_formulario','frm_name'], 'ordenanza', 'descripcion', 'version'
    ])
    
    //qUtils.setOrder([qUtils.getGestor().col('sections.orden'), qUtils.getGestor().col('sections.questions.orden'), qUtils.getGestor().col('sections.questions.answers.orden'), qUtils.getGestor().col('sections.questions.questions.orden')])
    qUtils.setOrder([qUtils.col('sections.orden'), qUtils.col('sections.questions.orden'), 
                  qUtils.col('sections.questions.answers.orden'), qUtils.col('sections.questions.questions.orden'), 
                  qUtils.col('sections.questions.questions.answers.orden'),
                  //qUtils.col('sections.questions.mrow.fatributos.orden'), qUtils.col('sections.questions.mcol.fatributos.orden'), 
                  //qUtils.col('sections.questions.mscol.fatributos.orden'), 
                ],
                )
    let cnf = {
      as: 'grupo',
      attributes: [['nombre_grupo_formulario','grupo']],
      model: qUtils.getTableInstance('f_formulario_grupo'),      
    }
    qUtils.setInclude(cnf)
    cnf = {
      as: 'clase',
      attributes:[['nombre_clase','clase']],
      model: qUtils.getTableInstance('f_formulario_clase'),
    }
    qUtils.pushInclude(cnf)
    cnf = {
      association: 'sections', required: false,
      attributes: [['nombre_subfrm','name_section'], ['orden','ord'], ['subfrm_id','sfrm'],'descripcion', 'codigo'],      
      include: [
        {
          association: 'questions', required: false,
          attributes: [['enunciado','question'], ['tipo_enunciado_id', 'type'], ['orden','ord'], ['enunciado_id','efrm'],['enunciado_root','root'], 
                        'repeat', 'repeat_row', 'row_title', 'col_title',
                        ['row_code', 'mrow'], ['col_code', 'mcol'], ['scol_code', 'mscol']
                      ],          
          where: {enunciado_root:'-1'},          
          include: [
            {
              as: 'answers',
              attributes:[['respuesta','answer'],['tipo_enunciado_id', 'type'], ['orden','ord'], ['opcion_id','ofrm']],
              model: qUtils.getTableInstance('f_frm_enun_opciones'),
            },
            {
              association: 'questions',
              attributes: [['enunciado','question'], ['tipo_enunciado_id', 'type'], ['orden','ord'], ['enunciado_id','efrm']],
              include:[{
                association: 'answers',
                attributes:[['respuesta','answer'],['tipo_enunciado_id', 'type'], ['orden','ord'], ['opcion_id','ofrm']],
              }]
            },
            //nueva cols row, col, scol
            /*{
              association: 'mrow', required: false, attributes:[['grupo_atributo','grupo']],
              include:[{
                association: 'fatributos', required: false, attributes:qUtils.transAttribByComboBox(['atributo_id','atributo']),
              }]
            },{
              association: 'mcol', required: false, attributes:[['grupo_atributo','grupo']],
              include:[{
                association: 'fatributos', required: false, attributes:qUtils.transAttribByComboBox(['atributo_id','atributo']),
              }]
            },{
              association: 'mscol', required: false, attributes:[['grupo_atributo','grupo']],
              include:[{
                association: 'fatributos', required: false, attributes:qUtils.transAttribByComboBox(['atributo_id','atributo']),
              }]
            },*/

          ],
        },
      ],
    }    
    qUtils.pushInclude(cnf)
     /*cnf = {      
      association:'others',        
      attributes: [['tipo_opcion_id','tipo']],
      where:{activo:'Y'},            
      include:[{        
        association:'frm',
        attributes: [['titulo','title'],['tipo_opcion_id','type']],
      }]
    }*/
    //qUtils.pushInclude(cnf)
    qUtils.setWhere({ formulario_id: idx })

    await qUtils.findTune()
    const r = qUtils.getResults()
    qUtil.setResetVars()

    //recorre resultados para encontrar datos de mrow, mcol y mscol
    const auxRcols = ['mrow', 'mcol', 'mscol']    
    for (const key in r[0]?.sections) {
      for(const k in r[0]?.sections[key]?.questions){
        //busca informacion solo si hay mrow, mcol y mscol
        qUtil.setResetVars()
        qUtils.setTableInstance('f_is_atributo')
        qUtils.setAttributes(qUtils.transAttribByComboBox(['atributo_id','atributo'])) 
        qUtils.setOrder(['orden'])       
        for (const element of auxRcols) {
          if(r[0].sections[key].questions[k][element]){
            qUtils.setWhere({grupo_atributo: r[0].sections[key].questions[k][element]})
            const tmp = r[0].sections[key].questions[k][element]
            //delete r[0].sections[key].questions[k][element]
            r[0].sections[key].questions[k][element] = {}
            await qUtils.findTune()
            r[0].sections[key].questions[k][element].fatributos = qUtils.getResults()
            r[0].sections[key].questions[k][element].grupo = tmp
          }
          
        }
        
      }
    }

    return {
      ok: true,
      data: r,
      message: 'Resultado exitoso. Parametros obtenidos',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error de sistema: FRMSDATA',
      error: error.message,
    }
  }
}

const getCnfForms = async (dto)=>{
  try {
    dto.modelos = [dto.modelo]
    frmUtil.setParametros(PARAMETROS)
    await frmUtil.getDataParams(dto)
    const result = frmUtil.getResults()

    return {
      ok: true,
      data: result,
      message: 'Resultado exitoso. Parametros obtenidos',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error de sistema: NEGOCYCNFFORMS',
      error: error.message,
    }
  }
}

const saveCnfForms = async (dto)=>{
  try {
    dto.modelos = [dto.modelo]
    console.log("\n\n\n---------------------------GUARDANDO... MODELO:", dto.modelo,"\n\n\n")
    frmUtil.setParametros(PARAMETROS)
    await frmUtil.saveDataParams(dto)
    const result = frmUtil.getResults()

    if(result)
    return {
      ok: true,     
      r:result, 
      message: 'Resultado exitoso. Parametros Guardados',
    }
    else return {
      ok: false,
      rr:result,       
      message: 'La Transaccion ha fallado. vuelva a intentarlo o comuniquese con su administrador',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error de sistema: OBJSAVEFRMCNF',
      error: error.message,
    }
  }
}

/**
 * 0  -> 1 radio
 * 1  -> 2 check
 * 2  -> 4 texto
 * 3  -> 8 grid Respuestas
 *
 */
const saveFormsRes = async (dto)=>{
  await  qUtil.startTransaction()
  try {
    // obtiene datos de session
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()

    const frm = dto.frm
    const idx =  dto.idx
    
    const respuestas = []
    qUtil.setTableInstance("f_formulario_llenado")
    for (const seccion_id in dto.respuestas) {
      if(seccion_id!= '-1'){
        for (const pregunta_id in dto.respuestas[seccion_id]) {
          const tmp = {registro_id:idx, formulario_id:frm, subfrm_id:seccion_id, enunciado_id: pregunta_id, ...obj_cnf}
          //const tmp = {formulario_id:idx, subfrm_id:seccion_id, enunciado_id: pregunta_id, ...obj_cnf}
          let datos = {}
          switch (dto.respuestas[seccion_id][pregunta_id].tipo) {
            case 0:
               datos = {...tmp, res_frm_id: uuidv4(), opcion_id:Object.keys(dto.respuestas[seccion_id][pregunta_id].answers)[0]}          
              respuestas.push(datos)            
              break;
            case 1:
              const ress = Object.keys(dto.respuestas[seccion_id][pregunta_id].answers)
              datos = ress.map((o,i)=>({...tmp, res_frm_id: uuidv4(), opcion_id: o}))
              respuestas.push(...datos)
            break;
            case 2:
                 datos = {...tmp, res_frm_id: uuidv4(), opcion_id:Object.keys(dto.respuestas[seccion_id][pregunta_id].answers)[0], texto:Object.values(dto.respuestas[seccion_id][pregunta_id].answers)[0]}          
                respuestas.push(datos)            
            break;
            case 3:
              for(const row in dto.respuestas[seccion_id][pregunta_id].answers){
                for(const col in dto.respuestas[seccion_id][pregunta_id].answers[row]){
                  datos = {...tmp, res_frm_id: uuidv4(), enunciado_id:row, opcion_id:col, texto:dto.respuestas[seccion_id][pregunta_id].answers[row][col]}
                  respuestas.push(datos)
                }
              }
              break;
            case 100:
                for(const row in dto.respuestas[seccion_id][pregunta_id].answers.tabla){
                  for(const col in dto.respuestas[seccion_id][pregunta_id].answers.tabla[row]){
                    const auxx= dto.respuestas[seccion_id][pregunta_id].answers.tabla[row][col]
                    
                    datos = {...tmp, res_frm_id: uuidv4(), 
                      irow_ll: auxx?.irow >=0 ? auxx.irow: -1,
                      row_ll: auxx?.irow >=0 ? null : auxx.row.value, //auxx.row.value,
                      col_ll: auxx.col,
                      scol_ll: auxx.scol,
                      texto:auxx.valor}
                    respuestas.push(datos)
                  }
                }
                break;          
            default:
              break;
          }
          
        }
      }
      
      
    }

    qUtil.setDataset(respuestas)
    await qUtil.createwLote()

    await qUtil.commitTransaction()
    return {
      ok: true,
      data: respuestas,
      message: 'Datos del llenado Guardados',
      
    }
    
  } catch (error) {
    console.log(error)
    await  qUtil.rollbackTransaction()
    return {
      ok: false,
      message: 'Error de sistema: OBJSAVERES',
      error: error.message,
    }
  }
}

const modifyCXYLlenado =  async (dto)=>{
  
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSessionForModify()
    const formulario_id =  dto.formulario_id
    const registro_id =  dto.registro_id

    const query = `UPDATE f_formulario_llenado l
SET cxy_id =  i.cxy_id, dni_register='${obj_cnf.dni_register}' , last_modify_date_time= NOW()
FROM f_formulario_img_cnf i
WHERE 
l.formulario_id =  i.formulario_id AND l.subfrm_id =  i.subfrm_id  AND  l.enunciado_id =  i.enunciado_id 
AND COALESCE(l.opcion_id, '-1') = COALESCE(i.opcion_id, '-1') 
AND  COALESCE(l.irow_ll, '-11') = COALESCE(i.irow_ll,'-11') 
 AND  COALESCE(l.row_ll,'-1') =  COALESCE(i.row_ll,'-1')
 AND  COALESCE(l.col_ll, '-1') = COALESCE(i.col_ll, '-1') AND  COALESCE(l.scol_ll, '-1') = COALESCE(i.scol_ll, '-1')
AND l.formulario_id='${formulario_id}' AND l.registro_id='${registro_id}'`
qUtil.setQuery(query)
await qUtil.excuteUpdate()
  
}

module.exports = {getDataCboxLigado, 
  getfrmsConstuct,
  getFrmsInfo, getCnfForms, 
  saveCnfForms, saveFormsRes,
  modifyCXYLlenado
}
