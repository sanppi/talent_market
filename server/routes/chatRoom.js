const express = require("express");
const router = express.Router();
const CchatRoom = require("../controller/CchatRoom");
const { upload } = require("../multer/multerConfig"); // Multer 설정 파일 import

router.get("/:id/getBoardInfo", CchatRoom.getBoardInfo);

router.get("/:id/getChatText", CchatRoom.getChatText);
router.post("/:id/postChat", CchatRoom.postChat);

router.get("/:id/getAccountNumber", CchatRoom.getAccountNumber);
router.patch("/:id/patchBuyerInfo", CchatRoom.patchBuyerInfo);

router.patch("/:id/patchChatState", CchatRoom.patchChatState);

router.post("/:id/sendFile",
upload.single("image"),
    CchatRoom.sendFile,
    (error, req, res, next) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        } else {
            next();
        }
    }
);

router.get("/:id/getFile", CchatRoom.getFile);

module.exports = router;