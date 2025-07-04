const handleJwt = require('./../../utils/handleJwt')

const cnf_cboxs = JSON.stringify(require('./params_cboxs'))
const PCBOXS = JSON.parse(cnf_cboxs)

const parametros = JSON.stringify(require('./parameters'))
const PARAMETROS = JSON.parse(parametros)

const FrmUtils = require('./FrmsUtils')
const frmUtil = new FrmUtils()

const QUtils = require('../../utils/queries/Qutils')
const qUtil = new QUtils()

const { v4: uuidv4 } = require('uuid')

const servicesBasics = require('./FrmsService')
const { where, NOW } = require('sequelize')
const { now } = require('sequelize/lib/utils')

const estado_conclusion='7'
const estado_revision='15'

/**
 * verifica permisos para crear formulario en periodo de evaluacion
 * @param {*} f_id 
 * @returns 
 */
const verificaPrimal = async (f_id) => {
  const obj_cnf = await frmUtil.getRoleSession()
  const obj_session = frmUtil.getObjSession()

  //verifica pertinencia de datos segun configuracion de firmularios
  //qUtil.setTableInstance('f_formulario_institucion_cnf')
  console.log("\n\n verifica pertinencia de datos segun configuracion de firmularios\n\n")
  let query = `SELECT COUNT(*) as conteo
              FROM f_formulario_institucion_cnf cnf
              WHERE cnf.formulario_id='${f_id}' AND cnf.institucion_id = '${obj_session.institucion_id}'
              AND (EXTRACT(DAY FROM NOW()) <= cnf.limite_dia
              OR (cnf.opening_delay = TO_CHAR(CURRENT_DATE - INTERVAL '1 month','YYYYMM') AND EXTRACT(DAY FROM NOW()) <= cnf.limite_plus)
              )`
  qUtil.setQuery(query)
  await qUtil.excuteSelect()
  const control = qUtil.getResults()

  //verifica si ya existe el registro PARA EL PERIODO ANTERIOR
  console.log("\n\n verifica si ya existe el registro PARA EL PERIODO ANTERIOR\n\n")
  query = `SELECT COUNT(*) AS existencia
          FROM f_formulario_registro
          WHERE formulario_id='${f_id}' AND institucion_id='${obj_session.institucion_id}' 
          AND periodo=TO_CHAR(NOW() - INTERVAL '1 month','YYYYMM')` //periodo=TO_CHAR(NOW(),'YYYYMM')
  qUtil.setQuery(query)
  await qUtil.excuteSelect()

  const existe = qUtil.getResults()

  if (obj_cnf.primal && control[0].conteo > 0 && existe[0].existencia <= 0)
    obj_cnf.primal = true
  else obj_cnf.primal = false
  return obj_cnf
}

const verificaPrimalEnExistencia =  async (f_id) =>{
  const obj_cnf = await frmUtil.getRoleSession()
  const obj_session = frmUtil.getObjSession()
  console.log("\n\n...............")

  qUtil.setTableInstance('f_formulario_registro')
  qUtil.setAttributes([[qUtil.literal(`${obj_cnf.primal} AND concluido::DECIMAL<${estado_conclusion} AND 
                      (CURRENT_DATE<= fecha_climite OR (ctype_plus<>'c0' AND CURRENT_DATE <=flimite_plus))`), 'primal'], 
                        [qUtil.literal('CURRENT_DATE'), 'fecha']])
  qUtil.setWhere({registro_id: f_id   })
  await qUtil.findTune()
  /*const query =  ` SELECT CURRENT_DATE<= fecha_climite and TRUE AND concluido::DECIMAL<${estado_conclusion} as primal, CURRENT_DATE, CURRENT_TIMESTAMP, now(), CURRENT_TIME
          FROM f_formulario_registro
          WHERE formulario_id='${f_id}' AND institucion_id='${obj_session.institucion_id}' 
          AND periodo=TO_CHAR(NOW() - INTERVAL '1 month','YYYYMM')`
  qUtil.setQuery(query)
  await qUtil.excuteSelect()*/
  const r =  qUtil.getResults()
  console.log("\n\n ********************> PRIMAL:::::::", r ,"::::::::::::::\n")
  if(r.length>0){
    return {primal:r[0].primal}
  } else{
    return {primal:false}
  }
}

