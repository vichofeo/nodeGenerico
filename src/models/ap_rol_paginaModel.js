'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ap_rol_pagina extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ap_rol_pagina.init(
    {
      aplicacion_id: { type: DataTypes.STRING(64) ,
      allowNull: false, primaryKey: true},
       rol_id:  {type: DataTypes.STRING(64) ,
      allowNull: false, primaryKey: true},
       modulo_id: { type: DataTypes.STRING(64) ,
      allowNull: false, primaryKey: true},
       controller: { type: DataTypes.STRING(50) ,
      allowNull: false , primaryKey: true},
       action_id: { type: DataTypes.STRING(2) ,
      allowNull: false},
       activo : {
      type: DataTypes.CHAR(1), defaultValue: 'Y'},
       create_date: { type: DataTypes.DATE , 
      allowNull: true},
       last_modify_date_time: {type: DataTypes.DATE, 
      allowNull: true},
    },
    {
      sequelize,
      modelName: 'ap_rol_pagina',
      timestamps: false,
      freezeTableName: true,
      tableName: 'ap_rol_pagina',
      classMethods: {},
    }
  )
  return ap_rol_pagina
}
