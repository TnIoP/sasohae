const {
    createGiftRanking,
    createMenuRanking,
} = require("../functions/rankingUpdate");

async function getTopRankedGifts(req, res) {
    try {
        const result = await createGiftRanking();
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

async function getTopRankedMenus(req, res) {
    try {
        const result = await createMenuRanking();
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

module.exports = { getTopRankedGifts, getTopRankedMenus };
