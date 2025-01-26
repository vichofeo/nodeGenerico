'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class tmp_carmelo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tmp_carmelo.init(
    {
      idx: { type: DataTypes.INTEGER(), allowNull: false, primaryKey: true, autoIncrement:true },
      ente_gestor_name: {type: DataTypes.STRING, allowNull: true}, 
      departamento: {type: DataTypes.STRING, allowNull: true}, 
      regional: {type: DataTypes.STRING, allowNull: true}, 
      establecimiento: {type: DataTypes.STRING, allowNull: true}, 
      nivel_atencion: {type: DataTypes.STRING, allowNull: true}, 
      fecha_dispensacion: {type: DataTypes.DATEONLY, allowNull: true}, 
      paciente: {type: DataTypes.STRING, allowNull: true}, 
      matricula: {type: DataTypes.STRING, allowNull: true}, 
      genero: {type: DataTypes.STRING, allowNull: true}, 
      edad: {type: DataTypes.STRING, allowNull: true}, 
      cantidad_dispensada: {type: DataTypes.STRING, allowNull: true}, 
      no_receta: {type: DataTypes.STRING, allowNull: true}, 
      especialidad: {type: DataTypes.STRING, allowNull: true}, 
      diagnostico: {type: DataTypes.STRING, allowNull: true}, 
      observacion: {type: DataTypes.STRING, allowNull: true}, 
      ente_gestor: {type: DataTypes.STRING, allowNull: true},

      swloadend: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
      f_dispensacion: { type: DataTypes.STRING, allowNull: true },
      f_edad: { type: DataTypes.STRING, allowNull: true },
      f_genero: { type: DataTypes.STRING, allowNull: true },
      
      hash: { type: DataTypes.STRING, allowNull: true, unique: true },
      hasher: { type: DataTypes.STRING, allowNull: true },
      dni_register: { type: DataTypes.STRING, allowNull: true },

      eg: { type: DataTypes.STRING, allowNull: true },
      dpto: { type: DataTypes.STRING, allowNull: true },
      eess: { type: DataTypes.STRING, allowNull: true },
      prd: { type: DataTypes.STRING, allowNull: true }

    },
    {
      sequelize,
      modelName: 'tmp_carmelo',
      timestamps: false,
      freezeTableName: true,
      tableName: 'tmp_carmelo',
      classMethods: {},
    }
  )
  return tmp_carmelo
}
