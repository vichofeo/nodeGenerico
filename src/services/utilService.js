
const  jwt = require("jsonwebtoken");
const  config = require("./../config/config.cnf");

const getCnfApp = (token) => {
    let  tk = token.split(' ')[1];    
    const ops=   jwt.verify(tk, config.JWT_SECRET)
    return ops
}

module.exports = {
    getCnfApp
}