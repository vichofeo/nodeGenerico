'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class tmp_camas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tmp_camas.init(
    {
      idx: { type: DataTypes.INTEGER(), allowNull: false, primaryKey: true, autoIncrement:true },      
      fecha_registro: {type: DataTypes.DATEONLY, allowNull: true}, 
      mail_origen: {type: DataTypes.STRING, allowNull: true}, 
      ente_gestor: {type: DataTypes.STRING, allowNull: true}, 
      establecimieno: {type: DataTypes.STRING, allowNull: true}, 
      nivel_atencion: {type: DataTypes.STRING, allowNull: true}, 
      servicios_primer: {type: DataTypes.STRING, allowNull: true}, 
      servicios_segundo: {type: DataTypes.STRING, allowNull: true}, 
      servicios_tercer: {type: DataTypes.STRING, allowNull: true}, 
      total_camas: {type: DataTypes.STRING, allowNull: true}, 
      camas_disponibles: {type: DataTypes.STRING, allowNull: true}, 
      total_camas_emergencia: {type: DataTypes.STRING, allowNull: true}, 
      camas_emergencia_disponibles: {type: DataTypes.STRING, allowNull: true}, 
      

      f_registro: {type: DataTypes.STRING, allowNull: true}, 
      swloadend: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
      
            
      hash: { type: DataTypes.STRING, allowNull: true, unique: true },
      hasher: { type: DataTypes.STRING, allowNull: true },
      dni_register: { type: DataTypes.STRING, allowNull: true }
    },
    {
      sequelize,
      modelName: 'tmp_camas',
      timestamps: false,
      freezeTableName: true,
      tableName: 'tmp_camas',
      classMethods: {},
    }
  )
  return tmp_camas
}
