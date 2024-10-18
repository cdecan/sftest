import { FighterAttackStrength, FighterAttackType, FighterHurtBox, FighterHurtBy } from "../../../constants/fighter.js";
import { FireballCollidedState, FireballState, fireballVelocity } from "../../../constants/fireball.js";
import { FRAME_TIME } from "../../../constants/game.js";
import { boxOverlap, getActualBoxDimensions } from "../../../utils/collisions.js";

const frame = new Map([
    ['hadoken-fireball-1', [[[1431, 1439, 57, 30], [25, 16]], [-15, -13, 30, 24], [-28, -20, 56, 38]]],
    ['hadoken-fireball-2', [[[1495, 1436, 44, 33], [25, 16]], [-15, -13, 30, 24], [-28, -20, 56, 38]]],
    ['hadoken-fireball-3', [[[0, 0, 0, 0], [0, 0]], [-15, -13, 30, 24], [-28, -20, 56, 38]]],
    // ['hadoken-fireball-3', [[[695, 1441, 60, 32], [25, 16]], [-15, -13, 30, 24], [-28, -20, 56, 38]]],
    // ['hadoken-fireball-4', [[[759, 1442, 59, 29], [25, 16]], [-15, -13, 30, 24], [-28, -20, 56, 38]]],
    ['hadoken-collide-1', [[[1156, 1440, 35, 29], [13, 10]], [0, 0, 0, 0]]],
    ['hadoken-collide-2', [[[1198, 1434, 37, 40], [9, 13]], [0, 0, 0, 0]]],
    ['hadoken-collide-3', [[[1242, 1421, 55, 60], [26, 24]], [0, 0, 0, 0]]],
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

    constructor(args, time, entityList) {
        const [fighter] = args;
        this.fighter = fighter;
        this.entityList = entityList;
        this.direction = this.fighter.direction;
        this.velocity = fireballVelocity;
        this.position = {
            x: this.fighter.position.x + (76 * this.direction),
            y: this.fighter.position.y - 57
        };
        this.animationTimer = time.previous;
    }

    hasCollidedWithOpponent(actualHitBox) {
        
        for(const [, hurtBox] of Object.entries(this.fighter.opponent.boxes.hurt)) {
            const [x, y, width, height] = hurtBox;
            const actualOpponentHurtBox = getActualBoxDimensions(
                this.fighter.opponent.position,
                this.fighter.opponent.direction,
                { x, y, width, height},
            );
            if(boxOverlap(actualHitBox, actualOpponentHurtBox)) return FireballCollidedState.OPPONENT;
        }

        return false;
    }

    hasCollidedWithOtherFireball(actualHitBox) {
        const otherFireballs = this.entityList.entities.filter((fireball) => fireball instanceof Fireball && fireball !== this);
        if(otherFireballs.length === 0)return;

        for(const fireball of otherFireballs) {
            const [x, y, width, height] = frame.get(animations[fireball.state][fireball.animationFrame][0])[1];
            const otherActualHitBox = getActualBoxDimensions(fireball.position, fireball.direction, {x, y, width, height});

            if(boxOverlap(actualHitBox, otherActualHitBox)) return FireballCollidedState.FIREBALL;
        }
    }

    hasCollided(){
        const [x, y, width, height] = frame.get(animations[this.state][this.animationFrame][0])[1];
        const actualHitBox = getActualBoxDimensions(this.position, this.direction, {x, y, width, height});

        
        return this.hasCollidedWithOpponent(actualHitBox) || this.hasCollidedWithOtherFireball(actualHitBox);
    }
    
    updateMovement(time, camera){
        if(this.state !== FireballState.ACTIVE) return;

        this.position.x += (this.velocity * this.direction) * time.delta;

        if(this.position.x - camera.position.x > 384 + 56 || this.position.x - camera.position.x < -56){
            this.entityList.remove(this);
        }

        const hasCollided = this.hasCollided();
        if(!hasCollided) return;

        this.state = FireballState.COLLIDED;
        this.animationFrame = 0;
        this.animationTimer = time.previous + animations[this.state][this.animationFrame][1] * FRAME_TIME;
        
        if(hasCollided !== FireballCollidedState.OPPONENT) return;

        this.fighter.opponent.handleAttackHit(FighterAttackStrength.HEAVY, FighterAttackType.STAND, undefined, FighterHurtBox.BODY, FighterHurtBy.FIREBALL, time);
    }

    updateAnimation(time){

        if(time.previous < this.animationTimer) return;

        this.animationFrame += 1;
        if (this.animationFrame >= animations[this.state].length) {
            this.animationFrame = 0;
            if(this.state === FireballState.COLLIDED) this.entityList.remove(this);
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
        ]] = frame.get(frameKey);

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