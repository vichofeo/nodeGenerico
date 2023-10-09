const Sequelize     = require('sequelize');
const  usuario  = require("../models").usuario
const bcrypt = require('bcrypt')
const jwt  = require('jsonwebtoken');
const config = require('../config/config');


async function ingresar(req, res){
    const usr = await usuario.findOne({username:req.body.nombre})
    if(!usr)
    res.json({mensaje:"incorrecto"})
    else
    if(await bcrypt.compare(req.body.pass,usr.pass)){
        const payload = {
            username: "juanitoPinto",
            id:"32456657gfy6756",
            time: new Date()
        }
        let secretKey = "palabvra secreta"

        let token = jwt.sign(payload, config.JWT_SECRET, {expiresIn: config.JWT_TIME} )

        res.json({mensaje:"Bienvenido pendejo", access_token:token})
    }else{
        res.json({mensaje:"incorrecto"})
    }
}

module.exports={
    ingresar
}