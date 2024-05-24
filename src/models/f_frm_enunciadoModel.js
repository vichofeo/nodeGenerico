'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class f_frm_enunciado extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      f_frm_enunciado.belongsTo(models.f_frm_subfrm, {
        as: 'subfrm',
        foreignKey: 'subfrm_id',
        targetKey:'subfrm_id'
      }),
      f_frm_enunciado.hasMany(models.f_frm_enun_opciones, {
        as:'answers',
        foreignKey: 'enunciado_id',
        targetKey: 'enunciado_id'
      }),
      f_frm_enunciado.hasMany(models.f_frm_enunciado, {
        as:'questions',
        foreignKey: 'enunciado_root'
      }),

      f_frm_enunciado.belongsTo(models.r_is_gr_atributo, {
        as: 'mrow',
        foreignKey: 'row_code',
        targetKey:'grupo_atributo'
      }),
      f_frm_enunciado.belongsTo(models.r_is_gr_atributo, {
        as: 'mcol',
        foreignKey: 'col_code',
        targetKey:'grupo_atributo'
      }),
      f_frm_enunciado.belongsTo(models.r_is_gr_atributo, {
        as: 'mscol',
        foreignKey: 'scol_code',
        targetKey:'grupo_atributo'
      })
    }
  }
  f_frm_enunciado.init(
    {
      enunciado_id:{type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true},
      formulario_id:{type: DataTypes.STRING(64), allowNull: false, primaryKey: true},
      subfrm_id:{type: DataTypes.STRING(64), allowNull: false, primaryKey: true},      
      

      tipo_enunciado_id:{type: DataTypes.INTEGER, allowNull: true},

      codigo:{type: DataTypes.STRING(10), allowNull: true},
      enunciado:{type: DataTypes.TEXT, allowNull: true},
      orden:{type: DataTypes.INTEGER, allowNull: true, defaultValue: 0},
      activo:{type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'Y'},

      create_date:{type: DataTypes.DATE, allowNull: false},
      last_modify_date_time:{type: DataTypes.DATE, allowNull: true},
      dni_register:{type: DataTypes.STRING(25), allowNull: false},
      
      enunciado_root:{type: DataTypes.STRING(64), allowNull: true},

      row_code:{type: DataTypes.STRING(64), allowNull: true},
      col_code:{type: DataTypes.STRING(64), allowNull: true},
      scol_code:{type: DataTypes.STRING(64), allowNull: true},

      row_title:{type: DataTypes.STRING(512), allowNull: true},
      col_title:{type: DataTypes.STRING(512), allowNull: true},

      repeat_row:{type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false} ,
      repeat:{type: DataTypes.STRING(64), allowNull: true, defaultValue:0},
      
        
    },
    {
      sequelize,
      modelName: 'f_frm_enunciado',
      timestamps: false,
      freezeTableName: true,
      tableName: 'f_frm_enunciado',
      classMethods: {},
    }
  )
  return f_frm_enunciado
}
