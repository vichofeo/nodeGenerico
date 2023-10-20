const db = require('../index')

const credencialModel = db.apu_credencial

module.exports = {
    Create(data) {
       return credencialModel.create (data)
           .then(data => data)
           .catch(error => false)
    },
    list() {
        return credencialModel.findAll()
           .then(data => data)
           .catch(error => false)
    },
    find (data) {
        return credencialModel.findAll({
            where: {
                login: data.login,
            }
        })
        .then(data => data)
        .catch(error => false)
     },
     findDataOne(data){
        return credencialModel.findOne({where: {login: data.login}})
        .then(usr=>usr)
        .catch(e=>false)
     }
   };