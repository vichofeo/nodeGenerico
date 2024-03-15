const express =  require("express")
const router =  express.Router()

const  authMiddleWare = require('./../middlewares/authMiddleware')
const controller = require('../controllers/actividad/actividadController')

//admin
router.get("/:modelo", authMiddleWare, controller.getDataModelN)
router.get("/:modelo/new", authMiddleWare, controller.getDataModelNew)
router.get("/:idx/:modelo", authMiddleWare, controller.getDataModel1)

router.post("/cbox", authMiddleWare, controller.getDataCboxLigado) 

/*
router.post("/save", authMiddleWare, adminController.saveDataModifyInsertByModel)
router.post("/saveUsr", authMiddleWare, adminController.saveUsr)

router.post("/eess", authMiddleWare, adminController.getTreeEess)

*/

module.exports = router