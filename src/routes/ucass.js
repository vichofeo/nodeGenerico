const express = require('express')
const router = express.Router()

const authMiddleWare = require('./../middlewares/authMiddleware')
const controller =  require('./../controllers/ucass/ucassController')
const farmaciaController = require('./../controllers/ucass/farmaciaController')

//generico
router.get("/:modelo", authMiddleWare, controller.getDataModelN)
router.get("/:modelo/new", authMiddleWare, controller.getDataModelNew)
router.get("/:idx/:modelo", authMiddleWare, controller.getDataModel1)


router.post("/cbox", authMiddleWare, controller.getDataCboxLigado) 



router.post('/abas/geteess', authMiddleWare, farmaciaController.getEESS)
router.post('/abas/cnfsave', authMiddleWare, farmaciaController.getEESSsave)
/*router.get('/:idx', authMiddleWare, farmaciaController.getFrmsInfo)
router.post('/cnf/cbox', authMiddleWare, farmaciaController.getDataCboxLigado)
router.get('/cnf/:modelo', authMiddleWare, farmaciaController.getCnfForms)
*/

module.exports = router