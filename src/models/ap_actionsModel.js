'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ap_actions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ap_actions.init(
    {
      action_id: { type: DataTypes.STRING(2) ,
      allowNull: false, primaryKey: true},
       accion:  {type: DataTypes.STRING(25) ,
      allowNull: false},
       nombre_accion:  {type: DataTypes.STRING(128) ,
      allowNull: false},
       orden: { type: DataTypes.INTEGER,
      allowNull: true},
       style:  {type: DataTypes.STRING(80),
      allowNull: true}, 
    },
    {
      sequelize,
      modelName: 'ap_actions',
      timestamps: false,
      freezeTableName: true,
      tableName: 'ap_actions',
      classMethods: {},
    }
  )
  return ap_actions
}
