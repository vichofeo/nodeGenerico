'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class tmp_defunciones extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    tmp_defunciones.init(
        {
            idx: { type: DataTypes.INTEGER(), allowNull: false, primaryKey: true, autoIncrement: true },
            
            gestion: { type: DataTypes.STRING, allowNull: true },
            codigo: { type: DataTypes.STRING, allowNull: true },
            cod_dpto: { type: DataTypes.STRING, allowNull: true },
            departamento: { type: DataTypes.STRING, allowNull: true },
            cod_area: { type: DataTypes.STRING, allowNull: true },
            red: { type: DataTypes.STRING, allowNull: true },
            cod_municipio: { type: DataTypes.STRING, allowNull: true },
            municipio: { type: DataTypes.STRING, allowNull: true },
            cod_establecimiento: { type: DataTypes.STRING, allowNull: true },
            establecimiento: { type: DataTypes.STRING, allowNull: true },
            nivel: { type: DataTypes.STRING, allowNull: true },
            subsector: { type: DataTypes.STRING, allowNull: true },
            ente_gestor_name: { type: DataTypes.STRING, allowNull: true },
            ambito: { type: DataTypes.STRING, allowNull: true },
            departamento_nacimiento: { type: DataTypes.STRING, allowNull: true },
            provincia_nacimiento: { type: DataTypes.STRING, allowNull: true },
            municipio_nacimiento: { type: DataTypes.STRING, allowNull: true },
            localidad_nacimiento: { type: DataTypes.STRING, allowNull: true },
            departamento_residencia: { type: DataTypes.STRING, allowNull: true },
            provincia_residencia: { type: DataTypes.STRING, allowNull: true },
            municipio_residencia: { type: DataTypes.STRING, allowNull: true },
            localidad_residencia: { type: DataTypes.STRING, allowNull: true },
            nombres: { type: DataTypes.STRING, allowNull: true },
            segundo_apellido: { type: DataTypes.STRING, allowNull: true },
            tipo_documento: { type: DataTypes.STRING, allowNull: true },
            complemento_documento: { type: DataTypes.STRING, allowNull: true },
            codigo_expedicion: { type: DataTypes.STRING, allowNull: true },
            verificacion_segip: { type: DataTypes.STRING, allowNull: true },
            lugar_fisico_fallecimiento: { type: DataTypes.STRING, allowNull: true },
            fecha_nacimiento: { type: DataTypes.DATEONLY, allowNull: true },
            fecha_defuncion: { type: DataTypes.DATEONLY, allowNull: true },
            edad_anio: { type: DataTypes.STRING, allowNull: true },
            edad_mes: { type: DataTypes.STRING, allowNull: true },
            edad_dia: { type: DataTypes.STRING, allowNull: true },
            sexo: { type: DataTypes.STRING, allowNull: true },
            grado_instruccion: { type: DataTypes.STRING, allowNull: true },
            estado_civil: { type: DataTypes.STRING, allowNull: true },
            origen_ciudadano: { type: DataTypes.STRING, allowNull: true },
            departamento_defuncion: { type: DataTypes.STRING, allowNull: true },
            provincia_defuncion: { type: DataTypes.STRING, allowNull: true },
            municipio_defuncion: { type: DataTypes.STRING, allowNull: true },
            localidad_defuncion: { type: DataTypes.STRING, allowNull: true },
            atencion_medica: { type: DataTypes.STRING, allowNull: true },
            causa_directa: { type: DataTypes.STRING, allowNull: true },
            cie10_causa_directa_codigo: { type: DataTypes.STRING, allowNull: true },
            cie10_causa_directa_descripcion: { type: DataTypes.STRING, allowNull: true },
            causa_antecedente_1: { type: DataTypes.STRING, allowNull: true },
            cie10_causa_antecedente_1_codigo: { type: DataTypes.STRING, allowNull: true },
            cie10_causa_antecedente_1_descripcion: { type: DataTypes.STRING, allowNull: true },
            causa_antecedente_2: { type: DataTypes.STRING, allowNull: true },
            cie10_causa_antecedente_2_codigo: { type: DataTypes.STRING, allowNull: true },
            cie10_causa_antecedente_2_descripcion: { type: DataTypes.STRING, allowNull: true },
            causa_antecedente_3: { type: DataTypes.STRING, allowNull: true },
            cie10_causa_antecedente_3_codigo: { type: DataTypes.STRING, allowNull: true },
            cie10_causa_antecedente_3_descripcion: { type: DataTypes.STRING, allowNull: true },
            causa_contribuyente_1: { type: DataTypes.STRING, allowNull: true },
            cie10_causa_contribuyente_1_codigo: { type: DataTypes.STRING, allowNull: true },
            cie10_causa_contribuyente_1_descripcion: { type: DataTypes.STRING, allowNull: true },
            causa_contribuyente_2: { type: DataTypes.STRING, allowNull: true },
            cie10_causa_contribuyente_2_codigo: { type: DataTypes.STRING, allowNull: true },
            cie10_causa_contribuyente_2_descripcion: { type: DataTypes.STRING, allowNull: true },
            cie10_causa_b_sica_codigo: { type: DataTypes.STRING, allowNull: true },
            cie10_causa_b_sica_descripcion: { type: DataTypes.STRING, allowNull: true },
            presuncion_muerte: { type: DataTypes.STRING, allowNull: true },
            mecanismo_muerte: { type: DataTypes.STRING, allowNull: true },
            lugar_fisico_lesion: { type: DataTypes.STRING, allowNull: true },
            procedimiento: { type: DataTypes.STRING, allowNull: true },
            detalle_probable_lesion: { type: DataTypes.STRING, allowNull: true },
            defuncion_femenina: { type: DataTypes.STRING, allowNull: true },
            causa_fue_complicacion_embarazo: { type: DataTypes.STRING, allowNull: true },
            causa_complic_embarazo: { type: DataTypes.STRING, allowNull: true },
            certificador_nombre_completo: { type: DataTypes.STRING, allowNull: true },
            certificador_profesion: { type: DataTypes.STRING, allowNull: true },
            certificador_matricula: { type: DataTypes.STRING, allowNull: true },
            fecha_emision: { type: DataTypes.STRING, allowNull: true },
            fecha_registro: { type: DataTypes.STRING, allowNull: true },
            usuario_registro: { type: DataTypes.STRING, allowNull: true },
            estado: { type: DataTypes.STRING, allowNull: true },


            swloadend: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
            f_nacimiento: { type: DataTypes.STRING, allowNull: true },
            f_defuncion: { type: DataTypes.STRING, allowNull: true },


            hash: { type: DataTypes.STRING, allowNull: true, unique: true },
            hasher: { type: DataTypes.STRING, allowNull: true },
            dni_register: { type: DataTypes.STRING, allowNull: true },

            eg: { type: DataTypes.STRING, allowNull: true },
            dpto: { type: DataTypes.STRING, allowNull: true },
            eess: { type: DataTypes.STRING, allowNull: true },


        },
        {
            sequelize,
            modelName: 'tmp_defunciones',
            timestamps: false,
            freezeTableName: true,
            tableName: 'tmp_defunciones',
            classMethods: {},
        }
    )
    return tmp_defunciones
}
