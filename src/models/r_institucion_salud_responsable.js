'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class r_institucion_salud_responsable extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    r_institucion_salud_responsable.init(
        {
            responsable_id: { type: DataTypes.STRING(64), allowNull: false, primaryKey: true },
            institucion_id: { type: DataTypes.STRING(64), allowNull: true },
            dni_persona: { type: DataTypes.STRING(25), allowNull: true },
            profesion_ocupacion: { type: DataTypes.STRING(64), allowNull: true },
            matricula_profesional: { type: DataTypes.STRING(64), allowNull: true },
            create_date: { type: DataTypes.DATE, allowNull: true },
            last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
            activo: { type: DataTypes.CHAR(1), allowNull: false, defaultValue: 'Y' },
            dni_register: { type: DataTypes.STRING(25), allowNull: true },
        },
        {
            sequelize,
            modelName: 'r_institucion_salud_responsable',
            timestamps: false,
            freezeTableName: true,
            tableName: 'r_institucion_salud_responsable',
            classMethods: {},
        }
    )
    return r_institucion_salud_responsable
}
