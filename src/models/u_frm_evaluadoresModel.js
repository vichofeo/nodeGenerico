'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class u_frm_evaluadores extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      u_frm_evaluadores.belongsTo(models.au_persona,{
        as:'evaluador',
        foreignKey: 'dni_evaluador',
        targetKey: 'dni_persona'
      })
    }
  }
  u_frm_evaluadores.init(
    {
      evaluacion_id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },      
      frm_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
      dni_evaluador: { type: DataTypes.STRING(25), allowNull: true, primaryKey: true },
            
      create_date: { type: DataTypes.DATE, allowNull: false },
      last_modify_date_time: { type: DataTypes.DATE, allowNull: true },      
      activo: { type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'Y' },
      dni_register: { type: DataTypes.STRING(25), allowNull: true }
    },
    {
      sequelize,
      modelName: 'u_frm_evaluadores',
      timestamps: false,
      freezeTableName: true,
      tableName: 'u_frm_evaluadores',
      classMethods: {},
    }
  )
  return u_frm_evaluadores
}
