const express = require("express");
const router = express.Router();
const CchatRoom = require("../controller/CchatRoom");

router.get("/:id/getBoardInfo", CchatRoom.getBoardInfo);

router.get("/:id/getChatText", CchatRoom.getChatText);
router.post("/:id/postChat", CchatRoom.postChat);

router.get("/:id/getAccountNumber", CchatRoom.getAccountNumber);
router.patch("/:id/patchBuyerInfo", CchatRoom.patchBuyerInfo);

module.exports = router;