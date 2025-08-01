'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class tmp_ames extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tmp_ames.init(
    {
      idx: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },

      numero: { type: DataTypes.STRING, allowNull: true },
      auditor: { type: DataTypes.STRING, allowNull: true },
      no_ame: { type: DataTypes.STRING, allowNull: true },
      caso: { type: DataTypes.STRING, allowNull: true },
      genero: { type: DataTypes.STRING, allowNull: true },
      edad: { type: DataTypes.STRING, allowNull: true },
      por_fallecimiento: { type: DataTypes.STRING, allowNull: true },
      solicitante: { type: DataTypes.STRING, allowNull: true },
      tipo_solicitud: { type: DataTypes.STRING, allowNull: true },
      gestion_solicitud: { type: DataTypes.STRING, allowNull: true },
      gestion_ejecucion: { type: DataTypes.STRING, allowNull: true },
      departamento: { type: DataTypes.STRING, allowNull: true },
      ciudad: { type: DataTypes.STRING, allowNull: true },
      ente_gestor_name: { type: DataTypes.STRING, allowNull: true },
      establecimiento: { type: DataTypes.STRING, allowNull: true },
      servicio: { type: DataTypes.STRING, allowNull: true },
      art_63: { type: DataTypes.STRING, allowNull: true },
      art_642: { type: DataTypes.STRING, allowNull: true },
      art_644: { type: DataTypes.STRING, allowNull: true },
      fecha_emision: { type: DataTypes.DATEONLY, allowNull: true },
      cronograma: { type: DataTypes.DATEONLY, allowNull: true },
      notificacion_legitimador: { type: DataTypes.STRING, allowNull: true },
      notificacion_msyd: { type: DataTypes.STRING, allowNull: true },
      seguimiento: { type: DataTypes.STRING, allowNull: true },
      apelacion: { type: DataTypes.STRING, allowNull: true },
      segimiento_2: { type: DataTypes.STRING, allowNull: true },
      observacion: { type: DataTypes.STRING, allowNull: true },


      swloadend: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      f_emision: { type: DataTypes.STRING, allowNull: true },
      f_cronograma: { type: DataTypes.STRING, allowNull: true },
      f_edad: { type: DataTypes.STRING, allowNull: true },


      hash: { type: DataTypes.STRING, allowNull: true, unique: true },
      hasher: { type: DataTypes.STRING, allowNull: true },
      dni_register: { type: DataTypes.STRING, allowNull: true },

      eg: { type: DataTypes.STRING, allowNull: true },
      dpto: { type: DataTypes.STRING, allowNull: true },
      eess: { type: DataTypes.STRING, allowNull: true },




    },
    {
      sequelize,
      modelName: 'tmp_ames',
      timestamps: false,
      freezeTableName: true,
      tableName: 'tmp_ames',
      classMethods: {},
    }
  )
  return tmp_ames
}
