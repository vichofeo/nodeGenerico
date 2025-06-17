const parameters = require('./parameters')
//$keySession  
//extraCondicion:[[campo, valor], [campo2, valor]...]
//orden de ejecucion : REFERER, PRIMAL, ILOGIC
"use strict"
const PDEPENDENCIES = {

  cbx_register_ind: {
    alias: 'cbx_register_ind',
    campos: {
      forms: ['Intrumento de captura datos', true, true, 'C'],
      periodos: ['Periodos', true, true, 'C']

    },
    ilogic: {
      forms: `SELECT distinct t.file_tipo_id AS VALUE, 
          t.nombre_tipo_archivo ||' ('||CASE WHEN t.sw_semana THEN 'SEMANAL' ELSE  'MENSUAL'END ||')' as text 
          FROM upf_file_tipo t, upf_registro r
          WHERE $keySession
          AND t.file_tipo_id =  r.file_tipo_id
          AND r.activo='Y' AND t.activo= 'Y' and t.grupo_file_id='94aac697-ba28-4f2f-94af-1348d8e49e95'
          ORDER BY 2`,
      periodos: `SELECT r.periodo AS value, 
                  CASE WHEN t.sw_semana THEN to_char(TO_DATE(r.periodo, 'IYYY-IW'), 'IYYY- semana - IW')
                  ELSE TO_CHAR(TO_DATE(r.periodo,'YYYY-MM'), 'YYYY - Mon') END AS text
                  FROM upf_file_tipo t, upf_registro r
                  WHERE $keySession AND t.file_tipo_id ='$forms'
                  AND t.file_tipo_id =  r.file_tipo_id
                  AND r.activo='Y' AND t.activo= 'Y' and t.grupo_file_id='94aac697-ba28-4f2f-94af-1348d8e49e95'
                  ORDER BY 1 DESC `
    },
    keySession: { replaceKey: false, campo: 'r.institucion_id' },
    referer: [],
  },



}
module.exports = PDEPENDENCIES