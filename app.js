const express = require('express')
const app = express()

app.set('view engine', 'ejs')

app.get("/", (req, res) => {
    res.redirect('/board');
})
app.get("/board", (req,res) => {
    res.render('board/board');
})

app.use("/api/board", require('./routes/board'))
app.listen(4000)