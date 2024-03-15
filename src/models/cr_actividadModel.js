'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class cr_actividad extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  cr_actividad.init(
    {
      actividad_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
      nombre_actividad: { type: DataTypes.STRING(128), allowNull: false, },
      codigo: { type: DataTypes.STRING(32), allowNull: false, },
      objetivo: { type: DataTypes.TEXT, allowNull: true },
      descripcion: { type: DataTypes.TEXT, allowNull: true, },
      narrativa: { type: DataTypes.TEXT, allowNull: true, },
      inicio_proyecto: { type: DataTypes.DATEONLY, allowNull: false },
      finalizacion: { type: DataTypes.DATEONLY, allowNull: true },
      concluido: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      create_date: { type: DataTypes.DATE, allowNull: false },
      last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
      activo: { type: DataTypes.CHAR(1), allowNull: false, defaultValue: 'Y' },
      actividad_root: { type: DataTypes.INTEGER, allowNull: true },
      clase_actividad: { type: DataTypes.STRING(64), allowNull: false },
      tipo_actividad: { type: DataTypes.STRING(64), allowNull: false },
      institucion_id: { type: DataTypes.UUID, allowNull: true },
      dni_register: { type: DataTypes.STRING(25), allowNull: true },
      virtual: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    {
      sequelize,
      modelName: 'cr_actividad',
      timestamps: false,
      freezeTableName: true,
      tableName: 'cr_actividad',
      classMethods: {},
    }
  )
  return cr_actividad
}
