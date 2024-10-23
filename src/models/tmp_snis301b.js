'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class tmp_snis301b extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tmp_snis301b.init(
    {
      idx: { type: DataTypes.INTEGER(), allowNull: false, primaryKey: true, autoIncrement:true },
            

      gestion: {type: DataTypes.INTEGER, allowNull: false},
    mes: {type: DataTypes.STRING, allowNull: false},
    departamento: {type: DataTypes.STRING, allowNull: true}, 
    provincia: {type: DataTypes.STRING, allowNull: true}, 
    red: {type: DataTypes.STRING, allowNull: true}, 
    municipio: {type: DataTypes.STRING, allowNull: true}, 
    
    ente_gestor: {type: DataTypes.STRING, allowNull: false}, 
    establecimiento: {type: DataTypes.STRING, allowNull: false}, 
    cue: {type: DataTypes.STRING, allowNull: true}, 
    nivel: {type: DataTypes.STRING, allowNull: true}, 
    area: {type: DataTypes.STRING, allowNull: true}, 
    tipo: {type: DataTypes.STRING, allowNull: true}, 
    
    formulario: {type: DataTypes.STRING, allowNull: false}, 
    grupo: {type: DataTypes.STRING, allowNull: false}, 
    lugar_atencion: {type: DataTypes.STRING, allowNull: true}, 
    variable: {type: DataTypes.STRING, allowNull: false}, 
    subvariable: {type: DataTypes.STRING, allowNull: false}, 
    valor: {type: DataTypes.INTEGER, allowNull: false}, 
    swloadend: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
          
      hash: { type: DataTypes.STRING, allowNull: true, unique: true },
      hasher: { type: DataTypes.STRING, allowNull: true },
      dni_register: { type: DataTypes.STRING, allowNull: true }
    },
    {
      sequelize,
      modelName: 'tmp_snis301b',
      timestamps: false,
      freezeTableName: true,
      tableName: 'tmp_snis301b',
      classMethods: {},
    }
  )
  return tmp_snis301b
}
