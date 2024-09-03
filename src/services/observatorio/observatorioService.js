

const QUtils = require('./../../models/queries/Qutils')
const qUtil = new QUtils()






const AEB = require('../aeb/params_cboxs') //JSON.parse(JSON.stringify(require('../aeb/params_cboxs')))
const UFAM = require('../ufam/params_cboxs') //JSON.stringify(require('../ufam/params_cboxs'))
const METRAB = require('../medtrab/params_cboxs') //JSON.stringify(require('../medtrab/params_cboxs'))

const FrmUtils = require('./../frms/FrmsUtils')
const frmUtil = new FrmUtils()

//CONFIGURACION POR DEFAULT PARA REPORTES
const observatorio = {}
observatorio.hemofilia = {campos:{}, alias:'hemofilia', referer:[]}
observatorio.hemofilia.ilogic = {hemofilia: AEB.dash_hemofilia.ilogic.hemo_dpto}

observatorio.cancer = {campos:{}, alias:'cancer', referer:[]}
//observatorio.cancer.ilogic = {cancer: AEB.dash_cancer.ilogic.cancer_casos }
observatorio.cancer.ilogic = {cancer: `SELECT gestion as pila ,
'Registrados' as ejex ,COUNT(*) AS value, TO_CHAR((SELECT MAX(fecha_diagnostico) FROM tmp_cancer),'dd/mm/YYYY') AS obs
      FROM tmp_cancer WHERE 1=1 
      GROUP BY  1,2
      union all
      (SELECT gestion as periodo ,
      case when tecnica_recoleccion='DF' then 'Defuncion'
      when tecnica_recoleccion='EH' then 'Egreso Hospitalario'
      when tecnica_recoleccion='LAB' then 'Laboratorio'
      else tecnica_recoleccion end as ejex ,
      COUNT(*) AS value, TO_CHAR((SELECT MAX(fecha_diagnostico) FROM tmp_cancer),'dd/mm/YYYY') AS obs
      FROM tmp_cancer WHERE 1=1 
      GROUP BY  1,2
      ORDER BY 3 desc,2)` }

observatorio.carmelo = {campos:{}, alias:'carmelo', referer:[]}
observatorio.carmelo.ilogic = {carmelo: AEB.dash_carmelo.ilogic.car_dpto_eg }

observatorio.pai = {campos:{}, alias:'pai', referer:[]}
observatorio.pai.ilogic = {pai: AEB.dash_pai.ilogic.pai_hetario, pai_dia:AEB.dash_pai.ilogic.pai_day }

//Canales endimicos
observatorio.neumonia = {campos:{}, alias:'neumonia', referer:[]}
observatorio.neumonia.ilogic = {neumonia: AEB.dash_neumonia.ilogic.infec_quartil }

observatorio.iras = {campos:{}, alias:'iras', referer:[]}
observatorio.iras.ilogic = {iras: AEB.dash_iras.ilogic.infec_quartil }

observatorio.edas = {campos:{}, alias:'edas', referer:[]}
observatorio.edas.ilogic = {edas: AEB.dash_edas.ilogic.infec_quartil }


//UFAM
observatorio.ames = {campos:{}, alias:'ames', referer:[]}
observatorio.ames.ilogic = {ames: UFAM.dash_ames.ilogic.ames_dpto_eg_gestion }

observatorio.inas = {campos:{}, alias:'inas', referer:[]}
observatorio.inas.ilogic = {inas: UFAM.dash_inas.ilogic.ames_dpto_eg_gestion }

observatorio.rrame = {campos:{}, alias:'rrame', referer:[]}
observatorio.rrame.ilogic = {rrame: UFAM.dash_rrame.ilogic.ames_dpto_eg_gestion }

//MedTrab
observatorio.metrab = {campos:{}, alias:'metrab', referer:[]}
observatorio.metrab.ilogic = {metrab: `SELECT pivot as pila,  ejex, value,
                SUM(value) OVER (PARTITION BY pivot ORDER BY pivot, ejex ) AS total_acumulado,
                TO_CHAR((SELECT MAX(periodo) FROM tmp_mt_frms t0 WHERE t0.formulario=tt.pivot),'MM/YYYY') AS obs
                FROM (
                SELECT 
                formulario AS pivot, 					 
                departamento AS ejex,
                SUM(CASE WHEN reportado is null THEN 0 ELSE reportado END ) AS VALUE
                FROM tmp_mt_frms
                WHERE 1=1 
                GROUP BY 1,2
                ORDER BY 1,2
                ) AS tt` }



const getDataCboxLigado = async (dto, handleError) => {
    try {
        dto.modelos = [dto.modelo]
        frmUtil.setParametros(observatorio)
        await frmUtil.makerDataComboDependency(dto)
        const result = frmUtil.getResults()
        return {
            ok: true,
            data: result,
            message: "Requerimiento Exitoso. Parametros Obtenidos"
        }

    } catch (error) {
        console.log("\n\n ?????????????????????????????????********error en COMBOX LIGADO *******?????????????????????? \n\n");
        console.log(error);
        handleError.setMessage("Error de sistema: BVDATCBOXSRV")
        handleError.setHttpError(error.message)
    };

}


module.exports = {
    
    getDataCboxLigado,

}