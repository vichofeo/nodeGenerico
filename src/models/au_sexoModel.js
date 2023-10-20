'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class au_sexo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  au_sexo.init(
    {
      sexo: {type: DataTypes.STRING(2) ,
 allowNull: false, primaryKey: true},
	nombre_sexo:  {type: DataTypes.STRING(20),
 allowNull: true},  
    },
    {
      sequelize,
      modelName: 'au_sexo',
      timestamps: false,
      freezeTableName: true,
      tableName: 'au_sexo',
      classMethods: {},
    }
  )
  return au_sexo
}
