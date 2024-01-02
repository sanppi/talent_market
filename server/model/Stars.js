function Stars(sequelize, DataTypes){
    return sequelize.define(
        'Stars', {
            starId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            count: {
                type: DataTypes.INTEGER,
            },
            starNum: {
                type: DataTypes.INTEGER, 
            },
            starAvg: {
                type: DataTypes.FLOAT, 
            }
            }, {
                tableName: 'Stars',
                freezeTableName: true,
                timestamps: false,
        }
    )
}

module.exports = Stars;