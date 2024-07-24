const express = require('express')
const app = express()
const http = require('http')
const socket = require('socket.io')

const server = http.createServer(app)
const io = socket(server)

app.set('view engine', 'ejs')
app.use(express.static('public'))

io.on("connection", (socket) => {
    console.log(socket.id)
    socket.on("send-location", (data) => {
        io.emit("received-location", {id: socket.id, ...data})
    })
    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id)
    })
})

app.get("/", (req, res) => {
    res.render("index")
})

server.listen(3000)