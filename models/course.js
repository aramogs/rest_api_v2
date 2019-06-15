// Define your Sequelize models
// Define two Sequelize models: one for the Users table and another for the Courses table.`. Define the models following these requirements:
// Course
// id (Integer, primary key, auto-generated)
// userId (id from the Users table)
// title (String)
// description (Text)
// estimatedTime (String, nullable)
// materialsNeeded (String, nullable)
"use strict";
module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define("Course", {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.INTEGER
    },
    title: {
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Course title must not be empty"
        }
      },
      type: DataTypes.STRING
    },
    description: {
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Course description must not be empty"
        }
      },
      type: DataTypes.TEXT
    },
    estimatedTime: {
      allowNull: true,
      type: DataTypes.STRING
    },
    materialsNeeded: {
      allowNull: true,
      type: DataTypes.STRING
    }
  });

  // Define associations between your models
  // Within your Course model, define a BelongsTo association between your Course and User models (i.e. a "Course" belongs to a single "User").
   Course.associate = models => {
    Course.belongsTo(models.User);
  };

  return Course;
};
