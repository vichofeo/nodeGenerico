const nodemailer= require('nodemailer')
const logger = require('../../config/logger')
module.exports = class MailerUtils{

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

    #transporter

     constructor(myMail="myadmin@combazo.com") {
        if (MailerUtils.instance) return MailerUtils.instance
    
        this.#mailer = process.env.MAILER
        this.#port = process.env.MAILER_PORT
        this.#secure = true
        this.#user =  process.env.MAILER_PASSPORT
        this.#pass =  process.env.MAILER_CODE
        this.#myMail = myMail
        this.#initializerMailer()
        MailerUtils.instance = this
      }

      #initializerMailer(){
        this.#transporter =  nodemailer.createTransport({
            host: this.#mailer,
            port: this.#port,
            secure: this.#secure,
            auth:{
                //type: 'OAuth2',
                user: this.#user,
                pass: this.#pass
            },
            debug: true, // show debug output
            //logger: true // log information in console
        })
        //this.#___verify()
      }
      #___verify(){
        this.#transporter.verify()
        .then(()=>{
            const message = 'Mail enviado con exito..!'
            console.log(message)
            logger.info(message);
        })
        .catch((e)=>{
          const message = "Error en envio de mail:\n"
          console.log(message + e)
          logger.error(message + e);
        })
      }
      setToMail(mail){
        this.#toMail= mail
      }
      setFromMail(mail){
        this.#myMail = mail
      }
      setSubjet(subject){
        this.#subjet= subject
      }
      setMessagePlain(messagePlain){
        this.#textPlain =  messagePlain
      }

      sendMail(){
        const mailOptions = {
          from: this.#myMail,
          to: this.#toMail,
          subject: this.#subjet,
          text: this.#textPlain
        }
        //send mail
         this.#transporter.sendMail(mailOptions,
          function(error, info){
            if(error){
              console.log("Error Send mail", error)
              logger.error("Error Send mail:"+ error)
            }else{
              console.log('Email enviado exitosamente: ' + info.response)
              logger.info('Email enviado exitosamente: ' + info.response)
            }
          }
        )
        //this.#___verify()
      }
}