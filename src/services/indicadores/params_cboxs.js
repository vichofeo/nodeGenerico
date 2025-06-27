const parameters = require('./parameters')
//$keySession  
//extraCondicion:[[campo, valor], [campo2, valor]...]
//orden de ejecucion : REFERER, PRIMAL, ILOGIC
"use strict"
const PDEPENDENCIES = {

  cbx_register_ind: {
    alias: 'cbx_register_ind',
    
        campos: {
            modelo: ['Modelo', false, true, 'C'],
            tipo_mmodelo: ['Tipo Modelo', false, true, 'C'],
            indicador: ['Indicador', false, true, 'C'],
            ente_gestor: ['Ente Gestor', false, true, 'C'],
            departamento: ['Departamento', false, true, 'C', , , 'M'],
            establecimiento: ['Establecimiento de Salud', false, true, 'C', , , 'M'],
        },
        ilogic: null,
        ilogicMultiple: null, //{ eg: 'eg.institucion_id', dpto: 'd.cod_dpto', eess: 'i.institucion_id' },
        primal: {
            equivalencia: {
                modelo: ['m.modelo_id', 'm.nombre_modelo'],
                tipo_mmodelo: ['t.cod_tipo_indicador', 't.nombre_tipo_indicador'],
                indicador: ['ind.indicador_id', 'ind.nombre_indicador'],
                ente_gestor: ['eg.institucion_id', 'eg.nombre_institucion'],
                departamento: ['d.cod_dpto', 'd.nombre_dpto'],
                establecimiento: ['i.institucion_id', 'i.nombre_institucion']
            },
            query: `SELECT DISTINCT $a$
        FROM  ae_institucion i, ae_institucion eg, al_departamento d,
        i_mti_institucion ii,
        i_modelo_tipo_indicador ind, i_indicador_tipo t, i_modelo m
        WHERE 
        eg.institucion_id =  i.institucion_root AND i.cod_pais =  d.cod_pais AND i.cod_dpto = d.cod_dpto
        and i.institucion_id =  ii.institucion_id
        AND ii.indicador_id =  ind.indicador_id
        AND ind.cod_tipo_indicador =  t.cod_tipo_indicador AND ind.modelo_id= m.modelo_id 
         $w$ order by 2
        `,
            headers: [{}],
            attributes: null,
        },
        referer: [],
        withInitial: false,
  },



}
module.exports = PDEPENDENCIES