function ChattingRoom(sequelize, DataTypes){
    return sequelize.define(
        'ChattingRoom', {
            roomId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            recordedChatting: {
                type: DataTypes.TEXT,
            },
            merchantId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Member",
                    key: 'memberId',
                },
                onDelete: 'CASCADE',
            },
            customerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Member",
                    key: 'memberId',
                },
                onDelete: 'CASCADE',
            },
        }, {
            tableName: 'ChattingRoom',
            freezeTableName: true,
            timestamps: false,
        }
    )
}

module.exports = ChattingRoom;