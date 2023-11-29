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

const menuController =  require('../controllers/admin/menuController')
const egController = require('../controllers/georef/egController')
const reportController =  require('../controllers/georef/reportsController')

const hl7 = require('../controllers/hl7Controller')

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

    //usuaRIOS PEOPLE
  app.post("/api/admin/people", authMiddleWare.verifyAuth, moduloController.peopleSearch)
  app.post("/api/admin/getDataConfigCre", authMiddleWare.verifyAuth, moduloController.peopleDataCredencial)
  //app.post("/api/admin/saveConfigCre", authMiddleWare.verifyAuth, moduloController.peopleDataCredencialSave)

  //PAIS DPTO MUN
  app.post("/api/admin/pais", authMiddleWare.verifyAuth, moduloController.getPais)
  app.post("/api/admin/dpto", authMiddleWare.verifyAuth, moduloController.getDpto)
  app.post("/api/admin/muni", authMiddleWare.verifyAuth, moduloController.getMuni)

  //app.post("/gestores", productoController.getGestor)
  //app.post("/establecimientos", productoController.getESalud)

  //opciones de menu
  app.get("/api/geo/menu", authMiddleWare.verifyAuth, menuController.menuGeoreferencia)

  //opciones para modulo georef
  app.get("/api/geo/ssepi/:idx", authMiddleWare.verifyAuth, egController.dataEESS)
  app.put("/api/geo/ssepi", authMiddleWare.verifyAuth, egController.saveDataEESS)
  app.get("/api/geo/ssepi/:idx/:modelo", authMiddleWare.verifyAuth, egController.getDataFrm)
  app.get("/api/geo/eess/:modelo", authMiddleWare.verifyAuth, egController.getDataModelParam)
  app.post("/api/geo/eess/get", authMiddleWare.verifyAuth, egController.getDataModelByIdxParam)
  app.post("/api/geo/eess", authMiddleWare.verifyAuth, egController.saveDataModelByIdxParam)

  //opciones submodulo de usuarios logueado
  app.get("/api/geo/weusers", authMiddleWare.verifyAuth, egController.weUsersget)
  app.get("/api/geo/weusers/:idx", authMiddleWare.verifyAuth, egController.weUserget)
  app.post("/api/geo/weuser", authMiddleWare.verifyAuth, egController.weUserSave)
  
  //mis establecimientos
  app.get("/api/geo/miseess", authMiddleWare.verifyAuth, egController.misEess)

    ///Repportes
  app.get("/api/geo/reportgral/:model", authMiddleWare.verifyAuth, reportController.getReports)

  //app.post('/api/hl7', hl7.recibe)
  app.get('/api/hl7', hl7.muestra)
  app.delete('/api/hl7', hl7.borrar)
  app.post('/api/hl7', hl7.tmp2)



};

module.exports={
    rutas
}
