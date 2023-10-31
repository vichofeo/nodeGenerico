const QueriesUtils = require('../../models/queries/QueriesUtils')

const db = require('../../models/index')
const { v4: uuidv4 } = require('uuid');

const rolModel = db.ap_roles
const aplicacionModel = db.ap_aplicacion

const sequelize = db.sequelize;



const listar = async () => {
  try {
    const aplicacion = new QueriesUtils(aplicacionModel)
    //let result = await  rol.find()

    const result = {}
    result.rolItems =   await rolModel.findAll({
      include: [{
        model: aplicacionModel,
        as: 'aplicacion',
        attributes: [          
          'nombre_aplicacion', 'version'
        ]
      }],
    }) 

    const data = {
      attributes: aplicacion.transAttribByComboBox('aplicacion_id,nombre_aplicacion'),
      where: null
    }
    result.aplicacion =  await aplicacion.findTune(data)
    result.aplicacionSelected = aplicacion.searchBySelectedComboData(result.aplicacion, {text:'-1',value:'-1'})
    
    return {
      ok: true,
      message: "Resultado exitoso",
      data: result
    }
  } catch (error) {
    return {
      ok: false,
      message: "Error de sistema: ADMROLSRV",
      error: error.message
    }
  };


}



const guardar = async (data) => {
  try {
    const rol = new QueriesUtils(rolModel)

data = {...data, rol_id: uuidv4(), create_date : new Date()}

    let result = await rol.create(data)
      if (result){
    result = await listar()
    
      return {
        ok: true,
        data: result.data,
        message: 'Datos Registrado exitosamente',
      }
      }else  return {
        ok: false,        
        message: 'No se pudo registrar la informacion',
      }
  } catch (error) {
    return {
      ok: false,
      message: "Error de sistema: ADMROLSRV",
      error: error.message
    }
  } 
  
  
}
module.exports = {
  listar,
  guardar,
}
