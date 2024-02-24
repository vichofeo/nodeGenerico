const express = require("express")
const router = express.Router()

const  authMiddleWare = require('./../middlewares/authMiddleware')
const snis =  require('../controllers/fsnis/fsnisController')

//Grupo para formularios SNIS
router.post("/f301", authMiddleWare, snis.fsnisReportParams)

module.exports = router