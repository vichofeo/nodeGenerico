module.exports = class HandleErrors {
    #_res
    #_message
    #_code
    constructor(res=null){
        if(HandleErrors.instance)
        return HandleErrors.instance

        this.#_res =  res
        this.#_code =  401
        this.#_message = "Existe un Error que impide continuar el proceso"
        HandleErrors.instance =  this
    }

    setCode(code){
        this.#_code =  code        
    }
    setRes(res){
        this.#_res = res
    }
    setMessage(message){
        this.#_message = message
    }
    
    handleHttpError(error){
        console.log("Error para logs:", error)
        this.#_res.status(500) //condicion inesperada
        this.#_res.send({error: "ERROR", ok:false, message: this.#_message })
    
    }
    handleErrorResponse(payload={}){
        console.log("Error pa log response def")
        this.#_res.status(this.#_code)
        this.#_res.send({error: this.#_message, ...payload})
    }

    handleResponse(payload){
        try {
            if(payload?.ok){
                this.#_res.status(200).json(payload)
            }else{
                this.handleErrorResponse(payload)
            }    
        } catch (error) {
            console.log("************************HORRROR*************************", error)
            this.handleHttpError(error.message)
        }
        
    }
}