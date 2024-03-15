module.exports = class HandleErrors {
    #_res
    #_message
    #_code
    #_objResponse
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
     
    #setObjResponse(obj){
        this.#_objResponse= obj
    }
    handleHttpError(error){
        console.log("\n\n************Error para logs INGRESO:\n\n", error)
        this.#_res.status(500) //condicion inesperada
        this.#_res.send({error: "ERROR", ok:false, message: this.#_message })        
        return;    
    }
    setHttpError(error){
        console.log("\n\n************Error para logs INGRESO:\n\n", error)
        this.setCode(500)
        this.#setObjResponse({error: "ERROR", ok:false, message: this.#_message })
    }
    handleErrorResponse(payload={}){
        console.log("\n\n****Error pa log RESPONSE def\n\n")
        this.#_res.json({error: this.#_message, ...payload})
        return;
    }

    setHttpErrorResponse(payload={}){
        console.log("\n\n****Error pa log RESPONSE def\n\n")
        this.setCode(204)
        this.#setObjResponse({error: this.#_message, ...payload})
    }

    handleResponse(payload){
        //console.log("************************payload*************************", payload)
        try {
            if(payload){
                if(payload?.ok){
                    console.log("\n\n************************POR ENVIAR*************************\n\n", payload.data)

                    this.#_res.json(payload)
                    console.log("\n\n************************ENVIADO*************************\n\n")
                    return;
                }else{
                    console.log("\n\n  QUERIENDO ENVIAR ALGO \n\n")
                    this.handleErrorResponse(payload)
                }    
            }else return
            
        } catch (error) {
            console.log("************************HORRROR*************************", error)
            this.handleHttpError(error.message)
        }        
    }
    setResponse(payload){        
        try {
            if(payload){
                if(payload?.ok){
                    this.setCode(200)
                    this.#setObjResponse(payload)                    
                }else{                                        
                    this.setHttpErrorResponse(payload)
                }    
            }else {this.setCode(409)
                this.#setObjResponse({ok:false, message:"Conflicto"})
            }
            
        } catch (error) {            
            this.handleHttpError(error.message)
            this.setHttpError(error.message)
        }        
    }

    getCode() {return this.#_code}
    getResponse(){ return this.#_objResponse}
}