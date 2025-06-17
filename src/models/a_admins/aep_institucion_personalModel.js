'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class aep_institucion_personal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
  aep_institucion_personal.init(
    {
      institucion_id: { type: DataTypes.STRING(64), allowNull: false, primaryKey: true },
      dni_persona: { type: DataTypes.STRING(25), allowNull: false, primaryKey: true },
      create_date: { type: DataTypes.DATE, allowNull: true },
      last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
      activo: { type: DataTypes.CHAR(1), allowNull: false, defaultValue: 'Y' },
      dni_register: { type: DataTypes.STRING(25), allowNull: true },
    },
    {
      sequelize,
      modelName: 'aep_institucion_personal',
      timestamps: false,
      freezeTableName: true,
      tableName: 'aep_institucion_personal',
      classMethods: {},
    }
  )
  return aep_institucion_personal
}
