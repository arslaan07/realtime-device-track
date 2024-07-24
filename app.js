const express = require('express')
const app = express()
const http = require('http')
const socket = require('socket.io')
const path = require('path');

const server = http.createServer(app)
const io = socket(server)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))

io.on("connection", (socket) => {
    console.log('User connected:', socket.id);
    socket.on("send-location", (data) => {
        console.log('Location received from', socket.id, data);
        io.emit("received-location", {id: socket.id, ...data})
    })
    socket.on("disconnect", () => {
        console.log('User disconnected:', socket.id);
        io.emit("user-disconnected", socket.id)
    })
})

app.get("/", (req, res) => {
    res.render("index")
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

server.timeout = 60000;