const express = require('express')
const router = express.Router()

const authMiddleWare = require('./../middlewares/authMiddleware')
const frmsController = require('../controllers/frms/frmsController')


router.post('/:modelo', authMiddleWare, frmsController.getfrmsConstuct)
router.get('/:idx', authMiddleWare, frmsController.getFrmsInfo)
router.get('/cnf/:modelo', authMiddleWare, frmsController.getCnfForms)
router.get('/cnf/:idx/:modelo', authMiddleWare, frmsController.getCnfFormswIdx)
router.post('', authMiddleWare, frmsController.saveCnfForms)

router.post('/fres/save', authMiddleWare, frmsController.saveFormsRes)

//para evaluacion
router.put('/evals', authMiddleWare, frmsController.getEvalForms)
router.post('/eval/save', authMiddleWare, frmsController.saveEvalForm)
router.post('/eval/get/all', authMiddleWare, frmsController.getDataFrmAll)
router.put('/eval/get/all', authMiddleWare, frmsController.modifyDataFrm)
router.put('/eval/finish', authMiddleWare, frmsController.modifyDataEval)

//para impresion en pdf
router.post('/evals/theprint', authMiddleWare, frmsController.pdfOptions)


module.exports = router
