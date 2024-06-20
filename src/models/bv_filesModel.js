'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class bv_files extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      bv_files.belongsTo(models.bv_folder, {
        as: 'folder_root',
        foreignKey: 'folder_id',
        targetKey: 'folder_id'
      })
    }
  }
  bv_files.init(
    {
      file_id:{ type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
      file_name: { type: DataTypes.STRING(128), allowNull: true },
      file_type: { type: DataTypes.STRING(128), allowNull: true },
      file_md5: { type: DataTypes.STRING(512), allowNull: true },
      file_description: { type: DataTypes.TEXT, allowNull: true },
      file_original_name: { type: DataTypes.TEXT, allowNull: true },
      folder_id: { type: DataTypes.INTEGER, allowNull: false },
      words: { type: DataTypes.STRING(512), allowNull: false },
      activo: { type: DataTypes.CHAR(1), allowNull: false, defaultValue: 'Y' },
      create_date: { type: DataTypes.DATE, allowNull: true },
      last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
      dni_register: { type: DataTypes.STRING(25), allowNull: true },
    },
    {
      sequelize,
      modelName: 'bv_files',
      timestamps: false,
      freezeTableName: true,
      tableName: 'bv_files',
      classMethods: {},
    }
  )
  return bv_files
}
