'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class tmp_pai extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tmp_pai.init(
    {
      idx: { type: DataTypes.INTEGER(), allowNull: false, primaryKey: true, autoIncrement:true },
      fecha_vacunacion: { type: DataTypes.DATEONLY, allowNull: true },
      estrategia: { type: DataTypes.STRING, allowNull: true },
      ci: { type: DataTypes.STRING, allowNull: true },
      nombre: { type: DataTypes.STRING, allowNull: true },
      celular: { type: DataTypes.STRING, allowNull: true },
      fecha_nacimiento: { type: DataTypes.DATEONLY, allowNull: true },
      edad: { type: DataTypes.STRING, allowNull: true },
      genero: { type: DataTypes.STRING, allowNull: true },
      nacionalidad: { type: DataTypes.STRING, allowNull: true },
      cod_dpto: { type: DataTypes.STRING, allowNull: true },
      departamento: { type: DataTypes.STRING, allowNull: true },
      cod_mun: { type: DataTypes.STRING, allowNull: true },
      municipio: { type: DataTypes.STRING, allowNull: true },
      cod_rues: { type: DataTypes.STRING, allowNull: true },
      establecimiento: { type: DataTypes.STRING, allowNull: true },
      subsector: { type: DataTypes.STRING, allowNull: true },
      ente_gestor_name: { type: DataTypes.STRING, allowNull: true },
      ente_gestor: { type: DataTypes.STRING, allowNull: true },
      empresa: { type: DataTypes.STRING, allowNull: true },
      matricula: { type: DataTypes.STRING, allowNull: true },
      vacuna: { type: DataTypes.STRING, allowNull: true },
      nro_dosis: { type: DataTypes.STRING, allowNull: true },
      proveedor: { type: DataTypes.STRING, allowNull: true },
      lote_vacuna: { type: DataTypes.STRING, allowNull: true },
      usuario: { type: DataTypes.STRING, allowNull: true },
      cel_usr: { type: DataTypes.STRING, allowNull: true },
      validacion: { type: DataTypes.STRING, allowNull: true },
      embarazo: { type: DataTypes.STRING, allowNull: true },
      fecha_registro: { type: DataTypes.DATE, allowNull: true },
      fecha_modificacion: { type: DataTypes.DATE, allowNull: true },
      jeringa_administracion: { type: DataTypes.STRING, allowNull: true },
      lote_diluyente: { type: DataTypes.STRING, allowNull: true },
      jeringa_dilusion: { type: DataTypes.STRING, allowNull: true },

      swloadend: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
      f_vacunacion: { type: DataTypes.STRING, allowNull: true },
      f_nacimiento: { type: DataTypes.STRING, allowNull: true }
    },
    {
      sequelize,
      modelName: 'tmp_pai',
      timestamps: false,
      freezeTableName: true,
      tableName: 'tmp_pai',
      classMethods: {},
    }
  )
  return tmp_pai
}
