'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class r_institucion_salud_acrehab extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  r_institucion_salud_acrehab.init(
    {
      acrehab_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true },
      institucion_id: { type: DataTypes.STRING(64), allowNull: true },
      eess_nombre: { type: DataTypes.STRING(128), allowNull: true },
      estado_acrehab: { type: DataTypes.STRING(64), allowNull: true },
      gestion_registro: { type: DataTypes.INTEGER, allowNull: true },
      nro_ra: { type: DataTypes.STRING(80), allowNull: true },
      fecha_ra: { type: DataTypes.DATEONLY, allowNull: true },
      vigencia_anios: { type: DataTypes.INTEGER, allowNull: true },
      puntaje: { type: DataTypes.DOUBLE, allowNull: true },
      tipo_registro: { type: DataTypes.STRING(64), allowNull: true },
      activo: { type: DataTypes.CHAR(1), allowNull: true },
      create_date: { type: DataTypes.DATE, allowNull: true },
      last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
    },
    {
      sequelize,
      modelName: 'r_institucion_salud_acrehab',
      timestamps: false,
      freezeTableName: true,
      tableName: 'r_institucion_salud_acrehab',
      classMethods: {},
    }
  )
  return r_institucion_salud_acrehab
}
