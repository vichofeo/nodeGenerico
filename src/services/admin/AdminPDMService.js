const QueriesUtils = require('../../models/queries/QueriesUtils')

const db = require('../../models/index')
const { v4: uuidv4 } = require('uuid');

const paisModel =  db.al_pais
const dptoModel = db.al_departamento
const muniModel = db.al_municipio

const getPais = async (data) =>{
    try {
        let select = data        
        const pais = new QueriesUtils(paisModel)
        const cnfData = {
            attributes: pais.transAttribByComboBox('cod_pais,nombre_pais'),
            where:[]
        }
        const results = await pais.findTune(cnfData)
        const selected = pais.searchBySelectedComboData(results,select[0]) 
        
        return{
            ok: true,
            data: {
            selected: selected, items: results},
            message: "resultado exitoso"
        }

    } catch (error) {
        return{
            ok: false,
            message: "Error de sistema ADMPDMS",
            error : error.message
        }
    }
    
}
const getDpto= async (data)=>{
    try {
        let select  = data
        const dpto = new QueriesUtils(dptoModel)
        const cnfData = {
            attributes: dpto.transAttribByComboBox('cod_dpto,nombre_dpto'),
            where: {cod_pais: select[0].value},
            order: ['nombre_dpto']
        }
        const results = await dpto.findTune(cnfData)
        const selected = dpto.searchBySelectedComboDataNotransform(results,select[1]) 
                
        return{
            ok: true,
            data: {
            selected: selected, items: results},
            message: "resultado exitoso"
        }
    } catch (error) {
        return{
            ok: false,
            message: "Error de sistema ADMPDMS",
            error : error.message
        }
    }
} 

const getMuni= async (data)=>{
    try {
        let select = data
        
        const muni = new QueriesUtils(muniModel)
        const cnfData = {
            attributes: muni.transAttribByComboBox('cod_municipio,nombre_municipio'),
            where: {cod_pais: select[0].value,
                cod_dpto: select[1].value
            },
            order: ['nombre_municipio']

        }        
        const results = await muni.findTune(cnfData)
        const selected = muni.searchBySelectedComboData(results,select[2]) 
        
        return{
            ok: true,
            data: {
            selected: selected, items: results},
            message: "resultado exitoso"
        }
    } catch (error) {
        return{
            ok: false,
            message: "Error de sistema ADMPDMS",
            error : error.message
        }
    }
} 

module.exports = {
getPais, getDpto, getMuni
}