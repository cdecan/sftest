import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../constants/game.js";
import { drawFrame } from "../utils/context.js";
import * as control from "../engine/InputHandler.js";
import { SceneTypes } from "../constants/scenes.js";
import { Control } from "../constants/control.js";
import { Ryu } from "../entities/fighters/Ryu.js";

export class MoveSelectScene {
    fighters = [];
    background = document.querySelector('img[alt=moveSelector]');
    pointer = document.querySelector('img[alt=arrow]');
    misc = document.querySelector('img[alt="misc"]');
    selected = 1;

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

    constructor(fighters, winnerID, SFGame){
        this.fighters = fighters;
        if(this.fighters.length == 0) {
            this.fighters = [new Ryu()];
        }
        this.winnerID = winnerID;
        this.SFGame = SFGame;
        //return Math.floor(Math.random() * (max - min + 1) + min);
        this.specialAssignments = [Math.floor(Math.random() * (2)), Math.floor(Math.random() * (2) + 1), Math.floor(Math.random() * (2) + 1)];
        this.specials = [Math.floor(Math.random() * (2)), Math.floor(Math.random() * (2) + 1), Math.floor(Math.random() * (2) + 1)];
    }



    update(time, context){
        if (control.isAnyAttack(this.winnerID)){
            //this.fighters[this.winnerID].changeSpecial(this.specialAssignments[this.selected], )
            this.SFGame.changeScene(SceneTypes.FIGHTING_GAME);
        } else if (control.isControlPressed(this.winnerID, Control.LEFT)){
            this.selected = Math.max(0, this.selected - 1);
        } else if (control.isControlPressed(this.winnerID, Control.RIGHT)){
            this.selected = Math.min(2, this.selected + 1);
        }
    }
    draw(context, _){
        drawFrame(context, this.background, [0,0,SCREEN_WIDTH,SCREEN_HEIGHT], 0, 0);
        this.drawTitleText(context, this.winnerID);
        this.drawArrow(context);
        this.drawSpecials(context);
        this.drawSpecialLabels(context);
    }

    drawSpecialLabels(context){
        this.drawLabel(context, this.getSpecialInputs(this.specialAssignments[0]), 55, 65);
        this.drawLabel(context, this.getSpecialInputs(this.specialAssignments[1]), 173, 65);
        this.drawLabel(context, this.getSpecialInputs(this.specialAssignments[2]), 290, 65);
    }

    getSpecialInputs(i){
        switch (i) {
            case 0:
                return "236";
            case 1:
                return "214";
            case 2:
                return "623";
            default:
                break;
        }
    }

    drawSpecials(context){
        //drawFrame(context, fighters[0].image, [0,0,5,5], 30, 30);
        drawFrame(context, this.fighters[0].image, [9,136,53,83], 48, 85);
        drawFrame(context, this.fighters[0].image, [9,136,53,83], 165, 85);
        drawFrame(context, this.fighters[0].image, [9,136,53,83], 280, 85);
    }

    getArrowX(selected){
        switch (selected) {
            case 0:
                return 62;
            case 1:
                return 176;
            case 2:
                return 294;
            default:
                return 0;
        }
    }

    drawArrow(context){
        const x = this.getArrowX(this.selected);

        context.drawImage(
            this.pointer,
            0, 0, 25, 25,
            x, 28, 25, 25,
        )
    }

    drawTitleText(context, id){
        this.drawLabel(context, `PLAYER`, 110);
        this.drawLabel(context, `${id+1}`, 190);
        this.drawLabel(context, "WINS", 210)
    }

    drawLabel(context, label, x, y=15) {
        for(const index in label) {
            this.drawFrame(context, `score-${label.charAt(index)}`, x + index*12, y)
        }
    }

    drawFrame(context, frameKey, x, y, direction=1){
        drawFrame(context, this.misc, this.frames.get(frameKey), x, y, direction);
    }

}