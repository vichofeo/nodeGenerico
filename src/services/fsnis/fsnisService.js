const { v4: uuidv4 } = require('uuid');

const QueriesUtils = require('../../models/queries/QueriesUtils')
const { QueryTypes, UUIDV4 } = require("sequelize")

const db = require('../../models/index')
const tk = require('./../utilService')
const srveg = require('../georef/EgService')

const sequelize = db.sequelize;
const snisModel = db.s301
const eessModel = db.ae_institucion

const COMBOSSNIS = {
    campos_db: [['eg.institucion_id', 'eg.nombre_corto'], ['ente.institucion_id', 'ente.nombre_institucion'],
    ['snis.gestion', 'snis.gestion'], ['snis.mes', "to_char(snis.mes,'00')"], ['snis.mes', "to_char(snis.mes,'00')"],
    ['snis.formulario', 'snis.formulario'], ['snis.grupo', 'snis.grupo']],
    labels: ['Ente Gestor', 'Establecimiento de salud', 'Gestion', 'Mes Inicial', 'Mes Final', 'Formulario', 'Grupo'],
    name_cbo: ['eg', 'eess', 'gestion', 'mesini', 'mesfin', 'frm', 'grp'],
    default_cbo: [true, true, false, true, true, false, false]
}

function convertCampoValueText(campo = Array) {
    return ` ${campo[0]} as value, ${campo[1]} as text `
}
function convertCampoGroupBy(campo) {
    return ` ${campo[0]}, ${campo[1]} `
}
function buscaOpDefaultCbox(vectordatos, objSearch) {
    let i = 0
    for (const ii in vectordatos) {
        if (vectordatos[ii].value == objSearch?.value) {
            i = ii
            break
        }
    }
    return i
}

/**
 * conforma informacion basado en comboSeleted para presentar los graficos del F3011A 
 * por el momento
 * en cuanto haya informacion de los otros formularios se debe analizar si se aplica este modelo a las demas estructuras
 * @param {token, idx: String ,selected:[{value, text}]} dto 
 * @returns {data:{combox:{items:[], selected:{value, text}, labels:String}},
 *          datos: {"grupo frm": {
 *                   labels:[Array de meses],
 *                   series:{"variable":{mujeres:[integer], varones:[integer], total:[integer]}} }},
 *          list:[0:{grupo}, 1:{variables}]
 *          }
 * @vichofeo
 */
