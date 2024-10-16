module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define("Likes", {
    userId: { // Foreign key to Users
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'userId', // Reference to userId in Users table
      },
      validate: {
        notNull: { msg: "User ID is required" }, // Ensure userId is not null
      },
    },
    postId: { // Foreign key to Posts
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Posts',
        key: 'postId', // Reference to postId in Posts table
      },
      validate: {
        notNull: { msg: "Post ID is required" }, // Ensure postId is not null
      },
    },
    createdAt: { // Track when a like was created
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false, // Ensure createdAt is not null
    },
  });

  Likes.associate = (models) => {
    // Define relationships
    Likes.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE', // Delete likes if user is deleted
      as: 'user', // Alias for association
    });

    Likes.belongsTo(models.Posts, {
      foreignKey: 'postId',
      onDelete: 'CASCADE', // Delete likes if post is deleted
      as: 'post', // Alias for association
    });
  };

  return Likes;
};
