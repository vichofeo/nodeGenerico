const express =  require("express")
const router =  express.Router()

const  authMiddleWare = require('./../middlewares/authMiddleware')

const controller = require('../controllers/aeb/aebController')
const loaderController = require('../controllers/aeb/aebLoaderController')
//const ufamController = require('../controllers/acrehab/evaluacionController')

//admin
router.get("/:modelo", authMiddleWare, controller.getDataModelN)
router.get("/:modelo/new", authMiddleWare, controller.getDataModelNew)
router.get("/:idx/:modelo", authMiddleWare, controller.getDataModel1)

router.post("/cbox", authMiddleWare, controller.getDataCboxLigado) 


//router.post("/eval/tpac/report", authMiddleWare, evalController.tpacReport)
//rutas para LOUDER xlsm

//

router.post('/xlsx/initializetmps', authMiddleWare, loaderController.initialData)
router.post('/xlsx/statustmps', authMiddleWare, loaderController.statusTmps)
router.post('/xlsx/suprtmps', authMiddleWare, loaderController.vaciarTmps)
router.post('/xlsx/load', authMiddleWare, loaderController.xlsxLoad)
router.post('/xlsx/normalize', authMiddleWare, loaderController.xlsxNormalize)






module.exports = router