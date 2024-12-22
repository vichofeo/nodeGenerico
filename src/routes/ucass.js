const express = require('express')
const router = express.Router()

const authMiddleWare = require('./../middlewares/authMiddleware')
const controller =  require('./../controllers/ucass/ucassController')
const farmaciaController = require('./../controllers/ucass/farmaciaController')
const abastecimientoController = require('../controllers/ucass/abastecimientoController.js')
const loaderController = require('../controllers/ucass/loaderController.js')

//generico
router.get("/:modelo", authMiddleWare, controller.getDataModelN)
router.get("/:modelo/new", authMiddleWare, controller.getDataModelNew)
router.get("/:idx/:modelo", authMiddleWare, controller.getDataModel1)
router.post('savemodel', authMiddleWare, controller.saveModel)


router.post("/cbox", authMiddleWare, controller.getDataCboxLigado) 



router.post('/abas/geteess', authMiddleWare, farmaciaController.getEESS)
router.post('/abas/cnfsave', authMiddleWare, farmaciaController.getEESSsave)

//Abastecimiento control
router.put('/meds/ctrlAbas', authMiddleWare, abastecimientoController.getControlAbastecimiento)
router.post('/meds/saveCtrlAbas', authMiddleWare, abastecimientoController.saveRegCtrlAbas)
router.post('/meds/datosReg', authMiddleWare, abastecimientoController.getDataRegistrador)

//rutas para el cargado
router.post('/loader/initializeLoader', authMiddleWare, loaderController.initialData)

module.exports = router