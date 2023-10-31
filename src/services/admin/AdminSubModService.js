const subModuloModel = require('./../../models/queries/apControllerQueries')


const listar = async () => {
  try {
    const result = await subModuloModel.list()
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

  //verifica si esta registrado
  const result = await subModuloModel.find(data)
  
  if (result.length > 0) {
    return { ok: false, message: 'El controller Introducido ya esta registrado' }
  } else {
    try {

      const result = await subModuloModel.Create(data)
      if (result)
      return {
        ok: true,
        data: result,
        message: 'Datos Registrado exitosamente',
      }
      else  return {
        ok: false,        
        message: 'No se pudo registrar la informacion',
      }

    } catch (error) {
      return {
        ok: false,
        message: "Error de sistema: ADMSMODSRVG",
        error: error.message
      }
    }
  }
}
module.exports = {
  listar,
  guardar,
}
