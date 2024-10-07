import { STAGE_FLOOR } from "../../../constants/stage.js";

export class Shadow {
    constructor(fighter){
        this.image = document.querySelector('img[alt=shadow]');
        this.fighter = fighter;
        this.frame = [[0,0,49,9],[25,5]];
    }

    getScale(){
        if(this.fighter.position.y !== STAGE_FLOOR){
            const airScale = 1.4 - (STAGE_FLOOR - this.fighter.position.y) / 250;
            return [airScale, airScale];
        } else if(this.fighter.states[this.fighter.currentState].shadow){
            const [scaleX, scaleY, offsetX, offsetY] = this.fighter.states[this.fighter.currentState].shadow;

            return [scaleX, scaleY, offsetX * this.fighter.direction, offsetY];
        }

        return [1.4, 1.4];
    }

    update(){}

    draw(context, camera){
        const [
            [x,y,width,height],
            [originX,originY],
        ] = this.frame;

        //const scale = 1.4 - (STAGE_FLOOR - this.fighter.position.y) / 250;
        const [scaleX = 1.4, scaleY = 1.4, offsetX = 0, offsetY = 0] = this.getScale();

        context.globalAlpha = 0.5;
        context.drawImage(
            this.image,
            x,y,
            width,height,
            Math.floor(this.fighter.position.x - camera.position.x - originX * scaleX) + offsetX,
            Math.floor(STAGE_FLOOR - camera.position.y - originY * scaleY) - offsetY,
            Math.floor(width*scaleX),Math.floor(height*scaleY),
        );
        context.globalAlpha = 1;
    }
}