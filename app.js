const express = require('express')
const app = express()

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.get("/", (req, res) => {
    res.send("HELLO project")
})

app.use("/board", require('./routes/board'))

app.listen(4000)