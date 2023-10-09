const jwt = require('jsonwebtoken')
const config = require('../config/config.js')


const verifyAuth = (req, res, next)=>{
    const token = req.headers['token']
    if(!token)
    res.status(403).send({auth:false, mensaje:"Token invalido"}) //no autoprizado

    //verificacion del token
    jwt.verify(token,config.JWT_SECRET, (error, decoded)=>{
        if(error)
        res.status(500).send({auth:false, mensaje:"error de autenticaciojn"})//error de servidor

        req.user = {
            usuario: decoded.username,
            id: decoded.id
        }
        next()
    })
}

module.exports = {
    verifyAuth
}