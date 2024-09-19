'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class tmp_nombres extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tmp_nombres.init(
    {
      nombre: {type: DataTypes.STRING, allowNull: true}, 
      genero: {type: DataTypes.STRING, allowNull: true}, 
      
    },
    {
      sequelize,
      modelName: 'tmp_nombres',
      timestamps: false,
      freezeTableName: true,
      tableName: 'tmp_nombres',
      classMethods: {},
    }
  )
  tmp_nombres.removeAttribute("id");
  return tmp_nombres
}
