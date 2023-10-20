
const router = require('express').Router()

const moduloController = require('../controllers/admin/adminController')


router.get("/admin/module",  moduloController.listar)
//router.post("/admin/module",  moduloController.guardar)
//router.put("/module/:id",proController.modificar)


module.exports = router
