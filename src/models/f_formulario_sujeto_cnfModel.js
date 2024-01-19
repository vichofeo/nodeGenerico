'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class f_formulario_sujeto_cnf extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  f_formulario_sujeto_cnf.init(
    {
      frm_reg_sujeto_id:{type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true},
      formulario_id:{type: DataTypes.STRING(64), allowNull: true},      
      dni_sujeto:{type: DataTypes.STRING(25), allowNull: true},
      hora_in:{type: DataTypes.DATE, allowNull: false},
      fecha_reporte:{type: DataTypes.DATEONLY , allowNull: false},
      fecha_notificacion:{type: DataTypes.DATEONLY , allowNull: false},
      fecha_ini_sintomas:{type: DataTypes.DATEONLY , allowNull: false},
      fecha_infectado:{type: DataTypes.DATEONLY , allowNull: false},
      hora_out:{type: DataTypes.DATE, allowNull: false},
      concluido:{type: DataTypes.INTEGER, allowNull: true, defaultValue: 0},
      create_date:{type: DataTypes.DATE, allowNull: true},
      last_modify_date_time:{type: DataTypes.DATE, allowNull: false},
      dni_register:{type: DataTypes.STRING(25), allowNull: false},
      pais_infectado:{type: DataTypes.STRING(4), allowNull: true},
      dpto_infectado:{type: DataTypes.STRING(10), allowNull: true},
      muni_infectado:{type: DataTypes.STRING(10), allowNull: true},
      ciudad_localidad:{type: DataTypes.STRING(128), allowNull: true},
      zona_barrio:{type: DataTypes.STRING(1024), allowNull: false},
      deceso:{type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'N'},
      positivo:{type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'N'},
      institucion_id:{type: DataTypes.STRING(64), allowNull: true},
      
        
    },
    {
      sequelize,
      modelName: 'f_formulario_sujeto_cnf',
      timestamps: false,
      freezeTableName: true,
      tableName: 'f_formulario_sujeto_cnf',
      classMethods: {},
    }
  )
  return f_formulario_sujeto_cnf
}
