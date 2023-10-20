'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ap_controller extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ap_controller.init(
    {
      controller: { type: DataTypes.STRING(50) ,
      allowNull: false, primaryKey: true},
       nombre_submodulo: { type: DataTypes.STRING(50) ,
      allowNull: false},
       path_page: { type: DataTypes.STRING(80),
      allowNull: true},
       descripcion_submodulo: { type: DataTypes.STRING(250) ,
      allowNull: false},
       base_folder: { type: DataTypes.STRING(25),
      allowNull: true},
       orden : {type: DataTypes.INTEGER ,
      allowNull: false , defaultValue:  0},
    },
    {
      sequelize,
      modelName: 'ap_controller',
      timestamps: false,
      freezeTableName: true,
      tableName: 'ap_controller',
      classMethods: {},
    }
  )
  return ap_controller
}
