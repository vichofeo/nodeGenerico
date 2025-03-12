const express =  require("express")
const router =  express.Router()

const  authMiddleWare = require('./../middlewares/authMiddleware')
const controller = require('../controllers/actividad/actividadController')

//admin
router.get("/:modelo", authMiddleWare, controller.getDataModelN)
router.get("/:modelo/new", authMiddleWare, controller.getDataModelNew)
router.get("/:idx/:modelo", authMiddleWare, controller.getDataModel1)

router.post("/cbox", authMiddleWare, controller.getDataCboxLigado) 
router.post("/cron/save", authMiddleWare, controller.cronogramaSave) 

router.get("/cron/get/programacion", authMiddleWare, controller.getProgramacion)
router.get("/cron/get/all", authMiddleWare, controller.getAllProg)

router.post("/tosender", authMiddleWare, controller.enviarMail) 


/*
router.post("/save", authMiddleWare, adminController.saveDataModifyInsertByModel)
router.post("/saveUsr", authMiddleWare, adminController.saveUsr)

router.post("/eess", authMiddleWare, adminController.getTreeEess)

*/

module.exports = router