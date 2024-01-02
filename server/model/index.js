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
db.ChattingtText = require("./ChattingtText")(sequelize, Sequelize);
db.Comment = require("./comment")(sequelize, Sequelize);
db.LikeBoardTable = require("./LikeBoardTable")(sequelize, Sequelize);
db.Member = require("./Member")(sequelize, Sequelize);
db.Stars = require("./Stars")(sequelize, Sequelize);

// Member와 Board 연결 (1대 다)
db.Member.hasMany(db.Board, { foreignKey: 'memberId' });
db.Board.belongsTo(db.Member, { foreignKey: 'memberId' });

// Member와 Comment 연결 (1대 다)
db.Member.hasMany(db.Comment, { foreignKey: 'writtenBy', sourceKey: 'memberId' });
db.Comment.belongsTo(db.Member, { foreignKey: 'writtenBy', targetKey: 'memberId' });


// Board와 Comment 연결 (1대 다)
db.Board.hasMany(db.Comment, { foreignKey: 'boardId' });
db.Comment.belongsTo(db.Board, { foreignKey: 'boardId' });

// Member와 LikeBoardTable 연결 (1대 다)
db.Member.hasMany(db.LikeBoardTable, { foreignKey: 'memberId' });
db.LikeBoardTable.belongsTo(db.Member, { foreignKey: 'memberId' });

// Board와 LikeBoardTable 연결 (1대 다)
db.Board.hasMany(db.LikeBoardTable, { foreignKey: 'boardId' });
db.LikeBoardTable.belongsTo(db.Board, { foreignKey: 'boardId' });

// Board와 Stars 연결 (1대 1)
db.Stars.hasMany(db.Board, {foreignKey: 'starAvg'});
db.Board.belongsTo(db.Stars, {foreignKey: 'starAvg'});

db.Member.hasMany(db.ChattingRoom, { foreignKey: 'sellerMemberId', sourceKey: 'memberId' });
db.ChattingRoom.belongsTo(db.Member, { foreignKey: 'sellerMemberId', targetKey: 'memberId' });

db.Member.hasMany(db.ChattingRoom, { foreignKey: 'buyerMemberId', sourceKey: 'memberId' });
db.ChattingRoom.belongsTo(db.Member, { foreignKey: 'buyerMemberId', targetKey: 'memberId' });


db.Board.hasMany(db.ChattingRoom, { foreignKey: 'boardId' });
db.ChattingRoom.belongsTo(db.Board, { foreignKey: 'boardId' });

db.Member.hasMany(db.ChattingList, { foreignKey: 'memberId' });
db.ChattingList.belongsTo(db.Member, { foreignKey: 'memberId' });

db.ChattingRoom.hasMany(db.ChattingList, { foreignKey: 'roomId' });
db.ChattingList.belongsTo(db.ChattingRoom, { foreignKey: 'roomId' });

db.ChattingRoom.hasMany(db.ChattingtText, { foreignKey: 'roomId' });
db.ChattingtText.belongsTo(db.ChattingRoom, { foreignKey: 'roomId' });

module.exports = db;