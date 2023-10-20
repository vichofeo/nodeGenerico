'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class au_tipo_dni extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  au_tipo_dni.init(
    {
      tipo_dni:  {type: DataTypes.STRING(64) ,
      allowNull: false, primaryKey: true},
       nombre_tipo_dni:  {type: DataTypes.STRING(80), 
      allowNull: true},
    },
    {
      sequelize,
      modelName: 'au_tipo_dni',
      timestamps: false,
      freezeTableName: true,
      tableName: 'au_tipo_dni',
      classMethods: {},
    }
  )
  return au_tipo_dni
}
