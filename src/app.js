/** *****************************************
 * 1. IMPORTAR MODULOS
 */

const express = require('express')
const morgan = require('morgan') //FOR DEV control

const config = require('./config/config.cnf')


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


//Habilitar carga de archivos estaticos
app.use(express.static('public'))

/** ************************************
 * 5. MIDDLEWARES
 */
app.use(morgan('dev'))

//habilitando peticiones JSON y parseado
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//CORS
app.use(function (req, res, next){
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Headers', 'content-type, X-Requested-With, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT')
    next()
})
/** *************************************
 * 6. HABILITANDO RUTAS
 */

//rutas urls (MiddleWare)
//routes.producto(app)
routes.rutas(app)
//app.use("/prod",proRouter)

/**
 * 7. LEVANTANDO SERVIDOR
 */


//const host= 
app.listen(app.get('port'), ()=>{
    console.log("corriendo server:" + app.get('port'))
})