const credencialModel = require('./../models/queries/auCredencialQueries')

const jwt = require('jsonwebtoken')
const config = require('./../config/config.cnf')
const bcrypt = require('bcrypt')

const listar = async () => await credencialModel.list()

const login = async (usr) => {
  try {
    const result = await credencialModel.findDataOne(usr)
console.log("consulta ior uno:", result)
    if (!result) return { message: 'Usuario incorrecto', ok: false }
    else {
      const aux = await bcrypt.compare(usr.password, result.hash)
      if (aux) {
        const payload = {
          usr: result.login, //usr.usuario
          dni: result.dni_persona, //usr._id
          app: result.aplicacion_id,
          inst: result.institucion_id,
          time: new Date(),
        }
  
        let token = jwt.sign(payload, config.JWT_SECRET, {
          expiresIn: config.JWT_TIME,
        })
  
        return {
          ok: true,
          message: 'Bienvenido Al Sistema: ' + result.login,
          access_token: token,
          pages: [],
          usuario: payload
          
        }
      } else {
        return { mensaje: 'Contraseña incorrecto', ok: false }
      }
    }
  } catch (error) {
    console.log("error:::", error)
    return {      
      ok: false,
      message: "Error de sistema: CRESRV" ,
      error: error.message
    }
  };
  
}

const guardar = async (usr) => {
  //verifica si esta registrado
  const result = await credencialModel.find(usr)
  
  if (result.length>0) {
    return { ok: false, mensaje: 'El usuario Introducido ya esta registrado' }
  } else {
    try {
      const BCRYPT_SALT_ROUNDS = 12
      usr.password = await bcrypt.hash(usr.password, BCRYPT_SALT_ROUNDS)

      const user = await credencialModel.Create(usr)

      return {
        ok: true,
        datos: user,
        mensaje: 'Usuario Registrado exitosamente',
      }
    } catch (error) {
      return {
        ok: false,
        message: error,
      }
    }
  }
}
module.exports = {
  listar,
  login,
  guardar,
}
