const express =  require("express")
const router =  express.Router()

const  authMiddleWare = require('./../middlewares/authMiddleware')

const controller = require('../controllers/aeb/aebController')
const loaderController = require('../controllers/aeb/aebLoaderController')
const reportController = require('../controllers/aeb/aebReportsTmpsController')
const vesController = require('../controllers/aeb/aebVesController')

//const ufamController = require('../controllers/acrehab/evaluacionController')
const PATH_LOCAL = __dirname
const multer = require('multer-md5')
var storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './vesp')
    },
    filename:(req, file, cb)=>{
        console.log("El archivo es:::",file)
        //cb(null, Date.now() + '-' + file.originalname)
        cb(null, ''+file.originalname)
        //cb(null, ''+file.md5)
    }
})
const upload = multer({
    storage
}).single('uploaded_file')

//admin
router.get("/:modelo", authMiddleWare, controller.getDataModelN)
router.get("/:modelo/new", authMiddleWare, controller.getDataModelNew)
router.get("/:idx/:modelo", authMiddleWare, controller.getDataModel1)

router.post("/cbox", authMiddleWare, controller.getDataCboxLigado) 
router.post("/agrupado", authMiddleWare, controller.getGroupedModels) 


//router.post("/eval/tpac/report", authMiddleWare, evalController.tpacReport)
//rutas para LOUDER xlsm

//
router.post('/xlsx/initializetmps', authMiddleWare, loaderController.initialData)
router.post('/xlsx/statustmps', authMiddleWare, loaderController.statusTmps)
router.post('/xlsx/load', authMiddleWare, loaderController.xlsxLoad)
router.post('/xlsx/normalize', authMiddleWare, loaderController.xlsxNormalize)
router.post('/xlsx/suprtmps', authMiddleWare, loaderController.vaciarTmps)

router.post('/xlsx/eg', authMiddleWare, loaderController.egData)

//equivalencia de campos en datos de cargas
router.post('/tmps/equivalence', authMiddleWare, loaderController.tmpsSaveEquivalencia)

//rutas para reportes
router.post('/xlsx/initialReport', authMiddleWare, reportController.tmpsInitialReport)
router.post('/xlsx/statusReport', authMiddleWare, reportController.tmpsStatus)
router.post('/xlsx/dataReport', authMiddleWare, reportController.tmpsReport)
router.put('/xlsx/loading', authMiddleWare, reportController.tmpsDeletetSnis)

//reporte de snis que cargaron
router.post('/xlsx/statusFrmsSnis', authMiddleWare, reportController.tmpsReportSnis)

///rutas para cargado de archivos ves
router.post("/ves/file/upload", authMiddleWare, upload, vesController.uploadFile)






module.exports = router