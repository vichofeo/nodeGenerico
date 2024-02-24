'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class apu_credencial_rol extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  apu_credencial_rol.init(
    {
      institucion_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, },
      aplicacion_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false,  },
      role: { type: DataTypes.STRING(64), allowNull: false,  },
      dni_persona: { type: DataTypes.STRING(25), allowNull: false,  },
            
      create_date: { type: DataTypes.DATE, allowNull: false },
      last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
      activo: { type: DataTypes.CHAR(1), allowNull: false, defaultValue: 'Y' },   
    },
    {
      sequelize,
      modelName: 'apu_credencial_rol',
      timestamps: false,
      freezeTableName: true,
      tableName: 'apu_credencial_rol',
      classMethods: {},
    }
  )
  return apu_credencial_rol
}
