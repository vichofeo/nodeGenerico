'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class cr_actividad_programacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  cr_actividad_programacion.init(
    {
      programacion_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
      actividad_id: { type: DataTypes.INTEGER, allowNull: false },
      nombre_programacion: { type: DataTypes.STRING(128), allowNull: true, },
      descripcion: { type: DataTypes.TEXT, allowNull: true, },
      fecha: { type: DataTypes.DATEONLY, allowNull: false },
      inicio: { type: DataTypes.TIME, allowNull: false },
      fin: { type: DataTypes.TIME, allowNull: false },
      lugar_desarrollo: { type: DataTypes.STRING(128), allowNull: true, },
      contraparte: { type: DataTypes.TEXT, allowNull: true, },
      concluido: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      dni_register: { type: DataTypes.STRING(25), allowNull: true },
      create_date: { type: DataTypes.DATE, allowNull: false },
      last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
    },
    {
      sequelize,
      modelName: 'cr_actividad_programacion',
      timestamps: false,
      freezeTableName: true,
      tableName: 'cr_actividad_programacion',
      classMethods: {},
    }
  )
  return cr_actividad_programacion
}