const getEvalForms = async (dto) => {
  try {
    
    const paramLocalModelo = !dto.swModel ? 'evaluacionn' : 'evaluacion_todes'
    dto.modelos = [paramLocalModelo]
console.log("\n\n\n&&&&&&&&&&&& PROCESADOR GENERICO MODELO: ",dto ," &&&&&&&&&&&&\n\n\n")
    frmUtil.setParametros(PARAMETROS)
    await frmUtil.getDataParams(dto)
    const result = frmUtil.getResults()

    const obj_cnf = await verificaPrimal(dto.idx)

    return {
      ok: true,
      data: result,
      role: obj_cnf,
      message: 'Resultado exitoso. Parametros obtenidos',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error de sistema: NEGOCYCNFFORMS',
      error: error.message,
    }
  }
}
const saveEvalForm = async (dto, handleError) => {
  try {
    await qUtil.startTransaction()
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession() //await frmUtil.getRoleSession()
    delete dto.data.last_modify_date_time

    //obtiene fechas limite de conclusion y revision
    qUtil.setTableInstance('f_formulario_institucion_cnf')
    qUtil.setAttributes([
      [qUtil.literal(`(to_date('${dto.data.periodo}','YYYYMM') + CAST(limite_dia-1 ||'days' AS INTERVAL)) + INTERVAL '1 month'`), 'fecha_climite'],
      [qUtil.literal(`(to_date('${dto.data.periodo}','YYYYMM') + CAST(revision_dia-1 ||'days' AS INTERVAL)) + INTERVAL '1 month'`), 'fecha_rlimite'], 
      [qUtil.literal(`(to_date('${dto.data.periodo}','YYYYMM') + CAST(limite_plus-1 ||'days' AS INTERVAL)) + INTERVAL '1 month'`), 'flimite_plus'],
      [qUtil.literal(`(to_date('${dto.data.periodo}','YYYYMM') + CAST(revision_plus-1 ||'days' AS INTERVAL)) + INTERVAL '1 month'`), 'frevisado_plus'],
      'opening_delay'
    ])
    qUtil.setWhere({institucion_id: dto.data.institucion_id, formulario_id: dto.data.formulario_id })
    await qUtil.findTune()
    const data_cnfFrm =  qUtil.getResults()

    //repone configuracion en caso de ser registro por demora
    if(data_cnfFrm[0].opening_delay){
      console.log("\n *************REGISTRO POR DEMORA :::::\n")
      const obj_mod =  frmUtil.getObjSessionForModify()
      delete obj_mod.institucion_id
      qUtil.setDataset({opening_delay: null, ...obj_mod})
      await qUtil.modify()
      data_cnfFrm[0].ctype_plus = 'c1'

    }
    
    qUtil.setTableInstance('f_formulario_registro')
    qUtil.setDataset(Object.assign(dto.data, obj_cnf, data_cnfFrm[0]))

    await qUtil.create()
    const result = qUtil.getResults()
    
    await qUtil.commitTransaction()

    //guarda todos parametros formulario
    const respuestas =   await construyeDatos({ idx: dto.data.formulario_id, token: dto.token })
    const rr = await servicesBasics.saveFormsRes({frm: dto.data.formulario_id, respuestas: respuestas, idx:result.registro_id, token: dto.token})

    if(rr.ok==false){
      throw new Error('error Guardado Formulario') 
    }
    //actualiza cxy del registro enviado

    await servicesBasics.modifyCXYLlenado({token: dto.token, formulario_id: dto.data.formulario_id, registro_id: result.registro_id})

    return await getEvalForms({ idx: dto.data.formulario_id, token: dto.token })

    

    //getEvalForms(dto, handleError)
    //return {}
  } catch (error) {
    await qUtil.rollbackTransaction()
    console.log('\n\nerror::: EN SERVICES SAVE\n', error)
    handleError.setMessage('Error de sistema: FRMSPERSAVE')
    handleError.setHttpError(error.message)
  }
}

