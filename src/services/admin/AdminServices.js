const parametros =  JSON.stringify(require('./parameters'))
const PARAMETROS =  JSON.parse(parametros)

const cnf_cboxs = JSON.stringify(require('./params_cboxs'))
const PCBOXS = JSON.parse(cnf_cboxs)

const QUtils =  require('./../../models/queries/Qutils')
const qUtil =  new QUtils()

const FrmUtils =  require('./../frms/FrmsUtils')
const services = new FrmUtils()

const getDataForParam = async (dto)=>{
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
    if(dto.new){
      for (const key in result) {
        for (const index in result[key].campos) {
          if(!result[key].campos[index][1])
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

const getDataCboxForModel = async (dto)=>{
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

  module.exports={
    getDataForParam,
    getDataModelByIdxModel,
    saveDataModifyInsertByModel,
    getDataCboxForModel
  }