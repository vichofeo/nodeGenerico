'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ap_routes_cnf extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ap_routes_cnf.init(
    {
      idx: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
      aplicacion_id: { type: DataTypes.UUID,  allowNull: false, unique: true },
      role: { type: DataTypes.STRING(32), allowNull: false, unique: true },
      module: { type: DataTypes.STRING(32), allowNull: false, unique: true },
      component: { type: DataTypes.STRING(32), allowNull: false, unique: true },      
      
      create_date: { type: DataTypes.DATE, allowNull: false },
      activo: { type: DataTypes.CHAR(1), allowNull: false, defaultValue: 'Y' },   
    },
    {
      sequelize,
      modelName: 'ap_routes_cnf',
      timestamps: false,
      freezeTableName: true,
      tableName: 'ap_routes_cnf',
      classMethods: {},
    }
  )
  return ap_routes_cnf
}
