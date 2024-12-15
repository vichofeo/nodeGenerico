'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class uf_abastecimiento_institucion_cnf extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here      
    }
  }
  uf_abastecimiento_institucion_cnf.init(
    {
      institucion_id:{type: DataTypes.STRING(64), allowNull: false, primaryKey: true},
      opcional:{type: DataTypes.INTEGER, allowNull: true},

      activo:{type: DataTypes.CHAR(1), allowNull: false, defaultValue: 'Y'},      
      dni_register:{type: DataTypes.STRING(25), allowNull: false},
      create_date:{type: DataTypes.DATE, allowNull: false},
      last_modify_date_time:{type: DataTypes.DATE, allowNull: true}, 
      
      limite_dia:{type: DataTypes.INTEGER, allowNull: false, defaultValue:8},
      limite_plus:{type: DataTypes.INTEGER, allowNull: false, defaultValue:10},

      revision_dia:{type: DataTypes.INTEGER, allowNull: false, defaultValue:15},      
      revision_plus:{type: DataTypes.INTEGER, allowNull: false, defaultValue:17},
      opening_delay:{type: DataTypes.STRING, allowNull: true, defaultValue:null},
    },
    {
      sequelize,
      modelName: 'uf_abastecimiento_institucion_cnf',
      timestamps: false,
      freezeTableName: true,
      tableName: 'uf_abastecimiento_institucion_cnf',
      classMethods: {},
    }
  )
  return uf_abastecimiento_institucion_cnf
}
