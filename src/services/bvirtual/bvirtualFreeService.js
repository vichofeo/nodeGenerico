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
    qUtil.setOrder(['create_date'])

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



module.exports = {
  getFrFiles
}
