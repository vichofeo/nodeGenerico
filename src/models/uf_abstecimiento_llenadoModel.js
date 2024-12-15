'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class uf_abstecimiento_llenado extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
     
      uf_abstecimiento_llenado.belongsTo(models.uf_abastecimiento_registro,{
        as:'aregis',
        foreignKey: 'registro_id'
      })    
      
    }
  }
  uf_abstecimiento_llenado.init(
    {
        res_abas_id:{type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true},
        create_date:{type: DataTypes.DATE, allowNull: true},
        last_modify_date_time:{type: DataTypes.DATE, allowNull: false},
        dni_register:{type: DataTypes.STRING(25), allowNull: true},

      //institucion_id:{type: DataTypes.STRING(64), allowNull: true},    
      registro_id: {type: DataTypes.STRING(64), allowNull: true},       
      cod_liname:{type: DataTypes.STRING(25), allowNull: true},
      
      nro_reg_sanitario:{type: DataTypes.STRING(128), allowNull: true},
      nro_lote:{type: DataTypes.STRING(128), allowNull: true},
            
      
      stock:{type: DataTypes.DOUBLE, allowNull: false, defaultValue:0},
      consumo_promedio:{type: DataTypes.DOUBLE, allowNull: false, defaultValue:0},
      saldo:{type: DataTypes.DOUBLE, allowNull: false, defaultValue:0},
      
      obs:{type: DataTypes.TEXT, allowNull: true},
      

 
      
      concluido: { type: DataTypes.STRING(2), allowNull: false, defaultValue: '1' },
      
 
        
    },
    {
      sequelize,
      modelName: 'uf_abstecimiento_llenado',
      timestamps: false,
      freezeTableName: true,
      tableName: 'uf_abstecimiento_llenado',
      classMethods: {},
    }
  )
  return uf_abstecimiento_llenado
}