/**
 * metodo para habilitar registro en caso sobrepasar fechas calendario
 * @param {*} dto 
 * @param {*} handleError 
 * @returns 
 */
const editEvalForm = async (dto, handleError) => {
  try {
    await qUtil.startTransaction()
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSessionForModify() //await frmUtil.getRoleSession()
    delete obj_cnf.institucion_id
        
    const estado =  {ctype_plus:'c'+dto.data.estado, dni_plus:obj_cnf.dni_register, modify_date_plus: obj_cnf.last_modify_date_time}
    let neoData = null
    //analiza ifnormacion
    if(dto.data.idx && dto.data.estado==2){
      console.log("\n ******************INGRESANDO PARA MODIFICAR REGISTRO HABILITACION DE CONCLUSION POR DEMORA\n")
      //es registro para habilitar conclusion con demora
      qUtil.setTableInstance('f_formulario_registro')
      qUtil.setDataset(estado)
      qUtil.setWhere({registro_id:dto.data.idx})
      await qUtil.modify()
      //obtiene datos de nuevo estado
      qUtil.setTableInstance('u_is_atributo')
      qUtil.setAttributes([['atributo', 'revisado'], ['color','revisado_color'], ['atributo_id','revision_estado']])
      qUtil.setWhere({atributo_id: 'c'+dto.data.estado})
      await qUtil.findTune()
      neoData = qUtil.getResults()[0]
    }else if(dto.data.idx && dto.data.prevision) {
      console.log("\n ******************INGRESANDO PARA CAMBIAR ESTADO DE VERIFICACION  DE CONCLUSION\n")
      //es registro para VERIFICAR
      qUtil.setTableInstance('f_formulario_registro')
      qUtil.setDataset({revisado: estado_revision, dni_revisado:obj_cnf.dni_register, fecha_revisado:qUtil.literal('CURRENT_TIMESTAMP')})
      qUtil.setWhere({registro_id:dto.data.idx})
      await qUtil.modify()
      //obtiene datos de nuevo estado
      qUtil.setTableInstance('u_is_atributo')
      qUtil.setAttributes([['atributo', 'revisado'], ['color','revisado_color'], ['atributo_id','revision_estado']])
      qUtil.setWhere({atributo_id: estado_revision})
      await qUtil.findTune()
      neoData = qUtil.getResults()[0]

    }else if (dto.data.idx && dto.data.vestado==1){
      console.log("\n ******************INGRESANDO PARA AMPLIAR VERIFICACION  POR DEMORA\n")
      //AMPLIAR VERIFICACION POR DEMORA
      qUtil.setTableInstance('f_formulario_registro')
      qUtil.setDataset({rtype_plus:'r'+dto.data.vestado, dni_plus:obj_cnf.dni_register, modify_date_plus:obj_cnf.last_modify_date_time})
      qUtil.setWhere({registro_id:dto.data.idx})
      await qUtil.modify()
    }else if(!dto.data.idx && dto.data.estado==1){
      console.log("\n ******************INGRESANDO PARA MODIFICAR PERIODO PARA HABILITAR REGISTRO CON DEMORA\n")
      //es registro para habilitar registro inicial con demora
      qUtil.setTableInstance('f_formulario_institucion_cnf')
      qUtil.setDataset({opening_delay: dto.data.periodo, ...obj_cnf})
      qUtil.setWhere({institucion_id:dto.data.institucion, formulario_id: dto.data.frm})
      await qUtil.modify()
    }

    await qUtil.commitTransaction()

    //getEvalForms(dto, handleError)
    return {
      ok:true,
      data: neoData,
      message:'Transaccion realizada exitosamente'
    }
  } catch (error) {
    await qUtil.rollbackTransaction()
    console.log('\n\nerror::: EN SERVICES SAVE-EDIT\n', error)
    handleError.setMessage('Error de sistema: FRMSPEREDITCNF')
    handleError.setHttpError(error.message)
  }
}

