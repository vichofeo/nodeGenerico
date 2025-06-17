'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class upf_file_institucion_cnf extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            upf_file_institucion_cnf.belongsTo(models.upf_file_tipo, {
                as: 'uffiletipo',
                foreignKey: 'file_tipo_id',
                targetKey: 'file_tipo_id'
            }),
            upf_file_institucion_cnf.belongsTo(models.ae_institucion, {
                as: 'ufinst',
                foreignKey: 'institucion_id',
                targetKey: 'institucion_id'
            })
        }
    }
    upf_file_institucion_cnf.init(
        {

            institucion_id: { type: DataTypes.UUID, allowNull: false, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
            file_tipo_id: { type: DataTypes.UUID, allowNull: false, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
            opcional: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
            dni_register: { type: DataTypes.STRING(25), allowNull: true },
            activo: { type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'Y' },
            create_date: { type: DataTypes.DATE, allowNull: false },
            last_modify_date_time: { type: DataTypes.DATE, allowNull: false },
            limite_dia: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 8 },
            limite_plus: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10 },
            revision_dia: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 15 },
            revision_plus: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 17 },
            opening_delay: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
        },
        {
            sequelize,
            modelName: 'upf_file_institucion_cnf',
            timestamps: false,
            freezeTableName: true,
            tableName: 'upf_file_institucion_cnf',
            classMethods: {},
        }
    )
    return upf_file_institucion_cnf
}
