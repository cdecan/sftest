import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants/game.js";
// import { frontendPlayers } from "../index.js";

export class MatchMaker {

    constructor(SFGame, socket){
        this.socket = socket
        this.SFGame = SFGame
    }

    update(time, context){
        this.socket.emit('matchmake')
    }

    draw(context, _){
        context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        context.font = "30px Arial";
        context.fillStyle = "white";
        context.fillText("Waiting for opponent", 10, 80)
    }
}