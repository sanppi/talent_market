const express = require("express");
const router = express.Router();
const controller = require("../controller/index");

// 메인 페이지
router.get("/", controller.index);

module.exports = router;