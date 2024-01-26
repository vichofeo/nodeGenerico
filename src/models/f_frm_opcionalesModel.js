'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class f_frm_opcionales extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      f_frm_opcionales.belongsTo(models.f_frm_opcionales_tipo,{
        as: 'frm',
        foreignKey: 'tipo_opcion_id',
        targetKey:'tipo_opcion_id'
      }),
      f_frm_opcionales.belongsTo(models.f_formulario,{
        as: 'formulario',
        foreignKey: 'formulario_id',
        targetKey:'formulario_id'
      })
    }
  }
  f_frm_opcionales.init(
    {
      formulario_id:{type: DataTypes.STRING(64), allowNull: false, primaryKey: true},
      tipo_opcion_id:{type: DataTypes.STRING(8), allowNull: false, primaryKey: true},
      create_date:{type: DataTypes.DATE, allowNull: false},
      last_modify_date_time:{type: DataTypes.DATE, allowNull: false},
      activo:{type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'Y'},
      
        
    },
    {
      sequelize,
      modelName: 'f_frm_opcionales',
      timestamps: false,
      freezeTableName: true,
      tableName: 'f_frm_opcionales',
      classMethods: {},
    }
  )
  return f_frm_opcionales
}