const construyeDatos = async (dto) =>{
  frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()

  const datos = await servicesBasics.getFrmsInfo(dto)

  const respuestas = {}

  for (const seccion of datos.data[0].sections) {
    respuestas[seccion.sfrm] = {}    
    for (const pregunta of seccion.questions) {
      respuestas[seccion.sfrm][pregunta.efrm] = {answers:{}, tipo:pregunta.type}

      if([0,1,2].includes(pregunta.type))
        respuestas[seccion.sfrm][pregunta.efrm].answers = {[pregunta.answers[0].ofrm]:null}
      if([3].includes(pregunta.type)){
        for (const fila of pregunta.questions) {
          respuestas[seccion.sfrm][pregunta.efrm].answers[fila.efrm]={}
          for (const col of fila.answers) 
            respuestas[seccion.sfrm][pregunta.efrm].answers[fila.efrm][col.ofrm]=0
        }          
      }

      if([100].includes(pregunta.type)){
        respuestas[seccion.sfrm][pregunta.efrm].answers.tabla = []
        //solo para row y col con repeat ==0
        if(pregunta.mrow && pregunta.mcol && !pregunta.mscol && pregunta.repeat<=0){
          for(const trow of pregunta.mrow.fatributos){
            let tmp = []
            for(const tcol of pregunta.mcol.fatributos){
              tmp.push( {
                  col: tcol.value,
                  scol: null,
                  valor: 0,
                  row: trow
                }
              )
            }
            respuestas[seccion.sfrm][pregunta.efrm].answers.tabla.push(tmp)
          }
        }

        //solo para row y col con repeat >0
        if(pregunta.mrow && pregunta.mcol && !pregunta.mscol && pregunta.repeat>0){
          for (let index=0; index<pregunta.repeat ;index++) {
            let tmp = []
            for(const tcol of pregunta.mcol.fatributos){
              tmp.push( {
                  irow:  index,
                  col: tcol.value,
                  scol: null,
                  valor: 0,
                  row: pregunta.mrow.fatributos[index] ? pregunta.mrow.fatributos[index]:pregunta.mrow.fatributos[0]
                }
              )
            }
            respuestas[seccion.sfrm][pregunta.efrm].answers.tabla.push(tmp)
          }
        }

        //solo para row, col y scol con repeat ==0
        if(pregunta.mrow && pregunta.mcol && pregunta.mscol && pregunta.repeat<=0){

          for (const trow of pregunta.mrow.fatributos) {
            const tmp = []
            for (const tcol of pregunta.mcol.fatributos) {              
              for (const tscol of pregunta.mscol.fatributos) {
                tmp.push({
                  col: tcol.value,
                  scol: tscol.value,
                  valor: 0,
                  row: trow
                })
              }
            }
            respuestas[seccion.sfrm][pregunta.efrm].answers.tabla.push(tmp)
          }
        }
        
        //solo para row, col, scol y repeat >0
        if(pregunta.mrow && pregunta.mcol && pregunta.mscol && pregunta.repeat>0){

          for (let index=0; index<pregunta.repeat ;index++) {
            const tmp = []
            for (const tcol of pregunta.mcol.fatributos) {              
              for (const tscol of pregunta.mscol.fatributos) {
                tmp.push({
                  irow:index,
                  col: tcol.value,
                  scol: tscol.value,
                  valor: 0,
                  row: pregunta.mrow.fatributos[index] ? pregunta.mrow.fatributos[index]:pregunta.mrow.fatributos[0]                  
                })
              }
            }
            respuestas[seccion.sfrm][pregunta.efrm].answers.tabla.push(tmp)
          }
        }
      }//end if type 100

    }
  }

  console.log("********************************************\n\n\n")
  console.log("respuestas:", respuestas)
  console.log("********************************************\n\n\n")

  //datos.xyz = respuestas
  //return datos

  return respuestas
}

