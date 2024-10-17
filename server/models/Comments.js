module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define("Comments", {
    commentId: { // Primary key for comments
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    commentBody: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Comment body cannot be empty" }, // Ensure comment body is not empty
      },
    },
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
    refId:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Posts',
        key: 'postId', // Reference to postId in Posts table
      },
      validate: {
        notNull: { msg: "Post ID is required" }, // Ensure postId is not null
      },
    }
  });

  Comments.associate = (models) => {
    // Define relationships
    Comments.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE', // Delete comments if user is deleted
      as: 'user', // Alias for association
    });

    Comments.belongsTo(models.Posts, {
      foreignKey: 'postId',
      onDelete: 'CASCADE', // Delete comments if post is deleted
      as: 'post', // Alias for association
    });
  };

  return Comments;
};
