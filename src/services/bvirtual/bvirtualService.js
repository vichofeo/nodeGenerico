//const pdfConverter = require('pdf-poppler')
const path = require('path')

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
      
      'tipo_documento', 'tipo_componente', 'codigo', 'titulo', 'autores', 'organismo_emisor', 'resumen', 'palabras_clave', 'ambito_aplicacion', 'ciudad_publicacion', 'anio_publicacion', 'anios_actualizacion',
      'activo',
      
    ])
    qUtil.setWhere({ 
      ...qUtil.orWhere({file_original_name: qUtil.ilikeWhere(value),
        resumen:qUtil.ilikeWhere(value),
        palabras_clave: qUtil.ilikeWhere(value),
        titulo: qUtil.ilikeWhere(value),
        autores: qUtil.ilikeWhere(value),
        organismo_emisor: qUtil.ilikeWhere(value),
        //anio_publicacion: qUtil.ilikeWhere(value),
        ciudad_publicacion: qUtil.ilikeWhere(value),
        
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
      'tipo_documento', 'tipo_componente', 'ambito_aplicacion', 'codigo', 'titulo', 'anio_publicacion', 'anios_actualizacion', 'autores', 'organismo_emisor', 'resumen', 'palabras_clave',  'ciudad_publicacion', 'url',
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
/**
 * Almacena archivo fisico y en bd 
 * @param {*} dto 
 * @param {*} handleError 
 * @returns 
 */
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
        //construye archivo de imagen
        const img64 = await __uploadFileImage(dto.data.file_name)
        
        qUtil.setDataset(Object.assign(dto.data, {img: img64}))

        //inserta
        await qUtil.create()
        const result = qUtil.getResults()
        

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
    const {unlink} = require('fs/promises')
    const file = process.env.UPLOADS + '/'+dto.file.filename
    await unlink(file)
    console.log('\n\nerror::: EN SERVICES SAVE\n', error)
    handleError.setMessage('Error de sistema: BVIRTSAVEFOLDERSRV')
    handleError.setHttpError(error.message)
  }
}

const __uploadFileImage = async (fileName) =>{
  const fs = require('fs')
  const {unlink} = require('fs/promises')
  const dir =  process.env.UPLOADS
  //obtiene archivo en fisico
  //await convertImage(`${dir}/${fileName}`, dir)
  await convertImg(`${dir}/${fileName}`, `${dir}/${fileName}` )
  //busca archivo fisico para convertir en b64 y almacenar
  const patron = new RegExp("^"+fileName+".*.jpg$", 'g')
  //filtra y obtiene un array de resultados
  const body =  fs.readdirSync(dir)                          
                .filter((allFilesPaths) => allFilesPaths.match(patron) !== null)
  if(body.length ==1){
    let img =  `${dir}/${body[0]}`
    let result = fs.readFileSync(img)
    await unlink(img)    
    return 'data:image/jpeg;base64, '+ result.toString('base64')
    
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
    await qUtil.startTransaction()
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
      //procesa si se trata de una peticion desde la version publica
      if(dto?.viewdown){
        //existe actualiza contadoras
        qUtil.setTableInstance('bv_files')
        if(dto.viewdown?.view){
          qUtil.setDataset({views: result.views + 1})
          qUtil.setWhere({file_id:result.file_id})
          await qUtil.modify()
        }else if(dto.viewdown?.down){
          qUtil.setDataset({downs: result.downs + 1})
          qUtil.setWhere({file_id:result.file_id})
          await qUtil.modify()
        }
        
      }
      await qUtil.commitTransaction()
      return {
        ok: true,
        data: file64,
        message: 'Solicitud ejecutada correctamente',
      }
    } else {
      await qUtil.commitTransaction()
      return {
        ok: false,
        message: 'Solicitud sin resultados, identificador no valido',
      }
    }
  } catch (error) {
    await qUtil.rollbackTransaction()
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

//Free data
const getFrFiles = async (dto, handleError) => {
  try {
    //console.log('\n 9☻ entrando al get', dto)
    qUtil.setTableInstance('bv_files')
    qUtil.setAttributes([
      //['file_id', 'idx'],
      //['file_name', '__name'],
      //['file_type', 'type'],
      //['file_md5', 'name__'],
      //['file_original_name', 'name'],
      
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

//Utilitarios local
const uploadFiles = async (dto, handleError) => {
  try {
    frmUtil.setToken(dto.token)
    const obj_cnf = frmUtil.getObjSession()//await frmUtil.getRoleSession()
    const dir =  process.env.UPLOADS
      //inicia tranaccion
      await qUtil.startTransaction()
      qUtil.setTableInstance('bv_files')
      qUtil.setWhere({img: null})   
      await qUtil.findTune()
      const result = qUtil.getResults()
      
      const fs = require('fs')
      const {unlink} = require('fs/promises')
      for (const element of result) {
        const idx = element.file_id
        delete element.file_id
        await convertImage(dir+'/'+element.file_name, dir)

        
        //await convertImg(dir+'/'+element.file_name, dir+'/'+element.file_name )
        //leee el archivo 
        //const files = glob.readdirSync(dir+'/'+element.file_name+'-*.jpg', {});

        //console.log("luego de convertir FIles::::", files)
        var nn = element.file_name 
      let patron =  new RegExp("^"+nn+".*.jpg$", 'g')
      let body =  fs.readdirSync(dir)                          
                          .filter((allFilesPaths) => allFilesPaths.match(patron) !== null)
      console.log("FULTRADO..", body)
      if(body.length==1){
        let file =  dir + '/' + body[0]
        let bd = fs.readFileSync(file)
        bd= 'data:image/jpeg;base64, '+ bd.toString('base64')
        //guarda elemento
        qUtil.setTableInstance('bv_files')
        qUtil.setDataset({img:bd})
        qUtil.setWhere({file_id: idx})
        await qUtil.modify()
        await unlink(file)    
        
      }

      }

      return {
        ok:true,
        data: result
      }
    
  } catch (error) {
    await qUtil.rollbackTransaction()
    console.log('\n\nerror::: EN SERVICES SAVE\n', error)
    handleError.setMessage('Error de sistema: BVIRTSAVEFOLDERSRV')
    handleError.setHttpError(error.message)
  }
}
const  convertImage = async (pdfPath, outputPath)=> {

  let option = {
      format : 'jpeg',
      out_dir : outputPath, //'E:\\temp',
      out_prefix : path.basename(pdfPath, path.extname(pdfPath)),
      page : 1,
      scale: 384
  }
// option.out_dir value is the path where the image will be saved


  await pdfConverter.convert(pdfPath, option)
  /*.then(() => {
      console.log('file converted')
      console.log(path.basename(pdfPath, path.extname(pdfPath)))
  })
  .catch(err => {
      console.log('an error has occurred in the pdf converter ' + err)
  })*/


}
const convertImg = async (pdfPath, out_file)=>{
  const { Poppler } = require("node-poppler");

const file = pdfPath //"test_document.pdf";
const poppler = new Poppler();
const options = {
	//firstPageToConvert: 1,
	lastPageToConvert: 1,
	jpegFile: true,
  scalePageTo:384, 
  singleFile: false
};
const outputFile = out_file //`test_document.png`;
const res = await poppler.pdfToCairo(file, out_file, options);
//const res = await poppler.pdfToCairo(file, undefined, options);

console.log("Convirtiendo....", res)//.toString('base64'))
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

  getFile,editFile,

  getFrFiles
}
