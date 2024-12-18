const express = require('express')
const router = express.Router()

const authMiddleWare = require('./../middlewares/authMiddleware')
const controller =  require('./../controllers/ucass/ucassController')
const farmaciaController = require('./../controllers/ucass/farmaciaController')
const abastecimientoController = require('../controllers/ucass/abastecimientoController.js')

//generico
router.get("/:modelo", authMiddleWare, controller.getDataModelN)
router.get("/:modelo/new", authMiddleWare, controller.getDataModelNew)
router.get("/:idx/:modelo", authMiddleWare, controller.getDataModel1)


router.post("/cbox", authMiddleWare, controller.getDataCboxLigado) 



router.post('/abas/geteess', authMiddleWare, farmaciaController.getEESS)
router.post('/abas/cnfsave', authMiddleWare, farmaciaController.getEESSsave)

//Abastecimiento control
router.put('/meds/ctrlAbas', authMiddleWare, abastecimientoController.getControlAbastecimiento)

module.exports = router