const express = require('express')
const router = express.Router()

const authMiddleWare = require('./../middlewares/authMiddleware')

const controller =  require('./../controllers/upfs/upfsController.js')
const configController = require('./../controllers/upfs/configController.js')

const registroController = require('../controllers/upfs/resgistroController.js')
const loaderController = require('../controllers/upfs/loaderController')

//generico
router.get("/:modelo", authMiddleWare, controller.getDataModelN)
router.get("/:modelo/new", authMiddleWare, controller.getDataModelNew)
router.get("/:idx/:modelo", authMiddleWare, controller.getDataModel1)
router.post('/getDataParaDom', authMiddleWare, controller.getDataParaDomIdxModel)
router.post('/savemodel', authMiddleWare, controller.saveModel)



router.post("/cbox", authMiddleWare, controller.getDataCboxLigado) 
router.post("/agrupado", authMiddleWare, controller.getGroupedModels) 

//configuracion establecimientos
router.post('/cnf/geteess', authMiddleWare, configController.getEESS)
router.post('/cnf/cnfsave', authMiddleWare, configController.getEESSsave)

// control de registro por periodos
router.put('/regis/ctrl', authMiddleWare, registroController.getControlRegis)
router.post('/regis/saveCtrls', authMiddleWare, registroController.saveRegCtrlRegis)
router.post('/regis/datosReg', authMiddleWare, registroController.getDataRegistrador)

//rutas para el cargado
router.post('/loader/initializeLoader', authMiddleWare, loaderController.initialData)
//router.post('/loader/dataLoadingInitialReport', authMiddleWare, loaderController.dataLoadingReport)
router.post('/loader/comprobate', authMiddleWare, loaderController.loadersComprobate)
router.post('/loader/verify', authMiddleWare, loaderController.verificaPermisoAbasEnProcesamiento)
router.put('/loader/statusLoading', authMiddleWare, loaderController.actualizaEstadoLoader)

//router.post('/report/dataLoadingReport', authMiddleWare, loaderController.getDataLoadingReport)

//rutas pra subir archivos xls
router.post('/loader/xlsx/load', authMiddleWare, loaderController.xlsxLoad)
router.post('/loader/xlsx/normalize', authMiddleWare, loaderController.xlsxNormalize)
router.post('/loader/xlsx/del', authMiddleWare, loaderController.xlsxDeleting)







module.exports = router