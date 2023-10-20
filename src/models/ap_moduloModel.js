'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ap_modulo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ap_modulo.init(
    {
      modulo_id: { type: DataTypes.STRING(64),  
      allowNull: false, primaryKey: true},
       path_page: { type: DataTypes.STRING(128) ,
      allowNull: false},
       nombre_modulo: { type: DataTypes.STRING(50), 
      allowNull: false},
       layout: { type: DataTypes.STRING(128) ,
      allowNull: false},
       folder_base: { type: DataTypes.STRING(30),
      allowNull: true},
       descripcion_modulo: { type: DataTypes.STRING(250) , 
      allowNull: true},
       orden: { type: DataTypes.INTEGER ,
      allowNull: false , defaultValue: 0},
       icon: { type: DataTypes.STRING(45),
      allowNull: true},
       visible : {
      type: DataTypes.CHAR(1) , 
      allowNull: false , defaultValue: 'Y'}, 
    },
    {
      sequelize,
      modelName: 'ap_modulo',
      timestamps: false,
      freezeTableName: true,
      tableName: 'ap_modulo',
      classMethods: {},
    }
  )
  return ap_modulo
}
