const Sequelize = require("sequelize");
const config = require("../config/config.json")["development"];

const db = {};
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// 테이블 불러오기
db.Board = require("./board")(sequelize, Sequelize);
db.ChattingList = require("./ChattingList")(sequelize, Sequelize);
db.ChattingRoom = require("./ChattingRoom")(sequelize, Sequelize);
db.ChattingText = require("./ChattingText")(sequelize, Sequelize);
db.Comment = require("./comment")(sequelize, Sequelize);
db.LikeBoardTable = require("./LikeBoardTable")(sequelize, Sequelize);
db.Member = require("./Member")(sequelize, Sequelize);

// Member와 Board 연결 (1대 다)
db.Member.hasMany(db.Board, { foreignKey: 'memberId' });
db.Board.belongsTo(db.Member, { foreignKey: 'memberId' });

// Member와 Comment 연결 (1대 다)
db.Member.hasMany(db.Comment, { foreignKey: 'memberId' });
db.Comment.belongsTo(db.Member, { foreignKey: 'memberId' });

// Board와 Comment 연결 (1대 다)
db.Board.hasMany(db.Comment, { foreignKey: 'boardId' });
db.Comment.belongsTo(db.Board, { foreignKey: 'boardId' });

// Member와 LikeBoardTable 연결 (1대 다)
db.Member.hasMany(db.LikeBoardTable, { foreignKey: 'memberId' });
db.LikeBoardTable.belongsTo(db.Member, { foreignKey: 'memberId' });

// Board와 LikeBoardTable 연결 (1대 다)
db.Board.hasMany(db.LikeBoardTable, { foreignKey: 'boardId' });
db.LikeBoardTable.belongsTo(db.Board, { foreignKey: 'boardId' });

db.Member.hasMany(db.ChattingRoom, { foreignKey: 'memberId' });
db.ChattingRoom.belongsTo(db.Member, { foreignKey: 'memberId' });

db.Board.hasMany(db.ChattingRoom, { foreignKey: 'boardId' });
db.ChattingRoom.belongsTo(db.Board, { foreignKey: 'boardId' });

db.Member.hasMany(db.ChattingList, { foreignKey: 'memberId' });
db.ChattingList.belongsTo(db.Member, { foreignKey: 'memberId' });

db.ChattingRoom.hasMany(db.ChattingList, { foreignKey: 'roomId' });
db.ChattingList.belongsTo(db.ChattingRoom, { foreignKey: 'roomId' });

db.ChattingRoom.hasMany(db.ChattingText, { foreignKey: 'roomId' });
db.ChattingText.belongsTo(db.ChattingRoom, { foreignKey: 'roomId' });

module.exports = db;