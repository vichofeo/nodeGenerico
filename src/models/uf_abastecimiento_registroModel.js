("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class uf_abastecimiento_registro extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
   
      uf_abastecimiento_registro.belongsTo(models.ae_institucion,{
        as:'abainstitucion',
        foreignKey: 'institucion_id',
        targetKey: 'institucion_id'
      }),
      uf_abastecimiento_registro.belongsTo(models.r_institucion_salud,{
        as:'abaeess',
        foreignKey: 'institucion_id',
        targetKey: 'institucion_id'
      }),
      uf_abastecimiento_registro.belongsTo(models.u_is_atributo,{
        as:'estado',
        foreignKey: 'concluido',
        targetKey: 'atributo_id'
      })
    }
  }
  uf_abastecimiento_registro.init(
    {
        registro_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true },
        
        create_date: { type: DataTypes.DATE, allowNull: false },
        last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
        dni_register: { type: DataTypes.STRING(25), allowNull: true },
        activo: { type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'Y' },

        institucion_id: { type: DataTypes.STRING(64), allowNull: false },        
        periodo: { type: DataTypes.STRING(6), allowNull: false }, 

        dni_concluido: { type: DataTypes.STRING(25), allowNull: true },
        concluido: { type: DataTypes.STRING(2), allowNull: false, defaultValue: '1' },
        fecha_concluido: { type: DataTypes.DATEONLY, allowNull: true },
        fecha_climite: { type: DataTypes.DATEONLY, allowNull: true },
        flimite_plus: { type: DataTypes.DATEONLY, allowNull: true },
        
        
        dni_revisado: { type: DataTypes.STRING(25), allowNull: true },
        revisado: { type: DataTypes.STRING(2), allowNull: true  },
        fecha_revisado: { type: DataTypes.DATEONLY, allowNull: true },
        fecha_rlimite: { type: DataTypes.DATEONLY, allowNull: true },
        frevisado_plus: { type: DataTypes.DATEONLY, allowNull: true },
        
        opening: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue:true },

        dni_plus: { type: DataTypes.STRING(25), allowNull: true },        
        modify_date_plus: { type: DataTypes.DATE, allowNull: true },
        ctype_plus: { type: DataTypes.STRING, allowNull: true, defaultValue:'c0'  },
        rtype_plus: { type: DataTypes.STRING, allowNull: true, defaultValue:'r0'  },
        
        
        
    
    },
    {
      sequelize,
      modelName: "uf_abastecimiento_registro",
      timestamps: false,
      freezeTableName: true,
      tableName: "uf_abastecimiento_registro",
      classMethods: {},
    }
  );
  return uf_abastecimiento_registro;
};
