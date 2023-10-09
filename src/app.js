/** *****************************************
 * 1. IMPORTAR MODULOS
 */

const express = require('express')
const morgan = require('morgan') //FOR DEV control

const config = require('./config/config.js')


/** ******************************************
 *  2. IMPORTANDO RUTAS
 */

//rutas
const routes = require('./routes/index')
const proRouter = require('./routes/ProRouter')

/**
 * 3.CONEXION A BASE DE DATOS
 */


/** **************************************
 * 4. CONFIGURACIONES
 */

const app = express()
app.set('port', process.env.PORT || config.PORT )




/** ************************************
 * 5. MIDDLEWARES
 */
app.use(morgan('dev'))

//habilitando peticiones JSON y parseado
app.use(express.json())
app.use(express.urlencoded({extended:true}))

/** *************************************
 * 6. HABILITANDO RUTAS
 */

//rutas urls (MiddleWare)
//routes.producto(app)
routes.usuario(app)
app.use("/prod",proRouter)

/**
 * 7. LEVANTANDO SERVIDOR
 */


//const host= 
app.listen(app.get('port'), ()=>{
    console.log("corriendo server:" + app.get('port'))
})