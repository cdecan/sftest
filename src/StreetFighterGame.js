import { pollGamepads, registerGamepadEvents, registerKeyboardEvents } from "./engine/InputHandler.js";
import { getContext } from "./utils/context.js";
import { BattleScene } from "./scenes/BattleScene.js";
import { MoveSelectScene } from "./scenes/MoveSelectScene.js";
import { SceneTypes } from "./constants/scenes.js";
import { gameState } from "./state/gameState.js";
import { createDefaultFighterState } from "./state/fighterState.js";
import { FighterId } from "./constants/fighter.js";

export class StreetFighterGame {
    context = getContext();

    constructor(){
        this.frameTime = {
            previous: 0,
            delta:0,
        }
        this.scene = new MoveSelectScene([], 0, this);//new BattleScene();
    }

        

    frame(time) {
        window.requestAnimationFrame(this.frame.bind(this));

        this.frameTime = {
            delta: (time - this.frameTime.previous) / 1000,
            previous: time,
        }
            
        pollGamepads();
        this.scene.update(this.frameTime, this.context);
        this.scene.draw(this.context);
    }

    start(){
        registerKeyboardEvents();
        registerGamepadEvents();
        window.requestAnimationFrame(this.frame.bind(this));
    }

    changeScene(scene, winningID=0, fighters=[]){
        switch (scene) {
            case SceneTypes.FIGHTING_GAME:
                this.resetFighters();
                this.scene = new BattleScene(this);
                break;
            case SceneTypes.MOVE_SELECT:
                this.scene = new MoveSelectScene(fighters, winningID, this);
                break;
            default:
                break;
        }
    }

    resetFighters(){
        gameState.fighters = [
            createDefaultFighterState(FighterId.Player),
            createDefaultFighterState(FighterId.Ryu),
        ]
    }
}