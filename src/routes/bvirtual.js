//require("dotenv").config();
const express =  require("express")
const router =  express.Router()

const  authMiddleWare = require('./../middlewares/authMiddleware')

const controller = require('../controllers/bvirtual/bvirtualController')
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



//folder
router.get("/folders/get", authMiddleWare, controller.getDataFolders)
router.post("/folders/save", authMiddleWare, controller.saveDataFolders)
router.put("/folders/edit", authMiddleWare, controller.editDataFolders)
router.delete("/folders/:idx/del", authMiddleWare, controller.deleteDataFolders)

router.get("/files/:idx/get", authMiddleWare, controller.getDataFiles)
router.post("/files/search", authMiddleWare, controller.searchFiles)
router.post("/files/suggest", authMiddleWare, controller.suggestFiles)

router.post("/file/upload", authMiddleWare, upload, controller.uploadFile)
router.delete("/file/:idx/:idy/delete", authMiddleWare, controller.deleteFile)
router.get("/file/:idx/get", authMiddleWare, controller.getFile)
router.put("/file/edit", authMiddleWare, controller.editFile)



//router.post("/eval/tpac/report", authMiddleWare, evalController.tpacReport)


module.exports = router