'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class i_modelo extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    i_modelo.init(
        {
            modulo_id: { type: DataTypes.STRING(64), allowNull: false, primaryKey: true },
            cod_grupo: { type: DataTypes.STRING(64), allowNull: false },
            numero_mod: { type: DataTypes.STRING(25), allowNull: true },
            gestion: { type: DataTypes.STRING(4), allowNull: true },
            nombre_modelo: { type: DataTypes.STRING(500), allowNull: true },
            fecha_publico: { type: DataTypes.DATEONLY, allowNull: true },

            activo: { type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'Y' },
            create_date: { type: DataTypes.DATE, allowNull: true },
            last_modify_date_time: { type: DataTypes.DATE, allowNull: true },


        },
        {
            sequelize,
            modelName: 'i_modelo',
            timestamps: false,
            freezeTableName: true,
            tableName: 'i_modelo',
            classMethods: {},
        }
    )
    return i_modelo
}
