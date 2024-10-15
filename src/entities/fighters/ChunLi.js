import { FighterAttackStrength, FighterAttackType, FighterState, FrameDelay, HurtBox, PushBox, specialStateValidFrom } from "../../constants/fighter.js";
import { STAGE_FLOOR } from "../../constants/stage.js";
import { Fighter } from "./Fighter.js";

export class ChunLi extends Fighter{
    image = document.querySelector('img[alt=chunli]');

    frames = new Map([
        //up kicks
        ['flying-kicks-1', [[[48, 2663, 73, 92], [28, 75]], PushBox.CROUCH, HurtBox.CROUCH]],
        ['flying-kicks-2', [[[136, 2264, 71, 90], [28, 75]], PushBox.CROUCH, HurtBox.CROUCH]],
        ['flying-kicks-3', [[[233, 2240, 77, 116], [28, 75]], PushBox.CROUCH, HurtBox.CROUCH, [20, -75, 25, 60]]],
        ['flying-kicks-4', [[[340, 2234, 76, 123], [28, 75]], PushBox.CROUCH, HurtBox.CROUCH]],
        ['flying-kicks-5', [[[434, 2281, 67, 72], [28, 75]], PushBox.CROUCH, HurtBox.CROUCH]],
        ['flying-kicks-6', [[[528, 2284, 76, 67], [28, 75]], PushBox.CROUCH, HurtBox.CROUCH]],
        ['flying-kicks-7', [[[639, 2236, 110, 116], [28, 75]], PushBox.CROUCH, HurtBox.CROUCH, [20, -75, 50, 60]]],
        ['flying-kicks-8', [[[721, 2228, 114, 125], [28, 75]], PushBox.CROUCH, HurtBox.CROUCH]],
        ['flying-kicks-9', [[[896, 2242, 100, 106], [28, 75]], PushBox.CROUCH, HurtBox.CROUCH]],
        ['flying-kicks-10', [[[1007, 2259, 84, 85], [28, 75]], PushBox.CROUCH, HurtBox.CROUCH]],
        ['flying-kicks-11', [[[1106, 2252, 73, 93], [28, 75]], PushBox.CROUCH, HurtBox.CROUCH]],
        ['flying-kicks-12', [[[1187, 2246, 41, 104], [28, 75]], PushBox.CROUCH, HurtBox.CROUCH]],

        

    ]);

    animations = {
        [FighterState.SPECIAL_3]: [
            //startup - 6f
            ['flying-kicks-1', 3], ['flying-kicks-2', 3],
            //active - 24f
            ['flying-kicks-3', 4], ['flying-kicks-4', 4],
            ['flying-kicks-5', 4], ['flying-kicks-6', 4],
            ['flying-kicks-7', 4], ['flying-kicks-8', 4],
            //recovery - 37f
            ['flying-kicks-9', 9], ['flying-kicks-10', 9],
            ['flying-kicks-11', 9], ['flying-kicks-12', 10],
            ['flying-kicks-12', FrameDelay.TRANSITION],
        ],
    };

    constructor(playerId, onAttackHit, onAttackBlocked){
        super(playerId, onAttackHit, onAttackBlocked);
        
        this.states[FighterState.SPECIAL_3] = {
            init: this.handleUpKicksInit.bind(this),
            update: this.handleUpKicksState.bind(this),
            attackType: FighterAttackType.COMBO,
            attackStrength: FighterAttackStrength.LAUNCHER,
            shadow: [1.6, 1, 22, 0],
            validFrom: specialStateValidFrom
        }
        this.states[FighterState.IDLE].validFrom.push(FighterState.SPECIAL_3);
    }

    handleUpKicksInit(_, __){
        this.currentImage = this.images['chunli'];
        this.resetVelocities();
        this.velocity.y = this.initialVelocity.jump + 100;
    }

    handleUpKicksState(time){
        if(this.animationFrame < 9 && this.animationFrame > 2){
            this.velocity.x = 100;
        }else{
            this.velocity.x = 0;
        }

        if(this.animationFrame == 5){
            this.velocity.y = this.initialVelocity.jump;
        }

        if(!this.isAnimationCompleted()) return;
        if(this.position.y != STAGE_FLOOR) return;
        this.changeState(FighterState.IDLE, time);
    }

}