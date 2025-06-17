'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class i_mti_formula_calculo extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    i_mti_formula_calculo.init(
        {

            formula_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true },
            indicador_id: { type: DataTypes.STRING(64), allowNull: false },
            formula_teorica: { type: DataTypes.STRING(120), allowNull: false },
            formula_obtencion: { type: DataTypes.TEXT, allowNull: true },
            condicion_obtencion: { type: DataTypes.TEXT, allowNull: true },



            activo: { type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'Y' },
            create_date: { type: DataTypes.DATE, allowNull: true },
            last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
            dni_register: { type: DataTypes.STRING(25), allowNull: false },


        },
        {
            sequelize,
            modelName: 'i_mti_formula_calculo',
            timestamps: false,
            freezeTableName: true,
            tableName: 'i_mti_formula_calculo',
            classMethods: {},
        }
    )
    return i_mti_formula_calculo
}
