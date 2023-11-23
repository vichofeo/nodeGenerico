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
			dni_persona: { type: DataTypes.STRING(25), allowNull: false, primaryKey: true },
			dni: { type: DataTypes.STRING(25), allowNull: true },
			dni_complemento: { type: DataTypes.STRING(20), allowNull: true },
			tipo_dni: { type: DataTypes.STRING(64), allowNull: true },
			dni_alterno: { type: DataTypes.STRING(25), allowNull: true },
			fecha_nacimiento: { type: DataTypes.DATEONLY, allowNull: true },
			primer_apellido: { type: DataTypes.STRING(50), allowNull: true },
			segundo_apellido: { type: DataTypes.STRING(50), allowNull: true },
			casada_apellido: { type: DataTypes.STRING(50), allowNull: true },
			nombres: { type: DataTypes.STRING(128), allowNull: true },
			iniciales: { type: DataTypes.STRING(10), allowNull: true },
			estado_civil: { type: DataTypes.STRING(64), allowNull: true },
			genero: { type: DataTypes.STRING(64), allowNull: true },
			nacionalidad: { type: DataTypes.STRING(64), allowNull: true },
			discapacidad: { type: DataTypes.STRING(64), allowNull: true },
			telefono: { type: DataTypes.STRING(15), allowNull: true },
			movil: { type: DataTypes.STRING(20), allowNull: true },
			direccion: { type: DataTypes.STRING(200), allowNull: true },
			zona: { type: DataTypes.STRING(200), allowNull: true },
			telefono_referencia: { type: DataTypes.STRING(15), allowNull: true },
			movil_referencia: { type: DataTypes.STRING(20), allowNull: true },
			mail: { type: DataTypes.STRING(80), allowNull: true },
			confirmado: { type: DataTypes.INTEGER, allowNull: true },
			cod_pais: { type: DataTypes.STRING(4), allowNull: true },
			cod_dpto: { type: DataTypes.STRING(10), allowNull: true },
			cod_municipio: { type: DataTypes.STRING(10), allowNull: true },
			dni_register: { type: DataTypes.STRING(25), allowNull: true },
			activo: { type: DataTypes.STRING(1), allowNull: true },
			create_date: { type: DataTypes.DATE, allowNull: true },
			last_modify_date_time: { type: DataTypes.DATE, allowNull: true },

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
