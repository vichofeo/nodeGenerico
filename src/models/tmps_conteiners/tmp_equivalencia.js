'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class tmp_equivalencia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tmp_equivalencia.init(
    {
      
      ente_gestor_name: {type: DataTypes.STRING, allowNull: false, primaryKey: true},       
      departamento: {type: DataTypes.STRING, allowNull: false, primaryKey: true},       
      establecimiento: {type: DataTypes.STRING, allowNull: false, primaryKey: true}, 
      
      eg: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
      dpto: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
      eess: { type: DataTypes.STRING, allowNull: false, primaryKey: true }


    },
    {
      sequelize,
      modelName: 'tmp_equivalencia',
      timestamps: false,
      freezeTableName: true,
      tableName: 'tmp_equivalencia',
      classMethods: {},
    }
  )
  return tmp_equivalencia
}
