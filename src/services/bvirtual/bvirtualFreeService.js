const QUtils = require('./../../models/queries/Qutils')
const qUtil = new QUtils()

const FrmUtils = require('./../frms/FrmsUtils')
const frmUtil = new FrmUtils()

//Free data
const getFrFiles = async (dto, handleError) => {
  try {
    //console.log('\n 9☻ entrando al get', dto)
    qUtil.setTableInstance('bv_files')
    qUtil.setAttributes([
      
      //[qUtil.literal("file_md5||'&'||file_id||'==' "), 'idx'],
      ['file_id','idx'],
      'activo',
      'tipo_documento', 'tipo_componente', 'ambito_aplicacion', 
      'codigo', 'titulo', 'anio_publicacion', 'anios_actualizacion', 
      'autores', 
      'organismo_emisor', 'resumen', 
      'palabras_clave',  'ciudad_publicacion', 'url',
      
    ])
    //qUtil.setWhere({ folder_id: dto.data.folder_id })
    qUtil.setInclude({
      association: 'fambito', required: true,
      attributes: [['atributo','ambito']],
    })
    qUtil.setOrder([['create_date','DESC']])

    //condicion por busqueda: Orden search
    if(dto?.tipo =='S'){
      //resumen:qUtil.ilikeWhere(value),
      
      const payload =  dto.payload
      const value =  `%${payload.valor}%`
      if(payload.atributo=='ambito_aplicacion'){
        qUtil.setInclude({
          association: 'fambito', required: true,
          attributes: [['atributo','ambito']],
          where:{atributo: qUtil.ilikeWhere(value)}
        })
      }else{
        qUtil.setWhere({
          [payload.atributo]: qUtil.ilikeWhere(value),
        })
      }
      
    }

    //condicion por busqueda: Orden filtro
    if(dto?.tipo =='F'){
      console.log("???????????EXITO FFF?????: ", dto.payload)
      const payload =  dto.payload
      const w = {}
      for (const key in payload) {
        console.log("\n\n lenght:", key, ":::", payload[key].length)
        if(payload[key].length>0){
          w[key] = payload[key]
        }
      }
      if(Object.keys(w).length>0)
      qUtil.setWhere({
        ...qUtil.orWhere({...w})
      })
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
      attributes: [['atributo','ambito']],
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


module.exports = {
  getFrFiles, getFrFile
}
