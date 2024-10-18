const db = require('./../models/index')
const QueriesUtils = require('./../models/queries/QueriesUtils')

const QUtils =  require('./../models/queries/Qutils')
const qUtil =  new QUtils()

const credencialModel = require('./../models/queries/auCredencialQueries')

const tk = require('./../services/utilService')

const handleJwt =  require("./../utils/handleJwt")
const handleToken = require("./../utils/handleToken")

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

const guardar = async (usr, handleError) => {
  //verifica si esta registrado
  const result = await credencialModel.find(usr)

  if (result.length > 0) {
    handleError.setCode(401)
    handleError.setMessage('USER_EXISTS')
    return { ok: false, message: 'El usuario Introducido ya esta registrado' }
  } else {
    try {      
      usr.password = await handleJwt.encrypt(usr.password)
      
      const user = await credencialModel.Create(usr)

      return {
        ok: true,
        datos: user,
        message: 'Usuario Registrado exitosamente',
      }
    } catch (error) {
      handleError.setMessage("Error de sistema: CRUDLGNSRV")
        handleError.handleHttpError(error.message)    
    }
  }
} 

const login = async (usr, handleError) => {
  try {
    const result = await credencialModel.findDataOne(usr)

    if (!result) {
      handleError.setMessage("USER_NOT_EXISTS")
      handleError.setCode(404)
      return { message: 'Usuario incorrecto', ok: false }
    } else {
      const aux = await handleJwt.compare(usr.password, result.hash)      
      if (aux) {
        //obtiene el tipo de insitucion
        const eess =  new QueriesUtils(eessModel)
        const resultInst =  await eess.findID(result.dataValues.institucion_id)
        result.tipo_institucion =  resultInst.tipo_institucion_id   
        
        //genera token
        const  token = await handleToken.tokenSign(result)

        //obtiene informacion del rol y sus componentes
        qUtil.setTableInstance('apu_credencial')
        qUtil.setAttributes(['dni_persona', 'login', 'activo', 'sw'])
        let cnf =  {
          association: 'rol',                    
          where: { activo: 'Y' },    
          attributes:['aplicacion_id','role']      
        }
        qUtil.setInclude(cnf)
        qUtil.setWhere({login:result.login})
        await qUtil.findTune()
        const r =  qUtil.getResults()

        //busca informacion de rutas
        qUtil.setTableInstance('ap_routes_cnf')
        let routes = []
        let index = 0
        for (const element of r[0].rol) {                              
          const condicion = JSON.parse(JSON.stringify(element))// r[0].rol[index].dataValues
          
          cnf =  {
            association: 'modulo',                    
            where: { activo: 'Y' }             
          }
          qUtil.setInclude(cnf)
          cnf =  {
            association: 'componente',                    
            where: { activo: 'Y' }             
          }
          qUtil.setAttributes(['role','module', 'component'])
          qUtil.pushInclude(cnf)
          qUtil.setWhere(condicion)
          qUtil.setOrder(['module'])
          await qUtil.findTune()
          if(index==0)
          routes= qUtil.getResults()
        else 
        routes.push(qUtil.getResults())
          qUtil.setResetVars()

        }
        
        


        return {
          ok: true,
          message: 'Bienvenido Al Sistema: ' + result.login,
          access_token: token,
          rol: r[0],
          routes: routes
        }
      } else {
        handleError.setMessage("PASSWORD_INVALID")
        handleError.setCode(402)
        return { message: 'Contraseña incorrecto', ok: false }
      }
    }
  } catch (error) {        
        handleError.setMessage("Error de sistema: CRESRV")
        handleError.handleHttpError(error.message)    
  };

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
