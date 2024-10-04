const aebUtils = {
    filterSnis302A: function (datosJson , params) {
        try {
            
            const resultado = []
            const resultadoOriginal = []
            if (typeof datosJson[0] != 'undefined') {
                //verifica q la primera fial contenga informacion basica para el procesamiento
              let datos_basicos = {}
              params.columnBasic.forEach((v, i) => {                
                datos_basicos = Object.assign(datos_basicos, { [params.table[i]]: datosJson[0][v] })    
              })
                  
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
    }
}

module.exports = aebUtils