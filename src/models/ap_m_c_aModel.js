'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ap_m_c_a extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ap_m_c_a.belongsTo(models.ap_modulo, {
        as: 'modulo',
        foreignKey: 'modulo_id',
      })
      ap_m_c_a.belongsTo(models.ap_controller, {
        as: 'submodulo',
        foreignKey: 'controller',
      })
      ap_m_c_a.belongsTo(models.ap_actions, {
        as: 'actions',
        foreignKey: 'action_id',
      })
    }
  }
  ap_m_c_a.init(
    {
      modulo_id: {
        type: DataTypes.STRING(64),
        allowNull: false,
        primaryKey: true,
      },
      controller: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true,
      },
      action_id: {
        type: DataTypes.STRING(2),
        allowNull: false,
        primaryKey: true,
      },
      activo: {
        type: DataTypes.CHAR(1),
        defaultValue: 'Y',
      },
      create_date: { type: DataTypes.DATE, allowNull: true },
      padre: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      sequelize,
      modelName: 'ap_m_c_a',
      timestamps: false,
      freezeTableName: true,
      tableName: 'ap_m_c_a',
      classMethods: {},
    }
  )
  return ap_m_c_a
}
