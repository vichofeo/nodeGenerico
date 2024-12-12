const QUtils = require('./../../models/queries/Qutils')
const qUtil = new QUtils()

const FrmUtils = require('./../frms/FrmsUtils')
const frmUtil = new FrmUtils()

const parametros = JSON.stringify(require('./parameters'))
const PARAMETROS = JSON.parse(parametros)

//Free data
const getFrFilesv010 = async (dto, handleError) => {
  try {
    //console.log('\n 9☻ entrando al get', dto)
    qUtil.setTableInstance('bv_files')
    qUtil.setAttributes([

      //[qUtil.literal("file_md5||'&'||file_id||'==' "), 'idx'],
      ['file_id', 'idx'],
      'activo',
      'tipo_documento', 'tipo_componente', 'ambito_aplicacion',
      'codigo', 'titulo', 'anio_publicacion', 'anios_actualizacion',
      'autores',
      'organismo_emisor', 'resumen',
      'palabras_clave', 'ciudad_publicacion', 'url', 'views', 'downs'

    ])
    //qUtil.setWhere({ folder_id: dto.data.folder_id })
    qUtil.setInclude({
      association: 'fambito', required: true,
      attributes: [['atributo', 'ambito']],
    })
    qUtil.setOrder([['create_date', 'DESC']])

    //condicion por busqueda: Orden search
    if (dto?.tipo == 'S') {
      //resumen:qUtil.ilikeWhere(value),

      const payload = dto.payload
      const value = `%${payload.valor}%`
      if (payload.atributo == 'ambito_aplicacion') {
        qUtil.setInclude({
          association: 'fambito', required: true,
          attributes: [['atributo', 'ambito']],
          where: { atributo: qUtil.ilikeWhere(value) }
        })
      } else {
        qUtil.setWhere({
          [payload.atributo]: qUtil.ilikeWhere(value),
        })
      }

    }

    //condicion por busqueda: Orden filtro
    if (dto?.tipo == 'F') {
      console.log("???????????EXITO FFF?????: ", dto.payload)
      const payload = dto.payload
      const w = {}
      let w2 = undefined
      for (const key in payload) {
        console.log("\n\n lenght:", key, ":::", payload[key].length, "\n", payload[key])
        if (payload[key].length > 0) {
          if (key == 'organismo_emisor') {
            //pregunta si en arrayu existe la opcion otros_b
            let tmp = payload[key]
            if (payload[key].includes('otros_b')) {
              w2 = Object.assign({ ...qUtil.andWhere([{ [key]: qUtil.ilikeNotWhere(`%asuss%`) }, { [key]: qUtil.ilikeNotWhere(`%ministerio%`) }]) }, w2)
              //filtra la opcion 
              tmp = payload[key].filter(op => op != 'otros_b')
            }
            if (tmp.length >= 1) {
              const t = []
              for (const opcion of tmp)
                t.push({ [key]: qUtil.ilikeWhere(`%${opcion}%`) })
              w2 = qUtil.orWhere([{ ...qUtil.orWhere(t) }, { ...w2 }])
            }
          } else
            w[key] = payload[key]
        }
      }
      
      if (Object.keys(w).length > 0 || typeof w2 == 'object'){
        console.log("objeto w includes:", w)
      console.log("objeto w2 ilikes:", w2)
      qUtil.setWhere({
        ...w,
        //...qUtil.orWhere({...w}),
        ...w2,
      })
      }
        
    }


    await qUtil.findTune()
    const result = qUtil.getResults()

    return {
      ok: true,
      data: result,
      message: 'Solicitud ejecutada correctamente',
    }
  } catch (error) {
    handleError.setMessage('Error de sistema: BVIRTGEFREEFILESSRV')
    handleError.setHttpError(error.message)
  }
}


const getFrFile = async (dto, handleError) => {
  try {
    qUtil.setTableInstance('bv_files')
    qUtil.setInclude({
      association: 'fambito', required: true,
      attributes: [['atributo', 'ambito']],
    })
    await qUtil.findID(dto.idx)

    const result = qUtil.getResults()

    if (Object.keys(result).length > 0) {
      //./public/images in process.env.UPLOADS

      //const file = process.env.UPLOADS + '/'+result.file_name      
      //var fs = require('fs')
      //var body = fs.readFileSync(file)

      //const file64 = { name: result.file_original_name, type: result.file_type, file: body.toString('base64') }
      return {
        ok: true,
        data: result,
        message: 'Solicitud ejecutada correctamente',
      }
    } else {
      return {
        ok: false,
        message: 'Solicitud sin resultados, identificador no valido',
      }
    }
  } catch (error) {
    console.log('\n\nerror::: EN SERVICES GETfILE\n', error)
    handleError.setMessage('Error de sistema: BVIRTGETFILE64SRV')
    handleError.setHttpError(error.message)
  }
}

