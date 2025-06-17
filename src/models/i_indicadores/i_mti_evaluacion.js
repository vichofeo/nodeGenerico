'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class i_mti_evaluacion extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    i_mti_evaluacion.init(
        {
            cod_evaluacion: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true },
            gestion: { type: DataTypes.INTEGER, allowNull: false },
            periodo: { type: DataTypes.STRING(10), allowNull: false },
            observaciones: { type: DataTypes.TEXT, allowNull: true },
            comentarios: { type: DataTypes.TEXT, allowNull: true },

            institucion_id: { type: DataTypes.STRING(64), allowNull: false },
            formula_periodo: { type: DataTypes.STRING(64), allowNull: true },
            formula_anual: { type: DataTypes.STRING(64), allowNull: true },
            formula_semestre: { type: DataTypes.STRING(64), allowNull: true },
            indicador_id: { type: DataTypes.STRING(64), allowNull: false },
            nivel_referencia_id: { type: DataTypes.STRING(64), allowNull: false },


            create_date: { type: DataTypes.DATE, allowNull: true },
            last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
            dni_register: { type: DataTypes.STRING(25), allowNull: false },


        },
        {
            sequelize,
            modelName: 'i_mti_evaluacion',
            timestamps: false,
            freezeTableName: true,
            tableName: 'i_mti_evaluacion',
            classMethods: {},
        }
    )
    return i_mti_evaluacion
}
