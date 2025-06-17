'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class apu_usuario_log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  apu_usuario_log.init(
    {
      date_in: { type: DataTypes.DATE,   allowNull: false},
      ip_in:{ type: DataTypes.STRING(150) ,   allowNull: true},
       date_out: { type: DataTypes.DATE , allowNull: true},
       login: {type: DataTypes.STRING(25) ,     allowNull: true},
       institucion_id:  {type: DataTypes.STRING(64) ,  allowNull: true},
       dni_persona: {type: DataTypes.STRING(25) ,     allowNull: true},
       aplicacion_id:  {type: DataTypes.STRING(64) ,    allowNull: true},       
    },
    {
      sequelize,
      modelName: 'apu_usuario_log',
      timestamps: false,
      freezeTableName: true,
      tableName: 'apu_usuario_log',
      classMethods: {},
    }
  )
  apu_usuario_log.removeAttribute("id");
  return apu_usuario_log
}
