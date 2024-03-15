const express =  require("express")
const router =  express.Router()

const  authMiddleWare = require('./../middlewares/authMiddleware')
const adminController = require('../controllers/admin/adminController')

//admin
router.get("/:modelo", authMiddleWare, adminController.getDataForParam)
router.get("/:idx/:modelo", authMiddleWare, adminController.getDataModelByIdxModel)
router.post("/new", authMiddleWare, adminController.getDataModelForNewReg)
router.post("/cbox", authMiddleWare, adminController.getDataCboxForModel)

router.post("/save", authMiddleWare, adminController.saveDataModifyInsertByModel)
router.post("/saveUsr", authMiddleWare, adminController.saveUsr)

router.post("/eess", authMiddleWare, adminController.getTreeEess)

/*router.post("/module", authMiddleWare, moduloController.guardar)
//controller
router.get("/submodule", authMiddleWare, moduloController.sblistar)
router.post("/submodule", authMiddleWare, moduloController.sbguardar)

//cnf mod
router.post("/mca", authMiddleWare, moduloController.cnfListar)
router.post("/mcai", authMiddleWare, moduloController.cnfGuardar)

//rol
router.get("/croles", authMiddleWare, moduloController.rollistar)
router.post("/croles", authMiddleWare, moduloController.rolGuardar)

//config rol
router.post("/rolemod", authMiddleWare, moduloController.rolCnfListar)

 //usuarios
router.post("/people", authMiddleWare, moduloController.peopleSearch)
router.post("/getDataConfigCre", authMiddleWare, moduloController.peopleDataCredencial)
//router.post("/saveConfigCre", authMiddleWare, moduloController.peopleDataCredencialSave)

//PAIS DPTO MUN
router.post("/pais", authMiddleWare, moduloController.getPais)
router.post("/dpto", authMiddleWare, moduloController.getDpto)
router.post("/muni", authMiddleWare, moduloController.getMuni)
*/

module.exports = router