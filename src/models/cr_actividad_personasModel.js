'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class cr_actividad_personas extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here   
            cr_actividad_personas.belongsTo(models.au_persona, {
                as: 'act_people',
                foreignKey: 'dni_persona'
              })   
        }
    }
    cr_actividad_personas.init(
        {
            idx_ap: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
            actividad_id: { type: DataTypes.INTEGER, allowNull: false },
            dni_persona: { type: DataTypes.STRING(25), allowNull: false },
            mail_registro: { type: DataTypes.STRING(256), allowNull: true },
            tipo_persona_id: { type: DataTypes.STRING(64), allowNull: true },
            loguet: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
            presente: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
            authorized: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
            dni_register: { type: DataTypes.STRING(25), allowNull: true },
            create_date: { type: DataTypes.DATE, allowNull: true },
            last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
            activo: { type: DataTypes.CHAR(1), allowNull: false, defaultValue: 'Y' },

            logsend: { type: DataTypes.TEXT, allowNull: true},
            send: { type: DataTypes.CHAR(1), allowNull: false, defaultValue: 'N' },

        },
        {
            sequelize,
            modelName: 'cr_actividad_personas',
            timestamps: false,
            freezeTableName: true,
            tableName: 'cr_actividad_personas',
            classMethods: {},
        }
    )
    return cr_actividad_personas
}