const getDataFrmAll =  async (dto, handleError) => {
  try {
    console.log("\n\n\n *********** PROCESO POR MICROCONSULTA **************", dto)
    frmUtil.setToken(dto.token)
    //segun dto de carga obtiene datos
    // dto.frm &&  dto.sec &&  dto.prg
    if(dto.data.frm &&  dto.data.sec &&  dto.data.prg)
      return await getFrmSecQueAnsersInfo(dto.data)
    if(dto.data.frm &&  dto.data.sec &&  !dto.data.prg)
      return await getFrmSectionQuestionsInfo(dto.data)
    if(dto.data.frm &&  !dto.data.sec &&  !dto.data.prg)
      return await getFrmSectionInfo(dto.data)
    if(dto.data.reg && !dto.data.frm &&  !dto.data.sec &&  !dto.data.prg)
      return await getEvalInfo(dto.data,handleError)
    
    return{
      nose:"se pasao por alto",
      dto: dto.data
    }
  } catch (error) {
   
    console.log('\n\nerror::: EN SERVICES SAVE\n', error)
    handleError.setMessage('Error de sistema: GETSECCFRMSAVE')
    handleError.setHttpError(error.message)
  }
}


/** brinda informacion de formulario por partes */

const getEvalInfo = async (dto, handleError) => {
  try {
    
    const obj_cnf = frmUtil.getObjSession()
    const idx = dto.reg
    
    
    //pregunta si pidio datos complemenmtarios
    if(dto?.headerData){
      const pdfService =  require('./FrmPDFPrintService')
      const result = await pdfService.getInitialHeaderData({idx:idx},handleError)
      if(result.ok){
        const noCampos=['registro_id', 'last_modify_date_time','dni_register', 'activo', 'institucion_id', 'formulario_id', 'concluido', 'fecha_climite', 'dni_revisado', 'revisado', 'fecha_rlimite', 'opening', 'dni_plus', 'modify_date_plus', 'ctype_plus', 'rtype_plus', 'flimite_plus', 'frevisado_plus']
        for (const element of noCampos) {
          delete result.data[element]
        }
      }
      return result
    }else{
      qUtil.setResetVars()
      console.log("\n\n ***********VERIFICANDO VALIDEZ FORMULARIO ********** \n\n")
      qUtil.setTableInstance('f_formulario_registro')
      await qUtil.findID(idx)
      const r = qUtil.getResults()
      qUtil.setResetVars()

      if(r.concluido == estado_conclusion || r.dni_register != obj_cnf.dni_register)
        r.concluido = true
      else {
        //verifica primal segun dias limite
        const obj_ctrl =  await verificaPrimalEnExistencia(idx)//await verificaPrimal(r.formulario_id)
        console.log("\n\n ***********VALIDEZ FORMULARIO ********** \n\n", obj_ctrl)
        r.concluido = obj_ctrl.primal
        if(obj_ctrl.primal)
          r.concluido = false
        else
        r.concluido = true
      }
        //verifica estado de conclusion
      return {
        ok: true,
        data: r,
        //obj:obj_cnf,
        message: 'Resultado exitoso. Parametros Evaluacion obtenido',
      }
    }

    
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error de sistema: FRMSDATA',
      error: error.message,
    }
  }
}
const getFrmSectionInfo = async (dto) => {
  try {
    
    const idx = dto.frm
    
    qUtil.setResetVars()
    
    qUtil.setTableInstance('f_formulario')
    qUtil.setAttributes([
      ['codigo_formulario','frm_cod'],['formulario_id','frm'],['nombre_formulario','frm_name'], 'ordenanza', 'descripcion', 'version'
    ])
    
    
    qUtil.setOrder([qUtil.col('sections.orden')] )
    let cnf = {
      as: 'grupo',
      attributes: [['nombre_grupo_formulario','grupo']],
      model: qUtil.getTableInstance('f_formulario_grupo'),      
    }
    qUtil.setInclude(cnf)
    cnf = {
      as: 'clase',
      attributes:[['nombre_clase','clase']],
      model: qUtil.getTableInstance('f_formulario_clase'),
    }
    qUtil.pushInclude(cnf)
    cnf = {
      association: 'sections', required: false,
      attributes: [['nombre_subfrm','name_section'], ['orden','ord'], ['subfrm_id','sfrm'],'descripcion', 'codigo'],            
    }    
    qUtil.pushInclude(cnf)
     
    qUtil.setWhere({ formulario_id: idx })

    await qUtil.findTune()
    const r = qUtil.getResults()
    qUtil.setResetVars()

    return {
      ok: true,
      data: r,
      message: 'Resultado exitoso. Parametros formualrio seccion obtenido',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error de sistema: FRMSDATA',
      error: error.message,
    }
  }
}

