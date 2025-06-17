'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class i_indicador_tipo extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    i_indicador_tipo.init(
        {
            cod_tipo_indicador: { type: DataTypes.STRING(10), allowNull: false, primaryKey: true },
            nombre_tipo_indicador: { type: DataTypes.STRING(120), allowNull: false },

            activo: { type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'Y' },
            create_date: { type: DataTypes.DATE, allowNull: true },
            last_modify_date_time: { type: DataTypes.DATE, allowNull: true },


        },
        {
            sequelize,
            modelName: 'i_indicador_tipo',
            timestamps: false,
            freezeTableName: true,
            tableName: 'i_indicador_tipo',
            classMethods: {},
        }
    )
    return i_indicador_tipo
}
