//require("dotenv").config();
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`),
});

if (!process.env.NODE_ENV) {
  console.error('NODE_ENV no está definido. Usa development o production.');
  process.exit(1);
}
/** *****************************************
 * 1. IMPORTAR MODULOS
 */

const express = require('express')
const morgan = require('morgan') //FOR DEV control
const helmet = require('helmet');
//const xmlparser = require('express-xml-bodyparser')
const config = require('./config/config.cnf.js')

//******************************************************** */
// Usar helmet para agregar encabezados de seguridad
app.use(helmet());

/*app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'", 'trusted.com'], // Recursos por defecto
          scriptSrc: ["'self'", 'trusted.com'],  // Scripts
          styleSrc: ["'self'", 'fonts.googleapis.com'], // Estilos
          imgSrc: ["'self'", 'data:', 'trusted.com'], // Imágenes
          fontSrc: ["'self'", 'fonts.gstatic.com'], // Fuentes
        },
      },
    })
  );*/
/** ******************************************
 *  2. IMPORTANDO RUTAS
 */

//rutas
const routes = require('./routes/index')


/**
 * 3.CONEXION A BASE DE DATOS
 */


/** **************************************
 * 4. CONFIGURACIONES
 */

const app = express()
app.set('port', process.env.PORT || config.PORT )

//el xml parser 
//app.use(xmlparser());

//Habilitar carga de archivos estaticos
app.use(express.static('public'))

/** ************************************
 * 5. MIDDLEWARES
 */
app.use(morgan('dev'))

//habilitando peticiones JSON y parseado
app.use(express.json({limit: '300mb'}))
app.use(express.urlencoded({limit: '300mb', extended: true}))

//CORS
/*app.use(function (req, res, next){
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Headers', 'content-type, X-Requested-With, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT')
    next()
})*/
app.use('*', require('cors')());
/** *************************************
 * 6. HABILITANDO RUTAS
 */

//rutas urls (MiddleWare)
//routes.producto(app)
//routes.rutas(app)
app.use("/api", routes)
//app.use("/prod",proRouter)

/**
 * 7. LEVANTANDO SERVIDOR
 */


//const host= 
app.listen(app.get('port'), ()=>{
    console.log("corriendo server Node en :" + app.get('port'))
})