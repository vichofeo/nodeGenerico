const QueriesUtils = require('../../utils/queries/QueriesUtils')

const db = require('../../models/index')
const { v4: uuidv4 } = require('uuid');

const aplicacionModel = db.ap_aplicacion
const moduloModel = db.ap_modulo
const submoduloModel = db.ap_controller
const mcaModel = db.ap_m_c_a

const sequelize = db.sequelize;



const listar = async (dataDTO) => {
  try {
    const aplicacion =new QueriesUtils(aplicacionModel)
    const modulo =  new QueriesUtils(moduloModel)
    const submodulo = new QueriesUtils(submoduloModel)
    const mca = new QueriesUtils(mcaModel)
    
    const result = {}
    const data = {
      attributes: aplicacion.transAttribByComboBox('aplicacion_id,nombre_aplicacion'),
      where: null
    }
    
    result.aplicacion =  await aplicacion.findTune(data)
    result.aplicacionSelected = aplicacion.searchBySelectedComboData(result.aplicacion, dataDTO.aplicacionSelected)
    data.attributes = modulo.transAttribByComboBox('modulo_id,nombre_modulo')
    result.modulo = await modulo.findTune(data)
    result.moduloSelected = modulo.searchBySelectedComboData(result.modulo, dataDTO.moduloSelected)
    data.attributes = submodulo.transAttribByComboBox('controller,nombre_submodulo')
    result.submodulo = await submodulo.findTune(data)
    result.submoduloSelected = submodulo.searchBySelectedComboData(result.submodulo, dataDTO.submoduloSelected)


    data.attributes = ['controller']
    data.where = {
    modulo_id: result.moduloSelected.value,
    action_id: 'V', activo: 'Y' 
  }
  const temp= await mca.findTune(data)
  result.controllerExist = temp.map(obj => (obj.controller))


    return {
      ok: true,
      message: "Resultado exitoso",
      data: result
    }
  } catch (error) {
    return {
      ok: false,
      message: "Error de sistema: ADMSMODSRV",
      error: error.message
    }
  };


}



const guardar = async (data) => {
  try {
    const app = req.body
    let query = `SELECT controller 
  FROM ap_m_c_a 
  WHERE 
  modulo_id='${app.module}' 
  AND action_id='V' 
  and controller not in ('${app.controller.join("','")}')  `
    let aux = await sequelize.query(query, { mapToModel: true, type: QueryTypes.SELECT, raw: false, });

    //actualiza estado
    if (aux.length > 0) {

      let existentes = aux.map(obj => (obj.controller))

      query = `update ap_m_c_a
      SET activo = 'N'
      WHERE aplicacion_id='${app.app}' 
      AND modulo_id='${app.module}' 
      AND action_id='V' and controller  in ('${existentes.join("','")}') `
      await sequelize.query(query, { mapToModel: true, type: QueryTypes.UPDATE, raw: false, });
    }

    query = `SELECT controller 
  FROM ap_m_c_a 
  WHERE 
  modulo_id='${app.module}' 
  AND action_id='V' 
  and controller in ('${app.controller.join("','")}')
  `
    aux = await sequelize.query(query, { mapToModel: true, type: QueryTypes.SELECT, raw: false, });

    if (aux.length > 0) {
      let existentes = aux.map(obj => (obj.controller))
      //diferencia
      const intersection = existentes.filter(x => app.controller.includes(x))

      query = `update ap_m_c_a
      SET activo = 'Y'
      WHERE 
      modulo_id='${app.module}' 
      AND action_id='V' and controller in ('${intersection.join("','")}') `
      await sequelize.query(query, { mapToModel: true, type: QueryTypes.UPDATE, raw: false, });

      const diferencia = app.controller.filter(x => !existentes.includes(x));
      app.controller = diferencia
    }

    //inserta
    query = `INSERT INTO ap_m_c_a( modulo_id, controller, action_id)
    SELECT '${app.module}', controller , 'V'
    FROM ap_controller
    WHERE 
    controller not in(
      SELECT controller FROM ap_m_c_a 
      WHERE 
      modulo_id='${app.module}' 
      AND action_id='V' )
     and controller in ('${app.controller.join("','")}') `
    await sequelize.query(query, { mapToModel: true, type: QueryTypes.INSERT, raw: false, });

    res.json({
      ok: true,
      message: "Guardado Exitoso",
    })
  } catch (e) {
    res.json({
      ok: false,
      status: 404,
      message: "Error el guardado",
      error: e
    });
  } 
  
  
}
module.exports = {
  listar,
  guardar,
}
