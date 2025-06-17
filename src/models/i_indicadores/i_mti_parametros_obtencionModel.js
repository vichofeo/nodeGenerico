'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class i_mti_parametros_obtencion extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    i_mti_parametros_obtencion.init(
        {

            institucion_id: { type: DataTypes.STRING(64), allowNull: false },
            indicador_id: { type: DataTypes.STRING(64), allowNull: false },
            parametro_id: { type: DataTypes.STRING(5), allowNull: false },
            
            obtencion: { type: DataTypes.TEXT, allowNull: true },            
            por_parametro: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
            
            activo: { type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'Y' },
            create_date: { type: DataTypes.DATE, allowNull: true },
            last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
            dni_register: { type: DataTypes.STRING(25), allowNull: false },


        },
        {
            sequelize,
            modelName: 'i_mti_parametros_obtencion',
            timestamps: false,
            freezeTableName: true,
            tableName: 'i_mti_parametros_obtencion',
            classMethods: {},
        }
    )
    return i_mti_parametros_obtencion
}
