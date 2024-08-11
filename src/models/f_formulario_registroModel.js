("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class f_formulario_registro extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      f_formulario_registro.belongsTo(models.f_formulario,{
        as:'form',
        foreignKey: 'formulario_id',
        targetKey: 'formulario_id'
      }),
      f_formulario_registro.belongsTo(models.ae_institucion,{
        as:'institucion',
        foreignKey: 'institucion_id',
        targetKey: 'institucion_id'
      }),
      f_formulario_registro.belongsTo(models.u_is_atributo,{
        as:'estado',
        foreignKey: 'concluido',
        targetKey: 'atributo_id'
      })
    }
  }
  f_formulario_registro.init(
    {
        registro_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true },
        concluido: { type: DataTypes.STRING(2), allowNull: false, defaultValue: '1' },
        create_date: { type: DataTypes.DATE, allowNull: false },
        last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
        dni_register: { type: DataTypes.STRING(25), allowNull: true },
        activo: { type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'Y' },
        institucion_id: { type: DataTypes.STRING(64), allowNull: false },
        formulario_id: { type: DataTypes.UUID(), allowNull: false },
        periodo: { type: DataTypes.STRING(6), allowNull: false }
    
    },
    {
      sequelize,
      modelName: "f_formulario_registro",
      timestamps: false,
      freezeTableName: true,
      tableName: "f_formulario_registro",
      classMethods: {},
    }
  );
  return f_formulario_registro;
};
