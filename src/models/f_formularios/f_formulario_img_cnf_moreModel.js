("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class f_formulario_img_cnf_more extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here      
     
    }
  }
  f_formulario_img_cnf_more.init(
    {
        mcxy_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true },
                

        create_date: { type: DataTypes.DATE, allowNull: false },
        last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
        activo: { type: DataTypes.CHAR(1), allowNull: true, defaultValue: 'Y' },
        dni_register: { type: DataTypes.STRING(25), allowNull: true },

        img_id: { type: DataTypes.STRING(64), allowNull: true },
        clave: { type: DataTypes.STRING, allowNull: true }, 
        cx: { type: DataTypes.INTEGER, allowNull: false, defaultValue:10 }, 
        cy: { type: DataTypes.INTEGER, allowNull: false, defaultValue:10 },
        align: { type: DataTypes.STRING, allowNull: true, defaultValue:'left' },

    },
    {
      sequelize,
      modelName: "f_formulario_img_cnf_more",
      timestamps: false,
      freezeTableName: true,
      tableName: "f_formulario_img_cnf_more",
      classMethods: {},
    }
  );
  return f_formulario_img_cnf_more;
};
