const cnf_cboxs = JSON.stringify(require('./params_cboxs'))
const PCBOXS = JSON.parse(cnf_cboxs)

const parametros =  JSON.stringify(require('./parameters'))
const PARAMETROS = JSON.parse(parametros)

const services = require('./FrmsUtils')
const objService = new services()

const QUtils = require('../../models/queries/Qutils')
const getfrmsConstuct = async (dto) => {
  try {
    dto.modelos = [dto.modelo]
    objService.setParametros(PCBOXS)
    await objService.makerDataComboDependency(dto)
    const CboxResult = objService.getResults()

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

const getFrmsInfo = async (dto) => {
  try {
    const idx = dto.idx
    const qUtils = new QUtils()
    qUtils.setTableInstance('f_formulario')
    qUtils.setAttributes([
      ['codigo_formulario','frm_cod'],['formulario_id','frm'],['nombre_formulario','frm_name']
    ])
    
    //qUtils.setOrder([qUtils.getGestor().col('sections.orden'), qUtils.getGestor().col('sections.questions.orden'), qUtils.getGestor().col('sections.questions.answers.orden'), qUtils.getGestor().col('sections.questions.questions.orden')])
    qUtils.setOrder([qUtils.col('sections.orden'), qUtils.col('sections.questions.orden'), qUtils.col('sections.questions.answers.orden'), qUtils.col('sections.questions.questions.orden')])
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
      association: 'sections',
      attributes: [['nombre_subfrm','name_section'], ['orden','ord'], ['subfrm_id','sfrm']],      
      include: [
        {
          association: 'questions',
          attributes: [['enunciado','question'], ['tipo_enunciado_id', 'type'], ['orden','ord'], ['enunciado_id','efrm'],['enunciado_root','root']],          
          where: {enunciado_root:'-1'},
          required: false,
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
            }
          ],
        },
      ],
    }    
    qUtils.pushInclude(cnf)
     cnf = {      
      association:'others',        
      attributes: [['tipo_opcion_id','tipo']],
      where:{activo:'Y'},            
      include:[{        
        association:'frm',
        attributes: [['titulo','title'],['tipo_opcion_id','type']],
      }]
    }
    qUtils.pushInclude(cnf)
    qUtils.setWhere({ formulario_id: idx })

    await qUtils.findTune()
    const r = qUtils.getResults()
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
    objService.setParametros(PARAMETROS)
    await objService.getDataParams(dto)
    const result = objService.getResults()

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
    objService.setParametros(PARAMETROS)
    await objService.saveDataParams(dto)
    const result = objService.getResults()

    if(result)
    return {
      ok: true,     
      r:result, 
      message: 'Resultado exitoso. Parametros Guardados',
    }
    else return {
      ok: false,
      r:result,       
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
module.exports = {
  getfrmsConstuct,
  getFrmsInfo, getCnfForms, 
  saveCnfForms
}
