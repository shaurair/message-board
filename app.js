const express = require('express')
const app = express()

app.use(express.static('public'))
app.get("/", (req, res) => {
    res.send("HELLO project")
})

app.use("/board", require('./routes/board'))

app.listen(4000)