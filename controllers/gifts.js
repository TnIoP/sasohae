const gifts = require("../models/gifts");
const giftQuestions = require("../models/giftQuestions");
const giftUserData = require("../models/giftUserData");

async function getGiftQuestion(req, res) {
    try {
        const giftQuestionPersonality = await giftQuestions.find(
            { giftQuestionType: "personality" },
            { _id: false, giftQuestion: true, giftQuestion_id: true }
        );
        const giftQuestionEmotional = await giftQuestions.find(
            { giftQuestionType: "emotional" },
            { _id: false, giftQuestion: true, giftQuestion_id: true }
        );
        const giftQuestionTrendy = await giftQuestions.find(
            { giftQuestionType: "trendy" },
            { _id: false, giftQuestion: true, giftQuestion_id: true }
        );

        res.status(200).send({
            success: true,
            giftQuestionPersonality,
            giftQuestionEmotional,
            giftQuestionTrendy,
        });
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

async function addGiftResult(req, res) {
    try {
        const {
            giftTarget,
            giftEvent,
            sex,
            age,
            giftAnswerExpensive,
            giftAnswerPersonality,
            giftAnswerEmotional,
            giftAnswerTrendy,
        } = req.body;

        const giftAnswerP = giftAnswerPersonality[1];
        const giftAnswerE = giftAnswerEmotional[1];
        const giftAnswerT = giftAnswerTrendy[1];
        let surveyGifts = [];

        // giftUserData 컬렉션의 선물추천 데이터 수집용 답변 저장
        await giftUserData.create({
            giftTarget,
            giftEvent,
            sex,
            age,
            giftAnswerExpensive,
            giftAnswerPersonality,
            giftAnswerEmotional,
            giftAnswerTrendy,
        });

        /* gifts 컬렉션에서 답변에 맞는 선물 리스트 담기 */
        if (giftTarget === "8" || giftEvent === "9") {
            // 하찮은 선물인 경우
            const tempGiftList = await gifts.find(
                {
                    giftEvent: { $elemMatch: { $in: ["9"] } },
                },
                {
                    _id: false,
                    giftName: true,
                    giftUrl: true,
                    giftLikeCnt: true,
                    gift_id: true,
                }
            );

            tempGiftList.sort(() => Math.random() - Math.random());
            surveyGifts.push(tempGiftList[Object.keys(tempGiftList)[0]]);
            surveyGifts.push(tempGiftList[Object.keys(tempGiftList)[1]]);
            surveyGifts.push(tempGiftList[Object.keys(tempGiftList)[2]]);

            // 추천된 선물 카운트 증가
            const tempGift_0 = await gifts.findOne({
                giftName: surveyGifts[0].giftName,
            });
            await gifts.updateOne(
                { giftName: surveyGifts[0].giftName },
                { $set: { giftRecommendCnt: tempGift_0.giftRecommendCnt + 1 } }
            );
            const tempGift_1 = await gifts.findOne({
                giftName: surveyGifts[1].giftName,
            });
            await gifts.updateOne(
                { giftName: surveyGifts[1].giftName },
                { $set: { giftRecommendCnt: tempGift_1.giftRecommendCnt + 1 } }
            );
            const tempGift_2 = await gifts.findOne({
                giftName: surveyGifts[2].giftName,
            });
            await gifts.updateOne(
                { giftName: surveyGifts[2].giftName },
                { $set: { giftRecommendCnt: tempGift_2.giftRecommendCnt + 1 } }
            );

            // selectedGift_id 찾아서 보냄
            const getSelectedGift_id = await giftUserData
                .find(
                    {
                        $and: [
                            {
                                giftTarget: { $in: [giftTarget] },
                                giftEvent: { $in: [giftEvent] },
                                sex: { $in: [sex] },
                                age: { $in: [age] },
                                giftAnswerExpensive: {
                                    $in: [giftAnswerExpensive],
                                },
                                giftAnswerPersonality: {
                                    $elemMatch: { $in: [giftAnswerP] },
                                },
                                giftAnswerEmotional: {
                                    $elemMatch: { $in: [giftAnswerE] },
                                },
                                giftAnswerTrendy: {
                                    $elemMatch: { $in: [giftAnswerT] },
                                },
                            },
                        ],
                    },
                    {
                        selectedGift_id: true,
                        _id: false,
                    }
                )
                .limit(1)
                .sort({ $natural: -1 });
            const selectedGift_id = getSelectedGift_id[0].selectedGift_id;
            // 같은 답변이 있을 경우 가장 최근 사용자 데이터를 가져옴

            res.status(200).send({
                success: true,
                selectedGift_id: selectedGift_id,
                surveyGifts,
            });
        } else {
            // 하찮은 선물이 아닌 경우
            const all = "*"; // 전체 항목

            const tempGiftList = await gifts.find(
                {
                    $and: [
                        {
                            giftTarget: {
                                $elemMatch: { $in: [all, giftTarget] },
                            },
                            giftEvent: {
                                $elemMatch: { $in: [all, giftEvent] },
                            },
                            sex: { $in: [all, sex] },
                            age: { $elemMatch: { $in: [all, age] } },
                            giftAnswerExpensive: {
                                $in: [all, giftAnswerExpensive],
                            },
                            giftAnswerPersonality: { $in: [all, giftAnswerP] },
                            giftAnswerEmotional: { $in: [all, giftAnswerE] },
                            giftAnswerTrendy: { $in: [all, giftAnswerT] },
                        },
                    ],
                },
                {
                    _id: false,
                    giftName: true,
                    giftUrl: true,
                    giftLikeCnt: true,
                    gift_id: true,
                }
            );

            tempGiftList.sort(() => Math.random() - Math.random());
            surveyGifts.push(tempGiftList[Object.keys(tempGiftList)[0]]);
            surveyGifts.push(tempGiftList[Object.keys(tempGiftList)[1]]);
            surveyGifts.push(tempGiftList[Object.keys(tempGiftList)[2]]);

            // 추천된 선물 카운트 증가
            const tempGift_0 = await gifts.findOne({
                giftName: surveyGifts[0].giftName,
            });
            await gifts.updateOne(
                { giftName: surveyGifts[0].giftName },
                { $set: { giftRecommendCnt: tempGift_0.giftRecommendCnt + 1 } }
            );
            const tempGift_1 = await gifts.findOne({
                giftName: surveyGifts[1].giftName,
            });
            await gifts.updateOne(
                { giftName: surveyGifts[1].giftName },
                { $set: { giftRecommendCnt: tempGift_1.giftRecommendCnt + 1 } }
            );
            const tempGift_2 = await gifts.findOne({
                giftName: surveyGifts[2].giftName,
            });
            await gifts.updateOne(
                { giftName: surveyGifts[2].giftName },
                { $set: { giftRecommendCnt: tempGift_2.giftRecommendCnt + 1 } }
            );

            // selectedGift_id 찾아서 보냄
            const getSelectedGift_id = await giftUserData
                .find(
                    {
                        $and: [
                            {
                                giftTarget: { $in: [giftTarget] },
                                giftEvent: { $in: [giftEvent] },
                                sex: { $in: [sex] },
                                age: { $in: [age] },
                                giftAnswerExpensive: {
                                    $in: [giftAnswerExpensive],
                                },
                                giftAnswerPersonality: {
                                    $elemMatch: { $in: [giftAnswerP] },
                                },
                                giftAnswerEmotional: {
                                    $elemMatch: { $in: [giftAnswerE] },
                                },
                                giftAnswerTrendy: {
                                    $elemMatch: { $in: [giftAnswerT] },
                                },
                            },
                        ],
                    },
                    {
                        selectedGift_id: true,
                        _id: false,
                    }
                )
                .limit(1)
                .sort({ $natural: -1 });
            const selectedGift_id = getSelectedGift_id[0].selectedGift_id;
            // 같은 답변이 있을 경우 가장 최근 사용자 데이터를 가져옴

            res.status(200).send({
                success: true,
                selectedGift_id: selectedGift_id,
                surveyGifts,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

async function reviseGiftFeedback(req, res) {
    try {
        // giftUserData 테이블에 like한 선물 이름 반영
        const { selectedGift_id, selectedGift } = req.body;

        await giftUserData.updateOne(
            { selectedGift_id },
            { $push: { selectedGift: selectedGift } }
        );

        // gifts 테이블에 Like 반영
        const giftName = selectedGift;
        const { giftLikeCnt } = await gifts.findOne({ giftName: giftName });

        await gifts.updateOne(
            { giftName: giftName },
            { $set: { giftLikeCnt: giftLikeCnt + 1 } }
        );

        res.status(200).send({ success: true });
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

async function getRandomGift(req, res) {
    try {
        const randomGifts = await gifts.aggregate([
            { $sample: { size: 3 } },
            {
                $project: {
                    _id: false,
                    giftName: true,
                    giftUrl: true,
                    giftLikeCnt: true,
                    gift_id: true,
                },
            },
        ]);

        res.status(200).send({ success: true, randomGifts });
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

module.exports = {
    getGiftQuestion,
    addGiftResult,
    reviseGiftFeedback,
    getRandomGift,
};