const getFrmSectionQuestionsInfo = async (dto) => {
  try {
    console.log("***** OBTENIENDO TODA INFORMACION DE SECCIONES **********")
    const frm_id = dto.frm
    const sec_id = dto.sec
    
    qUtil.setResetVars()
    
    qUtil.setTableInstance('f_frm_subfrm')
    qUtil.setAttributes([['nombre_subfrm','name_section'], ['orden','ord'], ['subfrm_id','sfrm'],'descripcion', 'codigo'])
    
    
    qUtil.setOrder([ qUtil.col('questions.orden') ]       )
        
    let cnf = {                    
          association: 'questions', required: false,
          attributes: [['codigo','cod_e'],['enunciado','question'], ['tipo_enunciado_id', 'type'], ['orden','ord'], ['enunciado_id','efrm'],['enunciado_root','root'], 
                        'repeat', 'repeat_row', 'row_title', 'col_title',
                        ['row_code', 'mrow'], ['col_code', 'mcol'], ['scol_code', 'mscol']
                      ],          
          where: {enunciado_root:'-1'}
    }    
    qUtil.setInclude(cnf)
     
    qUtil.setWhere({ formulario_id: frm_id, subfrm_id:sec_id })

    await qUtil.findTune()
    const r = qUtil.getResults()
    qUtil.setResetVars()


    return {
      ok: true,
      data: r,
      message: 'Resultado exitoso. Parametros Preguntas obtenidos',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error de sistema: FRMSDATA',
      error: error.message,
    }
  }
}

