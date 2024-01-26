'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class f_frm_enun_opciones extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      f_frm_enun_opciones.belongsTo(models.f_frm_enunciado, {
        as:'enunciado',
        foreignKey:'enunciado_id',
        targetKey:'enunciado_id'
      })
    }
  }
  f_frm_enun_opciones.init(
    {      
      opcion_id:{type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true},
      enunciado_id:{type: DataTypes.STRING(64), allowNull: false, primaryKey: true},
      subfrm_id:{type: DataTypes.STRING(64), allowNull: false, primaryKey: true},
      formulario_id:{type: DataTypes.STRING(64), allowNull: false, primaryKey: true},
            

      tipo_enunciado_id:{type: DataTypes.INTEGER, allowNull: true},
      respuesta:{type: DataTypes.TEXT, allowNull: true},
      peso:{type: DataTypes.INTEGER, allowNull: false, defaultValue: 1},
      orden:{type: DataTypes.INTEGER, allowNull: true, defaultValue: 0},
      esDecision:{type: DataTypes.CHAR(1), allowNull: false, defaultValue: 0},
      esMultiplicador:{type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
      activo:{type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'Y'},
      dni_register:{type: DataTypes.STRING(25), allowNull: false},
      create_date:{type: DataTypes.DATE, allowNull: true},
      last_modify_date_time:{type: DataTypes.DATE, allowNull: false},
    },
    {
      sequelize,
      modelName: 'f_frm_enun_opciones',
      timestamps: false,
      freezeTableName: true,
      tableName: 'f_frm_enun_opciones',
      classMethods: {},
    }
  )
  return f_frm_enun_opciones
}
