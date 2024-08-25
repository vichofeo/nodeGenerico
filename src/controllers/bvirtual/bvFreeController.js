const HandleErrors = require('./../../utils/handleErrors')
const handleError = new HandleErrors()

const service =  require('./../../services/bvirtual/bvirtualFreeService')


//get data all files
const getFrFiles = async (req, res)=>{
        
    //const token = req.headers.authorization
    //const idx =  req.params.idx

    const data =  req.body
    const result = await service.getFrFiles(data,handleError)
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

const getFrFile = async (req, res)=>{
        
 //   const token = req.headers.authorization
    const idx =  req.params.idx
    
    const result = await service.getFrFile({ idx: idx},handleError)
    handleError.setResponse(result)
    res.status(handleError.getCode()).json(handleError.getResponse())
}

module.exports={
    getFrFiles, getFrFile
}