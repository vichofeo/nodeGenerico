const { where } = require("sequelize")

module.exports = class QueriesUtils {
  #table
  #sinDatoByCombo
  #initialByCombo
  constructor(table) {
    this.#table = table
    this.#sinDatoByCombo = { value: '-1', text: '-Sin Dato-' }
    this.#initialByCombo = { value: '-1', text: '-Todos-' }
  }
/**
 * Insert data
 * @param {objDatos} dato 
 * @returns 
 */
  create(dato) {
    return this.#table
      .create(dato)
      .then((data) => data)
      .catch((error) => error)
  }
  /**
   * select * all
   * @returns Array
   */
  list() {
    return this.#table
      .findAll()
      .then((data) => data)
      .catch((error) => false)
  }
  /**
   * select * from where {}
   * @param {campo:valor, c2:v2 ....} whereObjDat 
   * @returns 
   */
  find(whereObjDat) {
    return this.#table
      .findAll({
        where: whereObjDat,
      })
      .then((data) => data)
      .catch((error) => false)
  }
  /**
   * select * from where id=??
   * @param {String} datoKey 
   * @returns 
   */
  findID(datoKey) {
    return this.#table
      .findByPk(datoKey)
      .then((data) => data.dataValues)
      .catch((e) => {
        console.log("%%%%%%%%%%%%%", e)
        return e
      })
  }
  /**
   * select ?? from where {..}
   * @param {attributes:[], where:{a:v, a2:v2 ....}} data 
   * @returns 
   */
  findTune(data) {
    return this.#table
      .findAll({
        attributes: data.attributes,
        where: data.where,
        order: data.order
      })
      .then((data) => data)
      .catch((e) => e)
  }
  /**
   * select personalizado segun objeto de entrada
   * @param {attributes, where, includes, etc} data 
   * @returns 
   */
  findTuneAdvanced(data) {
    return this.#table
      .findAll(data)
      .then((data) => data)
      .catch((e) => {
        console.log("%%%%%%%%%%%%%", e)
        return e
      })
  }
/**
 * update
 * @param {set:{a:v,a2:v2,....}, where:{a:v1,a2:v2...}} data 
 */
  modify(data){
    console.log("###########", data)
    this.#table.
    update(data.set,{ where: data.where })
    .then((dato)=>{
      console.log("===========", dato)
      return dato})
    .catch((e)=>{console.log("UUUUUUMall", e)
    return e})
  }
/**
 * 
 * @param {'a1,a2'} textSeparatedComa 
 * @returns [[a1,value],[a2,text]]
 */
  transAttribByComboBox(textSeparatedComa) {
    try {
      const arr = textSeparatedComa.split(',')
      if (arr.length <= 0) return []
      else if (arr.length == 1)
        return [
          [arr[0], 'value'],
          [arr[0], 'text'],
        ]
      else
        return [
          [arr[0], 'value'],
          [arr[1], 'text'],
        ]
    } catch (error) {
      return []
    }
  }

  /**
   * transforma result a array normal
   * @param {results} datos 
   * @returns 
   */
  #transformResultArray(datos) {
    return datos.map((obj) => {
      return obj.dataValues
    })
  }

  

  /**
   * Busca opcion por defaul en coleccion de datos (value,text) para comboBox
   * @param {results} data 
   * @param {{value:xx, text:yy}} selected 
   * @returns 
   */
  searchBySelectedComboData(data, selected) {
    const datos = this.#transformResultArray(data)
    return this.searchBySelectedComboDataNotransform(datos, selected)
  }

  /**
   * Busca opcion por defaul en coleccion de datos (value,text) realizadas con query nativo para comboBox
   * @param {results} data 
   * @param {{value:xx, text:yy}} selected 
   * @returns 
   */
  searchBySelectedComboDataNotransform(data, selected) {
    try {
      const datos = data
      let i = 0
      let sw = 0
      for (const ii in datos) {
        sw = 1
        if (datos[ii].value == selected.value) {
          i = ii
          break
        }
      }
  
      if (sw) return datos[i]
      else return this.#sinDatoByCombo
    } catch (error) {
        console.log(error);
        return this.#sinDatoByCombo
    };
    
    
  }

  /**
   * devuelve los campos del cruce de datos usado con sequelice
   * @param {results} datos 
   * @param {String: alias tabla de cruce} campo 
   * @returns array[result]
   */
  modifyResultFindAdvanced(datos, campo){
    return datos.map((obj) => {
        return obj[campo]
      })
  }

  modifyResultToArray(result){
    return this.#transformResultArray(result)
  }
}
