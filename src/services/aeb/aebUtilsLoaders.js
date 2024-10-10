const aebUtils = {
    filterSnis302A: function (objDatosJson , params) {
        try {
            const datosJson = objDatosJson.data
            const resultado = []
            const resultadoOriginal = []
            if (typeof datosJson[0] != 'undefined') {
                //verifica q la primera fial contenga informacion basica para el procesamiento
              let datos_basicos = objDatosJson.dataBasic
              datos_basicos.ente_gestor = objDatosJson.eg.value
                                
              //recorre contenido del json excel
              let tmp = {}
              let pivotLocal = null
              for (const element of datosJson) {
    
                if (params.dataValid.includes(element[params.columnPivot])) {
                  if(!params.dataNoProcess.includes(element[params.columnPivot])){
                    tmp[element[params.columnPivot]] = []
                    pivotLocal = element[params.columnPivot]
                  }else pivotLocal = 'NoDefined'
                  
                } else {
    
                  if (Array.isArray(tmp[pivotLocal]) && Object.hasOwn(element, params.columnPivot)) {
                    const keys = Object.keys(element)
                    
                    const keysValidos = keys.filter(valor => params.columnsProcess.includes(valor))
                    //console.log("###3", element)
                    if (keysValidos.length > 0) {
                      //let aux = { formulario: pivotLocal, [params.columnPivot]: element[params.columnPivot], ...datos_basicos }
                      let aux = { formulario: pivotLocal, grupo: element[params.columnPivot], ...datos_basicos }
                      let aux1 = JSON.parse(JSON.stringify(aux))
                      keysValidos.forEach(valor => {
                        aux = Object.assign(aux, { [valor]: element[valor] })
                        //construye resultado
                        const [variable, subvariable] = valor.split("|")
                        //console.log(pivotLocal, " v= ", valor, ":::", { variable: variable, subvariable: subvariable })
    
                        resultado.push({ ...aux1, variable: variable, subvariable: subvariable, valor: element[valor] })
    
                      })
                      tmp[pivotLocal].push(aux)
                      resultadoOriginal.push(aux)
                    }
    
                  }
    
                }
              }
              //console.log("******************TMP:", tmp)
              //filtra  solo resultados
              /*for (const key in tmp) {
                const element = tmp[key]
                if(element.length>0)
                resultado.push(...element)
              }*/
            }
            //console.log("******************RESULADO:", resultado)
            
            return {
                ok: true,
                results : resultado
            }

          } catch (error) {
            console.log(error)
            return {
                ok: true,
                message: error.message
            }
          }
    }, 
    parserSnis302A: function(dataArray, params){
      try {

        const vars= {formulario:'formulario', grupo:'grupo'}
        const principalIndices= [27,31,35,39,43,47,51,55,59,63,67,71,75,79,83,87,91,95,99,103]
        const principalColumns =  params.columnsPrincipal.map(v=>v.split('|'))
        const secundaryColumns =  params.columnsSecundary

        const json_base =  dataArray.dataBasic
        json_base.ente_gestor =  dataArray.eg.value

        const dataValid = params.dataValid
        const dataNoProcess = params.dataNoProcess
        const dataMinusValid =  dataValid.filter(v=>!dataNoProcess.includes(v))

        const resTemp = {principales:{}, secundarios:{}}
        const auxSecundarios = {}

        const datosArray = dataArray.data
        const pivot = 0
        let pivotPricipal = null
        let pivotSecundario =  null

        
        //recorrre matriz de datos
        for (const data of datosArray) {
          //***principal
          if(dataValid.includes(data[pivot])){
            if(!dataNoProcess.includes(data[pivot])){
              resTemp.principales[data[pivot]] = []
              pivotPricipal = data[pivot]
            }else pivotPricipal= 'Nodefined'            
          }else if(Array.isArray(resTemp.principales[pivotPricipal]) && Object.hasOwn(data, pivot) && data[pivot] ){
            if(data.length>1){              
              for (const i in principalIndices) {
                const index =  principalIndices[i]                
                //checka q sea distinto de nulo
                data[index] = data[index]!=null || data[index]!=undefined ? data[index].toString().trim():data[index]
                if(data[index]){                
                  const obj=  {...json_base, formulario: pivotPricipal, grupo:data[pivot], variable: principalColumns[i][0], subvariable: principalColumns[i][1], valor:data[index]}
                  resTemp.principales[pivotPricipal].push(obj)
                }
              }
              
            }
            
          }
          //***secundarios          
          if(dataValid.includes(data[pivot])){
            if(dataNoProcess.includes(data[pivot]) && !dataMinusValid.includes(data[pivot])){
              resTemp.secundarios[data[pivot]] = []
              pivotSecundario = data[pivot]
              auxSecundarios[pivotSecundario] = data
            }else pivotSecundario= 'NoDefined'            
          }else if(Array.isArray(resTemp.secundarios[pivotSecundario]) && Object.hasOwn(data, pivot) && data[pivot] ){            
              resTemp.secundarios[pivotSecundario].push(data)
          }
        }

        
        //parsea datos secundarios
        //2.0. construye datos auxiliares para MORATLIDAD PERINATAL index=5
        let auxIndex5 = resTemp.secundarios[dataNoProcess[1]].concat([auxSecundarios[dataNoProcess[2]]]).concat(resTemp.secundarios[dataNoProcess[2]])
        //concat(resTemp.secundarios[dataNoProcess[2]])
                
        //2.1. secundario: eventos
        let tmpData =  []
        for (const data of resTemp.secundarios[dataNoProcess[0]]) {
          for(const fila of secundaryColumns[dataNoProcess[0]].columns){
            for(let j=1; j<fila.length; j++){
              data[fila[j]] = data[fila[j]]!=null || data[fila[j]]!=undefined ? data[fila[j]].toString().trim():data[fila[j]]              
              if( data[fila[j]] && data[fila[pivot]]?.trim()){
                const obj = {...json_base,
                            formulario: secundaryColumns[dataNoProcess[0]].alias, 
                            grupo: data[fila[pivot]], 
                            variable: secundaryColumns[dataNoProcess[0]].valuesColumns[j-1],
                            valor: data[fila[j]]
                          }
                tmpData.push(obj)
              }
            }
          }
        }
        resTemp.secundarios[dataNoProcess[0]]= tmpData

        //2.2. secundario MORATALIDAD MATERNA index=1
        resTemp.secundarios[dataNoProcess[1]]= parserMaterna_SaludSex(json_base ,pivot,secundaryColumns[dataNoProcess[1]], resTemp.secundarios[dataNoProcess[1]], dataNoProcess[1])
        //2.2. secundario SALUD SEXUAL REPRODUCTIVA index=2
        resTemp.secundarios[dataNoProcess[2]]= parserMaterna_SaludSex(json_base ,pivot,secundaryColumns[dataNoProcess[1]], resTemp.secundarios[dataNoProcess[2]], dataNoProcess[2])
        //2.3. secundario MORTALIDAD index=3
        resTemp.secundarios[dataNoProcess[3]]= parserMaterna_SaludSex(json_base ,pivot,secundaryColumns[dataNoProcess[3]], resTemp.secundarios[dataNoProcess[3]], dataNoProcess[3])
        //2.4  secundario SOSPECA DE ENFERMEDAD CONGENITAS index = 4
        resTemp.secundarios[dataNoProcess[4]]= parserMaterna_SaludSex(json_base ,pivot,secundaryColumns[dataNoProcess[4]], resTemp.secundarios[dataNoProcess[4]], dataNoProcess[4])        
        //2.5 secundario caso especial MORTALIDAD PERINATAL, NEONATAL E INFANTIL index=5
        resTemp.secundarios[dataNoProcess[5]]= parserMaterna_SaludSex(json_base ,67,secundaryColumns[dataNoProcess[5]], auxIndex5, dataNoProcess[5])
        
        const results = []
        for (const k in resTemp) {
          for (const key in resTemp[k]) {
            const element = resTemp[k][key]
            if(element.length>0)
              results.push(...element)
          }          
        }
        

        return {
          ok: true,
          results : results
      }
      } catch (error) {
        console.log(error)
        return {
            ok: true,
            results: error.message
        }
    }
  }
}
//data_basic
//pivot
//secundaryColumns[dataNoProcess[1]]
//resTemp.secundarios[dataNoProcess[1]]
//dataNoProcess[1]
const parserMaterna_SaludSex = (objData, pivot, objColumn, dataArray, frm)=>{
  const tmpData = []
  let colAux =  objColumn.valuesColumns.map(v=>v.split('|'))
  if(dataArray)
        for (const data of dataArray) {
          for (const i in objColumn.columns) {
            const index =  objColumn.columns[i]
            data[index] = data[index]!=null || data[index]!=undefined ? data[index].toString().trim():data[index]
            if(data[index] && data[pivot]){
              const obj = {...objData,
                formulario: frm,
                grupo: data[pivot],
                valor: data[index]
              }
              if(colAux[i][0]) obj.variable = colAux[i][0]
              if(colAux[i][1]) obj.lugar_atencion = colAux[i][1]
              if(colAux[i][2]) obj.subvariable= colAux[i][2] 

              tmpData.push(obj)
            }
          }
        }
    
    return tmpData
}

module.exports = aebUtils