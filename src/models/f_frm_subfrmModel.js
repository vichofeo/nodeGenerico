'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class f_frm_subfrm extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      f_frm_subfrm.hasMany(models.f_frm_enunciado,{
        as:'questions',
        foreignKey: 'subfrm_id'
      }),
      f_frm_subfrm.belongsTo(models.f_formulario,{
        as: 'formulario',
        foreignKey:'formulario_id',
        targetKey:'formulario_id'
      })
    }
  }
  f_frm_subfrm.init(
    {      
      
      subfrm_id:{type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: true, primaryKey: true},
      formulario_id:{type: DataTypes.STRING(64), allowNull: true, primaryKey: true},
      codigo:{type: DataTypes.STRING(10), allowNull: true},
      nombre_subfrm:{type: DataTypes.STRING(200), allowNull: false},
      descripcion:{type: DataTypes.STRING(4000), allowNull: true},
      orden:{type: DataTypes.INTEGER, allowNull: true, defaultValue: 0},
      version:{type: DataTypes.INTEGER, allowNull: true, defaultValue: 1},
      es_plantilla:{type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'N'},
      activo:{type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'Y'},
      dni_register:{type: DataTypes.STRING(25), allowNull: false},
      create_date:{type: DataTypes.DATE, allowNull: false},
      last_modify_date_time:{type: DataTypes.DATE, allowNull: true}
        
    },
    {
      sequelize,
      modelName: 'f_frm_subfrm',
      timestamps: false,
      freezeTableName: true,
      tableName: 'f_frm_subfrm',
      classMethods: {},
    }
  )
  return f_frm_subfrm
}
