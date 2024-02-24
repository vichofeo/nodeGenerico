'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ap_module extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ap_module.init(
    {
      module: { type: DataTypes.STRING(64), allowNull: false, primaryKey: true },
      name_module: { type: DataTypes.STRING(50), allowNull: false },      
      icon: { type: DataTypes.BLOB, allowNull: true },
      layout: { type: DataTypes.STRING(128), allowNull: true },
      description: { type: DataTypes.STRING(500), allowNull: true },

      orden: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },      
      
      create_date: { type: DataTypes.DATE, allowNull: false },
      activo: { type: DataTypes.CHAR(1), allowNull: false, defaultValue: 'Y' }, 
    },
    {
      sequelize,
      modelName: 'ap_module',
      timestamps: false,
      freezeTableName: true,
      tableName: 'ap_module',
      classMethods: {},
    }
  )
  return ap_module
}
