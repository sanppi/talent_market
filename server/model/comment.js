function comment(sequelize, DataTypes){
    return sequelize.define(
        'comment', {
            commentId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            comment: {
                type: DataTypes.TEXT,
            },
            writtenAt: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "board",
                    key: 'boardId',
                },
                onDelete: 'CASCADE',
            },
            writtenBy: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "member",
                    key: 'memberId',
                },
                onDelete: 'CASCADE',
            },
        }, {
            tableName: 'comment',
            freezeTableName: true,
            timestamps: true,
        }
    )
}

module.exports = comment;