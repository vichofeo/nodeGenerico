'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ap_component extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ap_component.init(
    {
      component: { type: DataTypes.STRING(64), allowNull: false, primaryKey: true },
      route_access: { type: DataTypes.STRING(50), allowNull: false },      
      name_component: { type: DataTypes.STRING(80), allowNull: true },
      base_folder: { type: DataTypes.STRING(80), allowNull: false },
      prop: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },

      description: { type: DataTypes.STRING(500), allowNull: true },
      root: { type: DataTypes.STRING(64), allowNull: true,  },
      
      create_date: { type: DataTypes.DATE, allowNull: false },
      activo: { type: DataTypes.CHAR(1), allowNull: false, defaultValue: 'Y' },
    },
    {
      sequelize,
      modelName: 'ap_component',
      timestamps: false,
      freezeTableName: true,
      tableName: 'ap_component',
      classMethods: {},
    }
  )
  return ap_component
}
