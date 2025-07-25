'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class i_mti_parametros extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    i_mti_parametros.init(
        {


            indicador_id: { type: DataTypes.STRING(64), allowNull: false, primaryKey: true },
            parametro_id: { type: DataTypes.STRING(5), allowNull: false, primaryKey: true },
            nombre_parametro: { type: DataTypes.STRING(250), allowNull: true },
            unidad_medida: { type: DataTypes.STRING(64), allowNull: true },
            es_formula: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
            formula: { type: DataTypes.STRING(128), allowNull: true },
            es_numerico: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: true },


            activo: { type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'Y' },
            create_date: { type: DataTypes.DATE, allowNull: true },
            last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
            dni_register: { type: DataTypes.STRING(25), allowNull: false },


        },
        {
            sequelize,
            modelName: 'i_mti_parametros',
            timestamps: false,
            freezeTableName: true,
            tableName: 'i_mti_parametros',
            classMethods: {},
        }
    )
    return i_mti_parametros
}
