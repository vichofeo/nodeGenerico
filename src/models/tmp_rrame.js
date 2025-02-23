'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class tmp_rrame extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tmp_rrame.init(
    {
      
      
      numero: {type: DataTypes.STRING, allowNull: true},
      gestion_ejecucion: {type: DataTypes.STRING, allowNull: true},
	ente_gestor_name: {type: DataTypes.STRING, allowNull: true},
	rrame_no: {type: DataTypes.STRING, allowNull: true},
	caso: {type: DataTypes.STRING, allowNull: true},
	establecimiento: {type: DataTypes.STRING, allowNull: true},
	servicio: {type: DataTypes.STRING, allowNull: true},
	departamento: {type: DataTypes.STRING, allowNull: true},
	fecha_emision: {type: DataTypes.DATEONLY, allowNull: true},
	notificacion_rrame: {type: DataTypes.STRING, allowNull: true},
	vacio: {type: DataTypes.TEXT, allowNull: true},     

      eg: { type: DataTypes.STRING, allowNull: true },
      dpto: { type: DataTypes.STRING, allowNull: true },
      eess: { type: DataTypes.STRING, allowNull: true },
      prd: { type: DataTypes.STRING, allowNull: true }

    },
    {
      sequelize,
      modelName: 'tmp_rrame',
      timestamps: false,
      freezeTableName: true,
      tableName: 'tmp_rrame',
      classMethods: {},
    }
  )
  return tmp_rrame
}
