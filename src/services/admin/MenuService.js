const QueriesUtils = require('../../models/queries/QueriesUtils')

const {QueryTypes} = require("sequelize")

const db = require('../../models/index')

const tk =  require('./../utilService')


const appModel =  db.ae_institucion
const sequelize = db.sequelize

const menuGeoreferencia = async (token) =>{
try {
const datos =  tk.getCnfApp(token)


const app = new QueriesUtils(appModel)
//verifica si es usuario por tipo de institucion
let result = await app.findID(datos.inst)


let query = ""
switch (result.tipo_institucion_id) {
    case 'EG':
        query = `SELECT DISTINCT '/ssepi/sssscp/'||dpto.cod_dpto AS value, dpto.nombre_dpto AS text
        FROM ae_institucion ins, al_departamento dpto
        WHERE ins.cod_dpto =  dpto.cod_dpto
        AND ins.institucion_root = '${result.institucion_id}'
        ORDER BY 2`
        break;
    case 'EESS':
        query = `SELECT DISTINCT '/ssepi/sssscp/'||dpto.cod_dpto AS value, dpto.nombre_dpto AS text
        FROM ae_institucion ins, al_departamento dpto
        WHERE ins.cod_dpto =  dpto.cod_dpto
        AND ins.institucion_id = '${result.institucion_id}'
        ORDER BY 2`        
        break;
    default:
        query = "SELECT '' AS VALUE, '' AS text"
        break;        
}

result = await sequelize.query(query, { mapToModel: true, type: QueryTypes.SELECT, raw: false, });
if(result.length>0)
result.unshift({value:'/ssepi/sssscp/all', text:'Todos'})

return{
    ok:true,
    data: {georeferencia: result},
    message: 'Resultado exitoso'
}

} catch (error) {
    return {
        ok: false,
        message: "Error de sistema: MNGEOSRV",
        error: error.message
      }
};

}


module.exports = {
    menuGeoreferencia
}