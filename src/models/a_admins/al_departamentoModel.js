'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class al_departamento extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      al_departamento.hasMany(models.ae_institucion, {
        as: 'institucion',
        foreignKey: 'cod_dpto',
      })
    }
  }
  al_departamento.init(
    {
      cod_dpto: { type: DataTypes.STRING(10), allowNull: false, primaryKey: true, },
      cod_pais: { type: DataTypes.STRING(4), allowNull: false, primaryKey: true },
      nombre_dpto: { type: DataTypes.STRING(64), allowNull: true },
      nombre_largo: { type: DataTypes.STRING(512), allowNull: true },
      geoname_id: { type: DataTypes.STRING(12), allowNull: true },
      latitud: { type: DataTypes.DOUBLE, allowNull: true },
      longitud: { type: DataTypes.DOUBLE, allowNull: true }
    },
    {
      sequelize,
      modelName: 'al_departamento',
      timestamps: false,
      freezeTableName: true,
      tableName: 'al_departamento',
      classMethods: {},
    }
  )
  return al_departamento
}
