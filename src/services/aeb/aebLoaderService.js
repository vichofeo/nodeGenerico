const QUtils = require('./../../models/queries/Qutils')
const qUtil = new QUtils()

const LOADERS = require('./parametersLoad') //JSON.parse(JSON.stringify(require('./parametersLoad')))

const FrmUtils = require('./../frms/FrmsUtils')
const frmUtil = new FrmUtils()

const loaderUtils = require('./aebUtilsLoaders')

const egData = async (dto, handleError) => {
  try {
    qUtil.setTableInstance('ae_institucion')
    qUtil.setAttributes(
      qUtil.transAttribByComboBox(['institucion_id', 'nombre_institucion'])
    )
    qUtil.setWhere({ tipo_institucion_id: 'EG' })
    qUtil.setOrder(['nombre_institucion'])
    await qUtil.findTune()

    return {
      ok: true,
      data: qUtil.getResults(),
    }
  } catch (error) {
    handleError.setMessage('Error de sistema: LOADEGDATASRV')
    handleError.setHttpError(error.message)
    console.log('error:::', error)
  }
}

const initialData = (dto, handleError) => {
  try {
    const data = LOADERS
    const d = {}
    for (const key in data) {
      d[key] = {
        file: data[key].file,
        table: data[key].table,
        forFilter: data[key].forFilter,
        applyFilter: data[key].filterByFunc ? true : false,
      }
    }

    return {
      ok: true,
      data: d,
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
        [qUtil.literal(element.attributes[0][0]), element.attributes[0][1]],
        [qUtil.literal(element.attributes[1][0]), element.attributes[1][1]],
      ])
      qUtil.setWhere({ swloadend: true })
      qUtil.setGroupBy([qUtil.literal(element.attributes[0][0])])
      qUtil.setOrder([[qUtil.literal(element.attributes[0][0]), 'DESC']])
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
    const data = dto.data
    const model = Object.entries(data)[0][0]
    const modelos = LOADERS
    //elimina registros con flag swloadend=0
    const query = `DELETE FROM ${modelos[model].alias} WHERE ${modelos[
      model
    ]?.metodo(data[model])}`
    qUtil.setQuery(query)
    await qUtil.excuteUpdate()

    return {
      ok: true,
      message: 'Vaciado de datos ' + model + ' realizado con exito',
    }
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

    if (modelos[model].filterByFunc) {
      //console.log("********************** DATA LOAD:", datos[model])
      const metodo = modelos[model].filterByFunc.alias
      const params = modelos[model].filterByFunc.params
      const result = loaderUtils[metodo](datos[model], params)
      if (result.ok) datos[model].data = result.results
      else throw new Error('Formato de archivo incorrecto')
    }//en filterByFunc

/*** ********* INICIA GUARDADO ********* */

    //reEscribe valores a subir
    datos[model].data = datos[model].data.map((obj) => {
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
    console.log('\n\n datosss:', datos[model].data.length, '\n model ::', model)
    while (inicio <= datos[model].data.length) {
      //console.log(":::::=>", datos[model].length, ':creciendo:', inicio)

      const tmp = datos[model].data.slice(inicio, fin)
      inicio = fin
      fin = fin + param

      //INSERCION MASIVA
      qUtil.setTableInstance(modelos[model].alias)
      qUtil.setDataset(tmp)
      await qUtil.createwLote()
      sum += tmp.length
    }
    console.log('\n .... SUMA TOTAL:', sum)
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
        //console.log('\n..........\n', qUtil.getResults())

        await qUtil.commitTransaction()
      } catch (error) {
        console.log(error)
        return {
          ok: false,
          message: error.message + mensaje,
        }
      }
    }
    
      //---------------------------- *0000 ******************************
      //** *********** fin guardado **** */

    return {
      ok: true,
      message: 'Procesado Correctamente',
      data : datos[model].data
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
    const prefijo = (campo, valor) =>
      `La columna "${campo}": no puede ser nulo. Total registros encontrados: ${valor}`
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()
    //datos
    const name_modelos = dto.data
    console.log('-----', name_modelos)
    //modelos paramas
    const modelos = LOADERS

    const results = {}
    const generos = {}
    const definicionGenero = {
      definidos: [],
      no_definidos: [],
      inexactos: [],
      arreglo: { idx: [], campo: [] },
    }
    let sw_genero = false
    //normaliza
    for (const model of name_modelos) {
      console.log('----->', model)
      results[model] = []
      const element = modelos[model]
      console.log(element)
      const validates = []
      element.validate.forEach((v, i) => {
        if (v) validates.push(i)
      })
      /**APLICA RUTINA DE GENERO  */
      //RUTINA PARA DETERMINAR GENERO SEGUN NOMBRE CON TABLA DE DATOS DE  NOMBRES

      if (element.gender) {
        if (!sw_genero) {
          //obtiene los nombres de tabla maestra
          sw_genero = true
          qUtil.setTableInstance('tmp_nombres')
          qUtil.setAttributes(['nombre', 'genero'])
          qUtil.setOrder(['nombre'])

          await qUtil.findTune()
          const resultGenero = qUtil.getResults()

          for (const rg of resultGenero) {
            rg.nombre = rg.nombre.toUpperCase()
            if (!Object.hasOwn(generos, rg.nombre)) generos[rg.nombre] = {}
            generos[rg.nombre] = Object.assign(generos[rg.nombre], {
              [rg.genero]: rg.genero,
            })
          }
        }
        const nombre = element.gender[0]
        const genero = element.gender[1]
        const f_genero = element.gender[2]
        //obtiene todos los registris cargados a bd con solo los atrobutos de parametros GENDER
        qUtil.setTableInstance(element.alias)
        element.gender.push('idx')
        qUtil.setAttributes(element.gender)
        qUtil.setWhere({
          swloadend: false,
          dni_register: obj_cnf.dni_register,
          [nombre]: qUtil.notNull(),
        })
        await qUtil.findTune()

        const datos = qUtil.getResults()
        for (const d of datos) {
          //parsea nombre completo
          const nombres = Object.fromEntries(
            d[nombre].split(' ').map((v, i) => [v.toUpperCase(), v])
          )
          let sw_estado = -1
          let key_name = null
          //recorre el parseo de nombres buscando la primera ocurrencia de nombre para adotar el genero
          for (const key in nombres) {
            if (Object.hasOwn(generos, key)) {
              if (Object.keys(generos[key]).length > 1) sw_estado = 0
              else sw_estado = 1

              key_name = key
              break
            } else {
              sw_estado = -1
            }
          }
          //resguarda casos
          switch (sw_estado) {
            case -1:
              const nmbre = Object.fromEntries(
                d[nombre].split(' ').map((v, i) => [`N${i}`, v.toUpperCase()])
              )
              //definicionGenero.no_definidos.push({ idx: d.idx, nombre: d[nombre], genero: d[f_genero] })
              definicionGenero.no_definidos.push({
                ...nmbre,
                genero: d[f_genero],
              })
              break
            case 0:
              definicionGenero.inexactos.push({
                idx: d.idx,
                set: generos[key_name],
                nombre: d[nombre],
                genero: d[f_genero],
                name: key_name,
              })
              break
            case 1:
              definicionGenero.definidos.push({
                idx: d.idx,
                set: {
                  [genero]:
                    generos[key_name][Object.keys(generos[key_name])[0]],
                },
              })
              definicionGenero.arreglo.idx.push(d.idx)
              definicionGenero.arreglo.campo.push(
                generos[key_name][Object.keys(generos[key_name])[0]]
              )
              //actualiza genero del registro correcto
              //qUtil.setTableInstance(element.alias)
              //qUtil.setDataset({[genero]: generos[key_name][Object.keys(generos[key_name])[0]]})
              //qUtil.setWhere({idx: d.idx})
              //await qUtil.modify()
              break
            default:
              break
          }
        } //fin recorrido de datos
        // actualizacion e bath
        const query = `update ${element.alias}
                      set ${genero} = tt.campo
                      from (SELECT UNNEST(array[${definicionGenero.arreglo.idx.join(
                        ','
                      )}]) AS id,
                                  UNNEST(array['${definicionGenero.arreglo.campo.join(
                                    "','"
                                  )}']) AS campo
                             ) as tt
                      where idx= tt.id `
        qUtil.setQuery(query)
        await qUtil.excuteUpdate()
      }
      //fin genero
      //------0-----
      //--fin rutina genero
      // ---

      /**APLICA VALIDACIONES SEGUN PARAMETROS */
      //1.- Verifica campos abligatorios
      qUtil.setTableInstance(element.alias)
      for (const index of validates) {
        let whereNull =
          index > 1
            ? qUtil.orWhere([{ [element.table[index]]: null }])
            : qUtil.orWhere([
                { [element.table[index]]: null },
                { [element.table[index]]: '' },
              ])
        qUtil.setAttributes([[qUtil.literal('count(*)'), 'conteo']])
        qUtil.setWhere({
          swloadend: false,
          dni_register: obj_cnf.dni_register,
          ...whereNull,
        })
        await qUtil.findTune()

        const r = qUtil.getResults()
        if (r[0].conteo > 0)
          results[model].push(prefijo(element.file[index], r[0].conteo))
      } //end for validates

      //2.- Verifica unidad de registros
      const keyString = qUtil.literal(`md5(${element.key.join('||')})`)

      //rutina de unicidad de dato con HASER
      try {
        //primera actulizacion sobre hasher
        qUtil.setTableInstance(element.alias)
        qUtil.setDataset({ hasher: keyString })
        qUtil.setWhere({ swloadend: false, dni_register: obj_cnf.dni_register })
        await qUtil.modify()

        await qUtil.startTransaction()
        qUtil.setDataset({ hash: keyString })
        await qUtil.modify()
        await qUtil.commitTransaction()
      } catch (error) {
        await qUtil.rollbackTransaction()
        //obtiene los registros duplicados
        const campoHash = ['hasher']
        qUtil.setTableInstance(element.alias)
        qUtil.setAttributes(campoHash)
        //qUtil.setWhere({ swloadend: false, dni_register: obj_cnf.dni_register })
        qUtil.setGroupBy(campoHash)
        qUtil.setHaving(qUtil.literal('count(*)>1'))
        await qUtil.findTune()
        results[model].push(
          'Existen ' +
            qUtil.getResults().length +
            ', registros duplicados O que ya existen en Base de datos.'
        )
        //obtiene los registros duplicados
        const hashsers = qUtil.getResults().map((obj) => obj.hasher)
        qUtil.setTableInstance(element.alias)
        qUtil.setAttributes(element.keyAux)
        qUtil.setWhere({
          swloadend: false,
          dni_register: obj_cnf.dni_register,
          hasher: hashsers,
        })
        qUtil.setOrder([element.keyAux[0], element.keyAux[1]])
        await qUtil.findTune()

        results[model].push(qUtil.getResults())
      }
    }

    //termina actulizacion - si no hay observaciones se concluye procesamiento
    //-> si existe observacion se elimina todos los datos.
    const sw = {}
    for (const model in results) {
      const modelo = modelos[model]
      const element = results[model]
      console.log('tabla:::', modelo.alias)
      qUtil.setTableInstance(modelo.alias)
      sw[model] = {}
      if (element.length > 0) {
        sw[model].process = false
        //elimina registros malos
        qUtil.setWhere({ swloadend: false, dni_register: obj_cnf.dni_register })
        await qUtil.deleting()
      } else {
        sw[model].process = true
        //se procesan los archivos sin observacion ->swLoadend =  true
        qUtil.setDataset({ swloadend: true })
        qUtil.setWhere({ swloadend: false, dni_register: obj_cnf.dni_register })
        await qUtil.modify()
      }
    }
    return {
      ok: true,
      data: results,
      genero: definicionGenero,
      sws: sw,
      message: 'Datos procesados. Ver Registro de procesamiento',
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
  egData,
}
