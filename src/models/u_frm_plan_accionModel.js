'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class u_frm_plan_accion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      u_frm_plan_accion.belongsTo(models.u_frm,{
        as:'formulario',
        foreignKey: 'frm_id',
//        targetKey: 'valor'
      }),
      u_frm_plan_accion.belongsTo(models.u_frm,{
        as:'seccion',
        foreignKey: 'seccion_id',
//        targetKey: 'valor'
      }),
      u_frm_plan_accion.belongsTo(models.u_frm,{
        as:'capitulo',
        foreignKey: 'cap_id',
//        targetKey: 'valor'
      })

    }
  }
  u_frm_plan_accion.init(
    {
      
      valores_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
      frm_id: { type: DataTypes.INTEGER, allowNull: false },
      seccion_id: { type: DataTypes.INTEGER, allowNull: false },
      cap_id: { type: DataTypes.INTEGER, allowNull: false },      
      parametro_id: { type: DataTypes.INTEGER, allowNull: false },
      fecha_registro: { type: DataTypes.DATE, allowNull: true },
      fecha_complimiento: { type: DataTypes.DATEONLY, allowNull: true },
      acciones: { type: DataTypes.TEXT, allowNull: true },
      dni_evaluador: { type: DataTypes.STRING(25), allowNull: false },
      create_date: { type: DataTypes.DATE(), allowNull: true },
      last_modify_date_time: { type: DataTypes.DATE(), allowNull: true },
      activo: { type: DataTypes.CHAR(1), allowNull: false, defaultValue: 'Y' },
      dni_register: { type: DataTypes.STRING(25), allowNull: true },
      conteo: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 }
    },
    {
      sequelize,
      modelName: 'u_frm_plan_accion',
      timestamps: false,
      freezeTableName: true,
      tableName: 'u_frm_plan_accion',
      classMethods: {},
    }
  )
  return u_frm_plan_accion
}
