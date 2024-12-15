'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class uf_liname_pref extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
    }
  }
  uf_liname_pref.init(
    {
        cod_liname:{type: DataTypes.STRING(25), allowNull: false, primaryKey: true},
        gestion:{type: DataTypes.INTEGER, allowNull: false, primaryKey: true},
        
        create_date:{type: DataTypes.DATE, allowNull: true},
        last_modify_date_time:{type: DataTypes.DATE, allowNull: false},
        dni_register:{type: DataTypes.STRING(25), allowNull: true},
        activo: { type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'Y' },

      //institucion_id:{type: DataTypes.STRING(64), allowNull: true},    
      precio: {type: DataTypes.DOUBLE, allowNull: true},       
      
    },
    {
      sequelize,
      modelName: 'uf_liname_pref',
      timestamps: false,
      freezeTableName: true,
      tableName: 'uf_liname_pref',
      classMethods: {},
    }
  )
  return uf_liname_pref
}
