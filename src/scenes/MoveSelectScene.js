import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../constants/game.js";
import { drawFrame } from "../utils/context.js";
import * as control from "../engine/InputHandler.js";
import { SceneTypes } from "../constants/scenes.js";
import { Control } from "../constants/control.js";
import { Ryu } from "../entities/fighters/Ryu.js";
import { FighterState } from "../constants/fighter.js";
import { Cammy } from "../entities/fighters/Cammy.js";

export class MoveSelectScene {
    fighters = [];
    background = document.querySelector('img[alt=moveSelector]');
    pointer = document.querySelector('img[alt=arrow]');
    misc = document.querySelector('img[alt="misc"]');
    selected = 1;

    potentialSpecials = {
        'ryu': [FighterState.SPECIAL_1, FighterState.SPECIAL_2, FighterState.SPECIAL_3],
        'cammy': [FighterState.SPECIAL_1],
    };

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

        this.specialCharacters = [];
        this.specials = [];

        for(var i = 0; i < 3; i++){
            var randomFighter = this.randomProperty(this.potentialSpecials);
            var randomSpecial = this.potentialSpecials[randomFighter][Math.floor(Math.random()*this.potentialSpecials[randomFighter].length)];
            this.specialCharacters.push(this.getFighterEntity(randomFighter));
            this.specials.push(randomSpecial);
        }

    }


    
    randomProperty(obj) {
        const keys = Object.keys(obj);
        const len = keys.length;
        const rnd = Math.floor(Math.random() * len);
        return keys[rnd];
    };

    update(time, context){
        if (control.isAnyAttack(this.winnerID)){
            this.fighters[this.winnerID].changeSpecial(this.getSpecialNumber(this.specials[this.selected]), this.specials[this.selected], this.specialCharacters[this.selected])
            this.SFGame.changeScene(SceneTypes.FIGHTING_GAME, this.winnerID, this.fighters);
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
        this.drawLabel(context, this.getSpecialInputs(this.specials[0]), 55, 65);
        this.drawLabel(context, this.getSpecialInputs(this.specials[1]), 173, 65);
        this.drawLabel(context, this.getSpecialInputs(this.specials[2]), 290, 65);
    }

    getSpecialNumber(i){
        switch (i) {
            case 'special-1':
                return 1;
            case 'special-2':
                return 2;
            case 'special-3':
                return 3;
            default:
                break;
        }
    }

    getSpecialInputs(i){
        switch (i) {
            case 'special-1':
                return "236";
            case 'special-2':
                return "214";
            case 'special-3':
                return "623";
            default:
                break;
        }
    }

    drawSpecials(context){
        //special 1
        var [frameKey] = this.specialCharacters[0].animations[this.specials[0]][3];
        var[[
            [x,y,width,height],
            [originX, originY],
        ]] = this.specialCharacters[0].frames.get(frameKey);
        drawFrame(context, this.specialCharacters[0].image, [x,y,width,height], 48, 85);
        //special 2
        var [frameKey] = this.specialCharacters[1].animations[this.specials[1]][3];
        var[[
            [x,y,width,height],
            [originX, originY],
        ]] = this.specialCharacters[1].frames.get(frameKey);
        drawFrame(context, this.specialCharacters[1].image, [x,y,width,height], 165, 85);
        //special 3
        var [frameKey] = this.specialCharacters[2].animations[this.specials[2]][3];
        var[[
            [x,y,width,height],
            [originX, originY],
        ]] = this.specialCharacters[2].frames.get(frameKey);
        drawFrame(context, this.specialCharacters[2].image, [x,y,width,height], 280, 85);
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

    getFighterEntity(id){
        switch (id) {
            case 'ryu':
                return new Ryu();
            case 'cammy':
                return new Cammy();
            default:
                throw new Error('Unimplemented fighter entity request')
        }
    }

}