//require("dotenv").config();
const express =  require("express")
const router =  express.Router()

const  authMiddleWare = require('./../middlewares/authMiddleware')

const controller = require('../controllers/observatorio/observatorioController')


//ruta de solicitud de datos
router.post("/cbox",  controller.getDataCboxLigado) 



//router.post("/eval/tpac/report", authMiddleWare, evalbvController.tpacReport)


module.exports = router