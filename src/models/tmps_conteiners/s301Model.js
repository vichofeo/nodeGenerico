'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class s301 extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here

        }
    }
    s301.init(
        {
            codigo: { type: DataTypes.STRING, allowNull: false },
            gestion: { type: DataTypes.STRING, allowNull: false },
            mes: { type: DataTypes.STRING, allowNull: false },
            sedes: { type: DataTypes.STRING, allowNull: false },
            provincia: { type: DataTypes.STRING, allowNull: false },
            red_establ: { type: DataTypes.STRING, allowNull: false },
            municipio: { type: DataTypes.STRING, allowNull: false },
            establecimiento: { type: DataTypes.STRING, allowNull: false },
            ambito: { type: DataTypes.STRING, allowNull: false },
            nivel: { type: DataTypes.STRING, allowNull: false },
            tipo: { type: DataTypes.STRING, allowNull: false },
            intitucion: { type: DataTypes.STRING, allowNull: false },
            subsector: { type: DataTypes.STRING, allowNull: false },
            formulario: { type: DataTypes.STRING, allowNull: false },
            grupo: { type: DataTypes.STRING, allowNull: false },
            variable: { type: DataTypes.STRING, allowNull: false },
            subvariable: { type: DataTypes.STRING, allowNull: false },
            totalv: { type: DataTypes.INTEGER, allowNull: false },
            totalm: { type: DataTypes.INTEGER, allowNull: false },
            totalg: { type: DataTypes.INTEGER, allowNull: false },
        },
        {
            sequelize,
            modelName: 's301',
            timestamps: false,
            freezeTableName: true,
            tableName: 's301',
            classMethods: {},
        }
    )
    return s301
}
