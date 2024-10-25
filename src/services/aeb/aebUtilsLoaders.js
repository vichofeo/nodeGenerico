const aebUtils = {
  parserSnis302A: function (dataArray, params) {
    try {

      const vars = { formulario: 'formulario', grupo: 'grupo' }
      const principalIndices = [27, 31, 35, 39, 43, 47, 51, 55, 59, 63, 67, 71, 75, 79, 83, 87, 91, 95, 99, 103]
      const principalColumns = params.columnsPrincipal.map(v => v.split('|'))
      const secundaryColumns = params.columnsSecundary

      const json_base = dataArray.dataBasic
      json_base.ente_gestor = dataArray.eg.value

      const dataValid = params.dataValid
      const dataNoProcess = params.dataNoProcess
      const dataMinusValid = dataValid.filter(v => !dataNoProcess.includes(v))

      const resTemp = { principales: {}, secundarios: {} }
      const auxSecundarios = {}

      const datosArray = dataArray.data
      const pivot = 0
      let pivotPricipal = null
      let pivotSecundario = null


      //recorrre matriz de datos
      for (const data of datosArray) {
        //***principal
        if (dataValid.includes(data[pivot])) {
          if (!dataNoProcess.includes(data[pivot])) {
            resTemp.principales[data[pivot]] = []
            pivotPricipal = data[pivot]
          } else pivotPricipal = 'Nodefined'
        } else if (Array.isArray(resTemp.principales[pivotPricipal]) && Object.hasOwn(data, pivot) && data[pivot]) {
          if (data.length > 1) {
            for (const i in principalIndices) {
              const index = principalIndices[i]
              //checka q sea distinto de nulo
              data[index] = data[index] != null || data[index] != undefined ? data[index].toString().trim() : data[index]
              if (data[index]) {
                const obj = { ...json_base, formulario: pivotPricipal, grupo: data[pivot], variable: principalColumns[i][0], subvariable: principalColumns[i][1], valor: data[index] }
                resTemp.principales[pivotPricipal].push(obj)
              }
            }

          }

        }
        //***secundarios          
        if (dataValid.includes(data[pivot])) {
          if (dataNoProcess.includes(data[pivot]) && !dataMinusValid.includes(data[pivot])) {
            resTemp.secundarios[data[pivot]] = []
            pivotSecundario = data[pivot]
            auxSecundarios[pivotSecundario] = data
          } else pivotSecundario = 'NoDefined'
        } else if (Array.isArray(resTemp.secundarios[pivotSecundario]) && Object.hasOwn(data, pivot) && data[pivot]) {
          resTemp.secundarios[pivotSecundario].push(data)
        }
      }


      //parsea datos secundarios
      //2.0. construye datos auxiliares para MORATLIDAD PERINATAL index=5
      let auxIndex5 = resTemp.secundarios[dataNoProcess[1]].concat([auxSecundarios[dataNoProcess[2]]]).concat(resTemp.secundarios[dataNoProcess[2]])
      //concat(resTemp.secundarios[dataNoProcess[2]])

      //2.1. secundario: eventos
      let tmpData = []
      for (const data of resTemp.secundarios[dataNoProcess[0]]) {
        for (const fila of secundaryColumns[dataNoProcess[0]].columns) {
          for (let j = 1; j < fila.length; j++) {
            data[fila[j]] = data[fila[j]] != null || data[fila[j]] != undefined ? data[fila[j]].toString().trim() : data[fila[j]]
            if (data[fila[j]] && data[fila[pivot]]?.trim()) {
              const obj = {
                ...json_base,
                formulario: secundaryColumns[dataNoProcess[0]].alias,
                grupo: data[fila[pivot]],
                variable: secundaryColumns[dataNoProcess[0]].valuesColumns[j - 1],
                valor: data[fila[j]]
              }
              tmpData.push(obj)
            }
          }
        }
      }
      resTemp.secundarios[dataNoProcess[0]] = tmpData

      //2.2. secundario MORATALIDAD MATERNA index=1
      resTemp.secundarios[dataNoProcess[1]] = parserSectionVarLatcnSvar(json_base, pivot, secundaryColumns[dataNoProcess[1]], resTemp.secundarios[dataNoProcess[1]], dataNoProcess[1])
      //2.2. secundario SALUD SEXUAL REPRODUCTIVA index=2
      resTemp.secundarios[dataNoProcess[2]] = parserSectionVarLatcnSvar(json_base, pivot, secundaryColumns[dataNoProcess[1]], resTemp.secundarios[dataNoProcess[2]], dataNoProcess[2])
      //2.3. secundario MORTALIDAD index=3
      resTemp.secundarios[dataNoProcess[3]] = parserSectionVarLatcnSvar(json_base, pivot, secundaryColumns[dataNoProcess[3]], resTemp.secundarios[dataNoProcess[3]], dataNoProcess[3])
      //2.4  secundario SOSPECA DE ENFERMEDAD CONGENITAS index = 4
      resTemp.secundarios[dataNoProcess[4]] = parserSectionVarLatcnSvar(json_base, pivot, secundaryColumns[dataNoProcess[4]], resTemp.secundarios[dataNoProcess[4]], dataNoProcess[4])
      //2.5 secundario caso especial MORTALIDAD PERINATAL, NEONATAL E INFANTIL index=5
      resTemp.secundarios[dataNoProcess[5]] = parserSectionVarLatcnSvar(json_base, 67, secundaryColumns[dataNoProcess[5]], auxIndex5, dataNoProcess[5])

      const results = []
      for (const k in resTemp) {
        for (const key in resTemp[k]) {
          const element = resTemp[k][key]
          if (element.length > 0)
            results.push(...element)
        }
      }


      return {
        ok: true,
        results: results
      }
    } catch (error) {
      console.log(error)
      return {
        ok: true,
        results: error.message
      }
    }
  },
  parserSnis301A: function (dataArray, params) {
    try {

      //const secundaryColumns =  params.columnsSecundary

      const json_base = dataArray.dataBasic
      json_base.ente_gestor = dataArray.eg.value

      const sections = params.sections.map(v => v.trim())
      const dataNoProcess = params.dataNoProcess  //Object.keys(params.sectionsCol2).map(v=>v.trim())
      const sectionsComplement = params.sectionsCol2
      const sectionsColumns = params.sectionsColumns


      const resTemp = { principales: {}, secundarios: {} }

      const datosArray = dataArray.data
      const pivot = 0
      const pivotSecundary = 30
      let pivotPricipal = null
      let pivotSecundario = null


      //recorrre matriz de datos para columnas primaries
      for (const data of datosArray) {
        data[pivot] = data[pivot] ? data[pivot].trim().replace(/(\r\n|\n|\r)/gm, "") : data[pivot]
        //***principal
        if (sections.includes(data[pivot])) {
          if (!dataNoProcess.includes(data[pivot])) {
            resTemp.principales[data[pivot]] = []
            pivotPricipal = data[pivot]
          } else pivotPricipal = 'Nodefined'
        } else if (Array.isArray(resTemp.principales[pivotPricipal]) && Object.hasOwn(data, pivot) && data[pivot]) {
          if (data.length > 1 && !dataNoProcess.includes(data[pivot])) {
            resTemp.principales[pivotPricipal].push(data)
          }
        }

        //***secundario
        if (sectionsComplement.includes(data[pivotSecundary])) {
          if (!dataNoProcess.includes(data[pivotSecundary])) {
            resTemp.secundarios[data[pivotSecundary]] = []
            pivotSecundario = data[pivotSecundary]
          } else pivotSecundario = 'Nodefined'
        } else if (Array.isArray(resTemp.secundarios[pivotSecundario]) && Object.hasOwn(data, pivotSecundary) && data[pivotSecundary]) {
          if (data.length > 1 && !dataNoProcess.includes(data[pivotSecundary])) {
            resTemp.secundarios[pivotSecundario].push(data)
          }
        }
      }

      //bucle de parseo por sectiosn primaria
      for (const section of sections) {
        if (sectionsColumns[section]) {
          const datos = resTemp.principales[section]
          resTemp.principales[section] = parserSectionVarLatcnSvar(json_base, pivot, sectionsColumns[section], datos, section)
        }
      }

      //bucle de parseo por sectiosn SECUNDARIO O COUMNAS DDE LA DERECHA
      for (const section of sectionsComplement) {
        if (sectionsColumns[section]) {
          const datos = resTemp.secundarios[section]
          resTemp.secundarios[section] = parserSectionVarLatcnSvar(json_base, pivotSecundary, sectionsColumns[section], datos, section)
        }
      }

      //procesa Segmentos con excepcion "exeptionColumns"
      const excepciones = Object.keys(params.exeptionColumns)
      const auxiliarRes = {}
      let pivotAuxiliar = '-99'
      for (const data of datosArray) {
        data[pivot] = data[pivot] ? data[pivot].trim().replace(/(\r\n|\n|\r)/gm, "") : data[pivot]
        //***excepcional
        if (excepciones.includes(data[pivot])) {
          if (!dataNoProcess.includes(data[pivot])) {
            auxiliarRes[data[pivot]] = []
            pivotAuxiliar = data[pivot]
          } else pivotAuxiliar = 'Nodefined'
        } else if (Array.isArray(auxiliarRes[pivotAuxiliar])) {
          if (!dataNoProcess.includes(data[pivot])) {
            auxiliarRes[pivotAuxiliar].push(data)
          }
        }
      }
      //filtra excepciones
      for (const excepcion of excepciones) {
        const tmp = []
        let grupo = JSON.parse(JSON.stringify(params.exeptionColumns[excepcion].pivots)).map(v => null)
        for (fila of params.exeptionColumns[excepcion].filas) {
          //por fila recorre pivots si es nulo ='' 
          //concatena nuevo grupo
          let neogrupo = []
          for (const i in params.exeptionColumns[excepcion].pivots) {
            const colIndex = params.exeptionColumns[excepcion].pivots[i]
            const dataIndex = auxiliarRes[excepcion][fila][colIndex] ? auxiliarRes[excepcion][fila][colIndex] : grupo[i]
            //console.log(fila,",", colIndex, "::>", dataIndex)
            if (grupo[i] != dataIndex) grupo[i] = dataIndex
          }
          //console.log("fila::",fila, grupo )
          auxiliarRes[excepcion][fila][pivot] = grupo.join(': ')
          tmp.push(auxiliarRes[excepcion][fila])
        }
        //manda a filtrado de columnas
        resTemp.principales[excepcion] = parserSectionVarLatcnSvar(json_base, pivot, params.exeptionColumns[excepcion], tmp, excepcion)
      }


      const results = []
      for (const k in resTemp) {
        for (const key in resTemp[k]) {
          const element = resTemp[k][key]
          if (element.length > 0)
            results.push(...element)
        }
      }


      return {
        ok: true,
        results: results
      }
    } catch (error) {
      console.log(error)
      return {
        ok: false,
        results: error.message
      }
    }
  },
  parserSnis301B: function (dataArray, params) {
    try {

      //columnas con dato de parseo

      const sectionsColumns = params.sectionsColumns

      const json_base = dataArray.dataBasic
      json_base.ente_gestor = dataArray.eg.value

      const pivot = { primero: [2, 3], segundo: [14], tercero: [35] }
      const cnf = [
        { pivot: pivot.primero, secciones: params.sections.map(v => v.trim()), destino: 'principales' },
        { pivot: pivot.segundo, secciones: params.sectionsCol2.map(v => v.trim()), destino: 'secundarios' },
        { pivot: pivot.tercero, secciones: params.sectionsCol3.map(v => v.trim()), destino: 'terciarios' }
      ]
      //secciona datos segun modelo excel    
      const resTemp = seccionadorDataArray(dataArray.data, params.dataNoProcess, cnf)//{principales:{}, secundarios:{}}


      //recorrre matriz de datos para columnas primarias    

      //bucle de parseo por sectiosn primaria
      for (const conf of cnf) {
        for (const section of conf.secciones) {
          if (sectionsColumns[section]) {
            const datos = resTemp[conf.destino][section]
            resTemp[conf.destino][section] = parserSectionVarLatcnSvar(json_base, sectionsColumns[section].pivot, sectionsColumns[section], datos, section)
          }
        }
      }



      const results = []
      for (const k in resTemp) {
        for (const key in resTemp[k]) {
          const element = resTemp[k][key]
          if (element.length > 0)
            results.push(...element)
        }
      }


      return {
        ok: true,
        results: results
      }
    } catch (error) {
      console.log(error)
      return {
        ok: false,
        results: error.message
      }
    }
  },
  parserSnis302B: function (dataArray, params) {
    try {

      //columnas con dato de parseo

      const sectionsColumns = params.sectionsColumns

      const json_base = dataArray.dataBasic
      json_base.ente_gestor = dataArray.eg.value

      const pivot = { primero: [1], segundo: [43,33], tercero: [35] }
      const cnf = [
        { pivot: pivot.primero, secciones: params.sections.map(v => v.trim()), destino: 'principales' },
        {pivot:pivot.segundo, secciones: params.sectionsCol2.map(v=>v.trim()), destino:'secundarios' },      
      ]
      //secciona datos segun modelo excel    
      const resTemp = seccionadorDataArray(dataArray.data, params.dataNoProcess, cnf)//{principales:{}, secundarios:{}}

      //bucle de parseo por sectiosn primaria
      for (const conf of cnf) {
        for (const section of conf.secciones) {
          if (sectionsColumns[section]) {
            const datos = resTemp[conf.destino][section]
            resTemp[conf.destino][section] = parserSectionVarLatcnSvar(json_base, sectionsColumns[section].pivot, sectionsColumns[section], datos, section,false)
          }
        }
      }



      const results = []
      for (const k in resTemp) {
        for (const key in resTemp[k]) {
          const element = resTemp[k][key]
          if (element.length > 0)
            results.push(...element)
        }
      }


      return {
        ok: true,
        results: results
      }
    } catch (error) {
      console.log(error)
      return {
        ok: false,
        results: error.message
      }
    }
  }
}

