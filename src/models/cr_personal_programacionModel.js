'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class cr_personal_programacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  cr_personal_programacion.init(
    {
      idx: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
      actividad_id: { type: DataTypes.INTEGER, allowNull: false },
      dni_persona: { type: DataTypes.STRING(25), allowNull: true },
      
      programacion_id: { type: DataTypes.INTEGER, allowNull: false },
      dni_register: { type: DataTypes.STRING(25), allowNull: true },
      create_date: { type: DataTypes.DATE, allowNull: false },
      last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
      activo: { type: DataTypes.CHAR(1), allowNull: false, defaultValue: 'Y' },

      
    },
    {
      sequelize,
      modelName: 'cr_personal_programacion',
      timestamps: false,
      freezeTableName: true,
      tableName: 'cr_personal_programacion',
      classMethods: {},
    }
  )
  return cr_personal_programacion
}