const getFrmSecQueAnsersInfo = async (dto) => {
  try {
    console.log("***** OBTENIENDO TODA INFORMACION PREGUNTAS **********\n\n")
    const frm_id = dto.frm
    const sec_id = dto.sec
    const enu_id = dto.prg
    const reg_id = dto.reg
    
    qUtil.setResetVars()
    
    qUtil.setTableInstance('f_frm_enunciado')
    qUtil.setAttributes([['codigo','cod_e'],['enunciado','question'], ['tipo_enunciado_id', 'type'], ['orden','ord'], ['enunciado_id','efrm'],['enunciado_root','root'], 
      'repeat', 'repeat_row', 'row_title', 'col_title',
      ['row_code', 'mrow'], ['col_code', 'mcol'], ['scol_code', 'mscol']
    ],   )
    
    
    //qUtil.setOrder([  qUtil.col('answers.orden'), qUtil.col('questions.orden'),   qUtil.col('questions.answers.orden')       ]            )
    let cnf = {
      association: 'answers',
      attributes:[['respuesta','answer'],['tipo_enunciado_id', 'type'], ['orden','ord'], ['opcion_id','ofrm']],          
    }
    qUtil.setInclude(cnf)
    cnf = {
      association: 'questions',
      attributes: [['enunciado','question'], ['tipo_enunciado_id', 'type'], ['orden','ord'], ['enunciado_id','efrm']],
      include:[{
        association: 'answers',
        attributes:[['respuesta','answer'],['tipo_enunciado_id', 'type'], ['orden','ord'], ['opcion_id','ofrm']],
      },{
        association: 'respuestas',  required: false,
        attributes:[['opcion_id','ans'],['texto','valor'],['res_frm_id','rll']],
        where:{registro_id: reg_id, formulario_id: frm_id, subfrm_id: sec_id}
      }]
    },//fin
    qUtil.pushInclude(cnf)
    cnf = {      
      association: 'respuestas', required: false,
      attributes:[['opcion_id','ans'],['texto','valor'], ['res_frm_id','rll'],
      ['irow_ll','irow'],["row_ll",'row'],["col_ll",'col'], ["scol_ll",'scol']],
      where:{registro_id: reg_id, formulario_id: frm_id, subfrm_id: sec_id}
    }
    qUtil.pushInclude(cnf)
     
    qUtil.setWhere({ formulario_id: frm_id, subfrm_id: sec_id, enunciado_id:enu_id })

    await qUtil.findTune()
    const r = qUtil.getResults()
    qUtil.setResetVars()

    //recorre resultados para encontrar datos de mrow, mcol y mscol
    const auxRcols = ['mrow', 'mcol', 'mscol']    
    
      for(const k in r){
        //busca informacion solo si hay mrow, mcol y mscol
             
        for (const element of auxRcols) {
          if(r[k][element]){
            qUtil.setResetVars()
            qUtil.setTableInstance('f_is_atributo')
            const campos = qUtil.transAttribByComboBox(['atributo_id','atributo'])
            campos.push(['sw_sg','sume'])
            
            qUtil.setAttributes(campos) 
            qUtil.setOrder(['orden'])  
            qUtil.setWhere({grupo_atributo: r[k][element]})
            const tmp = r[k][element]
            //delete r[0].sections[key].questions[k][element]
            r[k][element] = {}
            await qUtil.findTune()
            r[k][element].fatributos = qUtil.getResults()
            r[k][element].grupo = tmp
          }          
        }        
      }

      //reconstruye respùesta
      console.log("\n************CONSTUYE RESÙESTAS***********\n\n", r)
      
      for(const k in r){
        const obj = r[k]
        const rpstas={rows:[], cols:{}}
        for(const element of obj.respuestas){          
          
          if(element.ans){
            rpstas[element.ans] = element.valor
          }else{
            //pregunta por scol y col
            if(element.scol){
              //con subcolumna y columna
              if(obj.repeat_row){
                const index = Number(element.irow)
                
                
                rpstas.rows[index] = obj.mrow.fatributos.find((o) => o.value === element.row)// element.row
                if(!rpstas.rows[index]) rpstas.rows[index]=  {value: null, text: null}
                rpstas.cols[`${element.irow}|${element.col}|${element.scol}`] =   {value: element.valor, index:element.rll  }
              } else
              rpstas.cols[`${element.row}|${element.col}|${element.scol}`] =   {value: element.valor, index:element.rll  }
            }else{
              //solo con columna 
              if(obj.repeat_row){
                const index = Number(element.irow)
                rpstas.rows[index] = obj.mrow.fatributos.find((o) => o.value === element.row) //element.row
                rpstas.cols[`${element.irow}|${element.col}`] = {value: element.valor, index:element.rll  }
              }else
              rpstas.cols[`${element.row}|${element.col}`] = {value: element.valor, index:element.rll  }
            }
          }
        }
        r[k].respuestas=rpstas
      }

    return {
      ok: true,
      data: r,
      message: 'Resultado exitoso. Parametros Posibles respuestas obtenidos',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error de sistema: FRMSDATA',
      error: error.message,
    }
  }
}

/**
 * 0  -> 1 radio
 * 1  -> 2 check
 * 2  -> 4 texto
 * 3  -> 8 grid Respuestas
 *
 */
