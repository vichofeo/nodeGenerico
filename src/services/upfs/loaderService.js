const QUtils = require('../../models/queries/Qutils')
const qUtil = new QUtils()

const parametros = JSON.stringify(require('./parameters'))
const PARAMETROS = JSON.parse(parametros)

const pcboxs = JSON.stringify(require('./params_cboxs'))
const PCBOXS = JSON.parse(pcboxs)

const LOADERS = require('./parametersLoad.js')
const loaderUtils = require('../aeb/aebUtilsLoaders.js')

const FrmUtils = require('../frms/FrmsUtils')
const frmUtil = new FrmUtils()

const estado_conclusion='7'
const estado_revision='15'
const estado_proceso = '3'

const resgitroServices =  require('./registroService.js')
const { Console } = require('winston/lib/winston/transports/index.js')



//metodos para el cargado
const initialData = async (dto, handleError) => {
  try {
    const data = LOADERS
    const key =  dto.data.model
    if(data.hasOwnProperty(key)){
      const d = {}      
    //for (const key in data) {
      d[key] = {
        file: data[key].file,
        table: data[key].table,
        forFilter: data[key].forFilter,
        applyFilter: data[key].filterByFunc ? true : false,
      }
    //}

    //obtiene permisos
    const permiso = await resgitroServices.verificaPermisoAbasEnProcesamiento(dto)
    return {
      ok: true,
      data: d,
      permiso: permiso.data
    }

    }else{
      return {
        ok: false,
        message: "Modelo Inexistente,Proceso detenido.",
        xx:data
        
      } 
    }
    
  } catch (error) {
    console.log(error)
    handleError.setMessage('Error de sistema: LOADINITIALSRV')
    handleError.setHttpError(error.message)
    console.log('error:::', error)
  }
}

