'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class f_frm_enun_tipo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  f_frm_enun_tipo.init(
    {
      tipo_enunciado_id:{type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true},
      nombre_tipo_pregunta:{type: DataTypes.STRING(50), allowNull: true},
    },
    {
      sequelize,
      modelName: 'f_frm_enun_tipo',
      timestamps: false,
      freezeTableName: true,
      tableName: 'f_frm_enun_tipo',
      classMethods: {},
    }
  )
  return f_frm_enun_tipo
}
