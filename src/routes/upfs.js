const express = require('express')
const router = express.Router()

const authMiddleWare = require('./../middlewares/authMiddleware')

const controller =  require('./../controllers/ucass/ucassController')
const configController = require('./../controllers/upfs/configController.js')

const abastecimientoController = require('../controllers/ucass/abastecimientoController.js')
const loaderController = require('../controllers/ucass/loaderController.js')

//generico
router.get("/:modelo", authMiddleWare, controller.getDataModelN)
router.get("/:modelo/new", authMiddleWare, controller.getDataModelNew)
router.get("/:idx/:modelo", authMiddleWare, controller.getDataModel1)
router.post('savemodel', authMiddleWare, controller.saveModel)


router.post("/cbox", authMiddleWare, controller.getDataCboxLigado) 


//configuracion establecimientos
router.post('/cnf/geteess', authMiddleWare, configController.getEESS)
router.post('/cnf/cnfsave', authMiddleWare, configController.getEESSsave)

//Abastecimiento control
router.put('/meds/ctrlAbas', authMiddleWare, abastecimientoController.getControlAbastecimiento)
router.post('/meds/saveCtrlAbas', authMiddleWare, abastecimientoController.saveRegCtrlAbas)
router.post('/meds/datosReg', authMiddleWare, abastecimientoController.getDataRegistrador)

//rutas para el cargado
router.post('/loader/initializeLoader', authMiddleWare, loaderController.initialData)
router.post('/loader/dataLoadingInitialReport', authMiddleWare, loaderController.dataLoadingReport)
router.post('/loader/comprobate', authMiddleWare, loaderController.loadersComprobate)
router.post('/loader/verify', authMiddleWare, loaderController.verificaPermisoAbasEnProcesamiento)
router.put('/loader/statusLoading', authMiddleWare, loaderController.actualizaEstadoLoader)

router.post('/report/dataLoadingReport', authMiddleWare, loaderController.getDataLoadingReport)
module.exports = router