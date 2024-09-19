'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class tmp_cancer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tmp_cancer.init(
    {
      idx: { type: DataTypes.INTEGER(), allowNull: false, primaryKey: true, autoIncrement:true },
      ente_gestor_name: {type: DataTypes.STRING, allowNull: true}, 
      
      departamento: {type: DataTypes.STRING, allowNull: true}, 
      sector: {type: DataTypes.STRING, allowNull: true}, 
      ente_gestor_name: {type: DataTypes.STRING, allowNull: true}, 
      ente_gestor: {type: DataTypes.STRING, allowNull: true}, 
      establecimiento: {type: DataTypes.STRING, allowNull: true}, 
      no_historia_clinica: {type: DataTypes.STRING, allowNull: true}, 
      apellidos_nombres: {type: DataTypes.STRING, allowNull: true}, 
      ci: {type: DataTypes.STRING, allowNull: true}, 
      fecha_nacimiento:{type: DataTypes.STRING, allowNull: true},
      edad: {type: DataTypes.STRING, allowNull: true}, 
      edad_recodificada: {type: DataTypes.STRING, allowNull: true}, 
      genero: {type: DataTypes.STRING, allowNull: true}, 
      residencia: {type: DataTypes.STRING, allowNull: true}, 
      procedencia: {type: DataTypes.STRING, allowNull: true}, 
      tecnica_recoleccion: {type: DataTypes.STRING, allowNull: true}, 
      gestion: {type: DataTypes.STRING, allowNull: true}, 
      fecha_diagnostico: {type: DataTypes.DATEONLY, allowNull: true}, 
      no_informe_patologia: {type: DataTypes.STRING, allowNull: true}, 
      diagnostico_histopatologico: {type: DataTypes.STRING, allowNull: true}, 
      cod_morfologico: {type: DataTypes.STRING, allowNull: true}, 
      localizacion: {type: DataTypes.STRING, allowNull: true}, 
      cod_topografico_loc: {type: DataTypes.STRING, allowNull: true}, 
      sitio_primario: {type: DataTypes.STRING, allowNull: true}, 
      codigo_topografico_pri: {type: DataTypes.STRING, allowNull: true}, 
      cie_grupo : {type: DataTypes.STRING, allowNull: true}, 
      lateridad: {type: DataTypes.STRING, allowNull: true}, 
      extension: {type: DataTypes.STRING, allowNull: true}, 
      tnm: {type: DataTypes.STRING, allowNull: true}, 
      estadio: {type: DataTypes.STRING, allowNull: true}, 
      localizacion_metastasis: {type: DataTypes.STRING, allowNull: true}, 
      gestion_defuncion: {type: DataTypes.STRING, allowNull: true}, 
      fecha_defuncion: {type: DataTypes.DATEONLY, allowNull: true}, 
      observacion: {type: DataTypes.STRING, allowNull: true},

      swloadend: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
      f_diagnostico: { type: DataTypes.STRING, allowNull: true },
      f_defuncion: { type: DataTypes.STRING, allowNull: true },
      f_genero: { type: DataTypes.STRING, allowNull: true },
      
      
      hash: { type: DataTypes.STRING, allowNull: true, unique: true },
      hasher: { type: DataTypes.STRING, allowNull: true },
      dni_register: { type: DataTypes.STRING, allowNull: true }
    },
    {
      sequelize,
      modelName: 'tmp_cancer',
      timestamps: false,
      freezeTableName: true,
      tableName: 'tmp_cancer',
      classMethods: {},
    }
  )
  return tmp_cancer
}
