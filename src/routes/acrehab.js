const express =  require("express")
const router =  express.Router()

const  authMiddleWare = require('./../middlewares/authMiddleware')
const controller = require('../controllers/acrehab/acrehabController')
const evalController = require('../controllers/acrehab/evaluacionController')

//admin
router.get("/:modelo", authMiddleWare, controller.getDataModelN)
router.get("/:modelo/new", authMiddleWare, controller.getDataModelNew)
router.get("/:idx/:modelo", authMiddleWare, controller.getDataModel1)

router.post("/cbox", authMiddleWare, controller.getDataCboxLigado) 

router.post("/save", authMiddleWare, controller.acrehabEvalSave) 
router.get("/eval/get/:idx", authMiddleWare, evalController.getDataFrm)
router.get("/eval/getView/:idx", authMiddleWare, evalController.getDataFrmView)
router.get("/eval/:idx/get/:key", authMiddleWare, evalController.getDataFrmSimplex)
router.get("/eval/:idx/getView/:key", authMiddleWare, evalController.getDataFrmSimplexView)
router.post("/eval/save", authMiddleWare, evalController.evalSimplexSave) 

//servicio par adatos monitor y seguimiento
router.get("/eval/getMon/:idx", authMiddleWare, evalController.getDataMonitorView)
router.get("/eval/getEval/:idx", authMiddleWare, evalController.getDataEvalView)

//formularios de evaluacion acreditacion 
router.get("/frm/getFrm/:idx", authMiddleWare, evalController.getFrmView)

//Plan de accion
router.post("/eval/pac/save", authMiddleWare, evalController.pacSave) 
router.get("/eval/pac/:idx/get", authMiddleWare, evalController.pacView)



//accesos para proceso de evaluacion segun formulario

//router.get("/cron/get/programacion", authMiddleWare, controller.getProgramacion)
//router.get("/cron/get/all", authMiddleWare, controller.getAllProg)


/*
router.post("/save", authMiddleWare, adminController.saveDataModifyInsertByModel)
router.post("/saveUsr", authMiddleWare, adminController.saveUsr)

router.post("/eess", authMiddleWare, adminController.getTreeEess)

*/

module.exports = router