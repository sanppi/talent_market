function ChattingRoom(sequelize, DataTypes){
    return sequelize.define(
        'ChattingRoom', {
            roomId: {
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
              roomName: {
                type: DataTypes.STRING(100),
                allowNull: false
              }
            }, {
              tableName: 'ChattingRoom',
            freezeTableName: true,
            timestamps: false,
        }
    )
}

module.exports = ChattingRoom;