'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class u_is_gr_atributo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      u_is_gr_atributo.hasMany(models.u_is_atributo,{
        as:'valores',
        foreignKey: 'grupo_atributo'
      })
      
    }
  }
  u_is_gr_atributo.init(
    {
      grupo_atributo: { type: DataTypes.STRING(64), allowNull: false, primaryKey: true, },
      grupo: { type: DataTypes.STRING(128), allowNull: false },

    },
    {
      sequelize,
      modelName: 'u_is_gr_atributo',
      timestamps: true,
      freezeTableName: true,
      tableName: 'u_is_gr_atributo',
      classMethods: {},
    }
  )
  return u_is_gr_atributo
}
