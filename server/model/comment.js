function Comment(sequelize, DataTypes){
    return sequelize.define(
        'Comment', {
            commentId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            review: {
                type: DataTypes.TEXT,
            },
            stars: {
                type: DataTypes.INTEGER,
            },
            writtenAt: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Board",
                    key: 'boardId',
                },
                onDelete: 'CASCADE',
            },
            writtenBy: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Member",
                    key: 'memberId',
                },
                onDelete: 'CASCADE',
            },
        }, {
            tableName: 'Comment',
            freezeTableName: true,
            timestamps: true,
        }
    )
}

module.exports = Comment;