'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class u_acrehab extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
           
        }
    }
    u_acrehab.init(
        {
            evaluacion_id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },

            acrehab_id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
            tipo_reg: { type: DataTypes.STRING(64), allowNull: false, },
            dni_register: { type: DataTypes.STRING(25), allowNull: true, },
            create_date: { type: DataTypes.DATE, allowNull: false },
            last_modify_date_time: { type: DataTypes.DATE, allowNull: false },
            activo: { type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'Y' },
            departamento: { type: DataTypes.STRING(32), allowNull: true, },
            ente_gestor_name: { type: DataTypes.STRING(256), allowNull: true, },
            establecimiento: { type: DataTypes.STRING(512), allowNull: true, },
            servicio: { type: DataTypes.STRING(64), allowNull: true, },
            nivel: { type: DataTypes.STRING(32), allowNull: true, },
            gestion: { type: DataTypes.INTEGER, allowNull: true },
            cod_reg: { type: DataTypes.STRING(128), allowNull: true, },
            ra_reg: { type: DataTypes.STRING(128), allowNull: true, },
            cite_ss: { type: DataTypes.STRING(128), allowNull: true, },
            porcentaje_ss: { type: DataTypes.DOUBLE, allowNull: true, },
            fecha_inf_ss: { type: DataTypes.DATEONLY, allowNull: true, },
            cite_etee: { type: DataTypes.STRING(128), allowNull: true, },
            porcentaje_etee: { type: DataTypes.DOUBLE, allowNull: true, },
            fecha_inf_etee: { type: DataTypes.DATEONLY, allowNull: true, },
            cite_ucass: { type: DataTypes.STRING(128), allowNull: true, },
            fecha_inf_ucass: { type: DataTypes.DATEONLY, allowNull: true, },
            ra: { type: DataTypes.STRING(128), allowNull: true, },
            fecha: { type: DataTypes.DATEONLY, allowNull: true, },
            tipo: { type: DataTypes.STRING(2), allowNull: true, defaultValue: 'O' },
            hashchild: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
            root: { type: DataTypes.STRING(128), allowNull: true, },
            obs: { type: DataTypes.TEXT, allowNull: true, },

            eg: { type: DataTypes.STRING, allowNull: true },
            dpto: { type: DataTypes.STRING, allowNull: true },
            eess: { type: DataTypes.STRING, allowNull: true },



        },
        {
            sequelize,
            modelName: 'u_acrehab',
            timestamps: false,
            freezeTableName: true,
            tableName: 'u_acrehab',
            classMethods: {},
        }
    )
    return u_acrehab
}
