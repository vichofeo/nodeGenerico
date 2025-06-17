const express = require('express')
const router = express.Router()

const authMiddleWare = require('./../middlewares/authMiddleware')

const controller =  require('./../controllers/indicadores/indicadorController.js')

//generico
router.get("/:modelo", authMiddleWare, controller.getDataModelN)
router.get("/:modelo/new", authMiddleWare, controller.getDataModelNew)
router.get("/:idx/:modelo", authMiddleWare, controller.getDataModel1)
router.post('/getDataParaDom', authMiddleWare, controller.getDataParaDomIdxModel)
router.post('/savemodel', authMiddleWare, controller.saveModel)

router.post("/cbox", authMiddleWare, controller.getDataCboxLigado) 
router.post("/agrupado", authMiddleWare, controller.getGroupedModels) 


//rutas pra subir archivos xls
/*router.post('/loader/xlsx/load', authMiddleWare, loaderController.xlsxLoad)
router.post('/loader/xlsx/normalize', authMiddleWare, loaderController.xlsxNormalize)
router.post('/loader/xlsx/del', authMiddleWare, loaderController.xlsxDeleting)
*/







module.exports = router