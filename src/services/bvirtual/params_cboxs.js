//extraCondicion:[[campo, valor], [campo2, valor]...]
'use strict'
const PDEPENDENCIES = {
    bv_box:{        
        alias: 'bv_box',        
        campos: {
            tipo_documento: ['Tipos de Documentos', true, true, 'C', 50],
            tipo_componente: ['Tipo de componente', true, true, 'C', 50],
                      
            ambito_aplicacion: ['Ámbito de aplicación', true, true, 'C', 64],
            codigo: ['Codigo Asignado', false, true, 'TT', 24],
        }, 
        ilogic: {
            ambito_aplicacion:`SELECT atributo_id as value, atributo as text
            FROM f_is_atributo            
            WHERE grupo_atributo='BV_$tipo_componente'                         
            ORDER BY 2`,
            codigo:`select 
            'FB-' ||substr('$tipo_documento',1,1) ||'-' ||substr('$tipo_componente',1,1) ||'-'||SUBSTR('$ambito_aplicacion', 4,length('$ambito_aplicacion'))||'-'||LPAD((COUNT(*)+1)::text,3,'0') as value, 
            'FB-' ||substr('$tipo_documento',1,1) ||'-' ||substr('$tipo_componente',1,1) ||'-'||SUBSTR('$ambito_aplicacion', 4,length('$ambito_aplicacion'))||'-'||LPAD((COUNT(*)+1)::text,3,'0') as text
            FROM bv_files
            WHERE 
            tipo_documento = '$tipo_documento'  AND tipo_componente = '$tipo_componente' AND ambito_aplicacion='$ambito_aplicacion'
            `
        },
        referer: [        
            { ref: 'f_is_atributo', apropiacion: 'tipo_documento', campos: ['atributo_id', 'atributo'],  campoForeign: null,   condicion: {grupo_atributo:'BV_TIPO_DOCUMENTO'}, condicional:null },            
            { ref: 'f_is_atributo', apropiacion: 'tipo_componente', campos: ['atributo_id', 'atributo'],  campoForeign: null,   condicion: {grupo_atributo:'BV_TIPO_COMPONENTE'}, condicional:null },            
            
            //{ ref: 'f_is_atributo', apropiacion: 'ambito_aplicacion', campos: ['atributo_id', 'atributo'],  campoForeign: null,   condicion: {}, condicional:null },            
            
        ],
    },
}
module.exports = PDEPENDENCIES
