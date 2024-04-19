'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class u_frm extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      u_frm.hasMany(models.u_frm_valores,{
        as:'valor',
        foreignKey: 'frm_id'
      }),
      u_frm.belongsTo(models.u_is_gr_atributo,{
        as:'opciones',
        foreignKey: 'parametros'
      }), 
      u_frm.belongsTo(models.u_frm,{
        as:'padre',
        foreignKey: 'codigo_root',
        targetKey: 'codigo'
      }),
      u_frm.hasMany(models.u_frm_evaluadores,{
        as:'evaluadores',
        foreignKey: 'frm_id',
        targetKey: 'frm_id'
      })
    }
  }
  u_frm.init(
    {
      frm_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
      nivel: { type: DataTypes.STRING(64), allowNull: true },
      tipo_acrehab: { type: DataTypes.STRING(64), allowNull: true },
      codigo: { type: DataTypes.STRING(24), allowNull: false },
      codigo_root: { type: DataTypes.STRING(24), allowNull: false, defaultValue: '-1' },
      //nombre_frm: { type: DataTypes.STRING(1024), allowNull: false },
      nombre_corto: { type: DataTypes.STRING(10), allowNull: true },
      //proposito: { type: DataTypes.TEXT, allowNull: true },
      parametro: { type: DataTypes.TEXT, allowNull: true },
      ordenanza: { type: DataTypes.TEXT, allowNull: true },
      obligatorio: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      aplica: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: true },
      orden: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
      frm: { type: DataTypes.INTEGER, allowNull: true },
      activo: { type: DataTypes.CHAR(1), allowNull: false, defaultValue: 'Y' },
      create_date: { type: DataTypes.DATE(), allowNull: true },
      last_modify_date_time: { type: DataTypes.DATE(), allowNull: true },
      dni_register: { type: DataTypes.STRING(25), allowNull: true },
      parametros: { type: DataTypes.STRING(64), allowNull: true },
      es_parametro: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    },
    {
      sequelize,
      modelName: 'u_frm',
      timestamps: false,
      freezeTableName: true,
      tableName: 'u_frm',
      classMethods: {},
    }
  )
  return u_frm
}
