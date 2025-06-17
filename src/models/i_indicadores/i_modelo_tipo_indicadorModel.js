'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class i_modelo_tipo_indicador extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    i_modelo_tipo_indicador.init(
        {
            indicador_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true },
            cod_tipo_indicador: { type: DataTypes.STRING(10), allowNull: false },
            modelo_id: { type: DataTypes.STRING(64), allowNull: false },
            nombre_indicador: { type: DataTypes.STRING(512), allowNull: false },
            abrev: { type: DataTypes.STRING(20), allowNull: true },
            objetivo_indicador: { type: DataTypes.TEXT, allowNull: true },
            definicion_indicador: { type: DataTypes.TEXT, allowNull: true },
            metodologia_calculo: { type: DataTypes.TEXT, allowNull: true },
            calculo_mensual: { type: DataTypes.TEXT, allowNull: true },
            calculo_anual: { type: DataTypes.TEXT, allowNull: true },
            unidad_medida: { type: DataTypes.STRING(25), allowNull: true },
            es_mensual: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: true },

            activo: { type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'Y' },
            create_date: { type: DataTypes.DATE, allowNull: true },
            last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
            dni_register: { type: DataTypes.STRING(25), allowNull: false },


        },
        {
            sequelize,
            modelName: 'i_modelo_tipo_indicador',
            timestamps: false,
            freezeTableName: true,
            tableName: 'i_modelo_tipo_indicador',
            classMethods: {},
        }
    )
    return i_modelo_tipo_indicador
}
