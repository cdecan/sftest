import { Ken } from "./entities/fighters/Ken.js";
import { Ryu } from "./entities/fighters/Ryu.js";
import { KenStage } from "./entities/stage/KenStage.js";
import { STAGE_MID_POINT, STAGE_PADDING } from "./constants/stage.js";
import { pollGamepads, registerGamepadEvents, registerKeyboardEvents } from "./engine/InputHandler.js";
import { Shadow } from "./entities/fighters/Shadow.js";
import { StatusBar } from "./entities/overlays/StatusBar.js";
import { Camera } from "./engine/Camera.js";
import { getContext } from "./utils/context.js";

export class StreetFighterGame {
    context = getContext();
    fighters = [new Ryu(0),new Ryu(1)];
    camera = new Camera(STAGE_MID_POINT + STAGE_PADDING - (this.context.canvas.width / 2), 16, this.fighters);

    constructor(){
        // this.context = getContext();
        this.stage = new KenStage();

        // this.fighters = [
        //     new Ryu(0),
        //     new Ryu(1),
        // ]

        this.fighters[0].opponent = this.fighters[1];
        this.fighters[1].opponent = this.fighters[0];

        // this.camera = new Camera(STAGE_MID_POINT + STAGE_PADDING - (this.context.canvas.width / 2), 16, this.fighters);

        this.entities = [
            ...this.fighters.map(fighter => new Shadow(fighter)),
            ...this.fighters,
        ];
        this.overlays = [
            new StatusBar(this.fighters),
        ];
        
        this.frameTime = {
            previous: 0,
            delta:0,
        }
    }

    update(){
        this.stage.update(this.frameTime, this.context);
        this.camera.update(this.frameTime, this.context);
        for (const entity of this.entities) {
            entity.update(this.frameTime, this.context, this.camera);
        }
        for (const overlay of this.overlays) {
            overlay.update(this.frameTime, this.context, this.camera);
        }
    }

    draw(){
        this.stage.drawBackground(this.context, this.camera);
        for (const entity of this.entities) {
            entity.draw(this.context, this.camera);
        }
        this.stage.drawForeground(this.context, this.camera);
        for (const overlay of this.overlays) {
            overlay.draw(this.context, this.camera);
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