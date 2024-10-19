import { Control } from "../constants/control.js";
import { FighterId, FighterState } from "../constants/fighter.js";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants/game.js";
import * as control from "../engine/InputHandler.js";
import { frontendPlayers } from "../index.js";

export class GameInitScene {

    letters = [
        "A", "B", "C", "D", "E", "F", "G", "H",
        "I", "J", "K", "L", "M", "N", "O", "P", 
        "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
    ]

    currentLetters = [0,0,0]

    selected = 0


    misc = document.querySelector('img[alt="misc"]');

    frames = new Map([
        //Numeric
        ['score-0', [17, 101, 10, 10]],
        ['score-1', [29, 101, 10, 10]],
        ['score-2', [41, 101, 10, 10]],
        ['score-3', [53, 101, 10, 10]],
        ['score-4', [65, 101, 11, 10]],
        ['score-5', [77, 101, 10, 10]],
        ['score-6', [89, 101, 10, 10]],
        ['score-7', [101, 101, 10, 10]],
        ['score-8', [113, 101, 10, 10]],
        ['score-9', [125, 101, 10, 10]],
        //Alpha
        ['score-@', [17, 113, 10, 10]],
        ['score-A', [29, 113, 11, 10]],
        ['score-B', [41, 113, 10, 10]],
        ['score-C', [53, 113, 10, 10]],
        ['score-D', [65, 113, 10, 10]],
        ['score-E', [77, 113, 10, 10]],
        ['score-F', [89, 113, 10, 10]],
        ['score-G', [101, 113, 10, 10]],
        ['score-H', [113, 113, 10, 10]],
        ['score-I', [125, 113, 9, 10]],
        ['score-J', [136, 113, 10, 10]],
        ['score-K', [149, 113, 10, 10]],
        ['score-L', [161, 113, 10, 10]],
        ['score-M', [173, 113, 10, 10]],
        ['score-N', [185, 113, 11, 10]],
        ['score-O', [197, 113, 10, 10]],
        ['score-P', [17, 125, 10, 10]],
        ['score-Q', [29, 125, 10, 10]],
        ['score-R', [41, 125, 10, 10]],
        ['score-S', [53, 125, 10, 10]],
        ['score-T', [65, 125, 10, 10]],
        ['score-U', [77, 125, 10, 10]],
        ['score-V', [89, 125, 10, 10]],
        ['score-W', [101, 125, 10, 10]],
        ['score-X', [113, 125, 10, 10]],
        ['score-Y', [125, 125, 10, 10]],
        ['score-Z', [136, 125, 10, 10]],
    ]);

    pointer = document.querySelector('img[alt=arrow]');
    
    
    constructor(SFGame, socket){
        this.socket = socket
        this.SFGame = SFGame
        //console.log(players);
    }

    update(time, context){
        if (control.isControlPressed(0, Control.LEFT)){
            this.selected = Math.max(0, this.selected - 1);
        } else if (control.isControlPressed(0, Control.RIGHT)){
            this.selected = Math.min(2, this.selected + 1);
        } else if (control.isControlPressed(0, Control.UP)){
            this.currentLetters[this.selected] = (this.currentLetters[this.selected] + 1) % 26
        } else if (control.isControlPressed(0, Control.DOWN)){
            this.currentLetters[this.selected] = (this.currentLetters[this.selected] - 1) % 26
            if(this.currentLetters[this.selected] < 0){
                this.currentLetters[this.selected] = 25
            }
        } else if (control.isControlPressed(0, Control.LIGHT_ATTACK)){
            if(!frontendPlayers[this.socket.id]) return
            var name = this.letters[this.currentLetters[0]] + this.letters[this.currentLetters[1]] + this.letters[this.currentLetters[2]]
            frontendPlayers[this.socket.id].name = name;
            this.socket.emit('namechange', name);
            this.socket.emit('playerinit', this.createPlayerInit())
            this.SFGame.changeScene("matchmaking",0,[],frontendPlayers[this.socket.id]);

        }
    }
    draw(context, _){
        //drawFrame(context, this.background, [0,0,SCREEN_WIDTH, SCREEN_HEIGHT], 0, 0);
        context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        this.drawArrow(context);
        this.drawLetters(context);
    }
    

    drawArrow(context){
        const x = this.getArrowX(this.selected);

        context.drawImage(
            this.pointer,
            0, 0, 25, 25,
            x, 28, 25, 25,
        )
    }

    drawLetters(context){
        this.drawLabel(context, this.letters[this.currentLetters[0]], this.getArrowX(0))
        this.drawLabel(context, this.letters[this.currentLetters[1]], this.getArrowX(1))
        this.drawLabel(context, this.letters[this.currentLetters[2]], this.getArrowX(2))
        this.drawLabel(context,"PRESS", 120, 150)
        this.drawLabel(context,"U", 195, 150)
        this.drawLabel(context,"TO", 220, 150)
        this.drawLabel(context,"CONTINUE", 135, 175)
    }

    drawLabel(context, label, x, y=70) {
        for(const index in label) {
            this.drawFrame(context, `score-${label.charAt(index)}`, x + index*12, y)
        }
    }

    drawFrame(context, frameKey, x, y){
        const [sourceX, sourceY, sourceWidth, sourceHeight] = this.frames.get(frameKey);

        context.drawImage(
            this.misc,
            sourceX, sourceY, sourceWidth, sourceHeight,
            x, y, sourceWidth*1.5, sourceHeight*1.5,
        )
        context.setTransform(1,0,0,1,0,0);//reset
    }

    getArrowX(selected){
        switch (selected) {
            case 0:
                return 125;
            case 1:
                return 175;
            case 2:
                return 225;
            default:
                return 0;
        }
    }

    createPlayerInit(){
        return {
            'special-1': 'ryu',
            'special-2': 'ryu',
            'special-3': 'ryu',
        }
    }
}