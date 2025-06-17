;('use strict')
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class f_formulario_img_cnf extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
    }
  }
  f_formulario_img_cnf.init(
    {
      cxy_id: {type: DataTypes.INTEGER,  allowNull: false,  primaryKey: true, autoIncrement: true, },

      img_id: { type: DataTypes.STRING(64), allowNull: true },
      cx: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10 },
      cy: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10 },
      align: { type: DataTypes.STRING, allowNull: true, defaultValue:'right' },

      max_length: { type: DataTypes.INTEGER, allowNull: true, defaultValue:null },
      sw_tipo: { type: DataTypes.INTEGER, allowNull: false, defaultValue:0 },
      
      formulario_id: { type: DataTypes.STRING(64), allowNull: true },
      subfrm_id: { type: DataTypes.STRING(64), allowNull: true },
      enunciado_id: { type: DataTypes.STRING(64), allowNull: true },
      opcion_id: { type: DataTypes.STRING(64), allowNull: true },
      tipo_enunciado_id: { type: DataTypes.INTEGER, allowNull: false },
      irow_ll: { type: DataTypes.INTEGER, allowNull: true, defaultValue: -1 },
      row_ll: { type: DataTypes.STRING(64), allowNull: true },
      col_ll: { type: DataTypes.STRING(64), allowNull: true },
      scol_ll: { type: DataTypes.STRING(64), allowNull: true },

      create_date: { type: DataTypes.DATE, allowNull: false },
      last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
      dni_register: { type: DataTypes.STRING(25), allowNull: true },
    },
    {
      sequelize,
      modelName: 'f_formulario_img_cnf',
      timestamps: false,
      freezeTableName: true,
      tableName: 'f_formulario_img_cnf',
      classMethods: {},
    }
  )
  return f_formulario_img_cnf
}
