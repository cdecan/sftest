import { Ken } from "./fighters/Ken.js";
import { Ryu } from "./fighters/Ryu.js";
import { Stage } from "./entities/stage.js";
import { STAGE_FLOOR } from "./constants/stage.js";
import { FighterDirection } from "./constants/fighter.js";
import { pollGamepads, registerGamepadEvents, registerKeyboardEvents } from "./InputHandler.js";
import { Shadow } from "./fighters/Shadow.js";

export class StreetFighterGame {

    constructor(){
        this.context = this.getContext();

        this.fighters = [
            new Ryu(80,STAGE_FLOOR,FighterDirection.RIGHT, 0),
            new Ryu(280,STAGE_FLOOR,FighterDirection.LEFT, 1),
        ]

        this.entities = [
            new Stage(),
            ...this.fighters.map(fighter => new Shadow(fighter)),
            ...this.fighters,
        ];

        
        this.frameTime = {
            previous: 0,
            delta:0,
        }
    }

    getContext(){
        const canvasEL = document.querySelector('canvas');
        const context = canvasEL.getContext('2d');
    
        context.imageSmoothingEnabled = false;
        return context;
    }

    update(){
        for (const entity of this.entities) {
            entity.update(this.frameTime, this.context);
        }
    }

    draw(){
        for (const entity of this.entities) {
            entity.draw(this.context);
        }
    }
        

    frame(time) {
        window.requestAnimationFrame(this.frame.bind(this));

        this.frameTime = {
            delta: (time - this.frameTime.previous) / 1000,
            previous: time,
        }
            
        pollGamepads();
        this.update();
        this.draw();
    }

    start(){
        registerKeyboardEvents();
        registerGamepadEvents();
        window.requestAnimationFrame(this.frame.bind(this));
    }
}