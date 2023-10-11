//verifyAuth
var jwt = require("jsonwebtoken");
var config = require("./../config/config.cnf");

const verifyAuth = (req, res, next) => {
    //var token = req.headers['token'];
    var token = null;
    if (req.headers.authorization)
        token = req.headers.authorization.split(' ')[1];
    //console.log(token)
    if (!token) {
        return res.status(403).send({
            auth: false,
            mensaje: "No se proporcionó el token de seguridad"
        })
    }

    jwt.verify(token, config.JWT_SECRET, (error, decoded) => {
        if (error)
            return res.status(500).send({
                auth: false,
                mensaje: "Error de Autenticación"
            })

        /*req.user = {
            usuario: decoded.usuario,
            id: decoded._id
        }*/
        next()
    })
}

module.exports = {
    verifyAuth
}