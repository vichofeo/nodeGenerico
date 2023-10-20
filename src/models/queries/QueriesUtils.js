module.exports = class QueriesUtils {
  #table
  #sinDatoByCombo
  #initialByCombo
  constructor(table) {
    this.#table = table
    this.#sinDatoByCombo = { value: '-1', text: '-Sin Dato-' }
    this.#initialByCombo = { value: '-1', text: '-Todos-' }
  }

  create(dato) {
    return this.#table
      .create(dato)
      .then((data) => data)
      .catch((error) => error)
  }
  list() {
    return this.#table
      .findAll()
      .then((data) => data)
      .catch((error) => false)
  }
  find(whereObjDat) {
    return this.#table
      .findAll({
        where: whereObjDat,
      })
      .then((data) => data)
      .catch((error) => false)
  }
  findID(datoKey) {
    return this.#table
      .findByPk(datoKey)
      .then((data) => data)
      .catch((e) => false)
  }
  findTune(data) {
    return this.#table
      .findAll({
        attributes: data.attributes,
        where: data.where,
      })
      .then((data) => data)
      .catch((e) => e)
  }
  findTuneAdvanced(data) {
    return this.#table
      .findAll(data)
      .then((data) => data)
      .catch((e) => {
        console.log("%%%%%%%%%%%%%", e)
        return e
      })
  }
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

  #transformResultArray(datos) {
    return datos.map((obj) => {
      return obj.dataValues
    })
  }

  searchBySelectedComboData(data, selected) {
    const datos = this.#transformResultArray(data)
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
  }
  modifyFindAdvanced(datos, campo){
    return datos.map((obj) => {
        return obj[campo]
      })
  }
}
