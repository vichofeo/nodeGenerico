'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class e_nutri_mama extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  e_nutri_mama.init(
    {
      idx: { type: DataTypes.INTEGER(), allowNull: false, primaryKey: true, autoIncrement:true },
      ente_gestor: {type: DataTypes.STRING, allowNull: true}, 
      departamento: {type: DataTypes.STRING, allowNull: true}, 
      municipio: {type: DataTypes.STRING, allowNull: true}, 
      establecimiento: {type: DataTypes.STRING, allowNull: true}, 
      nivel_atencion: {type: DataTypes.STRING, allowNull: true}, 
      fecha_dispensacion: {type: DataTypes.DATEONLY, allowNull: true}, 
      paciente: {type: DataTypes.STRING, allowNull: true}, 
      matricula: {type: DataTypes.STRING, allowNull: true}, 
      semana_gestacion: {type: DataTypes.STRING, allowNull: true}, 
      edad: {type: DataTypes.STRING, allowNull: true}, 
      cantidad_dispensada: {type: DataTypes.STRING, allowNull: true}, 
      no_receta: {type: DataTypes.STRING, allowNull: true}, 
      especialidad: {type: DataTypes.STRING, allowNull: true}, 
      diagnostico: {type: DataTypes.STRING, allowNull: true}, 
      observacion: {type: DataTypes.STRING, allowNull: true}, 
      
      swloadend: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
      f_dispensacion: { type: DataTypes.STRING, allowNull: true },
      f_edad: { type: DataTypes.STRING, allowNull: true },
      f_sgestacion: { type: DataTypes.STRING, allowNull: true },
      
      hash: { type: DataTypes.STRING, allowNull: true, unique: true },
      hasher: { type: DataTypes.STRING, allowNull: true },
      dni_register: { type: DataTypes.STRING, allowNull: true },

      file_id: { type: DataTypes.STRING(64), allowNull: false },
      registro_id: { type: DataTypes.STRING(64), allowNull: false },

      create_date: { type: DataTypes.DATE, allowNull: true },
      last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
      dni_register: { type: DataTypes.STRING(25), allowNull: true }

    },
    {
      sequelize,
      modelName: 'e_nutri_mama',
      timestamps: false,
      freezeTableName: true,
      tableName: 'e_nutri_mama',
      classMethods: {},
    }
  )
  return e_nutri_mama
}
