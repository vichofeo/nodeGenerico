'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class f_formulario_clase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  f_formulario_clase.init(
    {
      cod_clase:{type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true},
      nombre_clase:{type: DataTypes.STRING(256), allowNull: true},
  
    },
    {
      sequelize,
      modelName: 'f_formulario_clase',
      timestamps: false,
      freezeTableName: true,
      tableName: 'f_formulario_clase',
      classMethods: {},
    }
  )
  return f_formulario_clase
}
