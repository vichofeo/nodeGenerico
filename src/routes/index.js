/*
const productoController = require('../controllers/ProductoController')

const producto = (app)=>{
    app.get("/producto", productoController.listar)
    app.post("/producto", productoController.guardar)
    app.put("/producto/:id", productoController.modificar )
}

module.exports = {
    producto
}
*/

/* Controllers */

const usuarioController = require('../controllers/usuarioController');
const usuario = (app) => {
   app.get('/api', (req, res) => res.status(200).send ({
        message: 'Example project did not give you access to the api web services',
   }));
   app.post('/api/usuario/create/username/:username/status/:status', usuarioController.create);
   app.get('/api/usuario/list', usuarioController.list);
   app.get('/api/usuario/find/username/:username', usuarioController.find);
};

module.exports={
    usuario
}
