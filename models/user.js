// Define your Sequelize models
// Define two Sequelize models: one for the Users table and another for the Courses table.`. Define the models following these requirements:
// User
// id (Integer, primary key, auto-generated)
// firstName (String)
// lastName (String)
// emailAddress (String)
// password (String)

"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    firstName: {
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "User's First name is required"
        }
      },
      type: DataTypes.STRING
    },
    lastName: {
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "User's Last name is required"
        }
      },
      type: DataTypes.STRING
    },
    emailAddress: {
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "User's Email is required"
        },
        isEmail: {
          msg: "Please use a valid email address"
        }
      },
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "A Password is required"
        }
      }
    }
  });

  // Define associations between your models
  // Within your User model, define a HasMany association between your User and Course models (i.e. a "User" has many "Courses").
  User.associate = models => {
    User.hasMany(models.Course);
  };
  return User;
};
