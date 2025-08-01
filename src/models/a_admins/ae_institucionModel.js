'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ae_institucion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ae_institucion.belongsTo(models.al_departamento, {
        as: 'dpto',
        foreignKey: 'cod_dpto',
        targetKey: 'cod_dpto'
      }),
        ae_institucion.belongsToMany(
          models.ap_aplicacion, {
          as: "appis",
          through: { model: models.ape_aplicacion_institucion, unique: false },//'Parent_Child',
          foreignKey: 'institucion_id'
        }),
        ae_institucion.hasMany(models.ape_aplicacion_institucion, {
          as: 'appi',
          foreignKey: 'institucion_id'
        }),
      //User.belongsToMany(Role, { as: 'Roles', through: { model: UserRole, unique: false }, foreignKey: 'user_id' });
      ae_institucion.hasMany(models.ae_institucion, {
        as:'children',
        foreignKey: 'institucion_root'
      }),
      ae_institucion.belongsTo(models.ae_institucion, {
        as:'father',
        foreignKey:'institucion_root',
        targetKey: 'institucion_id'
      }),
      //link con actividades
      ae_institucion.hasMany(models.cr_actividad, {
        as: 'actividad',
        foreignKey: 'institucion_id'
      }),
      //link fr_registro
      ae_institucion.hasMany(models.f_formulario_registro, {
        as: 'frmreg',
        foreignKey: 'institucion_id'
      })      
    }
  }
  ae_institucion.init(
    {
      institucion_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true },
      id_fk: { type: DataTypes.STRING(64), allowNull: false },
      nombre_institucion: { type: DataTypes.STRING(80), allowNull: false },
      nombre_corto: { type: DataTypes.STRING(10), allowNull: false },
      telefono: { type: DataTypes.STRING(15), allowNull: true },
      telefono_emergencia: { type: DataTypes.STRING(15), allowNull: true },
      correo_electronico: { type: DataTypes.STRING(64), allowNull: true },
      direccion_web: { type: DataTypes.STRING(128), allowNull: true },
      fecha_creacion: { type: DataTypes.DATE, allowNull: true },
      fecha_actividades: { type: DataTypes.DATE, allowNull: true },

      cod_pais: { type: DataTypes.STRING(4), allowNull: true },
      cod_dpto: { type: DataTypes.STRING(10), allowNull: true },
      cod_municipio: { type: DataTypes.STRING(10), allowNull: true },
      ciudad: { type: DataTypes.STRING(64), allowNull: true },
      avenida_calle: { type: DataTypes.STRING(128), allowNull: true },
      zona_barrio: { type: DataTypes.STRING(128), allowNull: true },
      latitud: { type: DataTypes.DOUBLE, allowNull: true },
      longitud: { type: DataTypes.DOUBLE, allowNull: true },
      dni_register: { type: DataTypes.STRING(25), allowNull: true },
      activo: { type: DataTypes.CHAR(1), allowNull: false, defaultValue: 'Y' },
      create_date: { type: DataTypes.DATE, allowNull: true },
      last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
      institucion_root: { type: DataTypes.STRING(64), allowNull: true },
      parent_grp_id: { type: DataTypes.STRING(64), allowNull: true },
      root: { type: DataTypes.STRING(64), allowNull: true },
      tipo_institucion_id: { type: DataTypes.STRING(64), allowNull: false },
      es_unidad:{type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false}
    },
    {
      sequelize,
      modelName: 'ae_institucion',
      timestamps: false,
      freezeTableName: true,
      tableName: 'ae_institucion',
      classMethods: {},
    }
  )
  return ae_institucion
}
