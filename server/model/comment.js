function Comment(sequelize, DataTypes){
    return sequelize.define(
        'Comment', {
            commentId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
              },
              memberId: {
                type: DataTypes.INTEGER,
                allowNull: false
              },
              boardId: {
                type: DataTypes.INTEGER,
                allowNull: false
              },
              review: {
                type: DataTypes.TEXT,
                allowNull: false
              },
              createdAt: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
              },
              updatedAt: {
                type: DataTypes.DATE,
                allowNull: true
              },
              stars: {
                type: DataTypes.INTEGER,
                allowNull: false
              }
            }, {
              tableName: 'Comment',
            freezeTableName: true,
            timestamps: true,
        }
    )
}

module.exports = Comment;