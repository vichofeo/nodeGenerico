const logger = require('../../config/logger')
const qrcode = require('qrcode');
module.exports = class QrUtils{
    #linkDefault
    #result

    constructor(linkDefault="http://my.cpp") {
        if (QrUtils.instance) return QrUtils.instance
    
        this.#linkDefault =  linkDefault
        
        QrUtils.instance = this
      }
    setLinkUrl(link){
        this.#linkDefault =  link
    }  
    async generateQrLink(){
        this.#result = await qrcode.toDataURL(this.#linkDefault)
    }

    getQrResult(){
        return this.#result
    }

}