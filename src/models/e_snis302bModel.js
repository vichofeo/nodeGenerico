'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class e_snis302b extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here

        }
    }
    e_snis302b.init(
        {

            idx: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
            create_date: { type: DataTypes.DATE, allowNull: true },
            last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
            dni_register: { type: DataTypes.STRING(25), allowNull: true },
            formulario: { type: DataTypes.STRING, allowNull: true },
            grupo: { type: DataTypes.STRING, allowNull: true },
            gvariable: {type: DataTypes.STRING, allowNull: false}, 
            variable: { type: DataTypes.STRING, allowNull: true },
            subvariable: { type: DataTypes.STRING, allowNull: true },
            lugar_atencion: { type: DataTypes.STRING, allowNull: true },
            valor: { type: DataTypes.INTEGER, allowNull: true },
            hash: { type: DataTypes.STRING, allowNull: true, unique: true },
            hasher: { type: DataTypes.STRING, allowNull: true },
            swloadend: { type: DataTypes.STRING, allowNull: true, defaultValue: false },

            file_id: { type: DataTypes.STRING(64), allowNull: false },
            registro_id: { type: DataTypes.STRING(64), allowNull: false }
        },
        {
            sequelize,
            modelName: 'e_snis302b',
            timestamps: false,
            freezeTableName: true,
            tableName: 'e_snis302b',
            classMethods: {},
        }
    )
    return e_snis302b
}
