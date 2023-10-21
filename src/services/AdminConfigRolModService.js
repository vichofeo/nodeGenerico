const QueriesUtils = require('../models/queries/QueriesUtils')
const { QueryTypes } = require("sequelize");


const db = require('../models/index')
const { v4: uuidv4 } = require('uuid');

const aplicacionModel = db.ap_aplicacion
const rolModel = db.ap_roles
const moduloModel = db.ap_modulo
const submoduloModel = db.ap_controller
const rpModel = db.ap_rol_pagina
const mcaModel = db.ap_m_c_a

const sequelize = db.sequelize;



const listar = async (dataDTO) => {
  try {
    const aplicacion = new QueriesUtils(aplicacionModel)
    const rol = new QueriesUtils(rolModel)
    const modulo = new QueriesUtils(moduloModel)
    const submodulo = new QueriesUtils(submoduloModel)
    const rolPagina = new QueriesUtils(rpModel)
    const mca = new QueriesUtils(mcaModel)

    const result = {}
    const data = {
      attributes: aplicacion.transAttribByComboBox('aplicacion_id,nombre_aplicacion'),
      where: null
    }

    result.aplicacion = await aplicacion.findTune(data)
    result.aplicacionSelected = aplicacion.searchBySelectedComboData(result.aplicacion, dataDTO.aplicacionSelected)

    data.attributes = rol.transAttribByComboBox('rol_id,nombre_rol')
    data.where = { aplicacion_id: result.aplicacionSelected.value }
    result.rol = await rol.findTune(data)
    result.rolSelected = rol.searchBySelectedComboData(result.rol, dataDTO.rolSelected)

    /*data.attributes = []
    data.where = null
    data.include= [{
      model: moduloModel,
      as: 'modulo',
      attributes: mca.transAttribByComboBox('modulo_id,nombre_modulo'),      
    }],    
    result.modulo =  await mca.findTuneAdvanced(data)
    result.modulo =  mca.modifyFindAdvanced(result.modulo, 'modulo')        
    result.moduloSelected = modulo.searchBySelectedComboData(result.modulo, dataDTO.moduloSelected)
*/


    let query = `SELECT distinct m.modulo_id as  value, m.nombre_modulo as text 
FROM ap_modulo m, ap_m_c_a cnf
WHERE cnf.modulo_id=m.modulo_id
ORDER BY m.nombre_modulo`
    result.modulo = await sequelize.query(query, { mapToModel: true, type: QueryTypes.SELECT, raw: false, });
    result.moduloSelected = modulo.searchBySelectedComboDataNotransform(result.modulo, dataDTO.moduloSelected)

    data.attributes = [[sequelize.literal('DISTINCT(modulo_id)'), 'modulo_id'],]
    data.where = {aplicacion_id: result.aplicacionSelected.value, 
      rol_id: result.rolSelected.value,
     action_id: 'V' , activo:'Y'}
    result.moduleExist = await rolPagina.findTune(data)
    result.moduleExist = result.moduleExist.map(obj => (obj.modulo_id))


   


    return {
      ok: true,
      message: "Resultado exitoso",
      data: result
    }
  } catch (error) {
    return {
      ok: false,
      message: "Error de sistema: ADMCNFROLSRV",
      error: error.message
    }
  };


}



const guardar = async (data) => {
  try {
    const app = req.body
    console.log("***********INICIANDO**********")
    let query = `SELECT distinct modulo_id 
  FROM ap_rol_pagina 
  WHERE aplicacion_id='${app.app}' 
  AND rol_id='${app.role}' 
  AND action_id='V' 
  and modulo_id not in ('${app.module.join("','")}')  `
    let aux = await sequelize.query(query, { mapToModel: true, type: QueryTypes.SELECT, raw: false, });
    console.log("***********Q1**********")
    //actualiza estado
    if (aux.length > 0) {

      let existentes = aux.map(obj => (obj.modulo_id))

      query = `update ap_rol_pagina
      SET activo = 'N'
      WHERE aplicacion_id='${app.app}' 
      AND rol_id='${app.role}' 
      AND action_id='V'  and modulo_id  in ('${existentes.join("','")}') `
      await sequelize.query(query, { mapToModel: true, type: QueryTypes.UPDATE, raw: false, });
    }

    query = `SELECT distinct modulo_id  
  FROM ap_rol_pagina 
  WHERE aplicacion_id='${app.app}' 
  AND rol_id='${app.role}' 
  AND action_id='V'  
  and modulo_id in ('${app.module.join("','")}')
  `
  console.log("***********Q2**********")
    aux = await sequelize.query(query, { mapToModel: true, type: QueryTypes.SELECT, raw: false, });

    if (aux.length > 0) {
      let existentes = aux.map(obj => (obj.modulo_id))
      //diferencia
      const intersection = existentes.filter(x => app.module.includes(x))

      query = `update ap_rol_pagina
      SET activo = 'Y'
      WHERE aplicacion_id='${app.app}' 
      AND rol_id='${app.role}' 
      AND action_id='V'  and modulo_id in ('${intersection.join("','")}') `
      await sequelize.query(query, { mapToModel: true, type: QueryTypes.UPDATE, raw: false, });

      const diferencia = app.module.filter(x => !existentes.includes(x));
      app.controller = diferencia
    }

    //inserta
    query = `INSERT INTO ap_rol_pagina(rol_id, modulo_id, controller, action_id, aplicacion_id, create_date)
        
    SELECT '${app.role}', modulo_id, controller, action_id, aplicacion_id, sysdate() 
    FROM ap_m_c_a
    WHERE 
    modulo_id not in(
      SELECT distinct modulo_id FROM ap_rol_pagina 
      WHERE aplicacion_id='${app.app}' 
      AND modulo_id='${app.module}' 
      AND action_id='V'
      and rol_id='${app.role}' )
     and modulo_id in ('${app.module.join("','")}') `
    await sequelize.query(query, { mapToModel: true, type: QueryTypes.INSERT, raw: false, });
    console.log("***********Q3**********")
    res.json({
      status: 'OK',
      mensaje: "Guardado Exitoso",
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
