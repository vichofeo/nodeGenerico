'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class r_institucion_salud extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  r_institucion_salud.init(
    {
      institucion_id: {
        type: DataTypes.STRING(64),
        allowNull: false, primaryKey: true,
      },
      codigo: {
        type: DataTypes.STRING(16),
        allowNull: false
      },
      snis: {
        type: DataTypes.CHAR(1),
        allowNull: true
      },
      ente_gestor_id: {
        type: DataTypes.STRING(64),
        allowNull: true
      },
      tipo_red_id: {
        type: DataTypes.STRING(64),
        allowNull: true
      },
      clase: {
        type: DataTypes.STRING(64),
        allowNull: true
      },
      nivel_atencion: {
        type: DataTypes.STRING(64),
        allowNull: true
      },
      subsector: {
        type: DataTypes.STRING(64),
        allowNull: true
      },
      urbano_rural: {
        type: DataTypes.DATE,
        allowNull: true
      },

      nit: {
        type: DataTypes.STRING(24),
        allowNull: true
      },
      no_ra: {
        type: DataTypes.STRING(24),
        allowNull: true
      },
      accesibilidad_eess: {
        type: DataTypes.STRING(64),
        allowNull: true
      },
      carretera_eess: {
        type: DataTypes.STRING(64),
        allowNull: true
      },
      
      dni_register: {
        type: DataTypes.STRING(25),
        allowNull: true
      },
      activo: {
        type: DataTypes.CHAR(1),
        allowNull: false, defaultValue: 'Y'
      },
      create_date: {
        type: DataTypes.DATE,
        allowNull: true
      },
      last_modify_date_time: {
        type: DataTypes.DATE,
        allowNull: true
      },
       
    },
    {
      sequelize,
      modelName: 'r_institucion_salud',
      timestamps: false,
      freezeTableName: true,
      tableName: 'r_institucion_salud',
      classMethods: {},
    }
  )
  return r_institucion_salud
}
