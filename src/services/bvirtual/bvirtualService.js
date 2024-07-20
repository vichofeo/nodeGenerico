const QUtils = require('./../../models/queries/Qutils')
const qUtil = new QUtils()

const FrmUtils = require('./../frms/FrmsUtils')
const frmUtil = new FrmUtils()

const recorreArbolPorFolder = async (folder, no_rama = 0, datos) => {
  if (folder != '-1' && datos.hashchild) {
    datos.children = []
    qUtil.setTableInstance('bv_folder')
    qUtil.setAttributes([
      ['folder_id', 'id'],
      ['name_folder', 'name'],
      'hashchild',
      'folder_root',
    ])
    qUtil.setWhere({ folder_root: folder, activo: 'Y' })
    qUtil.setOrder(['name_folder'])
    await qUtil.findTune()
    console.log('\n\n ejecuta query........\n\n')
    const result = qUtil.getResults()
    if (result.length > 0) {
      for (const element of result) {
        const tmp = await recorreArbolPorFolder(element.id, no_rama, element)
        datos.children.push(tmp)
      }
    }
  }
  no_rama++
  return datos
}

const getDataFolders = async (dto, handleError) => {
  try {
    //o´regunta si rol es primal
    frmUtil.setToken(dto.token)
    const obj_rol = await frmUtil.getRoleSession()

    qUtil.setTableInstance('bv_folder')
    qUtil.setAttributes([
      ['folder_id', 'id'],
      ['name_folder', 'name'],
      'hashchild',
      'folder_root',
    ])

    //obtiene folder raiz
    qUtil.setWhere({ folder_root: -1, activo: 'Y' })
    qUtil.setOrder(['name_folder'])
    await qUtil.findTune()
    const result = qUtil.getResults()
    let no_rama = 0
    const valores = []
    if (result.length > 0) {
      for (const element of result) {
        console.log('\n\n entrando cooooo:', element.id)
        no_rama = await recorreArbolPorFolder(element.id, no_rama, element)
        console.log(':::nor rama', no_rama)
        valores.push(no_rama)
      }
    }
    qUtil.setResetVars()

    return {
      ok: true,
      data: valores,
      role:obj_rol,
      message: 'Requerimiento Exitoso',
    }
  } catch (error) {
    console.log(error)
    console.log('\n\nerror::: EN SERVICES\n')
    handleError.setMessage('Error de sistema: BVIRTFOLDERSRV')
    handleError.setHttpError(error.message)
  }
}

const saveDataFolders = async (dto, handleError) => {
  try {
    await qUtil.startTransaction()
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()//await frmUtil.getRoleSession()

    qUtil.setTableInstance('bv_folder')
    qUtil.setDataset(Object.assign(dto.data, obj_cnf))

    await qUtil.create()

    //actualiza campo haschil de folder padre
    if (dto.data.folder_root != -1) {
      qUtil.setDataset({ hashchild: 1 })
      qUtil.setWhere({ folder_id: dto.data.folder_root })
      await qUtil.modify()
    }

    await qUtil.commitTransaction()
    return getDataFolders(dto, handleError)
    //return {}
  } catch (error) {
    await qUtil.rollbackTransaction()
    console.log('\n\nerror::: EN SERVICES SAVE\n', error)
    handleError.setMessage('Error de sistema: BVIRTSAVEFOLDERSRV')
    handleError.setHttpError(error.message)
  }
}

const editDataFolders = async (dto, handleError) => {
  try {
    await qUtil.startTransaction()
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSessionForModify()

    qUtil.setTableInstance('bv_folder')
    qUtil.setDataset(Object.assign(dto.data, obj_cnf))
    qUtil.setWhere({ folder_id: dto.data.idx })
    //actualiza campo haschild de folder padre
    await qUtil.modify()

    await qUtil.commitTransaction()
    return getDataFolders(dto, handleError)
    //return {}
  } catch (error) {
    await qUtil.rollbackTransaction()
    console.log('\n\nerror::: EN SERVICES SAVE\n', error)
    handleError.setMessage('Error de sistema: BVIRTEDITFOLDERSRV')
    handleError.setHttpError(error.message)
  }
}
const deleteDataFolders = async (dto, handleError) => {
  try {
    await qUtil.startTransaction()
    frmUtil.setToken(dto.token)
    const obj_rol = await frmUtil.getObjSessionForModify()

    //verfica q no exista ocntenido en el folde
    qUtil.setTableInstance('bv_files')
    qUtil.setWhere({ folder_id: dto.data.idx })
    await qUtil.findTune()
    let result = qUtil.getResults()

    if (result.length > 0) {
      //no se pude borrar pq existe contenido
      return {
        ok: false,
        message:
          'La Carpeta no puede ser Suprimida por existir Archivo en ella',
      }
    } else {
      //verifica q no existan dependientes
      qUtil.setTableInstance('bv_folder')
      qUtil.setWhere({ folder_root: dto.data.idx })
      await qUtil.findTune()
      result = qUtil.getResults()
      if (result.length > 0) {
        //inactiva carpeta
        qUtil.setWhere({ folder_id: dto.data.idx })
        qUtil.setDataset(Object.assign({ activo: 'N' }, obj_rol))
        await qUtil.modify()
        const datos = await getDataFolders(dto, handleError)
        await qUtil.commitTransaction()
        datos.ok = false
        datos.message =
          'Se ha Inactivado el folder, ya no podra ver los subFolders'

        return datos
      } else {
        //elimina fisicamente el folder
        qUtil.setWhere({ folder_id: dto.data.idx })
        await qUtil.deleting()
        const datos = await getDataFolders(dto, handleError)
        await qUtil.commitTransaction()
        datos.message = 'Folder Eliminado.'
        return datos
      }
    }
  } catch (error) {
    await qUtil.rollbackTransaction()
    console.log('\n\nerror::: EN SERVICES deleting\n', error)
    handleError.setMessage('Error de sistema: BVIRTDELFOLDERSRV')
    handleError.setHttpError(error.message)
  }
}

