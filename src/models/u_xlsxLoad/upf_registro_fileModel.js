("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class upf_registro_file extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here

            upf_registro_file.belongsTo(models.upf_registro, {
                as: 'uffile_reg',
                foreignKey: 'registro_id',
            }),
                upf_registro_file.belongsTo(models.au_persona, {
                    as: 'ufrf_register',
                    foreignKey: 'dni_register',
                    targetKey: 'dni_persona'
                }),
                upf_registro_file.hasMany(models.uf_abastecimiento, {
                    as: 'regfiuf_abastecimiento',
                    foreignKey: 'file_id',
                    otherKey: 'registro_id',
                    //sourceKey: ['file_id', 'registro_id']
                }),
                upf_registro_file.hasMany(models.e_snis301a, {
                    as: 'uf_301a',
                    foreignKey: 'file_id',
                    otherKey: 'registro_id',
                    //sourceKey: ['file_id', 'registro_id']
                })
                upf_registro_file.hasMany(models.e_snis301b, {
                    as: 'uf_301b',
                    foreignKey: 'file_id',
                    otherKey: 'registro_id',
                    //sourceKey: ['file_id', 'registro_id']
                })
                upf_registro_file.hasMany(models.e_snis302a, {
                    as: 'uf_302a',
                    foreignKey: 'file_id',
                    otherKey: 'registro_id',
                    //sourceKey: ['file_id', 'registro_id']
                }),
                upf_registro_file.hasMany(models.e_snis302b, {
                    as: 'uf_302b',
                    foreignKey: 'file_id',
                    otherKey: 'registro_id',
                    //sourceKey: ['file_id', 'registro_id']
                })
        }
    }
    upf_registro_file.init(
        {


            file_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true },
            registro_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true },

            gestion: { type: DataTypes.INTEGER, allowNull: true },
            periodo: { type: DataTypes.STRING(6), allowNull: true },
            departamento: { type: DataTypes.STRING(32), allowNull: true },
            provincia: { type: DataTypes.STRING(512), allowNull: true },
            red: { type: DataTypes.STRING(128), allowNull: true },
            municipio: { type: DataTypes.STRING(512), allowNull: true },
            ente_gestor: { type: DataTypes.STRING(128), allowNull: true },
            establecimiento: { type: DataTypes.STRING(512), allowNull: true },
            sw_semana: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
            
            concluido: { type: DataTypes.STRING(2), allowNull: true, defaultValue: '1' },
            swloadend: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
            
            create_date: { type: DataTypes.DATE, allowNull: true },
            last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
            dni_register: { type: DataTypes.STRING(25), allowNull: true },
            
            file_name: { type: DataTypes.STRING(128), allowNull: false },
            file_original_name: { type: DataTypes.STRING(512), allowNull: true },
            file_type: { type: DataTypes.STRING(128), allowNull: true },
            file_md5: { type: DataTypes.STRING(512), allowNull: true,unique: true },

        },
        {
            sequelize,
            modelName: "upf_registro_file",
            timestamps: false,
            freezeTableName: true,
            tableName: "upf_registro_file",
            classMethods: {},
        }
    );
    return upf_registro_file;
};
