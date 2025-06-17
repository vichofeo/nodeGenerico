'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class r_institucion_salud_personal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  r_institucion_salud_personal.init(
    {
       personal_id:{type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true},
institucion_id:{type: DataTypes.STRING(64), allowNull: true},
dni_persona:{type: DataTypes.STRING(25), allowNull: true},
item_contrato:{type: DataTypes.STRING(64), allowNull: true},
item_contrato_desc:{type: DataTypes.STRING(64), allowNull: true},
item_desc_text: {type: DataTypes.STRING(4000), allowNull: true},
ambito:{type: DataTypes.STRING(64), allowNull: true},
nivel_instruccion:{type: DataTypes.STRING(64), allowNull: true},
profesion_ocupacion:{type: DataTypes.STRING(64), allowNull: true},
profesion_ocupacion_especifica:{type: DataTypes.STRING(64), allowNull: true},
fuente_financiamiento:{type: DataTypes.STRING(64), allowNull: true},
descripcion_cargo:{type: DataTypes.STRING(64), allowNull: true},
carga_laboral:{type: DataTypes.STRING(64), allowNull: true},
personal_rotatorio:{type: DataTypes.STRING(64), allowNull: true},
create_date: {type: DataTypes.DATE, allowNull: true},
last_modify_date_time: {type: DataTypes.DATE, allowNull: true},
activo:{type: DataTypes.CHAR(1), allowNull: true},
dni_register:{type: DataTypes.STRING(25), defaultValue: 'Y'},

    },
    {
      sequelize,
      modelName: 'r_institucion_salud_personal',
      timestamps: false,
      freezeTableName: true,
      tableName: 'r_institucion_salud_personal',
      classMethods: {},
    }
  )
  return r_institucion_salud_personal
}
