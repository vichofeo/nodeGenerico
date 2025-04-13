("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class upf_registro extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here

            upf_registro.belongsTo(models.ae_institucion, {
                as: 'ufrinst',
                foreignKey: 'institucion_id',
                targetKey: 'institucion_id'
            }),
                upf_registro.belongsTo(models.r_institucion_salud, {
                    as: 'ufsinst_sal',
                    foreignKey: 'institucion_id',
                    targetKey: 'institucion_id'
                }),
                upf_registro.belongsTo(models.u_is_atributo, {
                    as: 'ufestado',
                    foreignKey: 'concluido',
                    targetKey: 'atributo_id'
                }),
                upf_registro.belongsTo(models.au_persona, {
                    as: 'ufregister',
                    foreignKey: 'dni_register',
                    targetKey: 'dni_persona'
                }),
                upf_registro.belongsTo(models.upf_file_institucion_cnf, {
                    as: 'uffile_inst_cnf',
                    foreignKey: 'institucion_id',      // FK en upf_registro (parte 1)
                    otherKey: 'file_tipo_id',         // FK en upf_registro (parte 2)
                    //targetKey: ['institucion_id', 'file_tipo_id'], // PK compuesta en destino
                  })
        }
    }
    upf_registro.init(
        {
            registro_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true },
            dni_register: { type: DataTypes.STRING(25), allowNull: true },

            create_date: { type: DataTypes.DATE, allowNull: false },
            last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
            activo: { type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'Y' },

            periodo: { type: DataTypes.STRING(10), allowNull: false },
            dni_concluido: { type: DataTypes.STRING(25), allowNull: true },

            concluido: { type: DataTypes.STRING(2), allowNull: false, defaultValue: '1' },
            fecha_concluido: { type: DataTypes.DATEONLY, allowNull: true },
            fecha_climite: { type: DataTypes.DATEONLY, allowNull: true },
            flimite_plus: { type: DataTypes.DATEONLY, allowNull: true },

            revisado: { type: DataTypes.STRING(2), allowNull: true },
            dni_revisado: { type: DataTypes.STRING(25), allowNull: true },
            fecha_revisado: { type: DataTypes.DATEONLY, allowNull: true },
            fecha_rlimite: { type: DataTypes.DATEONLY, allowNull: true },
            frevisado_plus: { type: DataTypes.DATEONLY, allowNull: true },


            opening: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },

            dni_plus: { type: DataTypes.STRING(25), allowNull: true },
            modify_date_plus: { type: DataTypes.DATE, allowNull: true },
            ctype_plus: { type: DataTypes.STRING, allowNull: true, defaultValue: 'c0' },
            rtype_plus: { type: DataTypes.STRING, allowNull: true, defaultValue: 'r0' },

            institucion_id: { type: DataTypes.STRING(64), allowNull: false },
            file_tipo_id: { type: DataTypes.STRING(64), allowNull: false },
            sw_semana: { type: DataTypes.BOOLEAN, defaultValue: false },


        },
        {
            sequelize,
            modelName: "upf_registro",
            timestamps: false,
            freezeTableName: true,
            tableName: "upf_registro",
            classMethods: {},
        }
    );
    return upf_registro;
};
