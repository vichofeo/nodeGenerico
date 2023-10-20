'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class upu_inst_pers_rols extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  upu_inst_pers_rols.init(
    {
      create_date: { type: DataTypes.DATE ,
      allowNull: false},
       last_modify_date_time: { type: DataTypes.DATE,
      allowNull: true},
       activo : {
      type: DataTypes.CHAR(1) ,
      allowNull: false , defaultValue: 'Y'},
       institucion_id: { type: DataTypes.STRING(64) ,
      allowNull: false},
       aplicacion_id:  {type: DataTypes.STRING(64) ,
      allowNull: false},
       dni_persona:  {type: DataTypes.STRING(25) ,
      allowNull: false},
       rol_id: { type: DataTypes.STRING(64) ,
      allowNull: false},
    },
    {
      sequelize,
      modelName: 'upu_inst_pers_rols',
      timestamps: false,
      freezeTableName: true,
      tableName: 'upu_inst_pers_rols',
      classMethods: {},
    }
  )
  return upu_inst_pers_rols
}
