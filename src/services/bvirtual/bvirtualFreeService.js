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
      association: 'fambito', required: false,
      attributes: [['atributo','ambito']],
    })
    qUtil.setOrder(['create_date'])

    //evalua busqueda segun dto
    if(dto.tipo =='S'){
      console.log("*********EXITO *****")
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
