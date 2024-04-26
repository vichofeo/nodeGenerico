'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class u_is_atributo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      u_is_atributo.belongsTo(models.u_is_gr_atributo, {
        as: 'grupo',
        foreignKey: 'grupo_atributo',
      })
    }
  }
  u_is_atributo.init(
    {
      atributo_id: { type: DataTypes.STRING(64), allowNull: false, primaryKey: true, },
      atributo: { type: DataTypes.STRING(128), allowNull: false, },
      color: { type: DataTypes.STRING(64), allowNull: false, },
      condicionante: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },      
      grupo_atributo: { type: DataTypes.STRING(64), allowNull: false, },
      factor: { type: DataTypes.INTEGER, allowNull: false, defaultValue:1 },
      pac: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },

    },
    {
      sequelize,
      modelName: 'u_is_atributo',
      timestamps: false,
      freezeTableName: true,
      tableName: 'u_is_atributo',
      classMethods: {},
    }
  )
  return u_is_atributo
}
