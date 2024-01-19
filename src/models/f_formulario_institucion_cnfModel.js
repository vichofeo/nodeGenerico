'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class f_formulario_institucion_cnf extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  f_formulario_institucion_cnf.init(
    {
      institucion_id:{type: DataTypes.STRING(64), allowNull: false, primaryKey: true},
      formulario_id:{type: DataTypes.STRING(64), allowNull: false, primaryKey: true},
      activo:{type: DataTypes.CHAR(1), allowNull: false, defaultValue: 'Y'},
      opcional:{type: DataTypes.INTEGER, allowNull: true},
      dni_register:{type: DataTypes.STRING(25), allowNull: false},
      create_date:{type: DataTypes.DATE, allowNull: true},
      last_modify_date_time:{type: DataTypes.DATE, allowNull: false}, 
    },
    {
      sequelize,
      modelName: 'f_formulario_institucion_cnf',
      timestamps: false,
      freezeTableName: true,
      tableName: 'f_formulario_institucion_cnf',
      classMethods: {},
    }
  )
  return f_formulario_institucion_cnf
}
