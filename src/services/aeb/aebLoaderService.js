const QUtils = require('./../../models/queries/Qutils')
const qUtil = new QUtils()

const LOADERS = JSON.parse(JSON.stringify(require('./parametersLoad')))

const FrmUtils = require('./../frms/FrmsUtils')
const frmUtil = new FrmUtils()

const initialData = (dto, handleError) => {
  try {
    const data = LOADERS
    return {
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
      qUtil.setOrder([
        [qUtil.literal("to_char(fecha_vacunacion, 'YYYY-MM')"), 'DESC'],
      ])
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

const vaciarTmps = async (dto, handleError) => {
  try {
    const data = dto.body
    const index = Object.entries(data)[0][0]
    //elimina registros con flag swloadend=0
    await modelos[index].destroy({
      where: { ...data[index] },
    })
    res.send({
      ok: true,
      message:
        'Vaciado de datos ' + data[index].gestion + ' realizado con exito',
    })
  } catch (error) {
    console.log(error)
    handleError.setMessage('Error de sistema: SUPRTMPSSRV')
    handleError.setHttpError(error.message)
    console.log('error:::', error)
  }
}

const xlsxLoad = async (dto, handleError) => {
  //inicializa transaccion
  await qUtil.startTransaction()
  try {
    //datos de session
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()
    //recibe datos por post
    const datos = dto.data
    const modelos = LOADERS

    const model = Object.entries(datos)[0][0]

    //reEscribe valores a subir
    datos[model] = datos[model].map((obj) => {
      obj.dni_register = obj_cnf.dni_register
      return obj
    })

    //elimina registros con flag swloadend=0
    qUtil.setTableInstance(modelos[model].alias)
    qUtil.setWhere({ swloadend: false, dni_register: obj_cnf.dni_register })
    await qUtil.deleting()

    //PARSEA DATOS EN GRUPOS DE 1000 PARA QUE SE CAGUEN A SISTEMA
    let inicio = 0
    const param = 1000
    let fin = param
    let sum = 0
    console.log('\n\n datosss:', datos[model].length, '\n model ::', model)
    while (inicio <= datos[model].length) {
      
      console.log(":::::=>",datos[model].length, ':creciendo:', inicio)

      const tmp = datos[model].slice(inicio, fin)
      inicio = fin 
      fin = fin + param


      //INSERCION MASIVA
      qUtil.setTableInstance(modelos[model].alias)
      qUtil.setDataset(tmp)
      await qUtil.createwLote()
      sum += tmp.length
    }
    console.log("\n .... SUMA TOTAL:", sum)
    //finaliza transaccion  de insercion
    await qUtil.commitTransaction()
    //actualiza campos segun configuracion de parametros

    const modelo = modelos[model]
    if (modelo.update) {
      let mensaje = ''
      try {
        //inicializa trasnaccionpor update
        await qUtil.startTransaction()
        //construye objeto
        let aux = {}

        for (const key in modelo.update) {
          aux = {
            ...aux,
            [modelo.update[key][0]]: qUtil.literal(modelo.update[key][1]),
          }
          mensaje += '\n' + modelo.update[key][2]
        }

        qUtil.setTableInstance(modelos[model].alias)
        qUtil.setDataset(aux)
        qUtil.setWhere({ swloadend: false, dni_register: obj_cnf.dni_register })

        await qUtil.modify()
        console.log('\n..........\n', qUtil.getResults())
        
        await qUtil.commitTransaction()
      } catch (error) {
        return {
          ok: false,
          message: error.message + mensaje,
        }
      }
    }

    return {
      ok: true,
      message: 'Procesado Correctamente',
    }
  } catch (error) {
    await qUtil.rollbackTransaction()
    //console.log(error)
    console.log('error desde el origen:::', error.message)
    //handleError.setMessage('Error de sistema: LOADXLSXSRV')
    //handleError.setHttpError(error.message)
    return {
      ok: false,
      message: error.message,
    }
  }
}

const xlsxNormalize = async (dto, handleError) => {
  try {
    const prefijo = (campo, valor)=> `La columna "${campo}": no puede ser nulo. Total registros encontrados: ${valor}`
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()
    //datos
    const name_modelos = dto.data
    console.log('-----', name_modelos)
    //modelos paramas
    const modelos = LOADERS
    console.log(modelos)
    const results = {}
    //normaliza
    for (const model of name_modelos) {
      console.log('----->', model)
      results[model] = []
      const element = modelos[model]
      console.log(element)
      const validates = []
      element.validate.forEach((v,i)=> {
        if(v) validates.push(i)
      })

      /**APLICA VALIDACIONES SEGUN PARAMETROS */
      //1.- Verifica campos abligatorios
      qUtil.setTableInstance(element.alias)
      for (const index of validates) {
        qUtil.setAttributes([[qUtil.literal("count(*)"), 'conteo']])
        qUtil.setWhere({swloadend: false, dni_register: obj_cnf.dni_register, ...qUtil.orWhere([ {[element.table[index]]: null}, {[element.table[index]]:''} ])})
        
        
        await qUtil.findTune()
        const r = qUtil.getResults()
        if(r[0].conteo>0)
        results[model].push(prefijo(element.file[index],r[0].conteo))
      }
      //2.- Verifica unidad de registros
      const keyString =  qUtil.literal(`md5(${element.key.join('||')})`)
      
      
      try {
        //primera actulizacion sobre hasher
        qUtil.setTableInstance(element.alias)
        qUtil.setDataset({hasher: keyString})
        qUtil.setWhere({swloadend: false, dni_register: obj_cnf.dni_register})
        await qUtil.modify()
        
        await qUtil.startTransaction()
        qUtil.setDataset({hash: keyString})
        await qUtil.modify()
        await qUtil.commitTransaction()

      } catch (error) {
        await qUtil.rollbackTransaction()
        //obtiene los registros duplicados
        const campoHash = ['hasher']
        qUtil.setAttributes(campoHash)
        qUtil.setWhere({swloadend: false, dni_register: obj_cnf.dni_register})
        qUtil.setGroupBy(campoHash)
        qUtil.setHaving(qUtil.literal("count(*)>1"))
        await qUtil.findTune()
        results[model].push("Existen "+qUtil.getResults().length+", registros duplicados.")
        //obtiene los registros duplicados
        const hashsers =  qUtil.getResults().map(obj=>obj.hasher)
        qUtil.setTableInstance(element.alias)
        qUtil.setAttributes(element.keyAux)
        qUtil.setWhere({swloadend: false, dni_register: obj_cnf.dni_register, hasher: hashsers})
        qUtil.setOrder(['fecha_vacunacion', 'ci'])
        await qUtil.findTune()
        
        results[model].push(qUtil.getResults())
        
      }      
    }
    const sw = {}
    for (const model in results) {
      const modelo =  modelos[model]              
      const element =  results[model]
      console.log("tabla:::",modelo.alias)
      qUtil.setTableInstance(modelo.alias)
      sw[model] = {}
      if(element.length>0) {
        sw[model].process=false
        //elimina registros malos        
        qUtil.setWhere({swloadend: false, dni_register: obj_cnf.dni_register})
        await qUtil.deleting()
      }else{
        sw[model].process=true
        //se procesan los archivos sin observacion ->swLoadend =  true
        qUtil.setDataset({swloadend: true})
        qUtil.setWhere({swloadend: false, dni_register: obj_cnf.dni_register})
        await qUtil.modify()
      }
    }
    return {
      ok: true,
      data: results,
      sws : sw,
      message: 'Datos procesados. Ver Registro de procesamiento'
    }
  } catch (error) {
    handleError.setMessage('Error de sistema: XLSXNORMALIZESRV')
    handleError.setHttpError(error.message)
    console.log('error:::', error)
  }
}
module.exports = {
  initialData,
  statusTmps,
  vaciarTmps,
  xlsxLoad,
  xlsxNormalize,
}
