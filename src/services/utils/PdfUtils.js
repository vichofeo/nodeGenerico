
const logger = require('../../config/logger')
const key= "pdfUtils"
const {jsPDF} = require('jspdf')
module.exports = class PdfUtils {

    #jsPDF //smtp.gmail.com
#result

    constructor() {
        if (PdfUtils.instance) return PdfUtils.instance


        PdfUtils.instance = this
    }

    getCertificadoBlobPdf(data) {
        try {
          const results = data
          const imgs = []
          if (results.ok) {
            //inicializa pdf library      
            const personas = results.data.personas
            const certificados = results.data.certificados
            if (personas.length > 0) {
              for (const persona of personas) {
                const file_name = persona.mail
                let index = persona.certs[0].idx
                let doc = new jsPDF(certificados[index].orientation_page, 'pt', certificados[index].format_page);
                let i = 0
                for (const obj of persona.certs) {
                  index = obj.idx
                  const element = certificados[index]
                  if (i > 0) doc.addPage(element.format_page, element.orientation_page)
      
                  //seteo imagen d efondo para certificado
                  doc.addImage(element.img, 'PNG', 0, 0, element.img_width, element.img_heigth)
                  //inscribe cnf en la superficie del pdf por x,y coordenadas
                  doc.setFont('times', 'normal')
                  doc.setFontSize(9);
                  for (const xy of obj.cnf) {
                    if (xy.tipo == 0) doc.text(xy.value, xy.cx, xy.cy, xy.align)
                    else doc.addImage(xy.value, 'PNG', xy.cx, xy.cy)
                  }
                  i++
                }                
                
                imgs.push({mail: persona.mail, blob:doc.output('arraybuffer')})
                
              }
              this.#result= {ok:true, data:imgs, message:"requerimiento exitoso"}
            } else {
                this.#result={
                    ok:false,
                    message:"NO existe informacion para la generacion del certificado"
                }
              
            }
      
      
          } else {
            this.#result={
                ok:false,
                message:"-Sin Datos-"
            }
          }
        } catch (error) {
            //console.log(error)
            this.#result={
                ok:false,
                message:error.message
            }
        }
      }

      getResults(){
        return this.#result
      }

}