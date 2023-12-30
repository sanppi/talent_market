const express = require("express");
const router = express.Router();
const Cchatting = require("../controller/Cchatting");

router.get("/getSessionInfo", Cchatting.getSessionInfo);

router.get("/userCheck", Cchatting.userCheck);
router.get("/getRoomList", Cchatting.getRoomList);

module.exports = router;