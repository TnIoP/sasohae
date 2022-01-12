const express = require("express");
const router = express.Router();

/* ==================== controllers ==================== */
const {
    getGiftQuestion,
    addGiftResult,
    reviseGiftFeedback,
    giftRecommend,
    getRandomGift,
} = require("../controllers/gifts");
const {
    getMoneyQuestion,
    moneyQuestionAnswer,
} = require("../controllers/money");
const { getMenu, likeMenu, recommendMenu } = require("../controllers/menus");
const { createBoard, getSelectedBoards } = require("../controllers/boards");
const {
    createMoneyQuestions,
    createMenu,
    createGift,
    createGiftQuestions,
} = require("../controllers/admin");
const imgUpload = require("../controllers/imgUpload");
const {
    getTopRankedGifts,
    getTopRankedMenus,
} = require("../controllers/ranking");
const createAccessTime = require("../controllers/userAccessTime");
/* ================================================== */

/* ==================== middleware ==================== */
const upload = require("../middleware/upload");
const {
    userVisit,
    useGift,
    useRandomGift,
    useMoney,
    useMenu,
    userVisitBoard,
    writeBoard,
} = require("../middleware/statistic");
/* ================================================== */

/* ==================== router ==================== */
router.put("/main", userVisit, createAccessTime);
router.put("/money", useMoney);
// router.put("/comments", userVisitBoard);

router.get("/gifts", useGift, getGiftQuestion);
router.post("/gifts", addGiftResult);
router.put("/gifts/like", reviseGiftFeedback);
router.put("/gifts/recommend", giftRecommend);
router.get("/gifts/random", useRandomGift, getRandomGift);
router.get("/gifts/ranking", getTopRankedGifts);
router.get("/gifts/options", getTopRankedGifts);

router.get("/money", getMoneyQuestion);
router.post("/money", moneyQuestionAnswer);

router.post("/menu", getMenu);
router.put("/menu", useMenu, likeMenu);
router.put("/menu/recommend", recommendMenu);
router.get("/menu/ranking", getTopRankedMenus);

router.post("/comments", writeBoard, createBoard);
router.get("/comments", userVisitBoard, getSelectedBoards);

// router.post("/admin/image", upload.single("img"), imgUpload);

router.post("/admin/gifts", upload.single("img"), createGift);
router.post("/admin/gifts/questions", createGiftQuestions);
router.post("/admin/money", createMoneyQuestions);
router.post("/admin/menu", upload.single("img"), createMenu);
/* ================================================== */

module.exports = router;
