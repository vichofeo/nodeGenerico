'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class upf_file_tipo extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            upf_file_tipo.belongsTo(models.upf_file_grupo, {
                as: 'ufgroup',
                foreignKey: 'grupo_file_id',
                targetKey: 'grupo_file_id'
            })
    }
    }
    upf_file_tipo.init(
        {

            file_tipo_id: { type: DataTypes.UUID, allowNull: false, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
            nombre_tipo_archivo: { type: DataTypes.STRING(128), allowNull: false },
            ext: { type: DataTypes.STRING(5), allowNull: true },
            activo: { type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'Y' },
            create_date: { type: DataTypes.DATE, allowNull: false },
            last_modify_date_time: { type: DataTypes.DATE, allowNull: false },
            grupo_file_id: { type: DataTypes.STRING(64), allowNull: false },
            sw_semana: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },

            modelData: { type: DataTypes.STRING(32), allowNull: false },
            modelLoad: { type: DataTypes.STRING(32), allowNull: false },
            modelDataLoad: { type: DataTypes.STRING(32), allowNull: false },
            modelPlantilla: { type: DataTypes.STRING(32), allowNull: false },
            typeLoadFile: { type: DataTypes.INTEGER, allowNull: false, defaultValue:10 },
            mdi_icon: { type: DataTypes.STRING(24), allowNull: false, defaultValue:'mdi-pencil' },
            color: { type: DataTypes.STRING(24), allowNull: false, defaultValue:'teal' },
        },
        {
            sequelize,
            modelName: 'upf_file_tipo',
            timestamps: false,
            freezeTableName: true,
            tableName: 'upf_file_tipo',
            classMethods: {},
        }
    )
    return upf_file_tipo
}
