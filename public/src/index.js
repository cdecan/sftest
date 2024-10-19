import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./constants/game.js";
import { drawFrame, getContext } from "./utils/context.js";
import { StreetFighterGame } from "./StreetFighterGame.js"

const socket = io();

export const frontendPlayers = {};

socket.on('updatePlayers', (backendPlayers) => {
    for(const id in backendPlayers){
        const backendPlayer = backendPlayers[id];

        if(!frontendPlayers[id]) {
            frontendPlayers[id] = {
                fighter: backendPlayer.player,
                score: backendPlayer.score,
                name: backendPlayer.name,
                lfm: backendPlayer.lfm
            }
        } else {
            //if player already exists
            frontendPlayers[id].name = backendPlayer.name
        }
    }

    for(const id in frontendPlayers){
        if(!backendPlayers[id]){
            delete frontendPlayers[id]
        }
    }

    //console.log(frontendPlayers)
})

window.addEventListener('load', function() {
    const context = getContext();
    const image = document.querySelector('img[alt=titleScreen]');;
    drawFrame(context, image, [0,0,SCREEN_WIDTH,SCREEN_HEIGHT], 0, 0);

    window.addEventListener('click', function(){
        new StreetFighterGame(socket).start();
    }, {once: true});
    
});