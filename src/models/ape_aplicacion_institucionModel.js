'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ape_aplicacion_institucion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ape_aplicacion_institucion.init(
    {
      institucion_id: {
        type: DataTypes.STRING(64),
        allowNull: false, primaryKey: true
      },
      aplicacion_id: {
        type: DataTypes.STRING(64),
        allowNull: false
      },
      public_key: {
        type: DataTypes.STRING(64),
        allowNull: true
      },
      licence_key: {
        type: DataTypes.STRING(64),
        allowNull: true
      },
      license_date:{
        type: DataTypes.DATE,
    allowNull: true
  },
    l_no: { type: DataTypes.INTEGER, defaultValue: 10 },
    activo: {
    type: DataTypes.CHAR(1),
    allowNull: false, defaultValue: 'Y'
  },
    create_date: {
      type: DataTypes.DATE,
    allowNull: false
  },
    last_modify_date_time : {
      type: DataTypes.DATE,
    allowNull: true
  },  
    },
    {
      sequelize,
      modelName: 'ape_aplicacion_institucion',
      timestamps: false,
      freezeTableName: true,
      tableName: 'ape_aplicacion_institucion',
      classMethods: {},
    }
  )
  return ape_aplicacion_institucion
}
