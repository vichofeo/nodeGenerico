'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ap_aplicacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ap_aplicacion.belongsToMany(
        models.ae_institucion, {
        as: "appis",
        through: { model: models.ape_aplicacion_institucion, unique: false },//'Parent_Child',
        foreignKey: 'aplicacion_id'
      }),
      ap_aplicacion.hasMany(models.ape_aplicacion_institucion, {
        as: 'appi',
        foreignKey:'aplicacion_id'
      })
    }
  }
  ap_aplicacion.init(
    {
      aplicacion_id: { type: DataTypes.STRING(64), allowNull: false, primaryKey: true },
      nombre_aplicacion: { type: DataTypes.STRING(50), allowNull: true },
      version: { type: DataTypes.DOUBLE, allowNull: false },
      nombre_comercial: { type: DataTypes.STRING(128), allowNull: false },
      descripcion: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      sequelize,
      modelName: 'ap_aplicacion',
      timestamps: false,
      freezeTableName: true,
      tableName: 'ap_aplicacion',
      classMethods: {},
    }
  )
  return ap_aplicacion
}
