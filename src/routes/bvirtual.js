const express =  require("express")
const router =  express.Router()

const  authMiddleWare = require('./../middlewares/authMiddleware')

const controller = require('../controllers/bvirtual/bvirtualController')
//const ufamController = require('../controllers/acrehab/evaluacionController')

//folder
router.get("/folders/get", authMiddleWare, controller.getDataFolders)
router.post("/folders/save", authMiddleWare, controller.saveDataFolders)



//router.post("/eval/tpac/report", authMiddleWare, evalController.tpacReport)


module.exports = router