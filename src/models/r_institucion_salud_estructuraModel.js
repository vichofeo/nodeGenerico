'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class r_institucion_salud_estructura extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  r_institucion_salud_estructura.init(
    {
      estructura_id:{type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true},
      institucion_id:{type: DataTypes.STRING(64), allowNull: true},
      estructura:{type: DataTypes.STRING(64), allowNull: true},
      material:{type: DataTypes.STRING(64), allowNull: true},
      estado:{type: DataTypes.STRING(64), allowNull: true},
      observacion:{ type: DataTypes.STRING(4000), allowNull: true },
      create_date: { type:  DataTypes.DATE, allowNull: true },
      last_modify_date_time: { type:  DataTypes.DATE, allowNull: true },
      dni_register: { type: DataTypes.STRING(25), allowNull: true },
    },
    {
      sequelize,
      modelName: 'r_institucion_salud_estructura',
      timestamps: false,
      freezeTableName: true,
      tableName: 'r_institucion_salud_estructura',
      classMethods: {},
    }
  )
  return r_institucion_salud_estructura
}
