'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class au_persona extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  au_persona.init(
    {
      dni_persona: { type: DataTypes.STRING(25) , 
 allowNull: false, primaryKey: true},
	tipo_dni: { type: DataTypes.STRING(64),
 allowNull: true},
	
	dni_complemento: { type: DataTypes.STRING(20),
 allowNull: true},
	dni_alterno: { type: DataTypes.STRING(25),
 allowNull: true},
	primer_apellido: { type: DataTypes.STRING(50) ,
 allowNull: false},
	segundo_apellido: { type: DataTypes.STRING(50),
 allowNull: true},
	casada_apellido: { type: DataTypes.STRING(50),
 allowNull: true},
	nombres: { type: DataTypes.STRING(128),
 allowNull: true},
	iniciales: { 
 type: DataTypes.CHAR(10),
 allowNull: true},
	fecha_nacimiento: { type: DataTypes.DATEONLY,
 allowNull: false},
	telefono: { type: DataTypes.STRING(15),
 allowNull: true},
	movil: {type: DataTypes.STRING(20),
 allowNull: true},
	direccion: { type: DataTypes.STRING(200),
 allowNull: true},
	zona: { type: DataTypes.STRING(200),
 allowNull: true},
	codigo_postal: { type: DataTypes.STRING(10),
 allowNull: true},
	telefono_referencia: { type: DataTypes.STRING(15),
 allowNull: true},
	movil_referencia: { type: DataTypes.STRING(20),
 allowNull: true},
	mail: { type: DataTypes.STRING(80) ,
 allowNull: false},
	sexo: { type: DataTypes.STRING(2) ,
 allowNull: false},
	nal : {
 type: DataTypes.CHAR(1) , 
 allowNull: false, defaultValue:'Y'},
	confirmado:  {type: DataTypes.INTEGER , 
 allowNull: false, defaultValue:0},
	cod_pais: { type: DataTypes.STRING(4),
 allowNull: true},
	cod_dpto: { type: DataTypes.STRING(10),
 allowNull: true},
	cod_municipio: { type: DataTypes.STRING(10),
 allowNull: true},
	dni_register: { type: DataTypes.STRING(25),
 allowNull: true},
	activo : {
 type: DataTypes.CHAR(1) ,
 allowNull: false, defaultValue:'Y'},
	create_date:  {type: DataTypes.DATE, 
 allowNull: false},
	last_modify_date_time: { type: DataTypes.DATE,
 allowNull: true},  
    },
    {
      sequelize,
      modelName: 'au_persona',
      timestamps: false,
      freezeTableName: true,
      tableName: 'au_persona',
      classMethods: {},
    }
  )
  return au_persona
}
