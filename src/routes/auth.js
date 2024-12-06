const express = require("express")
const router = express.Router()

const validations = require("./../validators/authValidator")
const  authMiddleWare = require('./../middlewares/authMiddleware')

const  credencialController = require('./../controllers/auth/credencialController')

//router.get('/test', (req, res)=>{ res.send("Acceso de prueba")})
   //inicio de session
   router.post('/login', validations.validateLogin, credencialController.login)
   router.post('/getUsrLgn',authMiddleWare , credencialController.getLogin )
   router.post('/getRegisterLgn',authMiddleWare , credencialController.getLoginApp )

   // ****opciones para prototipo de control de usuario, deprecated
   //usrOptions
   router.get('/usr', authMiddleWare ,credencialController.listar)
   router.post('/usr', credencialController.guardar)
   router.put('/usr', authMiddleWare,  credencialController.modify)



module.exports = router
