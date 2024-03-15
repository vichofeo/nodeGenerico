'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class cr_personal_actividad extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  cr_personal_actividad.init(
    {
      actividad_id: { type: DataTypes.INTEGER, allowNull: false,  primaryKey:true},
      dni_persona: { type: DataTypes.STRING(25), allowNull: false, primaryKey:true },
      dni_register: { type: DataTypes.STRING(25), allowNull: true },
      observaciones: { type: DataTypes.TEXT, allowNull: true, },
      create_date: { type: DataTypes.DATE, allowNull: false },
      last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
      activo:{type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'Y'},
    },
    {
      sequelize,
      modelName: 'cr_personal_actividad',
      timestamps: false,
      freezeTableName: true,
      tableName: 'cr_personal_actividad',
      classMethods: {},
    }
  )
  return cr_personal_actividad
}
