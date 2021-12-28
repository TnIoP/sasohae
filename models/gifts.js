const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const gifts = new mongoose.Schema({
    gift_id: {
        type: Number,
        required: true,
        unique: true,
        default: 0,
    },
    giftName: {
        type: String,
    },
    giftUrl: {
        type: String,
    },
    giftTarget: {
        type: String,
    },
    giftEvent: {
        type: String,
    },
    sex: {
        type: String,
    },
    age: {
        type: Number,
    },
    giftAnswerPersonality: {
        type: Boolean,
    },
    giftAnswerEmotional: {
        type: Boolean,
    },
    giftAnswerTrendy: {
        type: Boolean,
    },
    giftAnswerExpensive: {
        type: Boolean,
    },
    giftLikeCnt: {
        type: Number,
        default: 0,
    },
    giftResultCnt: {
        type: Number,
        default: 0,
    },
});

gifts.plugin(autoIncrement.plugin, {
    model: "gifts",
    field: "gift_id",
    startAt: 1,
    increment: 1,
});

module.exports = mongoose.model("gifts", gifts);
