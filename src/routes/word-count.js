const router = require("express").Router()
const wordCountController = require("../controller/wordCountController")
const verifyToken = require("../middleware/jwtverify")

// wordcount crawling
router.post('/', wordCountController.getWordCount)
//getting history of a user by id
router.get('/history/:id', verifyToken, wordCountController.getHistory)
router.patch('/favourite/:id',  wordCountController.addToFavorites)
router.delete('/history/:id', wordCountController.deleteHistoryById);
    


module.exports = router;