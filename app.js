import express from 'express'
const app = express()

// socket.io setup
import { createServer } from 'http'
const server = createServer(app)
import { Server } from 'socket.io'
import { FighterHurtBox, FighterState } from './public/src/constants/fighter.js'
import { HEALTH_MAX_HP } from './public/src/constants/battle.js'
const io = new Server(server);

const port = 3000;

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

const players = {}
const playerQueue = []

io.on('connection', (socket) => {
    console.log("a user connected")
    players[socket.id] = {
        hitPoints: HEALTH_MAX_HP,
        socketId: socket.id,
        playerId: -1,
        fighter: undefined,
        score: 0,
        name: "AAA",
        fighterData: {
            position: {
                x: 0,
                y: 0,
            },
            velocity: {
                x: 0,
                y: 0,
            },
            currentState: FighterState.IDLE,
            animationFrame: 0,
            animationTimer: 0,
            winStart: false,
            winStop: false,
            hasHit: false,
            hurtBy: undefined,
            hurtShake: 0,
            hurtShakeTimer: 0,
            slideVelocity: 0,
            slideFriction: 0,
            boxes: {
                push: {x:0,y:0,width:0,height:0},
                hit: {x:0,y:0,width:0,height:0},
                hurt: {
                    [FighterHurtBox.HEAD]: [0,0,0,0],
                    [FighterHurtBox.BODY]: [0,0,0,0],
                    [FighterHurtBox.FEET]: [0,0,0,0],
                },
            },
            states: {},
            frames: {},
            animations: {},
            gravity: 0,


        }
    }

    io.emit('updatePlayers', players)

    printPlayers()

    socket.on('disconnect', (reason) =>{
        console.log("a user disconnected")
        console.log(reason)
        if(playerQueue.includes(players[socket.id])){
            const index = playerQueue.indexOf(players[socket.id]);
            playerQueue.splice(index, 1);
        }
        delete players[socket.id]
        io.emit('updatePlayers', players)
        printPlayers()
    })

    

    socket.on('namechange', (newName) => {
        players[socket.id].name = newName
        printPlayers();
    })

    socket.on('setPlayerId', (id) => {
        players[socket.id].playerId = id
    })

    socket.on('playerinit', (newPlayer) => {
        players[socket.id].fighter = newPlayer
        // players[socket.id].fighterData = {

        // }
        //players[socket.id].FighterData[]

    })

    socket.on('matchmake', () => {
        //console.log(playerQueue[0])
        if(!playerQueue.includes(players[socket.id])){
            playerQueue.push(players[socket.id])
            console.log("Player Queue:")
            console.log(playerQueue);
        }
        if(playerQueue.length > 1){
            //console.log(playerQueue.length)
            playerQueue[0].playerId = 0;
            playerQueue[1].playerId = 1;
            io.emit('makeMatch', playerQueue);
        }
        
    })

    socket.on('changeState', (newState, id) => {
        players[id].fighterData.currentState = newState;
    })

    socket.on('sendPlayerData', (fighter) => {
        players[socket.id].fighterData.currentState = fighter.currentState;
        players[socket.id].fighterData.position = fighter.position;
        players[socket.id].fighterData.velocity = fighter.velocity;
        players[socket.id].fighterData.animationFrame = fighter.animationFrame;
        players[socket.id].fighterData.animationTimer = fighter.animationTimer;
        players[socket.id].fighterData.hasHit = fighter.hasHit;
        players[socket.id].fighterData.hurtBy = fighter.hurtBy;
        players[socket.id].fighterData.hurtShake = fighter.hurtShake;
        players[socket.id].fighterData.hurtShakeTimer = fighter.hurtShakeTimer;
        players[socket.id].fighterData.slideVelocity = fighter.slideVelocity;
        players[socket.id].fighterData.slideFriction = fighter.slideFriction;
        players[socket.id].fighterData.boxes = fighter.boxes;
        players[socket.id].fighterData.states = fighter.states;
        players[socket.id].fighterData.frames = fighter.frames;
        players[socket.id].fighterData.animations = fighter.animations;
        players[socket.id].fighterData.gravity = fighter.gravity;

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