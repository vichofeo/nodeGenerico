'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class cr_actividad extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      cr_actividad.hasMany(models.cr_actividad_img, {
        as: 'act_img',
        foreignKey:'actividad_id'
      }),
      cr_actividad.hasMany(models.cr_actividad_personas, {
        as: 'act_per',
        foreignKey:'actividad_id'
      }),
      cr_actividad.hasMany(models.cr_actividad, {
        as: 'subactividad',
        foreignKey:'actividad_root'
      }),

      cr_actividad.belongsTo(models.r_is_atributo, {
        as: 'clase',
        foreignKey: 'clase_actividad'
      }),

      cr_actividad.belongsTo(models.r_is_atributo, {
        as: 'tipo',
        foreignKey: 'tipo_actividad'
      })
      
    }
  }
  cr_actividad.init(
    {
      actividad_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
      nombre_actividad: { type: DataTypes.STRING(128), allowNull: true, },
      codigo: { type: DataTypes.STRING(32), allowNull: true, },
      objetivo: { type: DataTypes.TEXT, allowNull: true },
      descripcion: { type: DataTypes.TEXT, allowNull: true, },
      narrativa: { type: DataTypes.TEXT, allowNull: true, },
      sede: { type: DataTypes.TEXT, allowNull: true, },
      //inicio_proyecto: { type: DataTypes.DATE, allowNull: true },
      //finalizacion: { type: DataTypes.DATE, allowNull: true },
      inicio_proyecto: { type: DataTypes.STRING(18), allowNull: true },
      finalizacion: { type: DataTypes.STRING(18), allowNull: true },
      full_dia: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      virtual: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      concluido: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
      create_date: { type: DataTypes.DATE, allowNull: true },
      last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
      activo: { type: DataTypes.CHAR(1), allowNull: false, defaultValue: 'Y' },
      authorized: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
      clase_actividad: { type: DataTypes.STRING(64), allowNull: true },
      tipo_actividad: { type: DataTypes.STRING(64), allowNull: true },
      institucion_id: { type: DataTypes.UUID, allowNull: true },
      dni_register: { type: DataTypes.STRING(25), allowNull: true },
      actividad_root: { type: DataTypes.INTEGER, allowNull: true },
            
    },
    {
      sequelize,
      modelName: 'cr_actividad',
      timestamps: false,
      freezeTableName: true,
      tableName: 'cr_actividad',
      classMethods: {},
    }
  )
  return cr_actividad
}
