'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class upf_file_grupo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    
    }
  }
  upf_file_grupo.init(
    {
        grupo_file_id: { type: DataTypes.UUID, allowNull: false, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
        nombre_grupo_file:{type: DataTypes.STRING(128), allowNull: false},
        activo: { type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'Y' },
        create_date: { type: DataTypes.DATE, allowNull: false },
        last_modify_date_time: { type: DataTypes.DATE, allowNull: false },
        aplicacion_id:{type: DataTypes.STRING(128), allowNull: false},

    },
    {
      sequelize,
      modelName: 'upf_file_grupo',
      timestamps: false,
      freezeTableName: true,
      tableName: 'upf_file_grupo',
      classMethods: {},
    }
  )
  return upf_file_grupo
}