const modifyDataFrm = async (dto, handleError)=>{
  await  qUtil.startTransaction()
  try {
    // obtiene datos de session
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSessionForModify()

    const reg = dto.data.reg
    const frm = dto.data.frm
    const sec = dto.data.sec
    const prg =  dto.data.prg
    
    const carga = dto.data.respuestas
    
    const respuestas = []        
        
          const tmp = {registro_id:reg, formulario_id:frm, subfrm_id:sec, enunciado_id: prg, ...obj_cnf}
          //const tmp = {formulario_id:idx, subfrm_id:seccion_id, enunciado_id: pregunta_id, ...obj_cnf}
          let datos = {}
          switch (carga.tipo) {
            case 0:
               datos = {...tmp, res_frm_id: uuidv4(), opcion_id:Object.keys(carga.answers)[0]}          
              respuestas.push(datos)            
              break;
            case 1:
              const ress = Object.keys(carga.answers)
              datos = ress.map((o,i)=>({...tmp, res_frm_id: uuidv4(), opcion_id: o}))
              respuestas.push(...datos)
            break;
            case 2:
                 datos = {...tmp, res_frm_id: uuidv4(), opcion_id:Object.keys(carga.answers)[0], texto:Object.values(carga.answers)[0]}          
                respuestas.push(datos)            
            break;
            case 3:
              for(const row in carga.answers){
                for(const col in carga.answers[row]){
                  datos = {...tmp, res_frm_id: uuidv4(), enunciado_id:row, opcion_id:col, texto:carga.answers[row][col]}
                  respuestas.push(datos)
                }
              }
              break;
            case 100:
                for(const row in carga.answers.tabla){
                  for(const col in carga.answers.tabla[row]){
                    const auxx= carga.answers.tabla[row][col]
                    datos = {...tmp, res_frm_id: uuidv4(), 
                      irow_ll: auxx?.irow >=0 ? auxx.irow: -1,
                      row_ll: auxx.row.value,
                      col_ll: auxx.col,
                      scol_ll: auxx.scol,
                      texto:auxx.valor,
                      rll: auxx.rll
                    }
                    respuestas.push(datos)
                  }
                }
                break;          
            default:
              break;
          }
     
    
    for(element of respuestas){
      console.log(element)
      qUtil.setTableInstance("f_formulario_llenado")
      qUtil.setDataset({...element, concluido:'3'})
      //qUtil.setDataset({texto:'-1000'})
      qUtil.setWhere({res_frm_id: element.rll})
      await qUtil.modify()
    
    }
    
    //actuliza estados

qUtil.setTableInstance('f_formulario_registro')
qUtil.setDataset({concluido:'3', ...obj_cnf})
qUtil.setWhere({registro_id:reg})
await qUtil.modify()

    await qUtil.commitTransaction()
    /*return {
      ok: true,
      data: respuestas,
      message: 'Datos del llenado Guardados',
      
    }*/
    return await getFrmSecQueAnsersInfo(dto.data)
    
  } catch (error) {
    console.log(error)
    await  qUtil.rollbackTransaction()
    return {
      ok: false,
      message: 'Error de sistema: OBJSAVERES',
      error: error.message,
    }
  }
}

const modifyDataEval = async (dto, handleError)=>{
  await  qUtil.startTransaction()
  try {
    // obtiene datos de session
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSessionForModify()

    const reg = dto.data.reg
      
    
    //actuliza estados

qUtil.setTableInstance('f_formulario_registro')
qUtil.setDataset({revisado: Number(estado_conclusion) + 1, 
  dni_concluido: obj_cnf.dni_register,
  concluido:estado_conclusion, 
  fecha_concluido: qUtil.literal('CURRENT_TIMESTAMP'), 
  ...obj_cnf})
qUtil.setWhere({registro_id:reg})
await qUtil.modify()

    await qUtil.commitTransaction()
    
    return {
      ok:true,
      message: "Proceso Efectuado Correctamente"
    }
    //await getDataFrmAll(dto.data,handleError)
    
  } catch (error) {
    console.log(error)
    await  qUtil.rollbackTransaction()
    return {
      ok: false,
      message: 'Error de sistema: MODIFYEVALRES',
      error: error.message,
    }
  }
}

module.exports = {
  getEvalForms,
  saveEvalForm, editEvalForm,
  getDataFrmAll, modifyDataFrm, modifyDataEval
}
