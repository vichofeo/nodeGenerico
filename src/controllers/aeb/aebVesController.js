const HandleErrors = require('./../../utils/handleErrors')
const handleError = new HandleErrors()

const { spawn, exec  } = require('child_process');
const path = require('path');

const uploadFile = async (req, res)=>{
        
    try {
        const token = req.headers.authorization
console.log("desde controller",req.file)
    //const result = await service.uploadFile({token:token, data: req.body, file: req.file},handleError)

    if (!req.file || !req.file.filename) {
        return res.status(400).json({ error: 'No se subió ningún archivo' })
      }
    
      const archivo = req.file
      const rutaArchivo = path.join(__dirname, '../../../vesp', archivo.filename)
    
                
        // Ejecutar el script Python
        const pythonProcess = spawn('python3', [
          path.join(__dirname, '../../py', 'procesarlyn.py'),
          rutaArchivo,
        ])
        console.log("____dirnamae")
    console.log(__dirname)
        let resultado = ''
        let error = ''
    
        pythonProcess.stdout.on('data', (data) => {
          resultado += data.toString()
        })
    
        pythonProcess.stderr.on('data', (data) => {
          error += data.toString()
        })
    
        console.log("resultado:", resultado)
        console.log("ruta vesfile:", rutaArchivo)
        console.log("\n\n")

        pythonProcess.on('close', (code) => {
              console.log("en funcion ON", code)
          if (code !== 0) {
            //return res.status(500).json({ error: error || 'Error en Python' })
            handleError.setCode(500)
            handleError.setResponse({ error: error || 'Error en Python' })
            res.status(handleError.getCode()).json(handleError.getResponse())
          }
    
          try {
            const jsonResult = JSON.parse(resultado)
            console.log(jsonResult)
            //res.json(jsonResult)
            handleError.setResponse({ok:true, data:jsonResult})
            res.status(handleError.getCode()).json(handleError.getResponse())

          } catch (e) {
            console.log("errrrorrr envio")
            console.log(e)
            res.status(500).json({ error: 'Error al parsear JSON' })
          }
        })
      

    //handleError.setResponse({ok:true, message:"enviado"})
    //res.status(handleError.getCode()).json(handleError.getResponse())
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    
    uploadFile
}