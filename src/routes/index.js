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

/* Controllers */
const  authMiddleWare = require('./../middlewares/authMiddleware')

const  credencialController = require('./../controllers/auth/credencialController')
const moduloController = require('../controllers/admin/adminController')

//define rutas de la aplicacion en una sola funcion 
const rutas = (app) => {
   app.get('/', (req, res)=>{ res.render("index.html")})

   app.get('/api/test', (req, res)=>{ res.send("Acceso de prueba")})
   //inicio de session
   app.post('/api/login', credencialController.login)

   //usrOptions
   app.get('/api/usr/', authMiddleWare.verifyAuth ,credencialController.listar)
   app.post('/api/usr/', credencialController.guardar)

   //admin
   app.get("/api/admin/module", authMiddleWare.verifyAuth, moduloController.listar)
   app.post("/api/admin/module", authMiddleWare.verifyAuth, moduloController.guardar)
   //controller
   app.get("/api/admin/submodule", authMiddleWare.verifyAuth, moduloController.sblistar)
   app.post("/api/admin/submodule", authMiddleWare.verifyAuth, moduloController.sbguardar)

   //cnf mod
   app.post("/api/admin/mca", authMiddleWare.verifyAuth, moduloController.cnfListar)
   app.post("/api/admin/mcai", authMiddleWare.verifyAuth, moduloController.cnfGuardar)

   //rol
   app.get("/api/admin/croles", authMiddleWare.verifyAuth, moduloController.rollistar)
   app.post("/api/admin/croles", authMiddleWare.verifyAuth, moduloController.rolGuardar)

   //config rol
   app.post("/api/admin/rolemod", authMiddleWare.verifyAuth, moduloController.rolCnfListar)
};

module.exports={
    rutas
}
