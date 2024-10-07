import { FireballState, fireballVelocity } from "../../../constants/fireball.js";
import { FRAME_TIME } from "../../../constants/game.js";

const frames = new Map([
    ['hadoken-fireball-1', [[[1431, 1439, 57, 30], [25, 16]], [-15, -13, 30, 24], [-28, -20, 56, 38]]],
    ['hadoken-fireball-2', [[[1495, 1436, 44, 33], [25, 16]], [-15, -13, 30, 24], [-28, -20, 56, 38]]],
    ['hadoken-fireball-3', [[[0, 0, 0, 0], [0, 0]], [-15, -13, 30, 24], [-28, -20, 56, 38]]],
    // ['hadoken-fireball-3', [[[695, 1441, 60, 32], [25, 16]], [-15, -13, 30, 24], [-28, -20, 56, 38]]],
    // ['hadoken-fireball-4', [[[759, 1442, 59, 29], [25, 16]], [-15, -13, 30, 24], [-28, -20, 56, 38]]],
    ['hadoken-collide-1', [[[1156, 1440, 35, 29], [13, 10]], [0, 0, 0, 0]]],
    ['hadoken-collide-2', [[[1198, 1434, 37, 40], [9, 13]], [0, 0, 0, 0]]],
    ['hadoken-collide-3', [[[1242, 1421, 55, 60], [26, 14]], [0, 0, 0, 0]]],
]);

const animations = {
    [FireballState.ACTIVE]: [
        ['hadoken-fireball-1', 2],  ['hadoken-fireball-3', 2],
        ['hadoken-fireball-2', 2],  ['hadoken-fireball-3', 2],
    ],
    [FireballState.COLLIDED]: [
        ['hadoken-collide-1', 9],  ['hadoken-collide-2', 5],
        ['hadoken-collide-3', 9]
    ],
};

export class Fireball {
    image = document.querySelector('img[alt="ryu"]');
    animationFrame = 0;
    state = FireballState.ACTIVE;

    constructor(fighter, time, onEnd) {
        this.fighter = fighter;
        this.onEnd = onEnd;
        this.direction = this.fighter.direction;
        this.velocity = fireballVelocity;
        this.position = {
            x: this.fighter.position.x + (76 * this.direction),
            y: this.fighter.position.y - 57
        };
        this.animationTimer = time.previous;
    }

    updateMovement(time, camera){
        this.position.x += (this.velocity * this.direction) * time.delta;

        if(this.position.x - camera.position.x > 384 + 56 || this.position.x - camera.position.x < -56){
            this.onEnd(this);
        }
    }

    updateAnimation(time){

        if(time.previous < this.animationTimer) return;

        this.animationFrame += 1;
        if (this.animationFrame >= animations[this.state].length) {
            this.animationFrame = 0;
        }

        this.animationTimer = time.previous + animations[this.state][this.animationFrame][1] * FRAME_TIME;
    }

    update(time, _, camera){
        this.updateMovement(time, camera);
        this.updateAnimation(time);
    }

    draw(context, camera){

        const [frameKey] = animations[this.state][this.animationFrame];
        const[[
            [x,y,width,height],
            [originX, originY],
        ]] = frames.get(frameKey);

        context.scale(this.direction, 1);
        context.drawImage(
            this.image,
            x, y,
            width, height,
            Math.floor((this.position.x - camera.position.x) * this.direction) - originX,
            Math.floor(this.position.y - camera.position.y) - originY,
            width, height
        );
        context.setTransform(1,0,0,1,0,0);
    }
}