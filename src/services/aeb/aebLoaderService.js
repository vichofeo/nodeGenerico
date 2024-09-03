const QUtils = require('./../../models/queries/Qutils')
const qUtil = new QUtils()


const LOADERS = JSON.parse(JSON.stringify(require('./parametersLoad')))



const initialData = (dto, handleError) => {
  try {
    const data = LOADERS
    return{
      ok: true,
      data: data,
    }
  } catch (error) {
    console.log(error)
    handleError.setMessage('Error de sistema: LOADINITIALSRV')
    handleError.setHttpError(error.message)
    console.log('error:::', error)
  }
}

const statusTmps = async (dto, handleError) => {
  try {
    const modelos = LOADERS
    
    let response = {}
    for (const key in modelos) {
      element = modelos[key]
      
      qUtil.setTableInstance(element.alias)
      qUtil.setAttributes([
        [qUtil.literal("to_char(fecha_vacunacion, 'YYYY-MM')"), 'periodo'],
        [qUtil.literal('count(*)'), 'registros'],
      ])
      qUtil.setGroupBy([qUtil.literal("to_char(fecha_vacunacion, 'YYYY-MM')")])
      qUtil.setOrder([[qUtil.literal("to_char(fecha_vacunacion, 'YYYY-MM')"), 'DESC']])
      await qUtil.findTune()
      response = { ...response, [key]: qUtil.getResults() }
    }

    return {
      ok: true,
      data: response,
      message: 'Requerimiento atendido exitosamente',
    }
  } catch (error) {
    console.log(error)
    handleError.setMessage('Error de sistema: STATUSINITIALSRV')
    handleError.setHttpError(error.message)
    console.log('error:::', error)
  }
}

const vaciarTmps = async (dto, handleError) =>{
    try {
        const data = dto.body
        const index = Object.entries(data)[0][0]
        //elimina registros con flag swloadend=0
        await modelos[index].destroy({
            where: { ...data[index] }
        })
        res.send({
            ok: true,
            message: 'Vaciado de datos ' + data[index].gestion + ' realizado con exito'
        })
    } catch (error) {
        console.log(error)
        handleError.setMessage('Error de sistema: SUPRTMPSSRV')
        handleError.setHttpError(error.message)
        console.log('error:::', error)
      }

}


const xlsxLoad = async(dto, handleError) =>{
  //inicializa transaccion 
  await qUtil.startTransaction()
  try {
    //recibe datos por post
    const datos = dto.data
    const modelos = LOADERS

    const model = Object.entries(datos)[0][0]

    
    //elimina registros con flag swloadend=0
    qUtil.setTableInstance(modelos[model].alias)
    qUtil.setWhere({swloadend: false})
    await qUtil.deleting()

    //PARSEA DATOS EN GRUPOS DE 1000 PARA QUE SE CAGUEN A SISTEMA
    let inicio = 0
    const param = 1000
    let fin = param
    console.log("\n\n datosss:", datos[model].length , "\n model ::",model)
    while (inicio <= datos[model].length) {
      console.log(datos[model].length, ':creciendo:', inicio)
      const tmp = datos[model].slice(inicio, fin)
      inicio = fin + 1
      fin = fin + param
//console.log("\n\n...", tmp, "\n\n")
      
      //INSERCION MASIVA
      //await modelos[model].bulkCreate(tmp, { ignoreDuplicates: true })
      qUtil.setTableInstance(modelos[model].alias)
      qUtil.setDataset(tmp)
      await qUtil.createwLote()
    }

    //finaliza transaccion  de insercion
    await qUtil.commitTransaction()
    //actualiza campos segun configuracion de parametros
    const modelo = modelos[model]
    if (modelo.update) {
      //inicializa trasnaccionpor update
      await qUtil.startTransaction()
      //construye objeto
      let aux = {}
      for (const key in modelo.update) {
        aux = {
          ...aux,
          [modelo.update[key][0]]: qUtil.literal(modelo.update[key][1]),
        }
      }

      qUtil.setTableInstance(modelos[model].alias)
      qUtil.setDataset(aux)
      qUtil.setWhere({swloadend: false})
            
      await qUtil.modify()
      console.log("\n..........\n", qUtil.getResults())  
      await qUtil.commitTransaction()
    }

    
    return{
      ok: true,
      message: 'Procesado Correctamente',
    }
  } catch (error) {
    await qUtil.rollbackTransaction()
    //console.log(error)
    console.log('error desde el origen:::', error.message)
    //handleError.setMessage('Error de sistema: LOADXLSXSRV')
    //handleError.setHttpError(error.message)
    return{
      ok: false,
      message: error.message,
    }
    
  }
}

const xlsxNormalize = async (dto, handleError) =>{
  try {
    const data = dto.data
    console.log('-----', data)
    //actualiza manuales ??
    
    //normaliza
    for (const key in data) {
      const element = data[key]
     
    }
    return{
      ok: true,
      message: 'sin novedad, continue su proceso, normalizando los datos',
    }
  } catch (error) {
    handleError.setMessage('Error de sistema: XLSXNORMALIZESRV')
    handleError.setHttpError(error.message)
    console.log('error:::', error)
  }
}
module.exports = {

  
  initialData,
  statusTmps, vaciarTmps, xlsxLoad,
  xlsxNormalize
}
