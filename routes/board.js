const express = require('express')
const multer = require('multer')
const path = require('path')
const router = express.Router()

router.use(express.static('public'))
router.use(express.static('images'))
router.use(express.urlencoded({extends: true}))

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: imageStorage})

router.get('/', (req, res) => {
    res.render('board/board')
})

router.post('/', upload.single('messageImage'), (req, res) => {
    res.send("POST")
})

module.exports = router