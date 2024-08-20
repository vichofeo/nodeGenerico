//require("dotenv").config();
const express =  require("express")
const router =  express.Router()

const  authMiddleWare = require('./../middlewares/authMiddleware')

const controller = require('../controllers/bvirtual/bibliotecaVirtualController')
const bvController =  require('../controllers/bvirtual/bvirtualController')
const bvFreeController =  require('../controllers/bvirtual/bvFreeController')
//const ufamController = require('../controllers/acrehab/evaluacionController')

const PATH_LOCAL = __dirname

const multer = require('multer-md5')
var storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, process.env.UPLOADS)
    },
    filename:(req, file, cb)=>{
        
        //cb(null, Date.now() + '-' + file.originalname)
        cb(null, ''+Date.now())
        //cb(null, ''+file.md5)
    }
})
const upload = multer({
    storage
}).single('uploaded_file')

//generico
router.get("/:modelo", authMiddleWare, controller.getDataModelN)
router.get("/:modelo/new", authMiddleWare, controller.getDataModelNew)
router.get("/:idx/:modelo", authMiddleWare, controller.getDataModel1)


router.post("/cbox", authMiddleWare, controller.getDataCboxLigado) 

//libre
router.get("/fr/:modelo/new",  controller.getDataModelNew)
router.post("/fr",  bvFreeController.getFrFiles)
router.get("/fr/:idx/get",  bvFreeController.getFrFile)
router.get("/fr/:idx/getb64",  bvController.getFile)

//folder
router.get("/folders/f/get", authMiddleWare, bvController.getDataFolders)
router.post("/folders/save", authMiddleWare, bvController.saveDataFolders)
router.put("/folders/edit", authMiddleWare, bvController.editDataFolders)
router.delete("/folders/:idx/del", authMiddleWare, bvController.deleteDataFolders)

router.get("/files/:idx/get", authMiddleWare, bvController.getDataFiles)
router.post("/files/search", authMiddleWare, bvController.searchFiles)
router.post("/files/suggest", authMiddleWare, bvController.suggestFiles)

//router.post("/file/upload", authMiddleWare, upload, bvController.uploadFile)
router.post("/file/upload", authMiddleWare, upload, bvController.uploadFile)
router.delete("/file/:idx/:idy/delete", authMiddleWare, bvController.deleteFile)
router.get("/file/:idx/get", authMiddleWare, bvController.getFile)
router.put("/file/edit", authMiddleWare, bvController.editFile)



//router.post("/eval/tpac/report", authMiddleWare, evalbvController.tpacReport)


module.exports = router