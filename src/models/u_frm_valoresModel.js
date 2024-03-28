'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class u_frm_valores extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  u_frm_valores.init(
    {
      valores_id: { type: DataTypes.INTEGER(), allowNull: false, primaryKey: true, autoIncrement:true },
      frm_id: { type: DataTypes.INTEGER, allowNull: false },
      dni_evaluador: { type: DataTypes.STRING(25), allowNull: true },
      valor: { type: DataTypes.STRING(32), allowNull: true },
      observacion: { type: DataTypes.TEXT, allowNull: true },
      create_date: { type: DataTypes.DATE, allowNull: false },
      last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
      dni_register: { type: DataTypes.STRING(25), allowNull: true },
      evaluacion_id: { type: DataTypes.UUID(), allowNull: false }
    },
    {
      sequelize,
      modelName: 'u_frm_valores',
      timestamps: false,
      freezeTableName: true,
      tableName: 'u_frm_valores',
      classMethods: {},
    }
  )
  return u_frm_valores
}
