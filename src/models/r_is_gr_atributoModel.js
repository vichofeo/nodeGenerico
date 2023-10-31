'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class r_is_gr_atributo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  r_is_gr_atributo.init(
    {
      grupo_atributo: {
        type: DataTypes.STRING(64),
        allowNull: false, primaryKey: true,
      },
      grupo: {
        type: DataTypes.STRING(128),
        allowNull: false
      },
      
    },
    {
      sequelize,
      modelName: 'r_is_gr_atributo',
      timestamps: true,
      freezeTableName: true,
      tableName: 'r_is_gr_atributo',
      classMethods: {},
    }
  )
  return r_is_gr_atributo
}
