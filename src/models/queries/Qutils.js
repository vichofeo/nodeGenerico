const { QueryTypes, UUIDV4 } = require("sequelize")
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

  constructor() {  
    if(Qutils.instance)  
    return Qutils.instance

    this.#sequelize = db.sequelize
    this.#sinDatoByCombo = { value: '-1', text: '-Sin Dato-' }
    this.#initialByCombo = { value: '-1', text: '-Todos-' }
    this.setResetVars()
    Qutils.instance =  this
  }
  //setters
  setResetVars(){
    this.#where =  null
    this.#attributes = null
    this.#order =  null
    this.#set =  null
    this.#include =  null
    this.query = ""
    this.#alias =  null
  }
  setTableInstance(tableDBName){
    this.#table = db[tableDBName]
  }
  setWhere(where){
    this.#where = where
  }
  setAttributes(attributes){
    this.#attributes =  attributes
  }
  setOrder(order){
    this.#order =  order
  }
  setAliasInclude(alias){
    this.#alias = alias
  }
  setInclude(tableDBNameIncluded){
    this.#include = [{ 
      model: db[tableDBNameIncluded], 
      as: this.#alias, 
      attributes: this.#attributes,
      where: this.#where,
      order: this.#order, 
    }]
  }
  
  setQuery(query){
    this.#query =  query
  }
//getters

getResults(){
  return this.#results
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
    this.#results= this.#table.findAll({where: this.#where}).then((data) => data)      
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
      include:this.#include
    })
    this.#transformResultToArray()    
  }

  /**
   * select * from where id=??
   * @param {String} datoKey 
   * @returns 
   */
  findID(datoKey) {
    this.#results = this.#table.findByPk(datoKey).then((data) => data ? data.dataValues : {})      
  }
  

 
  /**
   * Insert data
   * @param {objDatos} dato 
   * @returns 
   */
  create() {
    this.#results = this.#table.create(this.#set).then((data) => data)      
  }
  /**
   * update
   * @param {set:{a:v,a2:v2,....}, where:{a:v1,a2:v2...}} data 
   */
  modify() {
    this.#results = this.#table.update(this.#set, { where: this.#where }).then((data)=>data)
  }

  
 async excuteSelect(){
  this.#results = await this.#sequelize.query(this.#query, { mapToModel: true, type: QueryTypes.SELECT, raw: false, })
 } 
  
  async findData1toNFromReferer() {    
    await this.findTune()      
    const result = {}
    for (const element of this.#results) {        
      result[element.value] = element[this.#alias]
    }
    this.#results =  result    
}

// ------------------------ utilitarios complementarios a la clase
/**
   * transforma result a array normal
   * @param {results} datos 
   * @returns 
   */
#transformResultToArray() {
  if (Array.isArray(this.#results)){
    const datos = this.#results
    //this.#results = null 
    this.#results=  datos.map((obj) => {
      if (obj.dataValues)
        return obj.dataValues
      else return obj
    })      
  }
}

  /**
   * 
   * @param {'a1,a2'} textSeparatedComa 
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

 
}
