("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class f_formulario_img extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      f_formulario_img.belongsTo(models.f_formulario,{
        as:'form',
        foreignKey: 'formulario_id',
        targetKey: 'formulario_id'
      }),
      f_formulario_img.hasMany(models.f_formulario_img_cnf,{
        as:'cxy',
        foreignKey: 'img_id',
        targetKey: 'img_id'
      }),
      f_formulario_img.hasMany(models.f_formulario_img_cnf_more,{
        as:'mcxy',
        foreignKey: 'img_id',
        targetKey: 'img_id'
      })
     
    }
  }
  f_formulario_img.init(
    {
        img_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true },
        formulario_id: { type: DataTypes.UUID(), allowNull: false },
        img: { type: DataTypes.TEXT, allowNull: true },
        format_page: { type: DataTypes.STRING, allowNull: true, defaultValue:'letter' },
        orientation_page: { type: DataTypes.STRING, allowNull: true, defaultValue:'p' },
        
        img_width: {type: DataTypes.INTEGER, allowNull: true, defaultValue:250},
        img_heigth: {type: DataTypes.INTEGER, allowNull: true, defaultValue:500},

        create_date: { type: DataTypes.DATE, allowNull: false },
        last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
        activo: { type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'Y' },
        dni_register: { type: DataTypes.STRING(25), allowNull: true },

        orden: { type: DataTypes.INTEGER, allowNull: true, defaultValue:0 },

    },
    {
      sequelize,
      modelName: "f_formulario_img",
      timestamps: false,
      freezeTableName: true,
      tableName: "f_formulario_img",
      classMethods: {},
    }
  );
  return f_formulario_img;
};
