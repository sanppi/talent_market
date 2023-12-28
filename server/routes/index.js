const express = require("express");
const router = express.Router();
const controller = require("../controller/index");
const Cboard = require("../controller/Cboard");

// 메인 페이지
router.get("/", controller.index);

module.exports = router;