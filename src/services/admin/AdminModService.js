const moduloModel = require('./../../utils/queries/apModuloQueries')

const listar = async () => {
  try {
    const result = await moduloModel.list()
    return {
      ok: true,
      message: "Resultado exitoso",
      data: result
    }
  } catch (error) {
    return {
      ok: false,
      message: "Error de sistema: ADMMODSRV",
      error: error.message
    }
  };


}



const guardar = async (data) => {

  //verifica si esta registrado
  const result = await moduloModel.find(data)
  
  if (result.length > 0) {
    return { ok: false, message: 'El modulo Introducido ya esta registrado' }
  } else {
    try {

      const result = await moduloModel.Create(data)
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
        message: "Error de sistema: ADMMODSRVG",
        error: error.message
      }
    }
  }
}
module.exports = {
  listar,
  guardar,
}
