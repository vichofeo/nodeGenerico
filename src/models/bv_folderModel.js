'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class bv_folder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      bv_folder.hasMany(models.bv_files, {
        as: 'files',
        foreignKey: 'folder_id'
      }),
      bv_folder.hasMany(models.bv_folder, {
        as:'folder_child',
        foreignKey: 'folder_root'
      })
    }
  }
  bv_folder.init(
    {
      folder_id:{ type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
      name_folder: { type: DataTypes.STRING(128), allowNull: true },
      folder_root: { type: DataTypes.INTEGER, allowNull: false, default:-1 },
      hashchild: { type: DataTypes.BOOLEAN, allowNull: false, default: false },
      group_folder: { type: DataTypes.STRING(128), allowNull: true, default: 'unknown' },
      activo: { type: DataTypes.CHAR(1), allowNull: false, defaultValue: 'Y' },
      create_date: { type: DataTypes.DATE, allowNull: true },
      last_modify_date_time: { type: DataTypes.DATE, allowNull: true },       
      dni_register: { type: DataTypes.STRING(25), allowNull: true },
    },
    {
      sequelize,
      modelName: 'bv_folder',
      timestamps: false,
      freezeTableName: true,
      tableName: 'bv_folder',
      classMethods: {},
    }
  )
  return bv_folder
}
