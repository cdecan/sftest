import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./constants/game.js";
import { StreetFighterGame } from "./StreetFighterGame.js";
import { drawFrame, getContext } from "./utils/context.js";



window.addEventListener('load', function() {
    const context = getContext();
    const image = document.querySelector('img[alt=titleScreen]');;
    drawFrame(context, image, [0,0,SCREEN_WIDTH,SCREEN_HEIGHT], 0, 0);

    window.addEventListener('click', function(){
        new StreetFighterGame().start();
    }, {once: true});
    
});