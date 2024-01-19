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
    }
  }
  f_formulario.init(
    {
      formulario_id:{type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true},
      grupo_formulario_id:{type: DataTypes.STRING(64), allowNull: false},
      codigo_formulario:{type: DataTypes.STRING(25), allowNull: true},
      nombre_formulario:{type: DataTypes.STRING(150), allowNull: false},
      descripcion:{type: DataTypes.STRING(4000), allowNull: false},
      es_xpersona:{type: DataTypes.STRING(1), allowNull: false, defaultValue: 'N'},
      c_hh:{type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'N'},
      c_hv:{type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'N'},
      c_hlab:{type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'N'},
      c_cnts:{type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'N'},
      version:{type: DataTypes.INTEGER, allowNull: false, defaultValue: 1,},
      activo:{type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'Y'},
      dni_register:{type: DataTypes.STRING(25), allowNull: false},
      create_date:{type: DataTypes.DATE, allowNull: true},
      last_modify_date_time:{type: DataTypes.DATE, allowNull: false},
      cod_clase:{type: DataTypes.STRING(64), allowNull: false},
  
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