//-----------------------------FILES -------------
const searchFiles = async (dto, handleError) => {
  try {
    const value =  `%${dto.valueSearch}%`
    qUtil.setTableInstance('bv_files')
    qUtil.setAttributes([
      ['file_id', 'idx'],
      ['file_name', '__name'],
      ['file_type', 'type'],
      ['file_md5', 'name__'],
      ['file_original_name', 'name'],
      ['file_description', 'description'],
      'title', 'author', 'year', 'city', 'editorial', 'url', 'collection',
      'activo',
      'words',
    ])
    qUtil.setWhere({ 
      ...qUtil.orWhere({file_original_name: qUtil.ilikeWhere(value),
        file_description:qUtil.ilikeWhere(value),
        words: qUtil.ilikeWhere(value),
        title: qUtil.ilikeWhere(value),
        author: qUtil.ilikeWhere(value),
        year: qUtil.ilikeWhere(value),
        city: qUtil.ilikeWhere(value),
        editorial: qUtil.ilikeWhere(value),
        collection: qUtil.ilikeWhere(value),
      })
     })
    qUtil.setOrder(['file_type', 'file_original_name'])
    await qUtil.findTune()
    const result = qUtil.getResults()

    

    return {
      ok: true,
      data: result,
      message: 'Solicitud ejecutada correctamente',
    }
  } catch (error) {
    console.log('\n\nerror::: EN SERVICES GETfILE\n', error)
    handleError.setMessage('Error de sistema: BVIRTGETFILESSRV')
    handleError.setHttpError(error.message)
  }
}

const suggestFiles = async (dto, handleError) => {
  try {
    
    qUtil.setTableInstance('bv_files')
    qUtil.setAttributes([[qUtil.distinctData('ciudad_publicacion'),'value'], ['ciudad_publicacion','text']])  
    qUtil.setWhere({...qUtil.andWhere([{ciudad_publicacion:qUtil.notNull()},{ciudad_publicacion:qUtil.distinto('')}])})  
    qUtil.setOrder(['ciudad_publicacion'])
    await qUtil.findTune()
    const resultCity = qUtil.getResults()

    qUtil.setTableInstance('bv_files')
    qUtil.setAttributes([[qUtil.distinctData('organismo_emisor'),'value'], ['organismo_emisor','text']])  
    qUtil.setWhere({...qUtil.andWhere([{organismo_emisor:qUtil.notNull()},{organismo_emisor:qUtil.distinto('')}])})  
    qUtil.setOrder(['organismo_emisor'])
    await qUtil.findTune()
    const resultCollection = qUtil.getResults()
    return {
      ok: true,
      data: {city:resultCity, collection:resultCollection},
      message: 'Solicitud ejecutada correctamente',
    }
  } catch (error) {
    console.log('\n\nerror::: EN SERVICES get suggest\n', error)
    handleError.setMessage('Error de sistema: BVIRTGETSUGGESTSRV')
    handleError.setHttpError(error.message)
  }
}

const getDataFiles = async (dto, handleError) => {
  try {
    //console.log('\n 9☻ entrando al get', dto)
    qUtil.setTableInstance('bv_files')
    qUtil.setAttributes([
      ['file_id', 'idx'],
      ['file_name', '__name'],
      ['file_type', 'type'],
      ['file_md5', 'name__'],
      ['file_original_name', 'name'],
      //['file_description', 'description'],
      //'file_description',
      //'title', 'author', 'year', 'city', 'editorial', 'url', 'collection',
      'activo',
      'tipo_documento', 'area_tematica', 'tipo_componente', 'codigo', 'titulo', 'fecha_publicacion', 'fecha_actualizacion', 'autores', 'organismo_emisor', 'resumen', 'palabras_clave', 'ambito_aplicacion', 'ciudad_publicacion', 'url',
      //'words',
    ])
    qUtil.setWhere({ folder_id: dto.data.folder_id })
    qUtil.setOrder(['file_type', 'file_original_name'])
    await qUtil.findTune()
    const result = qUtil.getResults()

    return {
      ok: true,
      data: result,
      message: 'Solicitud ejecutada correctamente',
    }
  } catch (error) {
    console.log('\n\nerror::: EN SERVICES GETfILE\n', error)
    handleError.setMessage('Error de sistema: BVIRTGETFILESSRV')
    handleError.setHttpError(error.message)
  }
}

