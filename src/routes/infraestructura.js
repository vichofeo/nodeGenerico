const express = require("express")
const router = express.Router()

const  authMiddleWare = require('./../middlewares/authMiddleware')

const menuController =  require('../controllers/admin/menuController')
const egController = require('../controllers/georef/egController')
const reportController =  require('../controllers/georef/reportsController')

 //datos para menu de opciones segun: ASSUS, EG, EESS
 router.get("/menu", authMiddleWare, menuController.menuGeoreferencia)

 //datos para modulo de georeferencia e informacion de establecimiento
 router.get("/ssepi/:idx", authMiddleWare, egController.dataEESS)
 router.put("/ssepi", authMiddleWare, egController.saveDataEESS)
 router.get("/ssepi/:idx/:modelo", authMiddleWare, egController.getDataFrmGroupModel)
 
 //mi establecimiento: para usuario de un solo establecimiento
 router.get("/eess/:modelo", authMiddleWare, egController.getDataModelParam)
 router.get("/eess/:idx/:modelo", authMiddleWare, egController.getDataFrmByModel)
 router.post("/eess/get", authMiddleWare, egController.getDataModelByIdxParam)
 
 //llama comboxs personalizado con dependientes de acreditacion/habilitacion, datos para combodependencias
 router.post("/eess/cbox", authMiddleWare, egController.cbxUtil)
 router.post("/eess/cboxAcre", authMiddleWare, egController.cbxUtilAcreHab)

 router.post("/eess", authMiddleWare, egController.saveDataModelByIdxParam)
 router.post("/eess/save", authMiddleWare, egController.saveDataModifyInsertByModel)

 //opciones submodulo de usuarios: pide datos de todos, individual y guarda datos
 router.get("/weusers", authMiddleWare, egController.weUsersget)
 router.get("/weusers/:idx", authMiddleWare, egController.weUserget)
 router.post("/weuser", authMiddleWare, egController.weUserSave)
 
 //mis establecimientos: servicio que entrega datos de los establecimientos segun tipo de usuario
 router.get("/miseess", authMiddleWare, egController.misEess)

  ///Repportes: dinamicos para todos los modulos
 router.get("/reportgral/:model", authMiddleWare, reportController.getReports)

module.exports =  router