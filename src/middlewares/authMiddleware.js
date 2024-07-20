//verifyAuth
const handleToken = require("./../utils/handleToken")
const HandleErrors = require("./../utils/handleErrors")
 const handleError = new HandleErrors()

const verifyToken = async  (req, res, next) => {
handleError.setRes(res)
    try {
        handleError.setCode(409)
        handleError.setMessage("NOT_ALLOW")
        if(!req.headers.authorization){            
            handleError.handleErrorResponse()
        }
console.log(".........",req.headers.authorization)
        const tmp =  req.headers.authorization.split(" ").pop()
        if(!tmp) {
            handleError.setCode(403)       
            handleError.handleErrorResponse({message: "No se proporcionó el token de seguridad"}) 
        }
        const token =  await handleToken.verifyToken(tmp)
        if(token){
            next()
        }else{
            handleError.setCode(500)
            handleError.handleErrorResponse({message:"Error de Autenticación"})
        }
    } catch (error) {
        handleError.handleHttpError(error)
    }

    
}

module.exports = verifyToken