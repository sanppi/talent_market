const express = require("express");
const router = express.Router();
const CchatRoom = require("../controller/CchatRoom");

router.get("/:id/getBoardInfo", CchatRoom.getBoardInfo);

module.exports = router;