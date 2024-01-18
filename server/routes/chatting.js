const express = require("express");
const router = express.Router();
const Cchatting = require("../controller/Cchatting");

router.get("/getBuyRoomList", Cchatting.getBuyRoomList);
router.get("/getSellRoomList", Cchatting.getSellRoomList);

module.exports = router;