import { pollGamepads, registerGamepadEvents, registerKeyboardEvents } from "./engine/InputHandler.js";
import { getContext } from "./utils/context.js";
import { BattleScene } from "./scenes/BattleScene.js";

export class StreetFighterGame {
    context = getContext();

    constructor(){
        this.frameTime = {
            previous: 0,
            delta:0,
        }
        this.scene = new BattleScene();
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
}