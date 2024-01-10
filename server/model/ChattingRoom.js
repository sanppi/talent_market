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
              },
              chatState: {
                type: DataTypes.ENUM("ready", "want", "sale", "done", "check"),
                allowNull: false,
                defaultValue: "ready",
              },
              canRedCard: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
              },
              canReview: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
              },
              image: {
                type: DataTypes.TEXT,
                allowNull: true,
              },
            }, {
              tableName: 'ChattingRoom',
            freezeTableName: true,
            timestamps: false,
        }
    )
}

module.exports = ChattingRoom;