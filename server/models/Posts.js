module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("Posts", {
    postId: { // Define postId as primary key
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postText: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: { // Foreign key to Users
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'userId', // Reference to userId in Users table
      },
    },
  });

  Posts.associate = (models) => {
    // One post can have many likes
    Posts.hasMany(models.Likes, {
      foreignKey: 'postId', // Foreign key in Likes table
      onDelete: 'CASCADE', // Delete likes if post is deleted
    });

    // One post can have many comments
    Posts.hasMany(models.Comments, {
      foreignKey: 'postId', // Foreign key in Comments table
      onDelete: 'CASCADE', // Delete comments if post is deleted
    });

    // A post belongs to a user
    Posts.belongsTo(models.Users, {
      foreignKey: 'userId', // Foreign key in Users table
      as: 'user', // Alias for association
    });
  };

  return Posts;
};
