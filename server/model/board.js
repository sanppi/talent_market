function Board(sequelize, DataTypes) {
    return sequelize.define(
        'Board', {
            boardId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            price: {
                type: DataTypes.INTEGER, 
                allowNull: false,
            },
            likeNum: {
                type: DataTypes.INTEGER, 
            },
            starAvg: {
                type: DataTypes.DOUBLE,
            },
            image: {
                type: DataTypes.STRING(500), 
            },
            writtenBy: {
                type: DataTypes.INTEGER,
                // allowNull: false,
                // references: {
                //     model: "Member",
                //     key: 'memberId',
                // },
                // onDelete: 'CASCADE',
            },
            category: {
                type: DataTypes.STRING(50)
            },
            isOnMarket: {
                type: DataTypes.ENUM('yes', 'no'),
            }
        },{
            tableName: 'Board',
            freezeTableName: true,
            timestamps: true,
        }
    )
}

module.exports = Board;