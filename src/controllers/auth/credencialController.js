const credencialService = require('./../../services/CredencialService')

const login = async (req, res) =>{
  const usrDTO = req.body
console.log("desde controller: ", usrDTO)
  const user = await credencialService.login(usrDTO)

  res.json(user)
}

const listar = async (req, res)=>{
  const result = await credencialService.listar()  
  
  res.json(result)
}

const guardar = async (req,res) =>{
  const usrDto = req.body
const result = await credencialService.guardar(usrDto)
res.json(result)
}

module.exports = {
  login,
  listar,
  guardar
}