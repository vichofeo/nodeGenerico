'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class f_is_gr_atributo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here      
       f_is_gr_atributo.hasMany(models.f_is_atributo, {
          as: 'fatributos',
          foreignKey: 'grupo_atributo'
        })
    }
  }
  f_is_gr_atributo.init(
    {
      grupo_atributo: { type: DataTypes.STRING(64), allowNull: false, primaryKey: true, },
      grupo: { type: DataTypes.STRING(128), allowNull: false },

    },
    {
      sequelize,
      modelName: 'f_is_gr_atributo',
      timestamps: false,
      freezeTableName: true,
      tableName: 'f_is_gr_atributo',
      classMethods: {},
    }
  )
  return f_is_gr_atributo
}