const uploadFile = async (dto, handleError) => {
  try {
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()//await frmUtil.getRoleSession()

    dto.data.file_name = 'Unknown'
    dto.data.file_type = 'ukn'
    dto.data.file_md5 = 'Unknown'
    dto.data.file_original_name = 'Unknown'
    if (dto.file) {
      dto.data.file_name = dto.file.filename
      dto.data.file_md5 = dto.file.md5
      dto.data.file_type = dto.file.mimetype
      dto.data.file_original_name = dto.file.originalname

      //inicia tranaccion
      await qUtil.startTransaction()
      qUtil.setTableInstance('bv_files')
      qUtil.setDataset(Object.assign(dto.data, obj_cnf))

      //verifica existencia de archivo en folder
      qUtil.setWhere({
        folder_id: dto.data.folder_id,
        file_md5: dto.data.file_md5,
      })
      await qUtil.findTune()
      const result = qUtil.getResults()
      if (result.length > 0) {
        //ya existe el registro
        await qUtil.commitTransaction()
        return {
          ok: false,
          message: 'El Archivo ya existe en el folder selecionado',
        }
      } else {
        //inserta
        await qUtil.create()
        await qUtil.commitTransaction()
        return getDataFiles(dto, handleError)
      }
    } else {
      return {
        ok: false,
        message: 'Lo sentimos mucho pero no se pudo registrar ningun archivo',
      }
    }
  } catch (error) {
    await qUtil.rollbackTransaction()
    console.log('\n\nerror::: EN SERVICES SAVE\n', error)
    handleError.setMessage('Error de sistema: BVIRTSAVEFOLDERSRV')
    handleError.setHttpError(error.message)
  }
}

const deleteFile = async (dto, handleError) => {
  try {
    await qUtil.startTransaction()
    frmUtil.setToken(dto.token)
    //const obj_rol = await frmUtil.getObjSessionForModify()

    //verfica q no exista ocntenido en el folde
    qUtil.setTableInstance('bv_files')
    //datos del file
    await qUtil.findID(dto.data.idx)
    const result = qUtil.getResults()

    //elimina registro
    qUtil.setWhere({ file_id: dto.data.idx })
    await qUtil.deleting()
    const datos = await getDataFiles(dto, handleError)
    
    //REALIZAR EL BORRADO FISICO DEL ARCHIVO
    //---- EL TOTIN NO PUDO POR AHORA
    const {unlink} = require('fs/promises')
    const file = process.env.UPLOADS + '/'+result.file_name
    await unlink(file)    

    //lo hizo el Tontin °°||°°
    await qUtil.commitTransaction()
    datos.message = 'Archivo Eliminado.'
    return datos
  } catch (error) {
    await qUtil.rollbackTransaction()
    console.log('\n\nerror::: EN SERVICES deleting\n', error)
    handleError.setMessage('Error de sistema: BVIRTDELFILESRV')
    handleError.setHttpError(error.message)
  }
}

const getFile = async (dto, handleError) => {
  try {
    qUtil.setTableInstance('bv_files')        
    await qUtil.findID(dto.idx)

    const result = qUtil.getResults()

    if (Object.keys(result).length > 0) {
      //./public/images in process.env.UPLOADS
      //const file = './public/images/' + result.file_name
      const file = process.env.UPLOADS + '/'+result.file_name
      
      var fs = require('fs')
      var body = fs.readFileSync(file)
      const file64 = { name: result.file_original_name, type: result.file_type, file: body.toString('base64') }
      return {
        ok: true,
        data: file64,
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

const editFile = async (dto, handleError) => {
  try {
    frmUtil.setToken(dto.token)
    const obj_rol = await frmUtil.getObjSessionForModify()
    const datos =  dto.data
    
      //inicia tranaccion
      await qUtil.startTransaction()
      qUtil.setTableInstance('bv_files')
      qUtil.setDataset(Object.assign(datos, obj_rol))
      qUtil.setWhere({file_id: datos.idx})
      await qUtil.modify()
      
        await qUtil.commitTransaction()
        return getDataFiles(dto, handleError)
      
    
  } catch (error) {
    await qUtil.rollbackTransaction()
    console.log('\n\nerror::: EN SERVICES SAVE\n', error)
    handleError.setMessage('Error de sistema: BVIRTSAVEFOLDERSRV')
    handleError.setHttpError(error.message)
  }
}
module.exports = {
  searchFiles, suggestFiles,
  getDataFolders,
  saveDataFolders,
  editDataFolders,
  deleteDataFolders,

  getDataFiles,
  uploadFile,
  deleteFile,

  getFile,editFile
}
