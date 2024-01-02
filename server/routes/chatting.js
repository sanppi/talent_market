const express = require("express");
const router = express.Router();
const Cchatting = require("../controller/Cchatting");

router.get("/getSessionInfo", Cchatting.getSessionInfo);

router.get("/userCheck", Cchatting.userCheck);
router.get("/getRoomList", Cchatting.getRoomList);

router.delete("/deleteRoom", Cchatting.deleteRoom);

module.exports = router;