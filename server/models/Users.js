module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    userId: { // Define userId as primary key
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false, // Ensure userId cannot be null
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true, // Ensure usernames are unique
        msg: "Username already exists." // Custom error message for uniqueness violation
      },
      validate: {
        len: {
          args: [3, 20], // Username must be between 3 and 20 characters
          msg: "Username must be between 3 and 20 characters."
        },
        isAlphanumeric: {
          msg: "Username must be alphanumeric." // Ensure username is alphanumeric
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6, 100], // Password must be at least 6 characters long
          msg: "Password must be at least 6 characters long."
        }
      }
    },
  });

  Users.associate = (models) => {
    // One user can have many posts
    Users.hasMany(models.Posts, {
      foreignKey: 'userId', // Foreign key in Posts table
      onDelete: 'CASCADE', // Delete posts if user is deleted
      hooks: true // Enable cascading for associated records
    });

    // One user can have many likes
    Users.hasMany(models.Likes, {
      foreignKey: 'userId', // Foreign key in Likes table
      onDelete: 'CASCADE', // Delete likes if user is deleted
      hooks: true // Enable cascading for associated records
    });

    // One user can have many comments
    Users.hasMany(models.Comments, {
      foreignKey: 'userId', // Foreign key in Comments table
      onDelete: 'CASCADE', // Delete comments if user is deleted
      hooks: true // Enable cascading for associated records
    });
  };

  return Users;
};
