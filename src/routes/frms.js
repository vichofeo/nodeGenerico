const express = require("express")
const router = express.Router()

const  authMiddleWare = require('./../middlewares/authMiddleware')
const frmsController = require('../controllers/frms/frmsController')

router.post("/:modelo", authMiddleWare, frmsController.getfrmsConstuct)
  router.get("/:idx", authMiddleWare, frmsController.getFrmsInfo)
  router.get("/cnf/:modelo", authMiddleWare, frmsController.getCnfForms)
  router.get("/cnf/:idx/:modelo", authMiddleWare, frmsController.getCnfFormswIdx)
  router.post("", authMiddleWare, frmsController.saveCnfForms)

module.exports = router