'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class i_mti_nivel_ref extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    i_mti_nivel_ref.init(
        {

            nivel_referencia_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true },
            indicador_id: { type: DataTypes.STRING(64), allowNull: false },
            definicion: { type: DataTypes.TEXT, allowNull: true },
            nivel_referencia: { type: DataTypes.DECIMAL(10, 4), allowNull: true },

            activo: { type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'Y' },
            create_date: { type: DataTypes.DATE, allowNull: true },
            last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
            dni_register: { type: DataTypes.STRING(25), allowNull: false },


        },
        {
            sequelize,
            modelName: 'i_mti_nivel_ref',
            timestamps: false,
            freezeTableName: true,
            tableName: 'i_mti_nivel_ref',
            classMethods: {},
        }
    )
    return i_mti_nivel_ref
}
