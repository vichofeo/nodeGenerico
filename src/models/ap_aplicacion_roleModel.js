'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ap_aplicacion_role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ap_aplicacion_role.init(
    {
      role: { type: DataTypes.STRING(64), allowNull: false, primaryKey: true },
      aplicacion_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true },
      
      name_role: { type: DataTypes.STRING(128), allowNull: false },
      description: { type: DataTypes.STRING(500), allowNull: true },
      
      
      create_date: { type: DataTypes.DATE, allowNull: false },
      last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
      end_date: { type: DataTypes.DATEONLY, allowNull: true },
      activo: { type: DataTypes.CHAR(1), allowNull: false, defaultValue: 'Y' },
      
    },
    {
      sequelize,
      modelName: 'ap_aplicacion_role',
      timestamps: false,
      freezeTableName: true,
      tableName: 'ap_aplicacion_role',
      classMethods: {},
    }
  )
  return ap_aplicacion_role
}
