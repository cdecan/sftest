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

        //flip kick
        ['flip-kick-1', [[[144, 1009, 75, 78], [28, 100]], PushBox.IDLE, HurtBox.INVINCIBLE]],
        ['flip-kick-2', [[[222, 2024, 118, 49], [28, 100]], PushBox.IDLE, HurtBox.INVINCIBLE]],
        ['flip-kick-3', [[[346, 1997, 104, 86], [28, 100]], PushBox.IDLE, HurtBox.CROUCH]],
        ['flip-kick-4', [[[480, 2002, 54, 107], [28, 100]], PushBox.IDLE, HurtBox.CROUCH]],
        ['flip-kick-5', [[[570, 2003, 53, 105], [28, 100]], PushBox.IDLE, HurtBox.CROUCH]],
        ['flip-kick-6', [[[645, 2013, 68, 95], [28, 100]], PushBox.IDLE, HurtBox.CROUCH]],
        ['flip-kick-7', [[[735, 2016, 124, 69], [28, 100]], PushBox.IDLE, HurtBox.CROUCH]],
        ['flip-kick-8', [[[884, 2000, 98, 111], [28, 100]], PushBox.IDLE, HurtBox.CROUCH]],
        ['flip-kick-9', [[[989, 1992, 105, 115], [28, 100]], PushBox.IDLE, HurtBox.CROUCH, [20, -75, 60, 80]]],
        ['flip-kick-10', [[[1102, 2054, 118, 56], [28, 50]], PushBox.IDLE, HurtBox.CROUCH]],
        ['flip-kick-11', [[[29, 2158, 114, 65], [28, 60]], PushBox.IDLE, HurtBox.CROUCH]],
        ['flip-kick-12', [[[156, 2142, 111, 75], [28, 65]], PushBox.IDLE, HurtBox.CROUCH]],
        ['flip-kick-13', [[[279, 2127, 87, 94], [28, 87]], PushBox.IDLE, HurtBox.CROUCH]],
        ['flip-kick-14', [[[371, 2127, 87, 91], [28, 87]], PushBox.IDLE, HurtBox.CROUCH]],

        //rapid kicks
        ['rapid-kicks-1', [[[38, 2406, 68, 96], [28, 90]], PushBox.IDLE, HurtBox.IDLE]],
        ['rapid-kicks-2', [[[132, 2380, 134, 126], [40, 124]], PushBox.IDLE, HurtBox.RAPID_KICKS]],
        ['rapid-kicks-3', [[[281, 2386, 135, 131], [40, 120]], PushBox.IDLE, HurtBox.RAPID_KICKS, [20, -75, 70, 80]]],
        ['rapid-kicks-4', [[[432, 2393, 133, 116], [40, 114]], PushBox.IDLE, HurtBox.RAPID_KICKS]],
        ['rapid-kicks-5', [[[591, 2388, 135, 115], [40, 113]], PushBox.IDLE, HurtBox.RAPID_KICKS]],
        ['rapid-kicks-6', [[[740, 2408, 194, 95], [45, 93]], PushBox.IDLE, HurtBox.RAPID_KICKS, [20, -75, 70, 80]]],
        ['rapid-kicks-7', [[[945, 2398, 191, 102], [40, 100]], PushBox.IDLE, HurtBox.RAPID_KICKS]],
        ['rapid-kicks-8', [[[62, 2538, 199, 104], [43, 102]], PushBox.IDLE, HurtBox.RAPID_KICKS]],
        ['rapid-kicks-9', [[[276, 2537, 180, 109], [40, 102]], PushBox.IDLE, HurtBox.RAPID_KICKS]],
        ['rapid-kicks-10', [[[463, 2514, 134, 137], [40, 125]], PushBox.IDLE, HurtBox.RAPID_KICKS]],
        ['rapid-kicks-11', [[[605, 2524, 135, 130], [40, 119]], PushBox.IDLE, HurtBox.RAPID_KICKS, [20, -75, 70, 80]]],
        ['rapid-kicks-12', [[[750, 2531, 134, 115], [40, 113]], PushBox.IDLE, HurtBox.RAPID_KICKS]],
        ['rapid-kicks-13', [[[898, 2551, 195, 95], [45, 93]], PushBox.IDLE, HurtBox.RAPID_KICKS, [20, -75, 70, 80]]],
        ['rapid-kicks-14', [[[82, 2673, 191, 102], [40, 100]], PushBox.IDLE, HurtBox.RAPID_KICKS]],
        ['rapid-kicks-15', [[[280, 2673, 199, 104], [45, 102]], PushBox.IDLE, HurtBox.RAPID_KICKS]],
        ['rapid-kicks-16', [[[494, 2672, 180, 109], [40, 102]], PushBox.IDLE, HurtBox.RAPID_KICKS]],
        ['rapid-kicks-17', [[[681, 2661, 134, 135], [40, 125]], PushBox.IDLE, HurtBox.RAPID_KICKS]],
        ['rapid-kicks-18', [[[823, 2658, 135, 131], [40, 120]], PushBox.IDLE, HurtBox.RAPID_KICKS, [20, -75, 70, 80]]],
        ['rapid-kicks-19', [[[970, 2663, 135, 116], [40, 114]], PushBox.IDLE, HurtBox.RAPID_KICKS]],
        ['rapid-kicks-20', [[[1124, 2690, 69, 92], [28, 90]], PushBox.IDLE, HurtBox.IDLE]],

    ]);

    animations = {
        [FighterState.SPECIAL_1]: [
            //startup
            ['rapid-kicks-1', 3], ['rapid-kicks-2', 3], 
            //hit 1
            ['rapid-kicks-3', 3],
            //startup
            ['rapid-kicks-4', 3], ['rapid-kicks-5', 3], 
            //hit 2
            ['rapid-kicks-6', 3], 
            //startup
            ['rapid-kicks-7', 3], ['rapid-kicks-8', 3], 
            ['rapid-kicks-9', 3], ['rapid-kicks-10', 3],
            //hit 3
            ['rapid-kicks-11', 3],
            //startup
            ['rapid-kicks-12', 3],
            //hit 4
            ['rapid-kicks-13', 3],
            //startup
            ['rapid-kicks-14', 3], ['rapid-kicks-15', 3], 
            ['rapid-kicks-16', 3], ['rapid-kicks-17', 3],
            //hit 5
            ['rapid-kicks-18', 3],
            //recovery
            ['rapid-kicks-19', 3], ['rapid-kicks-20', 10],
            ['rapid-kicks-20', FrameDelay.TRANSITION],


        ],

        [FighterState.SPECIAL_2]: [
            //startup - 26f
            ['flip-kick-1', 3], ['flip-kick-2', 3],
            ['flip-kick-3', 3], ['flip-kick-4', 4],
            ['flip-kick-5', 4], ['flip-kick-6', 3],
            ['flip-kick-7', 3], ['flip-kick-8', 3],
            // active - 3f
            ['flip-kick-9', 3],
            //recovery - 15f
            ['flip-kick-10', 3], ['flip-kick-11', 3],
            ['flip-kick-12', 3], ['flip-kick-13', 3],
            ['flip-kick-14', 3],
            ['flip-kick-14', FrameDelay.TRANSITION],
        ],
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
        
        this.states[FighterState.SPECIAL_1] = {
            init: this.handleRapidKicksInit.bind(this),
            update: this.handleRapidKicksState.bind(this),
            attackType: FighterAttackType.COMBO,
            attackStrength: FighterAttackStrength.LIGHT,
            shadow: [1.6, 1, 22, 0],
            validFrom: specialStateValidFrom
        }
        this.states[FighterState.IDLE].validFrom.push(FighterState.SPECIAL_1);

        this.states[FighterState.SPECIAL_2] = {
            init: this.handleFlipKickInit.bind(this),
            update: this.handleFlipKickState.bind(this),
            attackType: FighterAttackType.OVERHEAD,
            attackStrength: FighterAttackStrength.HEAVY,
            shadow: [1.6, 1, 22, 0],
            validFrom: specialStateValidFrom
        }
        this.states[FighterState.IDLE].validFrom.push(FighterState.SPECIAL_2);


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

    handleRapidKicksInit(_, __){
        this.currentImage = this.images['chunli'];
        this.resetVelocities();
    }

    handleRapidKicksState(time){
        if(!this.isAnimationCompleted()) return;
        this.changeState(FighterState.IDLE, time);
    }

    handleFlipKickInit(_, __){
        this.currentImage = this.images['chunli'];
        this.resetVelocities();
    }

    handleFlipKickState(time){
        if(this.animationFrame == 0 || this.animationFrame == 6){
            this.velocity.x = 900;
        } else {
            this.velocity.x = 0;
        }
        if(!this.isAnimationCompleted()) return;
        this.changeState(FighterState.IDLE, time);
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