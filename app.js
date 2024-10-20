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
            battles.push([playerQueue[0], playerQueue[1]])
            io.emit('makeMatch', playerQueue);
        }
        
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
        players[socket.id].hitPoints -= damage;
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