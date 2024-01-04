const express = require("express");
const router = express.Router();
const Cchatting = require("../controller/Cchatting");

router.get("/getBuyRoomList", Cchatting.getBuyRoomList);
router.get("/getSellRoomList", Cchatting.getSellRoomList);

router.delete("/deleteRoom", Cchatting.deleteRoom);

module.exports = router;