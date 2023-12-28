function LikeBoardTable(sequelize, DataTypes){
    return sequelize.define(
        'LikeBoardTable', {
            likeId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            likeNum: {
                type: DataTypes.INTEGER,
            },
            isPushLike: {
                type: DataTypes.ENUM('true', 'false'),
            },
            likeBy: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Member",
                    key: 'memberId',
                },
                onDelete: 'CASCADE',
            },
            likeAt: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Board",
                    key: 'boardId',
                },
                onDelete: 'CASCADE',
            },
        }, {
            tableName: 'LikeBoardTable',
            freezeTableName: true,
            timestamps: false,
        }
    )
}

module.exports = LikeBoardTable;