const parametros = JSON.stringify(require('./parameters'))
const PARAMETROS = JSON.parse(parametros)

const cnf_cboxs = JSON.stringify(require('./params_cboxs'))
const PCBOXS = JSON.parse(cnf_cboxs)


const QUtils = require('./../../models/queries/Qutils')
const qUtil = new QUtils()

const FrmUtils = require('./../frms/FrmsUtils')
const services = new FrmUtils()

const tk = require('./../../services/utilService')

const getDataForParam = async (dto) => {
  try {
    dto.modelos = [dto.modelo]
    services.setParametros(PARAMETROS)
    await services.getDataParams(dto)
    const result = services.getResults()

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
      error: error,
    }
  }
}


const getDataModelByIdxModel = async (dto) => {
  dto.modelos = [dto.modelo]
  services.setParametros(PARAMETROS)
  await services.getDataParams(dto)
  const result = services.getResults()
  //dato nuevo cambia estado de edicion sy hubiese
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
    message: 'Resultado exitoso. Parametros obtenidos'
  }
}


const saveDataModifyInsertByModel = async (dto) => {
  try {
    console.log("\n\n\n\n\n GUARDANDOOOO DESDE EL SERVICIO .......................")
    dto.modelos = [dto.modelo]
    services.setParametros(PARAMETROS)
    await services.saveDataParams(dto)
    const result = services.getResults()

    if (result)
      return {
        ok: true,
        r: result,
        message: 'Resultado exitoso. Parametros Guardados',
      }
    else return {
      ok: false,
      r: result,
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
 * Guarda usr en rol y login
 * @param {*} dto 
 * @returns 
 */
const saveUsr = async (dto) => {
  try {
    console.log("\n\n\n\n\n GUARDANDOOOO DESDE EL SERVICIO .......................")
    dto.modelos = ['aep_institucion_personal', 'apu_credencial', 'apu_credencial_rol']
    const session = tk.getCnfApp(dto.token)
    //dto.data
    const obj = dto.data
    //obj.institucion_id = session.inst
    obj.dni_register = session.dni
    //obj.aplicacion_id = session.app

    obj.activo = 'Y'
    obj.hash = await tk.genPass(obj.login, obj.passs)

    await qUtil.startTransaction()
    let r = ""
    for (const modelo of dto.modelos) {
      obj.create_date = new Date()
      //setea tabla
      qUtil.setTableInstance(modelo)
      //setea campos insertar      
      qUtil.setDataset([obj])

      //ejecuta orden  
      await qUtil.createwLote()
      //await qUtil.create()
      r = qUtil.getResults()
    }
    await qUtil.commitTransaction()

    return {
      ok: true,
      //r: result,
      message: 'Resultado exitoso. Parametros Guardados',
    }

  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error de sistema: OBJSAVEUSRCNF',
      error: error.message
    }
  }
}

const getDataCboxForModel = async (dto) => {
  try {
    dto.modelos = [dto.modelo]
    services.setParametros(PCBOXS)
    await services.makerDataComboDependency(dto)
    const CboxResult = services.getResults()

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
      message: 'Error de sistema: OBJADMINCBOXDEP',
      error: error.message,
    }
  }
}

const treeEess = async (dto) => {
  try {
    const idx = dto.idx
    qUtil.setTableInstance('ae_institucion')
    qUtil.setAttributes([
      ['institucion_id', 'id'], ['nombre_institucion', 'name'], 'nombre_corto', ['tipo_institucion_id', 'type']
    ])

    //qUtils.setOrder([qUtils.getGestor().col('sections.orden'), qUtils.getGestor().col('sections.questions.orden'), qUtils.getGestor().col('sections.questions.answers.orden'), qUtils.getGestor().col('sections.questions.questions.orden')])
    qUtil.setOrder(['tipo_institucion_id', qUtil.col('children.tipo_institucion_id')])

    let cnf = {
      association: 'children',
      attributes: [['institucion_id', 'id'], ['nombre_institucion', 'name'], 'nombre_corto', ['tipo_institucion_id', 'type']],
      required: false,
      where: { tipo_institucion_id: qUtil.distinto('EESS') },
      include: [
        {
          association: 'children',
          attributes: [['institucion_id', 'id'], ['nombre_institucion', 'name'], 'nombre_corto', ['tipo_institucion_id', 'type']],
          required: false,
          where: { tipo_institucion_id: qUtil.distinto('EESS') },

        },
      ],
    }
    qUtil.setInclude(cnf)
    /*cnf = {      
     association:'others',        
     attributes: [['tipo_opcion_id','tipo']],
     where:{activo:'Y'},            
     include:[{        
       association:'frm',
       attributes: [['titulo','title'],['tipo_opcion_id','type']],
     }]
   }
   qUtils.pushInclude(cnf)*/
    qUtil.setWhere({ institucion_root: idx })

    await qUtil.findTune()
    const r = qUtil.getResults()
    return {
      ok: true,
      data: r,
      message: 'Resultado exitoso. Parametros obtenidos',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error de sistema: ADMTREESDATA',
      error: error.message,
    }
  }
}

module.exports = {
  getDataForParam,
  getDataModelByIdxModel,
  saveDataModifyInsertByModel, saveUsr,
  getDataCboxForModel,
  treeEess
}