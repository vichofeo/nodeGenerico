'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class f_formulario_llenado extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  f_formulario_llenado.init(
    {
      res_frm_id:{type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true},
      
      institucion_id:{type: DataTypes.STRING(64), allowNull: true},      
      formulario_id:{type: DataTypes.STRING(64), allowNull: true},
      subfrm_id:{type: DataTypes.STRING(64), allowNull: true},
      enunciado_id:{type: DataTypes.STRING(64), allowNull: true},      
      opcion_id:{type: DataTypes.STRING(64), allowNull: true},

            
      texto:{type: DataTypes.TEXT, allowNull: false},
      peso:{type: DataTypes.INTEGER, allowNull: false},
      
      create_date:{type: DataTypes.DATE, allowNull: true},
      last_modify_date_time:{type: DataTypes.DATE, allowNull: false},
      dni_register:{type: DataTypes.STRING(25), allowNull: true},

      row_ll:{type: DataTypes.STRING(64), allowNull: true},
      col_ll:{type: DataTypes.STRING(64), allowNull: true},
      scol_ll:{type: DataTypes.STRING(64), allowNull: true},
      
      
        
    },
    {
      sequelize,
      modelName: 'f_formulario_llenado',
      timestamps: false,
      freezeTableName: true,
      tableName: 'f_formulario_llenado',
      classMethods: {},
    }
  )
  return f_formulario_llenado
}
