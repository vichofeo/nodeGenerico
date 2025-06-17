'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class i_mti_valor_parametro extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    i_mti_valor_parametro.init(
        {

            cod_evaluacion: { type: DataTypes.STRING(64), allowNull: false, primaryKey: true },
            indicador_id: { type: DataTypes.STRING(64), allowNull: false, primaryKey: true },
            parametro_id: { type: DataTypes.STRING(5), allowNull: false, primaryKey: true },

            valor_nume: { type: DataTypes.DOUBLE, allowNull: true },
            valor_anum: { type: DataTypes.STRING(4000), allowNull: true },
            ip: { type: DataTypes.STRING(25), allowNull: true },



            create_date: { type: DataTypes.DATE, allowNull: true },
            last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
            dni_register: { type: DataTypes.STRING(25), allowNull: false },


        },
        {
            sequelize,
            modelName: 'i_mti_valor_parametro',
            timestamps: false,
            freezeTableName: true,
            tableName: 'i_mti_valor_parametro',
            classMethods: {},
        }
    )
    return i_mti_valor_parametro
}
