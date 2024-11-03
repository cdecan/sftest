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
const battles = []
const highScoreList = [
    {name: "AAA", score: 0},
    {name: "BBB", score: 0},
    {name: "CCC", score: 0},
    {name: "DDD", score: 0},
    {name: "EEE", score: 0}
]

io.on('connection', (socket) => {
    console.log("a user connected")
    players[socket.id] = {
        hitPoints: HEALTH_MAX_HP,
        socketId: socket.id,
        opponentSocketId: undefined,
        playerId: -1,
        fighter: undefined,
        score: 0,
        name: "AAA",
        inQueue: false,
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
            fireballFired: false,
            opponentFireballFired: false,

        },
        fighterSceneData: {
            fighterDrawOrder: [0,1],
            hurtTimer: undefined,
            entityList: [],
            needEntityUpdate: false,
        }
    }

    io.emit('updatePlayers', players)

    printPlayers()

    socket.on('disconnect', (reason) =>{
        console.log("a user disconnected")
        console.log(reason)
        //update high score
        // for(tuple of this.highScoreList){
        //     if()
        // }


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
        players[socket.id].hitPoints = HEALTH_MAX_HP

    })

    socket.on('matchmake', () => {
        if(players[socket.id].inQueue) return;
        if(!playerQueue.includes(players[socket.id])){
            playerQueue.push(players[socket.id])
            players[socket.id].inQueue = true;
            console.log("Player Added to Queue")
        }
        console.log("Player Queue:")
        let attrs = playerQueue.map(a => a.socketId)
        console.log(attrs);
    })

    socket.on('changeState', (newState, id) => {
        players[id].fighterData.currentState = newState;
    })

    socket.on('sendPlayerData', (data) => {
        players[socket.id].fighterData.currentState = data.currentState;
        players[socket.id].fighterData.position = data.position;
        players[socket.id].fighterData.velocity = data.velocity;
        players[socket.id].fighterData.animationFrame = data.animationFrame;
        players[socket.id].fighterData.animationTimer = data.animationTimer;
        players[socket.id].fighterData.hasHit = data.hasHit;
        players[socket.id].fighterData.hurtBy = data.hurtBy;
        players[socket.id].fighterData.hurtShake = data.hurtShake;
        players[socket.id].fighterData.hurtShakeTimer = data.hurtShakeTimer;
        players[socket.id].fighterData.slideVelocity = data.slideVelocity;
        players[socket.id].fighterData.slideFriction = data.slideFriction;
        players[socket.id].fighterData.boxes = data.boxes;
        // players[socket.id].fighterData.states = data.states;
        // players[socket.id].fighterData.frames = data.frames;
        // players[socket.id].fighterData.animations = data.animations;
        players[socket.id].fighterData.gravity = data.gravity;
        players[socket.id].fighterSceneData.fighterDrawOrder = data.fighterDrawOrder;
        players[socket.id].fighterSceneData.hurtTimer = data.hurtTimer;

    })

    socket.on('dealDamage', (damage) => {
        players[players[socket.id].opponentSocketId].hitPoints -= damage;
    })

    socket.on('entitiesChanged', (entities) => {
        for(var item of battles[0]){
            item.fighterSceneData.entityList = entities;
            item.fighterSceneData.needEntityUpdate = true;
        }
    })

    socket.on('entitiesSet', () => {
        for(var item of battles[0]){
            item.fighterSceneData.needEntityUpdate = false;
        }
    })

    socket.on('setFireballFired', (value) => {
        players[socket.id].fighterData.fireballFired = value;
    })

    socket.on('signalNewFireball', () => {
        players[players[socket.id].opponentSocketId].fighterData.opponentFireballFired = true;
    })

    socket.on('fireballRecieved', () => {
        players[socket.id].fighterData.opponentFireballFired = false;
    })

})

setInterval(() =>{
    io.emit('updatePlayers', players)

    if(playerQueue.length > 1){
        playerQueue[0].playerId = 0;
        playerQueue[0].opponentSocketId = playerQueue[1].socketId;
        playerQueue[1].playerId = 1;
        playerQueue[1].opponentSocketId = playerQueue[0].socketId;
        io.to(playerQueue[0].socketId).emit('makeMatch', playerQueue);
        io.to(playerQueue[1].socketId).emit('makeMatch', playerQueue);
        battles.push([playerQueue[0], playerQueue[1]])
        let player1 = playerQueue.splice(0, 1);
        let player2 = playerQueue.splice(0, 1);
        player1.inQueue = false;
        player2.inQueue = false;
        console.log("Players Removed From Queue")
    }

}, 15)

server.listen(port, () => {
    console.log(`Rogue Fighter listening on ${port}`)
})

function printPlayers(){
    console.log("PLAYERS:")
    console.log()
    for(var i in players){
        console.log(i + " : " + players[i].name)
    }
    console.log()
}