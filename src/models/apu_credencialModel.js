'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class apu_credencial extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  apu_credencial.init(
    {
        institucion_id:  {type: DataTypes.STRING(64) ,
        allowNull: false, primaryKey: true},
           aplicacion_id:{ type: DataTypes.STRING(64) ,
        allowNull: false, primaryKey: true},
           dni_persona: { type: DataTypes.STRING(25) ,
        allowNull: false,  primaryKey: true},
           login: { type: DataTypes.STRING(15) ,
        allowNull: false},
           password: { type: DataTypes.STRING(25),
        allowNull: true},
           hash: { type: DataTypes.STRING(128) ,
        allowNull: false},
           disable_date: { type: DataTypes.DATE,
        allowNull: true},
           sw: { type: DataTypes.INTEGER ,
        allowNull: false, defaultValue: 0},
           create_date: { type: DataTypes.DATE , 
        allowNull: false},
           last_modify_date_time: { type: DataTypes.DATE,
        allowNull: true},
           activo :{
        type: DataTypes.CHAR(1), defaultValue: 'Y'},   
    },
    {
      sequelize,
      modelName: 'apu_credencial',
      timestamps: false,
      freezeTableName: true,
      tableName: 'apu_credencial',
      classMethods: {},
    }
  )
  return apu_credencial
}
