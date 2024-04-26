'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class u_frm_evaluacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      u_frm_evaluacion.belongsTo(models.u_frm,{
        as:'frm',
        foreignKey: 'frm_id',
        targetKey: 'frm_id'
      }),
      u_frm_evaluacion.belongsTo(models.ae_institucion,{
        as:'eess',
        foreignKey: 'institucion_id',
        targetKey: 'institucion_id'
      })
      u_frm_evaluacion.belongsTo(models.r_is_atributo,{
        as:'tipo',
        foreignKey: 'tipo_acrehab',
        targetKey: 'atributo_id'
      }),
      u_frm_evaluacion.belongsTo(models.u_is_atributo,{
        as:'estado',
        foreignKey: 'concluido',
        targetKey: 'atributo_id'
      }),
      u_frm_evaluacion.belongsTo(models.au_persona,{
        as:'registerby',
        foreignKey: 'dni_register',
        targetKey: 'dni_persona'
      }),
      u_frm_evaluacion.hasMany(models.u_frm_evaluadores,{
        as:'evaluadores',
        foreignKey: 'evaluacion_id',
        targetKey: 'evaluacion_id'
      })

    }
  }
  u_frm_evaluacion.init(
    {
      evaluacion_id: { type: DataTypes.UUID, allowNull: false, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      institucion_id: { type: DataTypes.STRING(64), allowNull: false },
      tipo_acrehab: { type: DataTypes.STRING(64), allowNull: false },
      frm_id: { type: DataTypes.INTEGER, allowNull: false },
            
      concluido: { type: DataTypes.STRING(2), allowNull: false, defaultValue: '1' },
      excelencia: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      create_date: { type: DataTypes.DATE, allowNull: false },
      last_modify_date_time: { type: DataTypes.DATE, allowNull: true },      
      activo: { type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'Y' },
      dni_register: { type: DataTypes.STRING(25), allowNull: true }
    },
    {
      sequelize,
      modelName: 'u_frm_evaluacion',
      timestamps: false,
      freezeTableName: true,
      tableName: 'u_frm_evaluacion',
      classMethods: {},
    }
  )
  return u_frm_evaluacion
}
