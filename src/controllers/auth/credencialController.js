const credencialService = require('./../../services/CredencialService')

const login = async (req, res) =>{
  const usrDTO = req.body
console.log("desde controller: ", usrDTO)
  const user = await credencialService.login(usrDTO)

  res.json(user)
}

const getLogin = async (req, res) =>{
  const token =  req.headers.authorization 
  const usrDTO = {token: token}
  const user = await credencialService.getLogin(usrDTO)

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

const modify = async (req,res) =>{
  const token =  req.headers.authorization
  const usrDto = {token: token, ...req.body}
const result = await credencialService.modify(usrDto)
res.json(result)
}

module.exports = {
  login, getLogin,
  listar,
  guardar, modify
}