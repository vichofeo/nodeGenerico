'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class uf_liname extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      uf_liname.hasMany(models.uf_liname_pref,{
        as:'abaprecios',
        foreignKey: 'cod_liname',
        targetKey: 'cod_liname'
      })

    }
  }
  uf_liname.init(
    {
        cod_liname: { type: DataTypes.STRING(25), allowNull: false, primaryKey: true },
        grupo: { type: DataTypes.STRING(4), allowNull: false },
        variable: { type: DataTypes.STRING(4), allowNull: false },
        subvariable: { type: DataTypes.STRING(4), allowNull: false },
            
        medicamento: { type: DataTypes.STRING(120), allowNull: false, defaultValue: '1' },
        forma_farmaceutica: { type: DataTypes.STRING(120), allowNull: false},
        concentracion: { type: DataTypes.STRING(56), allowNull: false },
        clasificacion_atq: { type: DataTypes.STRING(56), allowNull: false },      
        uso_restringido: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
        aclaracion: { type: DataTypes.STRING, allowNull: true }
    },
    {
      sequelize,
      modelName: 'uf_liname',
      timestamps: false,
      freezeTableName: true,
      tableName: 'uf_liname',
      classMethods: {},
    }
  )
  return uf_liname
}
