function ChattingList(sequelize, DataTypes){
    return sequelize.define(
        'ChattingList', {
            roomListId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
              },
              memberId: {
                type: DataTypes.INTEGER,
                allowNull: false
              },
              roomId: {
                type: DataTypes.INTEGER,
                allowNull: false
              }
            }, {
              tableName: 'ChattingList',
            freezeTableName: true,
            timestamps: false,
        }
    )
}

module.exports = ChattingList;