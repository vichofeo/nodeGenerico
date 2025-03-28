const nodemailer = require('nodemailer')
const logger = require('../../config/logger')
const QUtils = require('./../../models/queries/Qutils')
const qUtil = new QUtils()
module.exports = class MailerUtils {

  #mailer //smtp.gmail.com
  #port //465
  #user
  #pass
  #secure

  #myMail
  #toMail
  #subjet
  #mailOptions
  #textPlain
  #textHtml
  #attachments
  #adjunto
  #result

  #transporter

  constructor(myMail = "myadmin@combazo.com") {
    if (MailerUtils.instance) return MailerUtils.instance

    this.#mailer = process.env.MAILER
    this.#port = process.env.MAILER_PORT
    this.#secure = true
    this.#user = process.env.MAILER_PASSPORT
    this.#pass = process.env.MAILER_CODE
    this.#myMail = myMail
    this.#attachments = undefined
    this.#adjunto = undefined
    this.#mailOptions = undefined
    this.#initializerMailer()
    MailerUtils.instance = this
  }

  #initializerMailer() {
    this.#transporter = nodemailer.createTransport({
      host: this.#mailer,
      port: this.#port,
      secure: this.#secure,
      pool: true,
      auth: {
        //type: 'OAuth2',
        user: this.#user,
        pass: this.#pass
      },
      debug: true, // show debug output
      //logger: true // log information in console
      maxMessages: Infinity, // Allow an unlimited number of messages per connection
      maxConnections: 5
    })
    //this.#___verify()
  }
  #___verify() {
    this.#transporter.verify()
      .then(() => {
        const message = 'Mail enviado con exito..!'
        console.log(message)
        logger.info(message);
      })
      .catch((e) => {
        const message = "Error en envio de mail:\n"
        console.log(message + e)
        logger.error(message + e);
      })
  }
  setToMail(mail) {
    this.#toMail = mail
  }
  setFromMail(mail) {
    this.#myMail = mail
  }
  setSubjet(subject) {
    this.#subjet = subject
  }
  setMessagePlain(messagePlain) {
    this.#textPlain = messagePlain
  }
  setAdjunto(blobFile, fileName = 'prx01.xyz') {
    if (blobFile) {
      this.#attachments = true
      this.#adjunto = {
        filename: fileName,
        content: Buffer.from(blobFile).toString('base64'),
        encoding: 'base64'
      }
    } else {
      this.#attachments = false
      this.#adjunto = null
    }
  }
  #__setMailOptions() {
    this.#mailOptions = {
      from: this.#myMail,
      to: this.#toMail,
      subject: this.#subjet,
      text: this.#textPlain
    }
    if (this.#attachments) this.#mailOptions.attachments = [this.#adjunto]
  }

  async sendMail() {
    this.#__setMailOptions()
    /*const mailOptions = {
      from: this.#myMail,
      to: this.#toMail,
      subject: this.#subjet,
      text: this.#textPlain
    }
    if(this.#attachments) mailOptions.attachments=[this.#adjunto]
    */
    //send mail
    /*this.#transporter.sendMail(mailOptions,
     (error, info)=>{
       if(error){
         this.#result = {ok:false, message: error}
         console.log("Error Send mail", error)
         logger.error("Error Send mail:"+ error)              
       }else{
         console.log('Email enviado exitosamente: ' + info.response)
         logger.info('Email enviado exitosamente: ' + info.response)
         this.#result = {ok:true, message: "Mail enviado exitosamente:"+this.#toMail}
       }
     }
   )*/
    //this.#___verify()
    try {
      const info = await this.#transporter.sendMail(this.#mailOptions);
      console.log('Email enviado exitosamente: ' + info.response);
      logger.info('Email enviado exitosamente: ' + info.response);
      this.#result = { ok: true, message: "Mail enviado exitosamente: " + this.#toMail };
    } catch (error) {
      console.log("Error Send mail", error);
      logger.error("Error Send mail: " + error);
      this.#result = { ok: false, message: error };
    }
  }
  /**
   * 
   * @param {*} obj :{table,campos:{log,estado},valueidx:{key:value}}
   */
  sendMailwLogTable(obj=null) {
    this.#result = {ok:true, message:"Procesando solicitud. por favor cheke log de estado"}
    this.#__setMailOptions()    
    //send mail
    this.#transporter.sendMail(this.#mailOptions,
     async (error, info)=>{
       try {
        if(error){          
          //console.log("Error Send mail", error)
          logger.error("Error Send mail:"+ error)  
          if(obj){
            qUtil.setTableInstance(obj.table)
            qUtil.setDataset({[obj.campos.log]: qUtil.literal(`coalesce(${obj.campos.log},'')||'\n\r'|| 'Error: No se pudo enviar el mensaje a ${this.#toMail} ${error}'`),
              [obj.campos.estado]:'E'
            })
            qUtil.setWhere(obj.valueidx)
            await qUtil.modify()
          }
        }else{
          console.log('Email enviado exitosamente desde table: ' + info.response)
          logger.info('Email enviado exitosamente: ' + info.response)          
          if(obj){
            qUtil.setTableInstance(obj.table)                       
            await qUtil.modify()
            qUtil.setDataset({[obj.campos.log]: qUtil.literal(`coalesce(${obj.campos.log},'')||'\n\r'|| 'Exito: Mensaje enviado correctamente a ${this.#toMail} ${error}'`),
              [obj.campos.log]:'E'
            })
            qUtil.setWhere(obj.valueidx)
          }
        }
       } catch (e) {
        console.log(e)
        this.#result = {ok:false, message: "Error de grabacion"}
       }
     }
   )
    //this.#___verify()
    
  }
  getResults() {
    return this.#result
  }
}