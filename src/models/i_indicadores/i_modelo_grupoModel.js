'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class i_modelo_grupo extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    i_modelo_grupo.init(
        {
            cod_grupo:{type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true},
            nombre_tipo_modelo: { type: DataTypes.STRING(250), allowNull: true },
            aplicacion_id: { type: DataTypes.STRING(64), allowNull: false },
            

        },
        {
            sequelize,
            modelName: 'i_modelo_grupo',
            timestamps: false,
            freezeTableName: true,
            tableName: 'i_modelo_grupo',
            classMethods: {},
        }
    )
    return i_modelo_grupo
}
