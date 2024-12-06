const db = require('./../models/index')
const QueriesUtils = require('./../models/queries/QueriesUtils')

const QUtils =  require('./../models/queries/Qutils')
const qUtil =  new QUtils()

const FrmUtils = require('./frms/FrmsUtils')
const frmUtil = new FrmUtils()


const credencialModel = require('./../models/queries/auCredencialQueries')

//const tk = require('./../services/utilService')

const handleJwt =  require("./../utils/handleJwt")
const handleToken = require("./../utils/handleToken")

const eessModel = db.ae_institucion
const userModel = db.au_persona
const appModel =  db.ap_aplicacion

const listar = async () => await credencialModel.list()

const getLogin = async (dto,handleError) => {
  try {
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()//handleToken.verifyToken(dto.token)//tk.getCnfApp(dto.token)
    
    qUtil.setTableInstance('ae_institucion')    
    await qUtil.findID(obj_cnf.institucion_id)
    const institucion = qUtil.getResults()

    qUtil.setTableInstance('au_persona')
    await qUtil.findID(obj_cnf.dni_register)    
    const user = qUtil.getResults()

    qUtil.setTableInstance("ap_aplicacion")
    await qUtil.findID(obj_cnf.aplicacion_id)    
    const appp =  qUtil.getResults()

    
    const credencial = obj_cnf//await credencialModel.findDataOne({ login: datos.usr })

    return {
      ok: true,
      dates: Intl.DateTimeFormat().resolvedOptions().timeZone,//
      hora: new Date().toString(),
      hh: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
      institucion: institucion,
      usr: user,
      data: credencial,
      aplicacion: appp,
      message: "Datos Obtenidos Exitosamente"
    }

  } catch (error) {
 console.log("\n\n ******************:::", error)
    handleError.setMessage("Error de sistema: GLGNSRV")
    handleError.setHttpError(error.message)
}

  


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
        
        //realiza registro log DB de acceso
        qUtil.setTableInstance("apu_usuario_log")
        qUtil.setDataset({  date_in: qUtil.literal('CURRENT_TIMESTAMP'),
          //ip_in:usr.ip,          
          login: result.login,
          institucion_id:result.institucion_id,
          dni_persona:result.dni_persona,
          aplicacion_id:result.aplicacion_id})
        //await qUtil.create()  


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
    console.log("\n\n", error)       
        handleError.setMessage("Error de sistema: CRESRV")
        handleError.handleHttpError(error.message)    
  };

}



const modify = async (dto, handleError) => {

  try {
    frmUtil.setToken(dto.token)
    const datos = frmUtil.getObjSessionForModify()//handleToken.verifyToken(dto.token)//tk.getCnfApp(dto.token)
    const hash = await handleJwt.encrypt(dto.pass)//await tk.genPass(datos.usr, dto.pass)

    qUtil.setTableInstance("apu_credencial")
    qUtil.setDataset({
      password: Number(new Date()),
      hash: hash,
      last_modify_date_time: new Date(),
      dni_register: datos.dni_register
    })
    qUtil.setWhere({ login: datos.login })

    await qUtil.modify()

    if(qUtil.getResults()[0])
    return {
      ok: true,           
      message: 'Usuario: Password modificado exitosamente. Por favor Vuelva a Autentificarse',
    }
    else return{
      ok:false,
      message:"No se pudo Modificar."
    }
  } catch (error) {
    console.log("errir", error)
    console.log("\n\n ******************:::", error)
    handleError.setMessage("Error de sistema: LGNMDFYNSRV")
    handleError.setHttpError(error.message)    
  }

}

const getLoginApp =  async (dto, handleError) => {
  try {
    frmUtil.setToken(dto.token)
    const ids = frmUtil.getGroupIdsInstitucion()

    const query = ``

  } catch (error) {
    handleError.setMessage("Error de sistema: LGNLOGSRV")
    handleError.setHttpError(error.message)    
  }
}
module.exports = {
  listar, getLogin,
  login,
  guardar, modify, getLoginApp
}
