'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class uf_abastecimiento extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    
    }
  }
  uf_abastecimiento.init(
    {
        res_abas_id:{type: DataTypes.INTEGER(), allowNull: false, primaryKey: true, autoIncrement:true},
        create_date:{type: DataTypes.DATE, allowNull: true},
        last_modify_date_time:{type: DataTypes.DATE, allowNull: false},
        dni_register:{type: DataTypes.STRING(25), allowNull: true},
 
      cod_liname:{type: DataTypes.STRING(25), allowNull: true},
      fecha_vencimiento:{type: DataTypes.DATEONLY, allowNull: true},
      reg_sanitario:{type: DataTypes.STRING(128), allowNull: true},
      consumo_mensual:{type: DataTypes.DOUBLE, allowNull: false, defaultValue:0},
      ingresos:{type: DataTypes.DOUBLE, allowNull: false, defaultValue:0},
      egresos:{type: DataTypes.DOUBLE, allowNull: false, defaultValue:0},
      transferencias:{type: DataTypes.DOUBLE, allowNull: false, defaultValue:0},
      saldo_stock:{type: DataTypes.DOUBLE, allowNull: false, defaultValue:0},
      stock_periodo_anterior:{type: DataTypes.DOUBLE, allowNull: false, defaultValue:0},
      nro_lote:{type: DataTypes.STRING(128), allowNull: true},

      file_id:{type: DataTypes.STRING(64), allowNull: false},
      registro_id:{type: DataTypes.STRING(64), allowNull: false}
    },
    {
      sequelize,
      modelName: 'uf_abastecimiento',
      timestamps: false,
      freezeTableName: true,
      tableName: 'uf_abastecimiento',
      classMethods: {},
    }
  )
  return uf_abastecimiento
}
