'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class cr_actividad_img extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      cr_actividad_img.hasMany(models.cr_actividad_img_cnf, {
        as: 'act_img_cnf',
        foreignKey: 'img_id'
      })
    }
  }
  cr_actividad_img.init(
    {
      img_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true },
      actividad_id: { type: DataTypes.INTEGER, allowNull: true, },
      img: { type: DataTypes.TEXT, allowNull: false, },
      format_page: { type: DataTypes.STRING(32), allowNull: true, },
      orientation_page: { type: DataTypes.STRING(8), allowNull: true, },
      img_width: { type: DataTypes.INTEGER, allowNull: true, },
      img_heigth: { type: DataTypes.INTEGER, allowNull: true, },
      create_date: { type: DataTypes.DATE, allowNull: true },
      last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
      activo: { type: DataTypes.CHAR(1), allowNull: false, defaultValue: 'Y' },
      dni_register: { type: DataTypes.STRING(25), allowNull: true },
      orden: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },


    },
    {
      sequelize,
      modelName: 'cr_actividad_img',
      timestamps: false,
      freezeTableName: true,
      tableName: 'cr_actividad_img',
      classMethods: {},
    }
  )
  return cr_actividad_img
}
