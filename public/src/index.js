import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./constants/game.js";
import { drawFrame, getContext } from "./utils/context.js";
import { StreetFighterGame } from "./StreetFighterGame.js"
import { SceneTypes } from "./constants/scenes.js";

export const socket = io();

export const frontendPlayers = {};

const SFGame = new StreetFighterGame(socket);

socket.on('updatePlayers', (backendPlayers) => {
    for(const id in backendPlayers){
        const backendPlayer = backendPlayers[id];

        if(!frontendPlayers[id]) {
            frontendPlayers[id] = {
                socketId: backendPlayer.socketId,
                playerId: backendPlayer.playerId,
                fighter: backendPlayer.fighter,
                score: backendPlayer.score,
                name: backendPlayer.name,
                fighterData: backendPlayer.fighterData,
                hitPoints: backendPlayer.hitPoints
            }
        } else {
            //if player already exists
            frontendPlayers[id].fighter = backendPlayer.fighter;
            frontendPlayers[id].playerId = backendPlayer.playerId;
            frontendPlayers[id].name = backendPlayer.name;
            frontendPlayers[id].score = backendPlayer.score;
            frontendPlayers[id].fighterData = backendPlayer.fighterData;
            frontendPlayers[id].hitPoints = backendPlayer.hitPoints;
        }
    }

    for(const id in frontendPlayers){
        if(!backendPlayers[id]){
            delete frontendPlayers[id]
        }
    }

    //console.log(frontendPlayers)
})

socket.on('makeMatch', (playerQueue) => {
    var fighters = [playerQueue[0], playerQueue[1]]
    SFGame.changeScene(SceneTypes.FIGHTING_GAME, 0, fighters)
})

window.addEventListener('load', function() {
    const context = getContext();
    const image = document.querySelector('img[alt=titleScreen]');;
    drawFrame(context, image, [0,0,SCREEN_WIDTH,SCREEN_HEIGHT], 0, 0);

    window.addEventListener('click', function(){
        SFGame.start();
    }, {once: true});
    
});