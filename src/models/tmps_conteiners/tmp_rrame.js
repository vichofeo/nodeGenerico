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
      idx: { type: DataTypes.INTEGER(), allowNull: false, primaryKey: true, autoIncrement: true },

      numero: { type: DataTypes.STRING, allowNull: true },
      gestion_ingreso: { type: DataTypes.STRING, allowNull: true },
      gestion_ejecucion: { type: DataTypes.STRING, allowNull: true },
      ente_gestor_name: { type: DataTypes.STRING, allowNull: true },
      origen: { type: DataTypes.STRING, allowNull: true },
      rrame_no: { type: DataTypes.STRING, allowNull: true },
      auditor: { type: DataTypes.STRING, allowNull: true },
      caso: { type: DataTypes.STRING, allowNull: true },
      _a: { type: DataTypes.STRING, allowNull: true },
      _b: { type: DataTypes.STRING, allowNull: true },
      _c: { type: DataTypes.STRING, allowNull: true },
      _d: { type: DataTypes.STRING, allowNull: true },
      servicio: { type: DataTypes.STRING, allowNull: true },
      departamento: { type: DataTypes.STRING, allowNull: true },
      ciudad: { type: DataTypes.STRING, allowNull: true },

      fecha_emision: { type: DataTypes.DATEONLY, allowNull: true },
      notificacion_conclusion: { type: DataTypes.STRING, allowNull: true },

      swloadend: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      f_emision: { type: DataTypes.STRING, allowNull: true },

      hash: { type: DataTypes.STRING, allowNull: true, unique: true },
      hasher: { type: DataTypes.STRING, allowNull: true },
      dni_register: { type: DataTypes.STRING, allowNull: true },

      eg: { type: DataTypes.STRING, allowNull: true },
      dpto: { type: DataTypes.STRING, allowNull: true },
      eess: { type: DataTypes.STRING, allowNull: true },



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
