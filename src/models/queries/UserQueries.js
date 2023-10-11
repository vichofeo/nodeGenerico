
const db = require('./../index')
const usrModel = db.usr


module.exports = {
    Create(user) {
       return usrModel.create (user)
           .then(usr => usr)
           .catch(error => {mal:"malisomo"})
    },
    list() {
        return usrModel.findAll()
           .then(usr => usr)
           .catch(error => null)
    },
    find (user) {
        return usrModel.findAll({
            where: {
                usuario: user.usuario,
            }
        })
        .then(usr => usr)
        .catch(error => false)
     },
     findUser(usr){
        return usrModel.findOne({where: {usuario: usr.usuario}})
        .then(usr=>usr)
        .catch(e=>null)
     }
   };