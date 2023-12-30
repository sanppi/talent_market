const express = require("express");
const router = express.Router();
const Cchatting = require("../controller/Cchatting");

router.get("/userCheck", Cchatting.userCheck);

router.get("/getSessionInfo", Cchatting.getSessionInfo);

module.exports = router;