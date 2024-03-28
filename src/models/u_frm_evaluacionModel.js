'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class u_frm_evaluacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  u_frm_evaluacion.init(
    {
      evaluacion_id: { type: DataTypes.UUID, allowNull: false, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      institucion_id: { type: DataTypes.STRING(64), allowNull: false },
      frm_id: { type: DataTypes.INTEGER, allowNull: false },
      dni_evaluador: { type: DataTypes.STRING(25), allowNull: true },
      tipo_acrehab: { type: DataTypes.STRING(64), allowNull: false },
      concluido: { type: DataTypes.INTEGER(), allowNull: false, defaultValue: 0 },
      create_date: { type: DataTypes.DATE, allowNull: false },
      last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
      dni_register: { type: DataTypes.STRING(25), allowNull: true },
      activo: { type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'Y' }
    },
    {
      sequelize,
      modelName: 'u_frm_evaluacion',
      timestamps: false,
      freezeTableName: true,
      tableName: 'u_frm_evaluacion',
      classMethods: {},
    }
  )
  return u_frm_evaluacion
}
