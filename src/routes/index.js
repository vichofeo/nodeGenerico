const multer = require('multer')
var storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, "./public/images")
    },
    filename:(req, file, cb)=>{
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({
    storage
}).single('imagen')
/*
const productoController = require('../controllers/ProductoController')

const producto = (app)=>{
    app.get("/producto", productoController.listar)
    app.post("/producto", productoController.guardar)
    app.put("/producto/:id", productoController.modificar )
}

module.exports = {
    producto
}
*/

/* Controllers */
const  authMiddleWare = require('./../middlewares/authMiddleware')
const  authController = require('./../controllers/auth/authController')
const  usrController = require('./../controllers/auth/usrController')

//define rutas de la aplicacion en una sola funcion 
const rutas = (app) => {
   app.get('/', (req, res)=>{ res.render("index.html")})

   app.get('/api/test', (req, res)=>{ res.send("Acceso de prueba")})
   //inicio de session
   app.post('/api/ingresar', usrController.login)

   //usrOptions
   app.get('/api/usr/', authMiddleWare.verifyAuth ,usrController.listar)
   app.post('/api/usr/', usrController.guardar)
};

module.exports={
    rutas
}
