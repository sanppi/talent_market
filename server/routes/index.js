const express = require('express');
const router = express.Router();
const controller = require('../controller/index');

// 메인 페이지
router.get('/', controller.index);

// 검색 기능
router.get('/search', controller.search);

// 카테고리
router.get('/category', controller.categories)

router.post('/getSession', controller.getSession);

module.exports = router;
