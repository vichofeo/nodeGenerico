'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ape_aplicacion_institucion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //User.belongsToMany(Role, { as: 'Roles', through: { model: UserRole, unique: false }, foreignKey: 'user_id' });
      //Role.belongsToMany(User, { as: 'Users', through: { model: UserRole, unique: false }, foreignKey: 'role_id' })
      // define association here
      ape_aplicacion_institucion.belongsTo(models.ae_institucion, {
        as: 'inst',
        foreignKey: 'institucion_id',
      }),
        ape_aplicacion_institucion.belongsTo(models.ap_aplicacion, {
          as: 'app',
          foreignKey: 'aplicacion_id',
        })
      /*
      // The Super Many-to-Many relationship
      User.belongsToMany(Profile, { through: Grant });
      User.hasMany(Grant);
      
      Profile.belongsToMany(User, { through: Grant });
      Profile.hasMany(Grant);
      
      Grant.belongsTo(User);
      Grant.belongsTo(Profile);
      
      User.findAll({ include: Profile });
      User.findAll({ include: Grant });
      Profile.findAll({ include: User });
      Profile.findAll({ include: Grant });
      Grant.findAll({ include: User });
      Grant.findAll({ include: Profile });*/
    }
  }
  ape_aplicacion_institucion.init(
    {
      institucion_id: { type: DataTypes.STRING(64), allowNull: false, primaryKey: true },
      aplicacion_id: { type: DataTypes.STRING(64), allowNull: false },
      public_key: { type: DataTypes.STRING(64), allowNull: true },
      licence_key: { type: DataTypes.STRING(64), allowNull: true },
      license_date: { type: DataTypes.DATE, allowNull: true },
      l_no: { type: DataTypes.INTEGER, defaultValue: 10 },
      activo: { type: DataTypes.CHAR(1), allowNull: false, defaultValue: 'Y' },
      create_date: { type: DataTypes.DATE, allowNull: false },
      last_modify_date_time: { type: DataTypes.DATE, allowNull: true },
    },
    {
      sequelize,
      modelName: 'ape_aplicacion_institucion',
      timestamps: false,
      freezeTableName: true,
      tableName: 'ape_aplicacion_institucion',
      classMethods: {},
    }
  )
  return ape_aplicacion_institucion
}
