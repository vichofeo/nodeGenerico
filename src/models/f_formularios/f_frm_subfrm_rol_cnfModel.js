'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class f_frm_subfrm_rol_cnf extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  f_frm_subfrm_rol_cnf.init(
    {
      rol_id:{type: DataTypes.STRING(64), allowNull: false},
      subfrm_id:{type: DataTypes.STRING(64), allowNull: false},
      institucion_id:{type: DataTypes.STRING(64), allowNull: false},
      activo:{type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'Y'},
      create_date:{type: DataTypes.DATE, allowNull: false},
      last_modify_date_time:{type: DataTypes.DATE, allowNull: false},
      dni_persona:{type: DataTypes.STRING(25), allowNull: false},
      
        
    },
    {
      sequelize,
      modelName: 'f_frm_subfrm_rol_cnf',
      timestamps: false,
      freezeTableName: true,
      tableName: 'f_frm_subfrm_rol_cnf',
      classMethods: {},
    }
  )
  return f_frm_subfrm_rol_cnf
}
