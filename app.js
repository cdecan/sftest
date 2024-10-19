import express from 'express'
const app = express()

// socket.io setup
import { createServer } from 'http'
const server = createServer(app)
import { Server } from 'socket.io'
const io = new Server(server);

const port = 3000;

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

const players = {}

io.on('connection', (socket) => {
    console.log("a user connected")
    players[socket.id] = {
        fighter: undefined,
        score: 0,
        name: "AAA",
        lfm: false
    }

    io.emit('updatePlayers', players)

    printPlayers()

    socket.on('disconnect', (reason) =>{
        console.log("a user disconnected")
        console.log(reason)
        delete players[socket.id]
        io.emit('updatePlayers', players)
        printPlayers()
    })

    

    socket.on('namechange', (newName) => {
        players[socket.id].name = newName
        printPlayers();
    })

    socket.on('playerinit', (newPlayer) => {
        players[socket.id].fighter = newPlayer
    })

    socket.on('matchmake', () => {
        console.log(players[socket.id].name + " is looking for a match");
    })
})

setInterval(() =>{
    io.emit('updatePlayers', players)
}, 15)

server.listen(port, () => {
    console.log(`Rogue Fighter listening on ${port}`)
})

function printPlayers(){
    console.log("PLAYERS:")
    for(var i in players){
        console.log(i + ":")
        console.log(players[i].name)
        console.log()
    }
}