const { QueryTypes, UUIDV4, Op } = require("sequelize")
const db = require('../index')
const tk = require('./../../services/utilService')

module.exports = class Qutils {
  #table
  #sequelize
  #sinDatoByCombo
  #initialByCombo
  #where
  #attributes
  #order
  #set
  #include
  #alias
  #query
  #results
  #opOptions
  #op
  #opSelect


  #transac

  constructor() {
    if (Qutils.instance)
      return Qutils.instance

    this.#sequelize = db.sequelize
    this.#sinDatoByCombo = { value: '-1', text: '-Sin Dato-' }
    this.#initialByCombo = { value: '-1', text: '-Todos-' }
    this.#transac = null
    this.setResetVars()
    Qutils.instance = this
  }
  //setters
  setResetVars() {
    this.#where = null
    this.#attributes = null
    this.#order = null
    this.#set = null
    this.#include = null
    this.query = ""
    this.#alias = null
    this.#opOptions = {}
    this.#op = { notin: Op.notIn, in: Op.in, between: Op.between }
    this.#opSelect = null
    //this.#transac = null
  }
  setTableInstance(tableDBName) {
    this.setResetVars()
    this.#table = db[tableDBName]
  }
  setWhere(where) {
    this.#where = where
  }
  /**
   * setea campos de la consulta ['c1','c2'...]
   * @param {*} attributes 
   */
  setAttributes(attributes) {
    this.#attributes = attributes
  }
  setDataset(dataSet = {}) {
    this.#set = dataSet
  }
  setOrder(order) {
    this.#order = order
  }
  setAliasInclude(alias) {
    this.#alias = alias
  }
  setIncludeLigado(tableDBNameIncluded) {
    this.#include = [{
      model: db[tableDBNameIncluded],
      as: this.#alias,
      attributes: this.#attributes,
      where: this.#where,
      order: this.#order,
    }]
  }
  setInclude(cnf_include = {}) {
    this.#include = [cnf_include]
  }
  pushInclude(cnf_include = {}) {
    this.#include.push(cnf_include)
  }
  setQuery(query) {
    this.#query = query
  }
  setOpSelect(stringOp) {
    this.#opSelect = this.#op[stringOp]
  }
  setOpOptions(dataArray = []) {
    this.#opOptions = { ...this.#opOptions, [this.#opSelect]: dataArray }
  }
  setOpOptionsReset() {
    this.#opOptions = {}
  }
  //getters
  getTableInstance(tableDBName) {
    return db[tableDBName]
  }
  
  getResults() {
    return this.#results
  }
  getOpOptions() {
    return this.#opOptions
  }
  /**
   * select * all
   * @returns Array
   */
  list() {
    this.#results = this.#table.findAll().then((data) => data)
    this.#transformResultToArray()
  }
  /**
   * select * from where {}
   * @param {campo:valor, c2:v2 ....} whereObjDat 
   * @returns 
   */
  find() {
    this.#results = this.#table.findAll({ where: this.#where }).then((data) => data)
    this.#transformResultToArray()
  }
  /**
   * select ?? from where {..}
   * @param {attributes:[], where:{a:v, a2:v2 ....}} data 
   * @returns 
   */
  async findTune() {
    this.#results = await this.#table.findAll({
      attributes: this.#attributes,
      where: this.#where,
      order: this.#order,
      include: this.#include
    })
    this.#transformResultToArray()
  }
  async findUnique() {
    this.#results = await this.#table.findOne({
      attributes: this.#attributes,
      where: this.#where,
      order: this.#order,
      include: this.#include
    })
  }
  /**
   * select * from where id=??
   * @param {String} datoKey 
   * @returns 
   */
  async findID(datoKey) {
    const data = await this.#table.findByPk(datoKey)
    this.#results = data ? data.dataValues : {}

  }



  /**
   * Insert data
   * @param {objDatos} dato 
   * @returns 
   */
  async create() {
    this.#results = await this.#table.create(this.#set, { transaction: this.#transac, include: this.#include })
  }
  /**
   * update
   * @param {set:{a:v,a2:v2,....}, where:{a:v1,a2:v2...}} data 
   */
  async modify() {
    this.#results = await this.#table.update(this.#set, { where: this.#where }, { transaction: this.#transac })
  }
  async createwLote() {
    this.#results = await this.#table.bulkCreate(this.#set, { transaction: this.#transac, ignoreDuplicates: true, include: this.#include })
  }

  async excuteSelect() {
    this.#results = await this.#sequelize.query(this.#query, { mapToModel: true, type: QueryTypes.SELECT, raw: false, })
  }

  async findData1toNFromReferer() {
    await this.findTune()
    const result = {}
    for (const element of this.#results) {
      result[element.value] = element[this.#alias]
    }
    this.#results = result
  }

  async startTransaction() {
    this.#transac = await this.#sequelize.transaction()
  }
  async commitTransaction() {
    await this.#transac.commit();
  }
  async rollbackTransaction() {
    await this.#transac.rollback();
  }
  // ------------------------ utilitarios complementarios a la clase
  /**
     * transforma result a array normal
     * @param {results} datos 
     * @returns 
     */
  #transformResultToArray() {
    if (Array.isArray(this.#results)) {
      const datos = this.#results
      //this.#results = null 
      this.#results = datos.map((obj) => {
        if (obj.dataValues)
          return obj.dataValues
        else return obj
      })
    }
  }

  /**
   * transforma Array de campos a forma value,text
   * @param ['a1,a2'] arrayCampos 
   * @returns [[a1,value],[a2,text]]
   */
  transAttribByComboBox(arrayCampos) {
    try {
      const arr = arrayCampos
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
   * Busca opcion por defaul en coleccion de datos (value,text) realizadas con query nativo para comboBox
   * @param {results} data 
   * @param {{value:xx, text:yy}} selected 
   * @returns 
   */
  searchSelectedInDataComboBox(data, selected) {
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

  searchSelectedForComboBox(selected) {
    return this.searchSelectedInDataComboBox(this.#results, selected)
  }

  searchSelectedForMultipleComboBox(selected) {
    try {
      const datos = this.#results
      let i = 0
      let sw = 0
      const results = []
      for (const ii in datos) {
        sw = 1
        const resultado = selected.find((obj) => obj.value === datos[ii].value);
        if (resultado) {
          results.push(datos[ii])
        }
      }

      if (sw) return results
      else return this.#sinDatoByCombo
    } catch (error) {
      console.log(error);
      return this.#sinDatoByCombo
    };
  }

  // ----------------- metodos adicionales a queries
  /**
   * convierte el campos select con operaciones a campo de sequelize ej campa||campb
   * @param {*} cadenaCampoSelect 
   * @returns 
   */
  literal(cadenaCampoSelect){
    return this.#sequelize.literal(cadenaCampoSelect)
  }
/**
 * convierte campo de asociacion para orderby
 * @param {*} cadenaCampoSelectInclude 
 * @returns 
 */
  col(cadenaCampoSelectInclude) {
    return this.#sequelize.col(cadenaCampoSelectInclude)
  }
  /**
   * devuele objeto de != para query
   * @param {*} value 
   * @returns 
   */
  distinto(value){
    return {[Op.ne]: value}
  }
  /**
   * sentencia not null 
   * @returns 
   */
  notNull(){
    return {[Op.not]: null}
  }
}