const dataLoadingReport = async (dto, handleError) => {
  try {
    frmUtil.setToken(dto.token)
    //ids de establecimientos permitidos    
    const resp =  await frmUtil.getGroupIdsInstitucion() 
    
    const ids_institucion = resp.join("','") //frmUtil.getResults().join("','")
    let whereAux = ''
    if (ids_institucion)
      whereAux = `AND r.institucion_id IN ('${ids_institucion}')`

    //colocar aki restriccion por estblecimiento segun rol
    //const formulario_id = dto.model
    const query = `
              SELECT 
              eg.institucion_id AS idx, eg.nombre_institucion AS periodo,
              '['||string_agg(DISTINCT '{"periodo":"'||r.periodo||'", "registros":'||
              (SELECT COUNT(*) FROM uf_abastecimiento_llenado ll2 
              WHERE ll2.registro_id=r.registro_id)
              ||' }'  ,',' 
              ORDER BY '{"periodo":"'||r.periodo||'", "registros":'||
              (SELECT COUNT(*) FROM uf_abastecimiento_llenado ll2 
              WHERE ll2.registro_id=r.registro_id)
              ||' }' desc
              )||']' AS registros


              FROM uf_abastecimiento_registro r, ae_institucion i, ae_institucion eg
              WHERE r.institucion_id =  i.institucion_id
              AND i.institucion_root=eg.institucion_id
              ${whereAux}
              GROUP BY 1,2
              ORDER BY 2`
    qUtil.setQuery(query)
    await qUtil.excuteSelect()

    let response = {}

    let result = qUtil.getResults()
    //parse results
    result = result.map((obj) => ({
      ...obj,
      registros: JSON.parse(obj.registros),
    }))

    response = { [dto.model]: { items: result, multiple: true } }

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

const getDataLoadingReport = async (dto, handleError) => {
  try {
    //datos de session
    frmUtil.setToken(dto.token)
    //const obj_cnf = frmUtil.getObjSession()

    const modelo = dto.modelo
//    const pregunta_id = dto.condicion.idx
    const periodos = dto.condicion.registros.map((o) => o.periodo)
    let whereAux = ''
    if (periodos[0] == 'Todos') whereAux = ''
    else whereAux = `AND r.periodo in ('${periodos.join("','")}')`

    //VALIDAR USO Y CONDICIONES SEGUN TOKEN
    //ids de establecimientos permitidos
    const resp =  await frmUtil.getGroupIdsInstitucion()
    const ids_institucion = resp.join("','")
    if (ids_institucion)
      whereAux = ` ${whereAux} AND r.institucion_id IN ('${ids_institucion}')`

    const datosResult = {}
    const query = `
    SELECT eg.nombre_institucion AS "Ente Gestor",
i.nombre_institucion AS "Establecimiento Salud", 
dpto.nombre_dpto AS "Departamento",

TO_CHAR(TO_DATE(r.periodo,'YYYYMMDD'), 'YYYY-Mon') AS "Periodo",
a.atributo AS "Estado",
ll.stock AS "Stock", ll.consumo_promedio AS "Consumo Promedio" 

FROM ae_institucion eg,
 u_is_atributo a, 
uf_abastecimiento_registro r,  

uf_abastecimiento_llenado ll,

ae_institucion i 
LEFT JOIN al_departamento dpto ON (dpto.cod_dpto=i.cod_dpto)
WHERE eg.institucion_id =  i.institucion_root
AND a.atributo_id =  r.concluido
and r.institucion_id= i.institucion_id
and r.registro_id= ll.registro_id

and eg.institucion_id='${modelo}'

${whereAux}
ORDER BY 4,3,2`

    qUtil.setQuery(query)
    await qUtil.excuteSelect()

    let result = qUtil.getResults()
    let headers = []
    //convierte en array resultados
    if (result.length > 0) {
      headers = Object.keys(result[0])
      result = result.map((obj, index) => Object.values(obj))
      result.unshift(headers)
    }

    //construye datos de configuracion para reporte dinamico
    const cnf = {
      tipo_agregacion: 'Sum',
      campos_ocultos: ['Stock', 'Consumo Promedio'],
      diferencia: headers.filter((x) => ['Stock', 'Consumo Promedio'].indexOf(x) === -1),
      rows: ['Establecimiento Salud'],
      cols: ['Stock', 'Consumo Promedio'],
      vals: ['Stock', 'Consumo Promedio'],
      mdi: 'mdi-seat-flat-angled',
    }
    datosResult[modelo] = { values: result, headers: headers, cnf }

    return {
      ok: true,
      data: { ...datosResult, model: modelo, titulo: 'Datos de formulario' },
      message: 'Resultado exitoso. Parametros obtenidos',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error de sistema: RPTGRALSRV',
      error: error.message,
    }
  }
}

const loadersComprobate = async(dto, handleError)=>{
  try {
    //datos de session
    const data = dto.data
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()
    const resp =  await frmUtil.getGroupIdsInstitucion()    
    const whereInst = resp.length>0 ? {institucion_id: resp} : {}

    //queries para validez de botona reporte
    const resultComprobacion = {}
    qUtil.setTableInstance("uf_abastecimiento_institucion_cnf")
    qUtil.setAttributes([[qUtil.literal('count(*)'), 'conteo']])
    qUtil.setWhere({...whereInst})
    await qUtil.findTune()
    resultComprobacion.frm_inst = qUtil.getResults()[0].conteo

    qUtil.setTableInstance("uf_abastecimiento_registro")
    qUtil.setAttributes([[qUtil.literal('count(*)'), 'conteo']])
    qUtil.setWhere({...whereInst,  periodo: data.periodos, concluido:qUtil.cMayorIgualQue('7'), revisado:qUtil.cMayorIgualQue('15')})
    await qUtil.findTune()
    resultComprobacion.frm_regs = qUtil.getResults()[0].conteo

    qUtil.setTableInstance("ae_institucion")
    qUtil.setAttributes([[qUtil.literal('count(*)'), 'conteo']])
    qUtil.setWhere({es_unidad: true, tipo_institucion_id: 'ASUSS', parent_grp_id: null, root: null, institucion_id: obj_cnf.institucion_id  })
    await qUtil.findTune()
    resultComprobacion.r_master = qUtil.getResults()[0].conteo

    qUtil.setTableInstance("ae_institucion")
    qUtil.setAttributes([[qUtil.literal('count(*)'), 'conteo']])
    qUtil.setWhere({tipo_institucion_id: 'EESS', parent_grp_id: obj_cnf.institucion_id  })
    await qUtil.findTune()
    resultComprobacion.r_slave = qUtil.getResults()[0].conteo

    //obtiene departamento de slave si existe
    resultComprobacion.dpto = 'Nacional'
    resultComprobacion.dptal = false
    if(resultComprobacion.r_slave>0){
      qUtil.setTableInstance("ae_institucion")
      qUtil.setInclude({association: 'dpto', required: true,
        attributes: ['nombre_dpto']      
      })
      await qUtil.findID(obj_cnf.institucion_id)
      resultComprobacion.dpto = qUtil.getResults().dpto.nombre_dpto    
      resultComprobacion.dptal = true
    }
    delete resultComprobacion.r_master
    delete resultComprobacion.r_slave

    return {
      ok: true,      
      data: resultComprobacion,
      message: 'Resultado exitoso. Parametros obtenidos',
    }

  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error de sistema: RPTCMPBFARMSTESRV',
      error: error.message,
    }
  }
}

const actualizaEstadoLoader = async(dto, handleError)=>{
  try {
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSessionForModify()
    //datos de session
    const idx = dto.data.idx
    const dataModels = LOADERS
    if(dataModels[dto.data?.payload?.modelo]){
      //modelo = "reg"+dataModels[dto.data.payload.modelo].alias
      modelo = dataModels[dto.data.payload.modelo].alias

      console.log("\n\nESTADO LOADER...",modelo,"\n\n")
      //console.log("\n\n",payload,"\n\n")
      await qUtil.startTransaction()
      let dataSet = {}
      if(dto.data?.payload?.process){
        //const payload = dto.data.payload
        //cambia a estado de en proceso
        dataSet = {dni_register: obj_cnf.dni_register, last_modify_date_time: obj_cnf.last_modify_date_time  ,concluido:estado_proceso}
        
      }else{
        //cambia a estado de en proceso
        dataSet = {dni_register: obj_cnf.dni_register, last_modify_date_time: obj_cnf.last_modify_date_time  ,concluido:estado_conclusion}
        
      }
      
      const updateData = {...dataSet,
        regfile: {...dataSet},
        [modelo]: {...dataSet}
      }      
      
      qUtil.setTableInstance(modelo)
      qUtil.setDataset(updateData)
      qUtil.setWhere({registro_id: idx})
      await qUtil.modify()

      qUtil.setTableInstance('upf_registro_file')
      qUtil.setDataset(updateData)
      qUtil.setWhere({registro_id: idx})
      await qUtil.modify()

      qUtil.setTableInstance('upf_registro')
      qUtil.setDataset(updateData)
      qUtil.setWhere({registro_id: idx})
      await qUtil.modify()           
      
      await qUtil.commitTransaction()
      return {
        ok: true,      
        //data: resultComprobacion,
        message: 'Resultado exitoso. Parametros obtenidos',
      }
    }else{
      return {
        ok: false,
        message: 'Modelo de datos No Encontrado',        
      }
    }
    
    

  } catch (error) {
    qUtil.rollbackTransaction()
    console.log(error)
    return {
      ok: false,
      message: 'Error de sistema: RPTCMPBFARMSTESRV',
      error: error.message,
    }
  }
}

/**
 * cargado a tabla de datos
 * @param {*} dto 
 * @param {*} handleError 
 * @returns 
 */
const xlsxLoad = async (dto, handleError) => {
  //inicializa transaccion
  await qUtil.startTransaction()
  try {
    //datos de session
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()
    //recibe datos por post
    console.log("\n\n*******************************************************")
    console.log("\n\nDTO")
    //console.log("\n\n", dto)
    console.log("\n\n*******************************************************")
    const datos = dto.data
    const modelos = LOADERS //datos.entity?LOADERS[datos.entity]:LOADERS[defaultEntity]

    const model = Object.entries(datos)[0][0]

    if (modelos[model]?.filterByFunc) {
      //console.log("********************** DATA LOAD:", datos[model])
      const metodo = modelos[model].filterByFunc.alias
      const params = modelos[model].filterByFunc.params
      const result = loaderUtils[metodo](datos[model], params)
      console.log("\n\n*******************************************************")
    console.log("\n\nMODELOOO:::",model, result)
    //console.log("\n\n", dto)
    console.log("\n\n*******************************************************")
      if (result.ok) datos[model].data = result.results
      else throw new Error('Formato de archivo incorrecto')
    }//en filterByFunc

/*** ********* INICIA GUARDADO ********* */
//obtiene informacion del registro maestro
    qUtil.setTableInstance('upf_registro')
    await qUtil.findID(datos[model].fileInfo.registro_id)
    const resultRegistro =  qUtil.getResults()

    
    //elimina registros con flag swloadend=0
    qUtil.setTableInstance(modelos[model].alias)
    qUtil.setWhere({ swloadend: false, dni_register: obj_cnf.dni_register })
    await qUtil.deleting()

    //elimina registro de archivo
    qUtil.setTableInstance('upf_registro_file')
    qUtil.setWhere({ swloadend: false, dni_register: obj_cnf.dni_register })
    await qUtil.deleting()
//-----------------------------------------------------------------------------
    let resultFile =  null
    let fileInfoBasic  =  null
try {
  //inserta informacion de archivo: upf_registro_file
  qUtil.setTableInstance('upf_registro_file')
  fileInfoBasic = JSON.parse(JSON.stringify(datos[model].fileInfo))  
  const payloadFile = Object.assign(datos[model].fileInfo, obj_cnf, {periodo: resultRegistro.periodo, gestion:resultRegistro.periodo.split('-')[0]})
  qUtil.setDataset(payloadFile)
  await qUtil.create()
  resultFile =  qUtil.getResults()
  console.log("------------------------------------------------>", resultFile)
} catch (error) {
  await qUtil.rollbackTransaction()
  return {
    ok:false,
    message:'El archivo que intenta subir, ya se encuentra registrado. Por favor Verifique su informacion.'
  }
}
    

    //reEscribe valores a subir
    datos[model].data = datos[model].data.map((obj) => {
      obj.dni_register = obj_cnf.dni_register
      obj.create_date = obj_cnf.create_date
      obj.file_id = resultFile.file_id
      return obj
    })
    datos[model].fileInfo = fileInfoBasic
    datos[model].fileInfo.file_id = resultFile.file_id

    //PARSEA DATOS EN GRUPOS DE 1000 PARA QUE SE CAGUEN A SISTEMA
    let inicio = 0
    const param = 1000
    let fin = param
    let sum = 0
    console.log('\n\n datosss:', datos[model].data.length, '\n model ::', model)
    console.log("\n\n********************************************")
    console.log("DATOSSSSS:", datos[model])
    console.log("\n\n----------------------------------------------")
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

    //** UTILIZA EL CAMPO SUPERUPDATE PARA UNA ACTUQALIZACION AVANZADA con dos tablas */
    if(modelo?.superUpdate){
      let mensaje = ''
      try {
        //inicializa trasnaccionpor update
        await qUtil.startTransaction()        
        //construye objeto
        let auxSet = []
        let auxWhere = []
        let t1p=t2p= ''
        let t1=t2= ''
        let from=''
        if(modelo.superUpdate?.referer){
          t2p='t2.'
          t2= 't2'
          t1p = 't1.'
          t1= 't1'
          from = `FROM ${modelo.superUpdate.referer} ${t2}`
        }

        //set
        for (const key in modelo.superUpdate?.update) {
          auxSet.push(` ${modelo.superUpdate.update[key][0]}= ${t2p}${modelo.superUpdate.update[key][1]} `) 
          mensaje += '\n' + modelo.superUpdate.update[key][2]
        }
        //where
        for (const key in modelo.superUpdate?.conditional) {
          auxWhere.push(` ${t1p}${modelo.superUpdate.conditional[key][0]}= ${t2p}${modelo.superUpdate.conditional[key][1]} `)           
        }

        if(auxSet.length>0){
          let query = `UPDATE ${modelos[model].alias} ${t1}
                      SET ${auxSet.join(", ")}
                      ${from}
                      WHERE swloadend= false AND dni_register= '${obj_cnf.dni_register}'
                      ${auxWhere.length>0? ' AND '+auxWhere.join(' AND '):''}
                      `
          qUtil.setQuery(query)
          await qUtil.excuteUpdate()             

        }

        await qUtil.commitTransaction()
      } catch (error) {
        console.log(error)
        return {
          ok: false,
          message: error.message + mensaje,
        }
      }
    }
    
    //**** fin super actuallizacion */
      //---------------------------- *0000 ******************************
      //** *********** fin guardado **** */

    return {
      ok: true,
      message: 'Procesado Correctamente',
      data : datos[model].fileInfo//datos[model].data
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
/**
 * 
 * @param {*} dto 
 * @param {*} handleError 
 * @returns 
 */
const xlsxNormalize = async (dto, handleError) => {
  try {
    const prefijo = (campo, valor) =>
      `La columna "${campo}": no puede ser nulo. Total registros encontrados: ${valor}`
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()

    //datos
    const name_modelos = dto.data.modelos
    let infoFiles = null
    if(dto.data?.fileInfos){
      infoFiles={}
      infoFiles.file =  dto.data?.fileInfos.map(o=>o.file_id)
      infoFiles.regs =  dto.data?.fileInfos.map(o=>o.registro_id)
    }
    

    //console.log('-----', name_modelos)
    console.log("************INICIANDO PROCESO DE VERIFICACION *************\n")
    //modelos paramas
    const modelos = LOADERS//dto.data.entity?LOADERS[dto.data.entity]:LOADERS[defaultEntity]

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
      console.log("\n************01 RECOGIENDO MODELO *************\n")
      console.log(`--------${model}-------`)
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
          console.log("\n************02 UPDATE POR GENERO SSI EXISTE 'GENDER'*************\n")
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
        console.log("\n************03 CAMPOS OBLIGATORIOS*: ",index ," *************\n")
        let whereNull = index > 1    ? qUtil.orWhere([{ [element.table[index]]: null }])
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
      const keyString = `md5(${element.key.join('||')})`
      const keyStringMd5 = qUtil.literal(keyString)

      //rutina de unicidad de dato con HASER
      console.log("\n************04 HASHER: *************\n")
      try {
        console.log("\n************04.1 UPDATE HASHER AND HASH *************\n")
        //primera actulizacion sobre hasher
        qUtil.setTableInstance(element.alias)
        qUtil.setDataset({ hasher: keyStringMd5 })
        qUtil.setWhere({ swloadend: false, dni_register: obj_cnf.dni_register })
        await qUtil.modify()

        await qUtil.startTransaction()
          qUtil.setDataset({ hash: keyStringMd5 })
          await qUtil.modify()
        await qUtil.commitTransaction()

        

      } catch (error) {     
        console.log("\n************04.2 FAIL - HASH UNICIDAD *************\n")   
        await qUtil.rollbackTransaction()
        //obtiene los registros duplicados
        const campoHash = ['hasher']
        qUtil.setTableInstance(element.alias)
        qUtil.setAttributes(campoHash)
        //qUtil.setWhere({ swloadend: false, dni_register: obj_cnf.dni_register })
        qUtil.setGroupBy(campoHash)
        qUtil.setHaving(qUtil.literal('count(*)>1'))
        await qUtil.findTune()
        results[model].push('Existen ' +
            qUtil.getResults().length + ', registros duplicados O que ya existen en Base de datos.'
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
      }//END TRYCACHT
    }//fin for modelos

    console.log("\n************05 CONCLUSION - CONSOLIDACION *************\n")   
    //termina actulizacion - si no hay observaciones se concluye procesamiento
    //-> si existe observacion se elimina todos los datos.
    const sw = {}
    for (const model in results) {
      const modelo = modelos[model]
      const element = results[model]
      console.log('tabla:::"', modelo.alias.trim(),'"')
      
      sw[model] = {}
      if (element.length > 0) {
        console.log("\n************05.1 ELIMINA TODO EL CARGADO *************\n")   
        console.log("\n************05.1.1 ELIMINA DATA *************\n")   
        sw[model].process = false
        //elimina registros malos
        qUtil.setTableInstance(modelo.alias)
        qUtil.setWhere({ swloadend: false, dni_register: obj_cnf.dni_register })
        await qUtil.deleting()

        //elimina informacion de archivos
        if(infoFiles){
          console.log("\n************05.1.2 ELIMINA FILES *************\n")   
          qUtil.setTableInstance('upf_registro_file')
          qUtil.setWhere({file_id:infoFiles.file, registro_id: infoFiles.regs, swloadend: false, dni_register: obj_cnf.dni_register })
          await qUtil.deleting()
        }

      } else {
        console.log("\n************05.2 CARGADO EXITOSO *************\n")   
        sw[model].process = true
        //se procesan los archivos sin observacion ->swLoadend =  true
        console.log("\n************05.2.1 CARGADO DATA *************\n")   
        qUtil.setTableInstance(modelo.alias)
        qUtil.setDataset({ swloadend: true, concluido:'3' })
        qUtil.setWhere({ swloadend: false, dni_register: obj_cnf.dni_register })
        await qUtil.modify()

        console.log("\n************05.2.2 CARGADO FILES *************\n")   
        qUtil.setTableInstance('upf_registro_file')
        qUtil.setDataset({ swloadend: true , concluido:'3'})
        qUtil.setWhere({file_id:infoFiles.file, registro_id: infoFiles.regs, swloadend: false, dni_register: obj_cnf.dni_register })        
        await qUtil.modify()
        sw[model].fileInfos = infoFiles
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


const xlsxDeleting = async (dto, handleError)=>{
  await qUtil.startTransaction()
  try {    
    const prefijo='regfi'
     //datos de session
     frmUtil.setToken(dto.token)
     const obj_cnf = frmUtil.getObjSession()

     const registro_id = dto.data.idx
     const file_id = dto.data.file_id

     const modelos =  LOADERS
     const modelo = dto.data.model
     
     if(modelos[modelo].alias){
      const nameTableData =  modelos[modelo].alias
      const nameModelAsociado =  prefijo+nameTableData      

      //0. verifrica si es eliminacion individual o tod
      let where = {file_id:file_id, registro_id:registro_id, dni_register: obj_cnf.dni_register}
      if(file_id=='-1')
        where = {registro_id:registro_id, dni_register: obj_cnf.dni_register}
      //busca datos con la asociacion
      qUtil.setTableInstance('upf_registro_file')
      qUtil.setAttributes([[qUtil.literal('count(*)'), 'conteo']])
      qUtil.setWhere(where)
      await qUtil.findTune()
      let result = qUtil.getResults()      
      if(result[0].conteo>0){
        //1. elimina tabla contenedora de datos
        qUtil.setTableInstance(nameTableData)
        qUtil.setWhere(where)
        await qUtil.deleting()
        //2. elimina tabla de registro de archivos
        qUtil.setTableInstance('upf_registro_file')
        qUtil.setWhere(where)
        await qUtil.deleting()

        await qUtil.commitTransaction()
        return{
          ok:true,
          message: 'Eliminacion exitosa'
        } 
      }else{
        return{
          ok:false,
          message: 'Ud. no esta autorizado para efectuar esta tarea.'
        }        
      }

     }else{
      return{
        ok:false,
        message: 'Modelo de datos, no existe'
      }
     }
     


     //obtiene  useruario para eliminar
     //qUtil.setTableInstance()
     //qUtil.deleting()
  } catch (error) {
    console.log(error)
    await qUtil.rollbackTransaction
    handleError.setMessage('Error de sistema: XLSXDELETINGSRV')
    handleError.setHttpError(error.message)
  }
}
module.exports = {    
    initialData, dataLoadingReport,
    getDataLoadingReport,
    loadersComprobate, 
    actualizaEstadoLoader,

    xlsxLoad, xlsxNormalize,
    xlsxDeleting
 
}