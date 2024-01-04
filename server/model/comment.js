function Comment(sequelize, DataTypes){
    return sequelize.define(
        'Comment', {
            commentId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
              },
              memberId: {
                type: DataTypes.INTEGER,
                allowNull: false
              },
              boardId: {
                type: DataTypes.INTEGER,
                allowNull: false
              },
              title: {
                type: DataTypes.STRING(15),
                allowNull: false,
              },
              review: {
                type: DataTypes.STRING(50),
                allowNull: false
              },
              createdAt: {
                type: DataTypes.DATE,
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
              },
              updatedAt: {
                type: DataTypes.DATE,
                allowNull: true
              },
              stars: {
                type: DataTypes.INTEGER,
                allowNull: false
              },
              isAnonyous: {
                type: DataTypes.ENUM("true", "false"),
                allowNull: false,
                defaultValue: "false",
              },
            }, {
              tableName: 'Comment',
            freezeTableName: true,
            timestamps: true,
        }
    )
}

module.exports = Comment;