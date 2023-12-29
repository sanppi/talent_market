const express = require("express");
const router = express.Router();
const Cchatting = require("../controller/Cchatting");

router.get("/userCheck", Cchatting.userCheck);

module.exports = router;