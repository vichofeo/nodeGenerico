'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class tmp_hemofilia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tmp_hemofilia.init(
    {
    ente_gestor_name: {type: DataTypes.STRING, allowNull: true}, 
    departamento:{type: DataTypes.STRING, allowNull: true}, 
    establecimiento:{type: DataTypes.STRING, allowNull: true}, 
    edad:{type: DataTypes.DOUBLE, allowNull: true}, 
    genero:{type: DataTypes.STRING, allowNull: true}, 
    tipo_hemofilia:{type: DataTypes.STRING, allowNull: true}, 
    tipo_hemorragia: {type: DataTypes.STRING, allowNull: true}, 
    tratamiento_casa:{type: DataTypes.STRING, allowNull: true},

    swloadend: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },


    
    },
    {
      sequelize,
      modelName: 'tmp_hemofilia',
      timestamps: false,
      freezeTableName: true,
      tableName: 'tmp_hemofilia',
      classMethods: {},
    }
  )
  tmp_hemofilia.removeAttribute("id");
  return tmp_hemofilia
}
