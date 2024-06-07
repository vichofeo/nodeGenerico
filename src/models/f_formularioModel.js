'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class f_formulario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //1:n 
      f_formulario.hasMany(models.f_frm_subfrm, {
        as: 'sections',
        foreignKey: 'formulario_id',
      }),
      /*f_formulario.hasMany(models.f_frm_opcionales, {
        as: 'others',
        foreignKey: 'formulario_id',
      }),*/
      f_formulario.belongsTo(models.f_formulario_clase,{
        as: 'clase',
        foreignKey: 'cod_clase',
        targetKey: 'cod_clase'
      }),
      f_formulario.belongsTo(models.f_formulario_grupo, {
        as:'grupo',
        foreignKey:'grupo_formulario_id',
        targetKey: 'grupo_formulario_id'
      })
    }
  }
  f_formulario.init(
    {
      formulario_id:{type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true},
      grupo_formulario_id:{type: DataTypes.STRING(64), allowNull: false},
      cod_clase:{type: DataTypes.STRING(64), allowNull: false},
      codigo_formulario:{type: DataTypes.STRING(25), allowNull: true},
      nombre_formulario:{type: DataTypes.STRING(150), allowNull: false},
      descripcion:{type: DataTypes.STRING(4000), allowNull: true},
      ordenanza:{type: DataTypes.TEXT, allowNull: true},

      es_xpersona:{type: DataTypes.STRING(1), allowNull: false, defaultValue: 'N'},
      
      version:{type: DataTypes.INTEGER, allowNull: false, defaultValue: 1,},
      activo:{type: DataTypes.CHAR(1), allowNull: false, defaultValue: 'Y'},
      dni_register:{type: DataTypes.STRING(25), allowNull: false},
      create_date:{type: DataTypes.DATE, allowNull: false},
      last_modify_date_time:{type: DataTypes.DATE, allowNull: true},
      
  
    },
    {
      sequelize,
      modelName: 'f_formulario',
      timestamps: false,
      freezeTableName: true,
      tableName: 'f_formulario',
      classMethods: {},
    }
  )
  return f_formulario
}
