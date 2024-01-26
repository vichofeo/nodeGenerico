'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class f_frm_opcionales_tipo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      f_frm_opcionales_tipo.hasMany(models.f_frm_opcionales,{
        as:'opciones',
        foreignKey:'tipo_opcion_id'
      })
    }
  }
  f_frm_opcionales_tipo.init(
    {
      tipo_opcion_id:{type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true},
      tipo_opcion:{type: DataTypes.STRING(128), allowNull: true},
      titulo:{type: DataTypes.STRING(120), allowNull: false},
              
    },
    {
      sequelize,
      modelName: 'f_frm_opcionales_tipo',
      timestamps: false,
      freezeTableName: true,
      tableName: 'f_frm_opcionales_tipo',
      classMethods: {},
    }
  )
  return f_frm_opcionales_tipo
}
