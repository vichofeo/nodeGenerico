const app = require('express')
const router = app.Router()

const proController = require('../controllers/ProController')
const authMiddleware = require('../middlewares/authMiddleware')

router.get("/",  proController.listar)
router.post("/",  proController.guardar)
router.put("/:id",proController.modificar)


//inicio de session
const authController = require("../controllers/authController")
router.post("/ingresar", authController.ingresar)

module.exports = router
