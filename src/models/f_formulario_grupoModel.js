'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class f_formulario_grupo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  f_formulario_grupo.init(
    {
      grupo_formulario_id:{type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true},
      nombre_grupo_formulario:{type: DataTypes.STRING(80), allowNull: false},
      descripcion:{type: DataTypes.STRING(4000), allowNull: false},
      activo:{type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'Y'},
      create_date:{type: DataTypes.DATE, allowNull: true},
      last_modify_date_time:{type: DataTypes.DATE, allowNull: false},
      dni_register:{type: DataTypes.STRING(25), allowNull: false},
      aplicacion_id:{type: DataTypes.STRING(64), allowNull: true},
      
        
    },
    {
      sequelize,
      modelName: 'f_formulario_grupo',
      timestamps: false,
      freezeTableName: true,
      tableName: 'f_formulario_grupo',
      classMethods: {},
    }
  )
  return f_formulario_grupo
}
