'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ap_roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ap_roles.belongsTo(models.ap_aplicacion,
				{
					as: 'aplicacion',
					foreignKey: 'aplicacion_id'
				}
			);

    }
  }
  ap_roles.init(
    {
      aplicacion_id: {
        type: DataTypes.STRING(64),
        allowNull: false,
        primaryKey: true,
      },
      rol_id: {
        type: DataTypes.STRING(64),
        allowNull: false,
        primaryKey: true,
      },
      nombre_rol: { type: DataTypes.STRING(128), allowNull: false },
      descripcion_rol: { type: DataTypes.STRING(500), allowNull: true },
      create_date: { type: DataTypes.DATE, allowNull: false },
      last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
      end_date: { type: DataTypes.DATE, allowNull: true },
      activo: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 'Y',
      },
    },
    {
      sequelize,
      modelName: 'ap_roles',
      timestamps: false,
      freezeTableName: true,
      tableName: 'ap_roles',
      classMethods: {},
    }
  )
  return ap_roles
}
