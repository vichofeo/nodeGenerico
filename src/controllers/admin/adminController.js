const moduloService = require('./../../services/AdminModService')
const subModuloService = require('./../../services/AdminSubModService')
const cnfMcaService = require('./../../services/AdminConfigModService')
const rolService = require('./../../services/AdminRolService')
const rolCnfService = require('./../../services/AdminConfigRolModService')

const listar = async (req, res) => {
  const result = await moduloService.listar()

  res.json(result)
}

const guardar = async (req, res) => {
  const dataDto = req.body

  const result = await moduloService.guardar(dataDto)
  res.json(result)
}

//submodulo
const sblistar = async (req, res) => {
  const result = await subModuloService.listar()

  res.json(result)
}
const sbguardar = async (req, res) => {
  const dataDto = req.body

  const result = await subModuloService.guardar(dataDto)
  res.json(result)
}

//config app-mod-controller
const cnfListar = async (req, res) => {
  const dataDto = req.body
  const result = await cnfMcaService.listar(dataDto)
  res.json(result)
}

const cnfGuardar = async() =>{
  const dataDto = req.body

  const result = await cnfMcaService.guardar(dataDto)
  res.json(result)
}

const rollistar = async (req, res) => {
  const result = await rolService.listar()

  res.json(result)
}

const rolGuardar = async (req, res) => {
  const dataDto = req.body
  const result = await rolService.guardar(dataDto)

  res.json(result)
}

//config rol

const rolCnfListar = async( req, res)=>{
  const datoDto = req.body
  const result = await rolCnfService.listar(datoDto)
  res.json(result)
}
module.exports = {
  listar, guardar,

  sblistar,sbguardar,

  cnfListar, cnfGuardar, 

  rollistar, rolGuardar, 

  rolCnfListar,
}
