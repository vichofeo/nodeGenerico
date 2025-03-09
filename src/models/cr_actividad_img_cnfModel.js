'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class cr_actividad_img_cnf extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here      

    }
  }
  cr_actividad_img_cnf.init(
    {
      mcxy_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true },
      create_date: { type: DataTypes.DATE, allowNull: true },
      last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
      activo: { type: DataTypes.CHAR(1), allowNull: false, defaultValue: 'Y' },
      dni_register: { type: DataTypes.STRING(25), allowNull: true },
      img_id: { type: DataTypes.STRING(64), allowNull: true },
      clave: { type: DataTypes.STRING(32), allowNull: true },
      cx: { type: DataTypes.INTEGER, allowNull: true, },
      cy: { type: DataTypes.INTEGER, allowNull: true, },
      align: { type: DataTypes.STRING(10), allowNull: true },


    },
    {
      sequelize,
      modelName: 'cr_actividad_img_cnf',
      timestamps: false,
      freezeTableName: true,
      tableName: 'cr_actividad_img_cnf',
      classMethods: {},
    }
  )
  return cr_actividad_img_cnf
}
