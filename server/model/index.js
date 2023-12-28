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
db.Member = require("./Member")(sequelize, Sequelize);
db.Board = require("./Board")(sequelize, Sequelize);
db.Comment = require("./Comment")(sequelize, Sequelize);
db.ChattingRoom = require("./ChattingRoom")(sequelize, Sequelize);
db.LikeBoardTable = require("./LikeBoardTablem")(sequelize, Sequelize);

// Member와 Board 연결 (1대 다)
db.Member.hasMany(db.Board, { foreignKey: 'writtenBy', sourceKey: 'memberId' });
db.Board.belongsTo(db.Member, { foreignKey: 'writtenBy', targetKey: 'memberId' });

// Member와 Comment 연결 (1대 다)
db.Member.hasMany(db.Comment, { foreignKey: 'writtenBy', sourceKey: 'memberId' });
db.Comment.belongsTo(db.Member, { foreignKey: 'writtenBy', targetKey: 'memberId' });

// Board와 Comment 연결 (1대 다)
db.Board.hasMany(db.Comment, { foreignKey: 'writtenAt', sourceKey: 'boardId' });
db.Comment.belongsTo(db.Board, { foreignKey: 'writtenAt', targetKey: 'boardId' });

// 채팅방 연결은 일단 패스했습니다.

// Member와 LikeBoardTable 연결 (1대 다)
db.Member.hasMany(db.Comment, { foreignKey: 'likeBy', sourceKey: 'memberId' });
db.LikeBoardTable.belongsTo(db.Member, { foreignKey: 'likeBy', targetKey: 'memberId' });

// Board와 LikeBoardTable 연결 (1대 다)
db.Board.hasMany(db.Comment, { foreignKey: 'likeAt', sourceKey: 'boardId' });
db.LikeBoardTable.belongsTo(db.Board, { foreignKey: 'likeAt', targetKey: 'boardId' });

module.exports = db;