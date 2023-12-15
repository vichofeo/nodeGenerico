const db = require('./../models/index')
const QueriesUtils = require('./../models/queries/QueriesUtils')

const credencialModel = require('./../models/queries/auCredencialQueries')

const tk = require('./../services/utilService')

const jwt = require('jsonwebtoken')
const config = require('./../config/config.cnf')
const bcrypt = require('bcrypt')

const eessModel = db.ae_institucion
const userModel = db.au_persona
const appModel =  db.ap_aplicacion

const listar = async () => await credencialModel.list()

const getLogin = async (dto) => {
  try {
    const datos = tk.getCnfApp(dto.token)
    const app = new QueriesUtils(eessModel)
    const institucion = await app.findID(datos.inst)
    const usr = new QueriesUtils(userModel)
    const user = await usr.findID(datos.dni)
    const ap =  new QueriesUtils(appModel)
    const appp =  await ap.findID(datos.app)
    const credencial = await credencialModel.findDataOne({ login: datos.usr })

    return {
      ok: true,
      institucion: institucion,
      usr: user,
      data: credencial,
      aplicacion: appp,
      message: "Datos Obtenidos Exitosamente"
    }

  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Error de sistema: GLGNSRV",
      error: error.message
    }
  };


}


const login = async (usr) => {
  try {
    const result = await credencialModel.findDataOne(usr)

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
      message: "Error de sistema: CRESRV",
      error: error.message
    }
  };

}

const guardar = async (usr) => {
  //verifica si esta registrado
  const result = await credencialModel.find(usr)

  if (result.length > 0) {
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

const modify = async (dto) => {

  try {
    const datos = tk.getCnfApp(dto.token)
    const hash = await tk.genPass(datos.usr, dto.pass)

    const payload = {
      set: {
        password: "",
        hash: hash,
        last_modify_date_time: new Date(),
        dni_register: datos.dni
      },
      where: {
        institucion_id: datos.inst,
        aplicacion_id: datos.app,
        dni_persona: datos.dni,
        login: datos.usr,
      }
    }
    console.log("paload:::", payload)
     await credencialModel.ModifyLogin(payload)

    return {
      ok: true,      
      message: 'Usuario: Password modificado exitosamente. Por favor Vuelva a Autentificarse',
    }
  } catch (error) {
    console.log("errir", error)
    return {
      ok: false,
      message: error,
    }
  }

}
module.exports = {
  listar, getLogin,
  login,
  guardar, modify
}