const __parseSubTitles = (colAux, tipoColTres)=>{
  obj = {}
  if(tipoColTres){
    if (colAux[0]) obj.variable = colAux[0]
    if (colAux[1]) obj.lugar_atencion = colAux[1]
    if (colAux[2]) obj.subvariable = colAux[2]
  }else{
    if (colAux[0]) obj.gvariable = colAux[0]
    if (colAux[1]) obj.variable = colAux[1]
    if (colAux[2]) obj.lugar_atencion = colAux[2]
    if (colAux[3]) obj.subvariable = colAux[3]
  }
  return obj
}

//data_basic
//pivot
//cnf:columns, valuesColumns
//DatosArray
//dataNoProcess[1]
const parserSectionVarLatcnSvar = (objData, pivot, objColumn, dataArray, frm, tipoColTres=true) => {
  const tmpData = []
  let colAux = objColumn.valuesColumns.map(v => v.split('|'))
  const exceptions = objColumn?.exception
  if (dataArray)
    for (const data of dataArray) {
      let newVars = []
      if (exceptions && exceptions.filasItem.includes(data[pivot].trim())) newVars = exceptions.atributos

      for (const i in objColumn.columns) {
        const index = objColumn.columns[i]
        data[index] = data[index] != null || data[index] != undefined ? data[index].toString().trim() : data[index]
        if (data[index] && data[pivot] && Number(data[index]) && data[index] > 0) {
          let obj = {
            ...objData,
            formulario: objColumn.alias? objColumn.alias:frm,
            grupo: data[pivot].trim(),
            valor: data[index]
          }
          if (newVars.length <= 0) {
            //console.log(colAux[i])
            obj =  {...obj, ...__parseSubTitles(colAux[i], tipoColTres)}
          } else {
            for (const element of newVars) {
              obj[element[0]] = element[1]
            }
          }
          tmpData.push(obj)
        }
      }
    }

  return tmpData
}
/**
 * cnf=[{pivot: NUmber, secciones:ArraySimple, destino: }]
 */
const seccionadorDataArray = (datosArray, dataNoProcess, cnf) => {

  const result = {}
  const pivotAux = cnf.map(obj => {

    result[obj.destino] = {}
    return null
  })
  for (const data of datosArray) {

    for (const index in cnf) {
      const conf = cnf[index]
      const pivot = conf.pivot[0]

      const destino = conf.destino
      const secciones = conf.secciones
      //inicia con dato pivot
      data[pivot] = data[pivot] && typeof data[pivot] != 'number' ? data[pivot].trim().replace(/(\r\n|\n|\r)/gm, "") : data[pivot]

      if (secciones.includes(data[pivot])) {
        if (!dataNoProcess.includes(data[pivot])) {
          result[destino][data[pivot]] = []
          pivotAux[index] = data[pivot]
        } else pivotAux[index] = 'Nodefined'
      } else if (Array.isArray(result[destino][pivotAux[index]]) && Object.hasOwn(data, pivot) && (data[pivot] || data[conf.pivot[1]])) {
        if (data.length > 1 && !dataNoProcess.includes(data[pivot])) {
          result[destino][pivotAux[index]].push(data)
        }
      }
    }
  }//end for dataArray
  return result
}

module.exports = aebUtils