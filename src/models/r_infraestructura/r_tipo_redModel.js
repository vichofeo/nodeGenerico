'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  usuario.init(
    {
        
    },
    {
      sequelize,
      modelName: 'usuario',
      timestamps: false,
      freezeTableName: true,
      tableName: 'usuario',
      classMethods: {},
    }
  )
  return usuario
}
