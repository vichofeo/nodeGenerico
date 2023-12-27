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
        allowNull: false,
        primaryKey: true,
      },
      codigo: {
        type: DataTypes.STRING(16),
        allowNull: false,
      },
      snis: {
        type: DataTypes.CHAR(1),
        allowNull: true,
      },
      ente_gestor_id: {
        type: DataTypes.STRING(64),
        allowNull: true,
      },
      tipo_red_id: {
        type: DataTypes.STRING(64),
        allowNull: true,
      },
      clase: {
        type: DataTypes.STRING(64),
        allowNull: true,
      },
      nivel_atencion: {
        type: DataTypes.STRING(64),
        allowNull: true,
      },
      subsector: {
        type: DataTypes.STRING(64),
        allowNull: true,
      },
      urbano_rural: {
        type: DataTypes.STRING(64),
        allowNull: true,
      },

      nit: {
        type: DataTypes.STRING(24),
        allowNull: true,
      },
      no_ra: {
        type: DataTypes.STRING(24),
        allowNull: true,
      },
      accesibilidad_eess: {
        type: DataTypes.STRING(64),
        allowNull: true,
      },
      carretera_eess: {
        type: DataTypes.STRING(64),
        allowNull: true,
      },

      dni_register: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      activo: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 'Y',
      },
      create_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      last_modify_date_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      //servicios basicos
      cableado_red: { type: DataTypes.STRING(64), allowNull: true },
      internet: { type: DataTypes.STRING(64), allowNull: true },
      empresa_internet: { type: DataTypes.STRING(64), allowNull: true },
      financiamiento_internet: { type: DataTypes.STRING(64), allowNull: true },
      tipo_internet: { type: DataTypes.STRING(64), allowNull: true },

      con_energia: { type: DataTypes.STRING(64), allowNull: true },
      energia_electrica: { type: DataTypes.STRING(64), allowNull: true },
      tipo_energia: { type: DataTypes.STRING(64), allowNull: true },
      sistema_iluminacion: { type: DataTypes.STRING(64), allowNull: true },

      conexion_gas: { type: DataTypes.STRING(64), allowNull: true },
      agua: { type: DataTypes.STRING(64), allowNull: true },
      tratamiento_agua: { type: DataTypes.STRING(64), allowNull: true },
      alcantarillado: { type: DataTypes.STRING(64), allowNull: true },
      del_excretas: { type: DataTypes.STRING(64), allowNull: true },

      telefonia_fija: { type: DataTypes.STRING(64), allowNull: true },
      telefonia_movil: { type: DataTypes.STRING(64), allowNull: true },

      central_oxigeno: { type: DataTypes.STRING(64), allowNull: true },
      gas_medicinal: { type: DataTypes.STRING(64), allowNull: true },
      filtro_aire: { type: DataTypes.STRING(64), allowNull: true },
      climatizacion: { type: DataTypes.STRING(64), allowNull: true },

      taller_mantenimiento: { type: DataTypes.STRING(64), allowNull: true },
      taller_reparacion: { type: DataTypes.STRING(64), allowNull: true },
      deposito_combustible: { type: DataTypes.STRING(64), allowNull: true },

      otras_instalaciones: { type: DataTypes.STRING(4000), allowNull: true },

      //tipo atencion establecimiento
      camilla_emergencia: { type: DataTypes.INTEGER, allowNull: true },
      camas_obs_emergencia: { type: DataTypes.INTEGER, allowNull: true },
      camas_obs_preparto: { type: DataTypes.INTEGER, allowNull: true },
      camas_internacion: { type: DataTypes.INTEGER, allowNull: true },
      camas_uti: { type: DataTypes.INTEGER, allowNull: true },
      camas_uti_neonatal: { type: DataTypes.INTEGER, allowNull: true },
      camas_uci: { type: DataTypes.INTEGER, allowNull: true },
      camas_uci_neonatal: { type: DataTypes.INTEGER, allowNull: true },
      atencion_horario: { type: DataTypes.STRING(64), allowNull: true },
      atencion_horas: { type: DataTypes.STRING(64), allowNull: true },

      //caracteristicas superficie
      ccaracteristicas_terreno: { type: DataTypes.STRING(64), allowNull: true },
      canio_construccion: { type: DataTypes.INTEGER, allowNull: true }, 
      csuperficie_construida: { type: DataTypes.DOUBLE, allowNull: true },
      csuperficie_circulacion: { type: DataTypes.DOUBLE, allowNull: true },
      csuperficie_total: { type: DataTypes.DOUBLE, allowNull: true },
      csuperficie_terreno: { type: DataTypes.DOUBLE, allowNull: true }, 
      cpisos : { type: DataTypes.INTEGER, allowNull: true }, 
      cascensor: { type: DataTypes.STRING(64), allowNull: true }, 
      crampas: { type: DataTypes.STRING(64), allowNull: true }, 
      cplano_aprobado: { type: DataTypes.STRING(64), allowNull: true }, 
      cplan_mantenimiento: { type: DataTypes.STRING(64), allowNull: true },
      cescalera_emergencia: { type: DataTypes.STRING(64), allowNull: true },
      cparqueo: { type: DataTypes.STRING(64), allowNull: true },

      //estructura establecimeinto
      estructura_estado: { type: DataTypes.STRING(64), allowNull: true },
      estructura_base: { type: DataTypes.STRING(64), allowNull: true },
      estructura_techo: { type: DataTypes.STRING(64), allowNull: true },
      estructura_piso: { type: DataTypes.STRING(64), allowNull: true },
      estructura_tipo_pared: { type: DataTypes.STRING(4000), allowNull: true },
      estructura_acabado_interior: { type: DataTypes.STRING(64), allowNull: true },
      estructura_acabado_exterior: { type: DataTypes.STRING(64), allowNull: true },


      //propietario
      pro_nit: { type: DataTypes.STRING(64), allowNull: true },
    pro_razon_social: { type: DataTypes.STRING(128), allowNull: true },
    pro_direccion: { type: DataTypes.STRING(4000), allowNull: true },
    pro_telefono:  { type: DataTypes.STRING(64), allowNull: true },
    pro_fax:  { type: DataTypes.STRING(64), allowNull: true },
    pro_pag_web:  { type: DataTypes.STRING(128), allowNull: true },
    pro_correo_electronico:  { type: DataTypes.STRING(64), allowNull: true },


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
