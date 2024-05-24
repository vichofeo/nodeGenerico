'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class f_is_atributo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      f_is_atributo.belongsTo(models.f_is_gr_atributo, {
        as: 'grupo',
        foreignKey: 'grupo_atributo',
      })

      /*f_is_atributo.belongsTo(models.f_is_atributo, {
        as: 'grplinkn',
        foreignKey: 'precedencia',
      })*/
    }
  }
  f_is_atributo.init(
    {
      atributo_id: { type: DataTypes.STRING(64), allowNull: false, primaryKey: true, },
      atributo: { type: DataTypes.STRING(512), allowNull: false },
      grupo_atributo: { type: DataTypes.STRING(64), allowNull: false },
      orden: { type: DataTypes.INTEGER, allowNull: false }

    },
    {
      sequelize,
      modelName: 'f_is_atributo',
      timestamps: true,
      freezeTableName: true,
      tableName: 'f_is_atributo',
      classMethods: {},
    }
  )
  return f_is_atributo
}