const getFrFiles = async (dto, handleError) => {
  try {
    //console.log('\n 9☻ entrando al get', dto)
    qUtil.setTableInstance('bv_files')
    qUtil.setAttributes([['file_id', 'idx'],
      'activo', 'tipo_documento', 'tipo_componente', 'ambito_aplicacion', 'codigo', 'titulo', 'anio_publicacion', 'anios_actualizacion',
      'autores', 'organismo_emisor', 'resumen', 'palabras_clave', 'ciudad_publicacion', 'url', 'views', 'downs'
    ])    
    qUtil.setInclude({
      association: 'fambito', required: true,
      attributes: [['atributo', 'ambito']],
    })
    qUtil.setOrder([['create_date', 'DESC']])

    let whereMaster = {}

    /**
     * *************** PARA HACER BUSQUEDA *************************
     */
    //condicion por busqueda: Orden search
    if (dto?.searchs && Object.keys(dto?.searchs).length > 0) {
      //opciones de busqueda
      const search = dto.searchs
      const value = `%${search.valor}%`
      if (search.atributo == 'ambito_aplicacion') {
        qUtil.setInclude({
          association: 'fambito', required: true,
          attributes: [['atributo', 'ambito']],
          where: { atributo: qUtil.ilikeWhere(value) }
        })
      } else {
        whereMaster = {...whereMaster, [search.atributo]: qUtil.ilikeWhere(value)}
      }

    }

    /**
     * ************* PARA APLICAR FILTROS ***************
     */
    //condicion por busqueda: Orden filtro
    if (dto?.filters && Object.keys(dto?.filters).length> 0) {
      
      const payload = dto.filters
      const w = {}
      let w2 = undefined
      for (const key in payload) {
        //console.log("\n\n lenght:", key, ":::", payload[key].length, "\n", payload[key])
        if (payload[key].length > 0) {
          if (key == 'organismo_emisor') {
            //pregunta si en arrayu existe la opcion otros_b
            let tmp = payload[key]
            if (payload[key].includes('otros_b')) {
              w2 = Object.assign({ ...qUtil.andWhere([{ [key]: qUtil.ilikeNotWhere(`%asuss%`) }, { [key]: qUtil.ilikeNotWhere(`%ministerio%`) }]) }, w2)
              //filtra la opcion 
              tmp = payload[key].filter(op => op != 'otros_b')
            }
            if (tmp.length >= 1) {
              const t = []
              for (const opcion of tmp)
                t.push({ [key]: qUtil.ilikeWhere(`%${opcion}%`) })
              w2 = qUtil.orWhere([{ ...qUtil.orWhere(t) }, { ...w2 }])
            }
          } else
            w[key] = payload[key]
        }
      }
      
      if (Object.keys(w).length > 0 || typeof w2 == 'object'){
        console.log("\n\n ::::::::::::::> objeto w includes:", w)
        console.log("\n\n ::::::::::::::> objeto w2 ilikes:", w2)
        whereMaster = {...whereMaster, ...w, ...w2 }      
      }
        
    }//end filters

    qUtil.setWhere(whereMaster)
    await qUtil.findTune()
    const result = qUtil.getResults()

    return {
      ok: true,
      data: result,
      message: 'Solicitud ejecutada correctamente',
    }
  } catch (error) {
    handleError.setMessage('Error de sistema: BVIRTGEFREEFILESSRV')
    handleError.setHttpError(error.message)
  }
}

const getDataCortina = async (dto, handleError) => {
  try {
      const modelLocal = 'opsBvirtual'
      dto.modelos = [modelLocal]
      //------------------modifica opciones de busqueda de parametros
      let tablaPluss = ""
      let wherePluss = `and ${dto.searchs.atributo} ILIKE '%${dto.searchs.valor}%'`
      if(dto.searchs.atributo == 'ambito_aplicacion'){
        tablaPluss =  "f_is_atributo, "
        wherePluss = `and bv_files.ambito_aplicacion = f_is_atributo.atributo_id AND f_is_atributo.atributo ILIKE '%${dto.searchs.valor}%'`
      }

      const parametrosAux =  JSON.parse(JSON.stringify(PARAMETROS))
      const tmp =  PARAMETROS[modelLocal].ilogic
      delete PARAMETROS[modelLocal].ilogic
      for (const key in tmp) {
        tmp[key] = tmp[key].replaceAll('|table|', tablaPluss)
        tmp[key] = tmp[key].replaceAll('|where|', wherePluss)
      }
      PARAMETROS[modelLocal].ilogic =  JSON.parse(JSON.stringify(tmp))
      //---------------FIN MDIFICACION PARAMTEROS
      frmUtil.setParametros(PARAMETROS)
      await frmUtil.getDataParams(dto)
      const result = frmUtil.getResults()

      if (dto?.new) {
          for (const key in result) {
              for (const index in result[key].campos) {
                  if (!result[key].campos[index][1])
                      result[key].campos[index][1] = true
                  if (result[key].campos[index][3]=='MS') result[key].valores[index].selected= {value:-1}
              }
          }
      }

      return {
          ok: true,
          data: result,
          message: "Requerimiento Exitoso. Parametros Obtenidos"
      }

  } catch (error) {
      console.log("\n\n ?????????????????????????????????error en GetNew Biblioteca?????????????????????? \n\n");
      console.log(error);
      handleError.setMessage("Error de sistema: BVDATNEWSRV")
      handleError.setHttpError(error.message)
  };

}

module.exports = {
  getFrFiles, getFrFile,
  getDataCortina
}
