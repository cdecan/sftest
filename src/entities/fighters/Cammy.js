import { FighterAttackStrength, FighterAttackType, FighterState, FrameDelay, HurtBox, PushBox, specialStateValidFrom } from "../../constants/fighter.js";
import { Fighter } from "./Fighter.js";

export class Cammy extends Fighter{
    //memo:
    //cammy image was flipped horizontally because it was backwards originally
    //so sprites are in reverse order
    image = document.querySelector('img[alt=cammy]');


    frames = new Map([
        //Cannon Drill
        ['drill-1', [[[2805, 2328, 71, 83], [28, 75]], PushBox.CROUCH, HurtBox.CROUCH]],
        ['drill-2', [[[2690, 2336, 91, 58], [28, 75]], PushBox.CROUCH, HurtBox.CROUCH]],
        ['drill-3', [[[2500, 2353, 170, 34], [70, 65]], PushBox.DRILL_KICK, HurtBox.DRILL_KICK, [-26, -60, 140, 30]]],
        ['drill-4', [[[2308, 2358, 166, 30], [70, 65]], PushBox.DRILL_KICK, HurtBox.DRILL_KICK, [-26, -60, 140, 30]]],
        ['drill-5', [[[2116, 2359, 168, 34], [70, 65]], PushBox.DRILL_KICK, HurtBox.DRILL_KICK, [-26, -60, 140, 30]]],
        ['drill-6', [[[1921, 2354, 171, 29], [70, 65]], PushBox.DRILL_KICK, HurtBox.DRILL_KICK, [-26, -60, 140, 30]]],
        ['drill-7', [[[1729, 2358, 166, 29], [70, 65]], PushBox.DRILL_KICK, HurtBox.DRILL_KICK, [-26, -60, 140, 30]]],
        ['drill-8', [[[1537, 2363, 167, 30], [70, 65]], PushBox.DRILL_KICK, HurtBox.DRILL_KICK, [-26, -60, 140, 30]]],
        ['drill-9', [[[1368, 2359, 153, 36], [28, 75]], PushBox.DRILL_KICK, HurtBox.DRILL_KICK]],
    ]);

    animations = {
        [FighterState.SPECIAL_1]: [
            ['drill-1', 8], ['drill-2', 6],
            ['drill-3', 3], ['drill-4', 3], ['drill-5', 3],
            ['drill-3', 3], ['drill-4', 3], ['drill-5', 1],
            ['drill-9', 6], ['drill-2', 6], ['drill-1', 8],
            ['drill-1', FrameDelay.TRANSITION],
        ],
    };


    constructor(playerId, onAttackHit, onAttackBlocked){
        super(playerId, onAttackHit, onAttackBlocked);
        
        this.states[FighterState.SPECIAL_1] = {
            init: this.handleCannonDrillInit.bind(this),
            update: this.handleCannonDrillState.bind(this),
            attackType: FighterAttackType.STAND,
            attackStrength: FighterAttackStrength.HEAVY,
            shadow: [1.6, 1, 22, 0],
            validFrom: specialStateValidFrom
        }
        this.states[FighterState.IDLE].validFrom.push(FighterState.SPECIAL_1);
    }




    handleCannonDrillInit(_, __){
        this.currentImage = this.images['cammy'];
        this.resetVelocities();
    }

    handleCannonDrillState(time){
        if(this.animationFrame > 2 && this.animationFrame < 10) this.velocity.x = 500;
        if(!this.isAnimationCompleted()) return;
        this.velocity.x = 0;
        this.changeState(FighterState.IDLE, time);
        this.changeState(FighterState.CROUCH_DOWN, time);
    }

}