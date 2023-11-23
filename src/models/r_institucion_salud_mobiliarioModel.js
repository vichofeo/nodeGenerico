'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class r_institucion_salud_mobiliario extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    r_institucion_salud_mobiliario.init(
        {
            registro_id: { type: DataTypes.STRING(64), allowNull: false, primaryKey: true},
            institucion_id: { type: DataTypes.STRING(64), allowNull: true },
            atributo_id: { type: DataTypes.STRING(64), allowNull: true },
            fuente_financiamiento: { type: DataTypes.STRING(64), allowNull: true },
            servicio: { type: DataTypes.STRING(64), allowNull: true },
            descripcion: { type: DataTypes.STRING(4000), allowNull: true },
            cantidad: { type: DataTypes.INTEGER, allowNull: true },
            estado: { type: DataTypes.STRING(64), allowNull: true },
            funcionamiento: { type: DataTypes.STRING(64), allowNull: true },
            anio_compra: { type: DataTypes.INTEGER, allowNull: true },
            observaciones: { type: DataTypes.STRING(4000), allowNull: true },
            create_date: { type: DataTypes.DATE, allowNull: true },
            last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
            activo: { type: DataTypes.CHAR(1), allowNull: false, defaultValue: 'Y' },
            dni_register: { type: DataTypes.STRING(25), allowNull: true },
            tipo_registro: { type: DataTypes.STRING(64), allowNull: true },

        },
        {
            sequelize,
            modelName: 'r_institucion_salud_mobiliario',
            timestamps: false,
            freezeTableName: true,
            tableName: 'r_institucion_salud_mobiliario',
            classMethods: {},
        }
    )
    return r_institucion_salud_mobiliario
}
