const express = require('express')
const fileUpload = require('express-fileupload')
const { spawn } = require('child_process')
const path = require('path')

const app = express()
app.use(fileUpload())

// Ruta para subir archivos
app.post('/procesar', (req, res) => {
  
})

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000')
})
