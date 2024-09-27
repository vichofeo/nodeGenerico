'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class tmp_pacientes extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    tmp_pacientes.init(
        {
            idx: { type: DataTypes.INTEGER(), allowNull: false, primaryKey: true, autoIncrement: true },
            fecha_registro: { type: DataTypes.DATEONLY, allowNull: true },
            mail_origen: { type: DataTypes.STRING, allowNull: true },
            ente_gestor: { type: DataTypes.STRING, allowNull: true },
            paciente: { type: DataTypes.STRING, allowNull: true },
            edad: { type: DataTypes.INTEGER, allowNull: true },
            ci: { type: DataTypes.STRING, allowNull: true },
            diagnostico: { type: DataTypes.STRING, allowNull: true },
            conducta: { type: DataTypes.STRING, allowNull: true },
            establecimiento: { type: DataTypes.STRING, allowNull: true },

            f_registro: { type: DataTypes.STRING, allowNull: true },
            f_edad: { type: DataTypes.STRING, allowNull: true },
            swloadend: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },


            hash: { type: DataTypes.STRING, allowNull: true, unique: true },
            hasher: { type: DataTypes.STRING, allowNull: true },
            dni_register: { type: DataTypes.STRING, allowNull: true }
        },
        {
            sequelize,
            modelName: 'tmp_pacientes',
            timestamps: false,
            freezeTableName: true,
            tableName: 'tmp_pacientes',
            classMethods: {},
        }
    )
    return tmp_pacientes
}
