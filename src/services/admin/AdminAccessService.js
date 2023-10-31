const QueriesUtils = require('../../models/queries/QueriesUtils')
const { QueryTypes } = require("sequelize");

const db = require('../../models/index')
const { v4: uuidv4 } = require('uuid');

const peopleModel = db.au_persona
const aplicacionModel = db.ap_aplicacion
const institucionModel = db.ae_institucion
const rpModel = db.ap_rol_pagina

const loginModel =  db.apu_credencial

const sequelize = db.sequelize;

//busca persona por ci
async function searchPeople(datos) {
  try {

    const people = new QueriesUtils(peopleModel)
    let results = await people.findID(datos.dni_persona)
    let respuesta = {};

if(!results){
  respuesta = {
    ok: false,
    message: "Busqueda infructifera",
  }
}else if ( results.length > 1) {
      respuesta = {
        ok: false,
        message: "Especifique mejor su busqueda existe mas de un registro, ingrese '-Complemento'",
      };
    } else if (results.length == 0) {
      respuesta = {
        ok: false,
        message: "No existe registro con esos datos",
      };
    } else {
      respuesta = {
        ok: true,
        data: results,
        message: "Busqueda exitosa."
      };
    }

    return respuesta
  } catch (e) {
    return {
      ok: false,
      message: "Error de sistema: ADMCRESPPRV",
      error: e.message
    }
  }
}

// Listar
async function getDataCredencial(data) {
  try {

    const people = new QueriesUtils(peopleModel)
    const result = {}

    console.log("************* 0. INICIO *************", data)

    //TIPO INSTITUCION
    let query = `SELECT distinct t.atributo_id as value, t.atributo as text
    FROM ae_institucion i, r_is_atributo t
    WHERE i.tipo_institucion_id=t.atributo_id
    ORDER BY t.atributo`;
    result.tipoItems = await sequelize.query(query, { mapToModel: true, type: QueryTypes.SELECT, raw: false })
    result.tipoSelected = people.searchBySelectedComboDataNotransform(result.tipoItems, data.tipoSelected)

    console.log("************* 1. TIPO INSTITUCION*************", result.tipoSelected)

    //datos de instirucion
    const institucion = new QueriesUtils(institucionModel)
    const cnfdata = {
      attributes: institucion.transAttribByComboBox('institucion_id,nombre_institucion'),
      where: { tipo_institucion_id: result.tipoSelected.value }
    }
    result.institucionItems = await institucion.findTune(cnfdata)
    result.institucionSelected = institucion.searchBySelectedComboDataNotransform(result.institucionItems, data.institucionSelected)

    
console.log("========== 2. INSTITUCION=========", result.institucionItems)
    //datos de la aplicacion segun rolPagina
    const aplicacion = new QueriesUtils(aplicacionModel)
    /*data.attributes = aplicacion.transAttribByComboBox('aplicacion_id','nombre_aplicacion')
    data.where = []
    data.include= [{
      model: rpModel,
      as: 'rp',      
    }], 
    result.appItems =  await aplicacion.findTuneAdvanced(data)
    result.appSelected = aplicacion*/

    query = `SELECT distinct a.aplicacion_id as value, a.nombre_aplicacion as text
    FROM ap_aplicacion a, ap_rol_pagina rp
    WHERE rp.aplicacion_id=a.aplicacion_id ` ;
    result.appItems = await sequelize.query(query, { mapToModel: true, type: QueryTypes.SELECT, raw: false, });
    result.appSelected = aplicacion.searchBySelectedComboDataNotransform(result.appItems, data.appSelected)

console.log("========== 3. APLICACION=========", result.appSelected)
    query = ` SELECT distinct r.rol_id as value, r.nombre_rol as text 
    FROM ap_roles r, ap_rol_pagina rp
    WHERE r.rol_id=rp.rol_id AND rp.aplicacion_id = '${result.appSelected.value}'
    ORDER BY r.nombre_rol`;
    result.rolItems = await sequelize.query(query, { mapToModel: true, type: QueryTypes.SELECT, raw: false, });
    result.rolSelected = aplicacion.searchBySelectedComboDataNotransform(result.rolItems, data.rolSelected);
    console.log("========== 4. ROL PAGINA***=========", result.appSelected)
    return {
      ok: true,
      data: {
        tipo: { tipoSelected:result.tipoSelected, tipoItems:result.tipoItems },
        institucion: { institucionSelected:result.institucionSelected, institucionItems:result.institucionItems },
        app: { appSelected:result.appSelected, appItems:result.appItems },
        rol: { rolSelected:result.rolSelected, rolItems:result.rolItems }
      },
      message: "dato encontrado"
    }

  } catch (e) {
    return {
      ok: false,
      message: "Error de sistema: ADMCRESRV",
      error: e.message
    }

  }
}
// Guardar
async function creGuardar(data) {
  let login = data.login;
  let pass = data.pass;

  const result = {}
  const credencial  =  new QueriesUtils(loginModel)

  const cnfdata = {
    attributes: ['login'],
    where: {login: login}   }
  
    result.user = await credencial.findTune(cnfdata)

  if (result.user.length > 0) {
    return{
      ok: false,
      message: "el Usuario se encuentra registrado",
      error: result.user
    };
  } else {
    try {

      let BCRYPT_SALT_ROUNDS = 12;
      const pass_real = await bcrypt.hash(pass, BCRYPT_SALT_ROUNDS);

      const app_id = data.app.value
      const ins_id = data.institucion.value
      const rol_id = data.rol.value
      const dni = data.people.dni_persona

      //inserta APLI INSTIUTUON
      query = `INSERT INTO ape_aplicacion_institucion(aplicacion_id, institucion_id, create_date)
      select '${app_id}', '${ins_id}', NOW()      
      where ('${app_id}', '${ins_id}') not in (SELECT aplicacion_id, institucion_id FROM ape_aplicacion_institucion )`
      await sequelize.query(query, { mapToModel: true, type: QueryTypes.INSERT, raw: false, });

      //INSERT PERSONA INSTITUION
      query = `INSERT INTO aep_institucion_personal(aplicacion_id, institucion_id, dni_persona, create_date)
      select '${app_id}', '${ins_id}', '${dni}', NOW()      
      where ('${app_id}', '${ins_id}', '${dni}') not in (SELECT aplicacion_id, institucion_id, dni_persona FROM aep_institucion_personal )`
      await sequelize.query(query, { mapToModel: true, type: QueryTypes.INSERT, raw: false, });
      //CREDENCIAL
      query = `INSERT INTO apu_credencial(login, aplicacion_id, institucion_id, dni_persona, password, hash, create_date)
      VALUES ('${login}', '${app_id}', '${ins_id}', '${dni}', '', '${pass_real}', NOW())  `
      await sequelize.query(query, { mapToModel: true, type: QueryTypes.INSERT, raw: false, });

      //ROL
      query = `INSERT INTO apu_inst_pers_rols(login, rol_id, create_date )
      VALUES ('${login}', '${rol_id}', NOW())  `
      await sequelize.query(query, { mapToModel: true, type: QueryTypes.INSERT, raw: false, });

      res.json({
        status: "ok",
        mensaje: "usuario registrado",
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = {
  searchPeople,
  getDataCredencial,
  creGuardar,
}
