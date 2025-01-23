'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class tmp_inas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tmp_inas.init(
    {
      
      numero:{type: DataTypes.STRING, allowNull: true},
      gestion:{type: DataTypes.STRING, allowNull: true},
      ente_gestor_name:{type: DataTypes.STRING, allowNull: true},
      inas_no:{type: DataTypes.STRING, allowNull: true},
      establecimiento:{type: DataTypes.STRING, allowNull: true},
      servicio:{type: DataTypes.STRING, allowNull: true},
      departamento:{type: DataTypes.STRING, allowNull: true},
      fecha_emision:{type: DataTypes.DATEONLY, allowNull: true, default: null},
      cronograma :{type: DataTypes.DATEONLY, allowNull: true},
      seguimiento :{type: DataTypes.STRING, allowNull: true},
      observacion :{type: DataTypes.TEXT, allowNull: true},      

      eg: { type: DataTypes.STRING, allowNull: true },
      dpto: { type: DataTypes.STRING, allowNull: true },
      eess: { type: DataTypes.STRING, allowNull: true }

    },
    {
      sequelize,
      modelName: 'tmp_inas',
      timestamps: false,
      freezeTableName: true,
      tableName: 'tmp_inas',
      classMethods: {},
    }
  )
  return tmp_inas
}
