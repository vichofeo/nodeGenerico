'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class tmp_nacimientos extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    tmp_nacimientos.init(
        {
            idx: { type: DataTypes.INTEGER(), allowNull: false, primaryKey: true, autoIncrement: true },

            gestion: { type: DataTypes.STRING, allowNull: true },
            codigo_unico_identificacion: { type: DataTypes.STRING, allowNull: true },
            fecha: { type: DataTypes.DATEONLY, allowNull: true },
            modalidad: { type: DataTypes.STRING, allowNull: true },
            cod_dpto: { type: DataTypes.STRING, allowNull: true },
            departamento: { type: DataTypes.STRING, allowNull: true },
            cod_red: { type: DataTypes.STRING, allowNull: true },
            red: { type: DataTypes.STRING, allowNull: true },
            cod_municipio: { type: DataTypes.STRING, allowNull: true },
            municipio: { type: DataTypes.STRING, allowNull: true },
            cod_establecimiento: { type: DataTypes.STRING, allowNull: true },
            establecimiento: { type: DataTypes.STRING, allowNull: true },
            nivel: { type: DataTypes.STRING, allowNull: true },
            subsector: { type: DataTypes.STRING, allowNull: true },
            ente_gestor_name: { type: DataTypes.STRING, allowNull: true },
            ambito: { type: DataTypes.STRING, allowNull: true },
            nombres: { type: DataTypes.STRING, allowNull: true },
            primer_apellido: { type: DataTypes.STRING, allowNull: true },
            segundo_apellido: { type: DataTypes.STRING, allowNull: true },
            nro_documento: { type: DataTypes.STRING, allowNull: true },
            fecha_nacimiento: { type: DataTypes.DATEONLY, allowNull: true },
            departamento_nac: { type: DataTypes.STRING, allowNull: true },
            provincia_nac: { type: DataTypes.STRING, allowNull: true },
            municipio_nac: { type: DataTypes.STRING, allowNull: true },
            localidad_nac: { type: DataTypes.STRING, allowNull: true },
            producto: { type: DataTypes.STRING, allowNull: true },
            lugar_fisico: { type: DataTypes.STRING, allowNull: true },
            sexo: { type: DataTypes.STRING, allowNull: true },
            parto_atendido: { type: DataTypes.STRING, allowNull: true },
            edad_gestacional: { type: DataTypes.STRING, allowNull: true },
            peso: { type: DataTypes.STRING, allowNull: true },
            talla: { type: DataTypes.STRING, allowNull: true },
            apgar_al_minuto: { type: DataTypes.STRING, allowNull: true },
            apgar_5_minutos: { type: DataTypes.STRING, allowNull: true },
            malformaciones: { type: DataTypes.STRING, allowNull: true },
            nombres_madre: { type: DataTypes.STRING, allowNull: true },
            segundo_apellido_madre: { type: DataTypes.STRING, allowNull: true },
            tipo_documento_madre: { type: DataTypes.STRING, allowNull: true },
            complemento_documento_madre: { type: DataTypes.STRING, allowNull: true },
            fecha_nac_madre: { type: DataTypes.DATEONLY, allowNull: true },
            expedicion_madre: { type: DataTypes.STRING, allowNull: true },
            identificacion_cultural: { type: DataTypes.STRING, allowNull: true },
            departamento_residencia: { type: DataTypes.STRING, allowNull: true },
            provincia_residencia: { type: DataTypes.STRING, allowNull: true },
            municipio_residencia: { type: DataTypes.STRING, allowNull: true },
            localidad_residencia: { type: DataTypes.STRING, allowNull: true },
            certificador_nombre_completo: { type: DataTypes.STRING, allowNull: true },
            certificador_profesion: { type: DataTypes.STRING, allowNull: true },
            certificador_matricula: { type: DataTypes.STRING, allowNull: true },
            fecha_emision: { type: DataTypes.STRING, allowNull: true },
            fecha_registro: { type: DataTypes.STRING, allowNull: true },
            estado_certificado: { type: DataTypes.STRING, allowNull: true },
            nombres_usuario: { type: DataTypes.STRING, allowNull: true },
            primer_apellido_usuario: { type: DataTypes.STRING, allowNull: true },
            segundo_apellido_usuario: { type: DataTypes.STRING, allowNull: true },


            swloadend: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
            f_nacimiento: { type: DataTypes.STRING, allowNull: true },
            f_nacmadre: { type: DataTypes.STRING, allowNull: true },


            hash: { type: DataTypes.STRING, allowNull: true, unique: true },
            hasher: { type: DataTypes.STRING, allowNull: true },
            dni_register: { type: DataTypes.STRING, allowNull: true },

            eg: { type: DataTypes.STRING, allowNull: true },
            dpto: { type: DataTypes.STRING, allowNull: true },
            eess: { type: DataTypes.STRING, allowNull: true },


        },
        {
            sequelize,
            modelName: 'tmp_nacimientos',
            timestamps: false,
            freezeTableName: true,
            tableName: 'tmp_nacimientos',
            classMethods: {},
        }
    )
    return tmp_nacimientos
}