const fsnisReportParams = async (dto) => {
    try {
        let selected_cbos = dto?.selected ? dto.selected : []
        const idx = dto.idx //cod de dpto seleccionado por menu principal

        //obtiene los identificadores de eess validos para los comboBox segun logueo
        const datos = tk.getCnfApp(dto.token)
        const inst = new QueriesUtils(eessModel)
        const eess = await inst.findID(datos.inst)


        const result = await srveg.getDataTreeEntidades(idx, eess.tipo_institucion_id, eess.institucion_root, eess.institucion_id)
        let ids = result.map(obj => obj.idx)
        ids = ` AND  isld.institucion_id  IN ('${ids.join("','")}')`

        const pre_query = ` 
        FROM s301 snis, r_institucion_salud isld, ae_institucion ente, ae_institucion eg
        WHERE 
        snis.codigo =  isld.codigo 
        AND isld.institucion_id =  ente.institucion_id
        AND  isld.ente_gestor_id =  eg.institucion_id ${ids}
        `
        //${ids} 

        const initial = { value: '-1', text: '-Todos-' }
        const sd = { value: '-999', text: '-Sin Dato-' }


        const selects = COMBOSSNIS.campos_db
        let wheres = ""
        const cboxData = {}

        console.log("00000000000000000000000000IINICIA00000000000000000000000", selects)

        for (let control = 0; control < selects.length; control++) {
            //index: 0
            console.log(control, '*************************: ', control, ':: ', COMBOSSNIS.name_cbo[control])
            let campos = convertCampoValueText(selects[control])
            let group = convertCampoGroupBy(selects[control])


            const query = `SELECT ${campos} ${pre_query}  ${wheres} GROUP BY ${group} ORDER BY ${COMBOSSNIS.name_cbo[control] == 'gestion' ? ' 2 DESC' : '2'}`
            const aux = inst.modifyResultToArray(await sequelize.query(query, { mapToModel: true, type: QueryTypes.SELECT, raw: false, }))

            //agrega opcion inicial solo si procede
            if (COMBOSSNIS.default_cbo[control] && aux.length > 1)
                aux.unshift(initial)

            if (aux.length <= 0) aux.unshift(sd)

            //comprueba opcion seleccionada
            //selected_cbos[control] ? 
            const indexResult = buscaOpDefaultCbox(aux, selected_cbos[control])
            selected_cbos[control] = aux[indexResult]
            //wheres
            if (selected_cbos && selected_cbos[control] && selected_cbos[control].value != '-1') {
                //verifica si se trata de opcin de mes inicial y final para modificar where
                if (COMBOSSNIS.name_cbo[control] == 'mesini') {
                    if (selected_cbos[control + 1].value != '-1')
                        wheres = ` ${wheres} AND (${selects[control][0]}>='${selected_cbos[control].value}' and ${selects[control][0]}<='${selected_cbos[control + 1].value}' )`
                    else wheres = ` ${wheres} AND ${selects[control][0]}='${selected_cbos[control].value}' `
                } else
                    wheres = ` ${wheres} AND ${selects[control][0]}='${selected_cbos[control].value}' `
            }

            cboxData[COMBOSSNIS.name_cbo[control]] = { items: aux, selected: selected_cbos[control], label: COMBOSSNIS.labels[control] }
            if (COMBOSSNIS.name_cbo[control] == 'mesini' && selected_cbos && selected_cbos[control]) {
                const iResult = buscaOpDefaultCbox(aux, selected_cbos[control+1])
                selected_cbos[control+1] = aux[iResult]
                cboxData[COMBOSSNIS.name_cbo[control + 1]] = { items: aux, selected: selected_cbos[control + 1], label: COMBOSSNIS.labels[control + 1] }
                control++
            }
        }

        //obtiene dato para graficaos
        const query = `SELECT snis.variable, snis.subvariable, snis.mes, sum(snis.totalv) AS varones, sum(snis.totalm) AS mujeres , sum(snis.totalg) AS total ${pre_query}  ${wheres} GROUP BY snis.variable, snis.subvariable, snis.mes ORDER BY 3,1,2 `
        let results = inst.modifyResultToArray(await sequelize.query(query, { mapToModel: true, type: QueryTypes.SELECT, raw: false, }))
        const data = {}
        let resultsAux = {}
        const list1 = {}
        const list2 = {}
        if (result.length > 0) {
            for (const element of results) {
                if (!data[element.variable]) data[element.variable] = {}
                //const mesIndex= "m"+element.mes 
                if (!data[element.variable][element.mes]) data[element.variable][element.mes] = {}
                data[element.variable] = {
                    ...data[element.variable],
                    [element.mes]: {
                        ...data[element.variable][element.mes],
                        mes: `${element.mes}`.padStart(2, "0"),
                        [element.subvariable]: {
                            ...data[element.variable][element.mes][element.subvariable],
                            varones: element.varones,
                            mujeres: element.mujeres,
                            total: element.total
                        }
                    }
                }
            }
            results = {}

            for (const element in data) {
                results[element] = Object.values(data[element])
                resultsAux[element] = { labels: [], series: {} }


                const listAux = { [element]: {} }
                for (const obj of results[element]) {
                    console.log("--------------entrando:", obj)
                    resultsAux[element].labels.push(obj.mes)
                    for (const key in obj) {
                        if (key != 'mes') {
                            if (!resultsAux[element].series[key]) resultsAux[element].series[key] = { varones: [], mujeres: [], total: [] }

                            resultsAux[element].series[key].varones.push(obj[key].varones)
                            resultsAux[element].series[key].mujeres.push(obj[key].mujeres)
                            resultsAux[element].series[key].total.push(obj[key].total)

                            listAux[element] = { ...listAux[element], [key]: key }
                        }
                    }
                }
                list1[element] = Object.values(listAux[element])
                list2[element] = ['varones', 'mujeres', 'total']
            }
        }//fin si datos query>0


        return {
            ok: true,
            data: cboxData,
            datos: resultsAux,
            lists: [list1, list2],
            //dx: results,
            message: 'Resultado exitoso. Parametros obtenidos'
        }
    } catch (e) {
        console.log(e);
        return {
            ok: false,
            message: "Error de sistema: CBOXGETPARAMSRV",
            error: e.message
        }
    }
}

module.exports = {
    fsnisReportParams
}


