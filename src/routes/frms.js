const express = require('express')
const router = express.Router()

const authMiddleWare = require('./../middlewares/authMiddleware')
const frmsController = require('../controllers/frms/frmsController')

const frmsReportController =  require('../controllers/frms/frmsReportsController')


router.post('/:modelo', authMiddleWare, frmsController.getfrmsConstuct)
router.get('/:idx', authMiddleWare, frmsController.getFrmsInfo)
router.post('/cnf/cbox', authMiddleWare, frmsController.getDataCboxLigado)
router.get('/cnf/:modelo', authMiddleWare, frmsController.getCnfForms)
router.get('/cnf/:idx/:modelo', authMiddleWare, frmsController.getCnfFormswIdx)
router.post('', authMiddleWare, frmsController.saveCnfForms)

router.post('/fres/save', authMiddleWare, frmsController.saveFormsRes)

//para evaluacion
router.put('/evals', authMiddleWare, frmsController.getEvalForms)
router.post('/eval/save', authMiddleWare, frmsController.saveEvalForm)
router.put('/eval/save', authMiddleWare, frmsController.editEvalForm)
router.post('/eval/get/all', authMiddleWare, frmsController.getDataFrmAll)
router.put('/eval/get/all', authMiddleWare, frmsController.modifyDataFrm)
router.put('/eval/finish', authMiddleWare, frmsController.modifyDataEval)

//para impresion en pdf
router.post('/evals/theprint', authMiddleWare, frmsController.pdfOptions)

//reportes
router.post('/report/initialReport', authMiddleWare, frmsReportController.frmsInitialReport)
router.post('/report/statusReport', authMiddleWare, frmsReportController.frmsStatusReport)
router.post('/report/dataReport', authMiddleWare, frmsReportController.frmsReport)
router.post('/report/consolidate', authMiddleWare, frmsReportController.frmsConsolidado)

module.exports = router
