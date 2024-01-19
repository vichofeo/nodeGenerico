'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class f_formulario_cnf extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  f_formulario_cnf.init(
    {
      formulario_id:{type: DataTypes.STRING(64), allowNull: false, primaryKey: true},
      subfrm_id:{type: DataTypes.STRING(64), allowNull: false, primaryKey: true},
      enunciado_id:{type: DataTypes.STRING(64), allowNull: false, primaryKey: true},
      opcion_id:{type: DataTypes.STRING(64), allowNull: false, primaryKey: true},
      activo:{type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'Y'},
      create_date:{type: DataTypes.DATE, allowNull: false},
      last_modify_date_time:{type: DataTypes.DATE, allowNull: false},
      dni_register:{type: DataTypes.STRING(25), allowNull: false},
      
        
    },
    {
      sequelize,
      modelName: 'f_formulario_cnf',
      timestamps: false,
      freezeTableName: true,
      tableName: 'f_formulario_cnf',
      classMethods: {},
    }
  )
  return f_formulario_cnf
}
