'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ae_institucion_tipo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ae_institucion_tipo.init(
    {
      tipo_institucion_id :{type: DataTypes.STRING(64) ,
      allowNull: false, primaryKey: true,},
       tipo_institucion: {type: DataTypes.STRING(80) ,
      allowNull: false} 
    },
    {
      sequelize,
      modelName: 'ae_institucion_tipo',
      timestamps: false,
      freezeTableName: true,
      tableName: 'ae_institucion_tipo',
      classMethods: {},
    }
  )
  return ae_institucion_tipo
}

