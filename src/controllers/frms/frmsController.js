const HandleErrors = require('./../../utils/handleErrors')
const handleError = new HandleErrors()


const frmService = require('../../services/frms/FrmsService')
const frmEvalService = require('../../services/frms/FrmsEvalService')


const getfrmsConstuct =  async (req, res) =>{    
    const modelo = req.params.modelo
    const token =  req.headers.authorization
    const datos = req.body
    const result = await frmService.getfrmsConstuct({modelo:modelo, token: token, ...datos})
    res.json(result)
  }

const getFrmsInfo = async(req, res)=>{
  const idx = req.params.idx
    const token =  req.headers.authorization
    //const datos = req.body
    const result = await frmService.getFrmsInfo({idx:idx, token: token})
    res.json(result)
}  

const getCnfForms = async(req, res)=>{
  const modelo = req.params.modelo
  const token =  req.headers.authorization
  const result = await frmService.getCnfForms({modelo:modelo, token: token})
  res.json(result)
}

const getCnfFormswIdx = async(req, res)=>{
  
  const modelo = req.params.modelo
  const idx = req.params.idx
  const token =  req.headers.authorization
  const result = await frmService.getCnfForms({idx:idx, modelo:modelo, token: token})
  res.json(result)
}



const saveCnfForms = async (req, res)=>{
  //const modelo = req.params.modelo
  const token =  req.headers.authorization  
  
  const result = await frmService.saveCnfForms({token: token, ...req.body})
  res.json(result)
}

const saveFormsRes = async(req, res)=>{  
  //const modelo = req.params.modelo
  const token =  req.headers.authorization  
  
  const result = await frmService.saveFormsRes({token: token, ...req.body})
  res.json(result)
}

//CONTROLADORES PARA EVALUACION DE  FORMULARIO
const getEvalForms = async(req, res)=>{
  const idx = req.params.idx
  const token =  req.headers.authorization
  const result = await frmEvalService.getEvalForms({idx:idx, token: token})
  res.json(result)
}
const saveEvalForm = async(req, res)=>{
  
  const token =  req.headers.authorization
  const result = await frmEvalService.saveEvalForm({data:req.body, token: token}, handleError)
  handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())

  //res.json(result)
}
module.exports = {
  getfrmsConstuct, getFrmsInfo,
  getCnfForms, getCnfFormswIdx, saveCnfForms, saveFormsRes,

  getEvalForms, saveEvalForm
}