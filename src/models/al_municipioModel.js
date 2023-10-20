'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class al_municipio extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  al_municipio.init(
    {
      cod_pais: { type: DataTypes.STRING(4) ,
      allowNull: false, primaryKey: true,},
       cod_dpto: { type: DataTypes.STRING(10), 
      allowNull: false, primaryKey: true},
       cod_municipio: { type: DataTypes.STRING(10) ,
      allowNull: false},
       nombre_municipio: { type: DataTypes.STRING(200),
      allowNull: true},
       nombre_alternativo: { type: DataTypes.STRING(10000),
      allowNull: true},
       asciiname: {type: DataTypes.STRING(200),
      allowNull: true},
       lat: { type: DataTypes.DOUBLE,
      allowNull: true},
       lng: { type: DataTypes.DOUBLE,
      allowNull: true}
    },
    {
      sequelize,
      modelName: 'al_municipio',
      timestamps: false,
      freezeTableName: true,
      tableName: 'al_municipio',
      classMethods: {},
    }
  )
  return al_municipio
}
