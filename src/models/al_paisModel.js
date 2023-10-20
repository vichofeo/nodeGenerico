'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class al_pais extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  al_pais.init(
    {
      cod_pais: { type: DataTypes.STRING(4) ,
      allowNull: false, primaryKey: true},
       nombre_pais: { type: DataTypes.STRING(80) ,
      allowNull: true},
    },
    {
      sequelize,
      modelName: 'al_pais',
      timestamps: false,
      freezeTableName: true,
      tableName: 'al_pais',
      classMethods: {},
    }
  )
  return al_pais
}
