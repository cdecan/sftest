import { FighterState, FrameDelay, HurtBox, PushBox } from '../../constants/fighter.js';
import { Fighter } from './Fighter.js';

export class Ryu extends Fighter{
    constructor(playerId, onAttackHit){
        super(playerId, onAttackHit);
        this.image = document.querySelector('img[alt=ryu]');

        // this.frame = [7,14,59,90];

        this.frames = new Map([
            //NAME | X,Y,W,H | origin | PUSHBOX | Head/Body/feet
            //Idle
            ['idle-1',  [[[75,14,60,89], [34,86]], PushBox.IDLE, HurtBox.IDLE]],
            ['idle-2',  [[[7,14,59,90], [33,87]], PushBox.IDLE, HurtBox.IDLE]],
            ['idle-3',  [[[277,11,58,92], [32,89]], PushBox.IDLE, HurtBox.IDLE]],
            ['idle-4',  [[[211,10,55,93], [31,90]], PushBox.IDLE, HurtBox.IDLE]],

            //Move Forwards
            ['forwards-1', [[[9,136,53,83], [27,81]], PushBox.IDLE, HurtBox.FORWARD]],
            ['forwards-2', [[[78,131,60,89], [35,86]], PushBox.IDLE, HurtBox.FORWARD]],
            ['forwards-3', [[[152,128,64,92], [35,89]], PushBox.IDLE, HurtBox.FORWARD]],
            ['forwards-4', [[[229,130,63,90], [29,89]], PushBox.IDLE, HurtBox.FORWARD]],
            ['forwards-5', [[[307,128,54,91], [25,89]], PushBox.IDLE, HurtBox.FORWARD]],
            ['forwards-6', [[[371,128,50,89], [25,86]], PushBox.IDLE, HurtBox.FORWARD]],

            //Move Backwards
            ['backwards-1', [[[777,128,61,87], [27,81]], PushBox.IDLE, HurtBox.BACKWARD]],
            ['backwards-2', [[[430,124,59,90], [35,86]], PushBox.IDLE, HurtBox.BACKWARD]],
            ['backwards-3', [[[495,124,57,90], [35,89]], PushBox.IDLE, HurtBox.BACKWARD]],
            ['backwards-4', [[[559,124,58,90], [29,89]], PushBox.IDLE, HurtBox.BACKWARD]],
            ['backwards-5', [[[631,125,58,91], [25,89]], PushBox.IDLE, HurtBox.BACKWARD]],
            ['backwards-6', [[[707,126,57,89], [25,86]], PushBox.IDLE, HurtBox.BACKWARD]],

            //Jump Up
            ['jumpUp-1', [[[67,244,56,104], [32,107]], PushBox.JUMP, HurtBox.JUMP]],
            ['jumpUp-2', [[[138,233,50,89], [25,103]], PushBox.JUMP, HurtBox.JUMP]],
            ['jumpUp-3', [[[197,233,54,77], [25,103]], PushBox.JUMP, HurtBox.JUMP]],
            ['jumpUp-4', [[[259,240,48,70], [28,101]], PushBox.JUMP, HurtBox.JUMP]],
            ['jumpUp-5', [[[319,234,48,89], [25,106]], PushBox.JUMP, HurtBox.JUMP]],
            ['jumpUp-6', [[[375,244,55,109], [31,113]], PushBox.JUMP, HurtBox.JUMP]],

            //Jump Directionally
            ['jumpRoll-1', [[[878,260,55,103], [25,106]], PushBox.JUMP, [[-11, -106, 24, 16],[-26, -90, 40, 42],[-26, -31, 40, 32]]]],
            ['jumpRoll-2', [[[442,261,61,78], [22,90]], PushBox.JUMP, [[17, -90, 24, 16],[-14, -91, 40, 42],[-22, -66, 38, 18]]]],
            ['jumpRoll-3', [[[507,259,104,42], [61,76]], PushBox.JUMP, [[22, -51, 24, 16],[-14, -81, 40, 42],[-22, -66, 38, 18]]]],
            ['jumpRoll-4', [[[617,240,53,82], [42,111]], PushBox.JUMP, [[-39, -46, 24, 16],[-30, -88, 40, 42],[-34, -118, 44, 48]]]],
            ['jumpRoll-5', [[[676,257,122,44], [71,81]], PushBox.JUMP, [[-72, -56, 24, 16],[-54, -77, 52, 40],[-14, -82, 48, 34]]]],
            ['jumpRoll-6', [[[804,258,71,87], [53,98]], PushBox.JUMP, [[-55, -100, 24, 16],[-48, -87, 44, 38],[-22, -66, 38, 18]]]],
            // ['jumpRoll-7', [[[883,261,54,109], [31,113]], PushBox.JUMP, [[-8, -88, 24, 16],[-26, -74, 40, 42],[-26, -31, 40, 32]]]],

            //Jump 1st/last frame
            ['jump-land', [[[7,268,55,85],[29,83]], PushBox.IDLE, HurtBox.IDLE]],

            //Crouch
            ['crouch-1', [[[551,21,53,83], [27,81]], PushBox.IDLE, HurtBox.IDLE]],
            ['crouch-2', [[[611,36,57,69], [25,66]], PushBox.BEND, HurtBox.BEND]],
            ['crouch-3', [[[679,44,61,61], [25,58]], PushBox.CROUCH, HurtBox.CROUCH]],

            //Stand Turn
            ['idle-turn-1', [[[348,8,54,95],[29,92]], PushBox.IDLE, [[-10, -89, 28, 18],[-14, -74, 40, 42],[-14, -31, 40, 32]]]],
            ['idle-turn-2', [[[414,6,58,97],[30,94]], PushBox.IDLE, [[-16, -96, 28, 18],[-14, -74, 40, 42],[-14, -31, 40, 32]]]],
            ['idle-turn-3', [[[486,10,54,94],[27,90]], PushBox.IDLE, [[-16, -96, 28, 18],[-14, -74, 40, 42],[-14, -31, 40, 32]]]],

            //Crouch Turn
            ['crouch-turn-1', [[[751,46,53,61],[26,58]], PushBox.CROUCH, [[-7, -60, 24, 18],[-28, -46, 44, 24],[-28, -24, 44, 24]]]],
            ['crouch-turn-2', [[[816,46,52,61],[27,58]], PushBox.CROUCH, [[-7, -60, 24, 18],[-28, -46, 44, 24],[-28, -24, 44, 24]]]],
            ['crouch-turn-3', [[[878,46,53,61],[29,58]], PushBox.CROUCH, [[-26, -61, 24, 18],[-28, -46, 44, 24],[-28, -24, 44, 24]]]],

            //Light Attack
            ['light-attack-1', [[[9,365,64,91],[32,88]], PushBox.IDLE, HurtBox.IDLE]],
            ['light-attack-2', [[[98,365,92,91],[32,88]], PushBox.IDLE, HurtBox.IDLE, [11, -85, 50, 18]]],
            
            //Medium Attack
            ['medium-attack-1', [[[6,466,60,94],[29,92]], PushBox.IDLE, HurtBox.IDLE]],
            ['medium-attack-2', [[[86,465,74,95],[29,92]], PushBox.IDLE, HurtBox.PUNCH]],
            ['medium-attack-3', [[[175,465,108,94],[24,92]], PushBox.IDLE, HurtBox.PUNCH, [17, -85, 76, 14]]],

            //Heavy Attack
            ['heavy-attack-1', [[[5,1196,61,90],[37,87]], PushBox.IDLE, [[-41, -78, 20, 20],[-25, -78, 42, 42],[-11, -50, 42, 50]]]],
            ['heavy-attack-2', [[[72,1192,94,94],[44,91]], PushBox.IDLE, [[12, -90, 34, 34],[-25, -78, 42, 42],[-11, -50, 42, 50]], [15, -99, 40, 32]]],
            ['heavy-attack-3', [[[176,1191,120,94],[42,91]], PushBox.IDLE, [[13, -91, 62, 34],[-25, -78, 42, 42],[-11, -50, 42, 50]], [21, -97, 62, 24]]],
            ['heavy-attack-4', [[[306,1208,101,77],[39,74]], PushBox.IDLE, [[-41, -78, 20, 20],[-25, -78, 42, 42],[-11, -50, 42, 50]]]],
            ['heavy-attack-5', [[[418,1204,64,81],[38,78]], PushBox.IDLE, [[-41, -78, 20, 20],[-25, -78, 42, 42],[-11, -50, 42, 50]]]],

            //OLD ATTACKS - HEAVY PUNCH:
            // ['heavy-attack-1', [[[175,465,108,94],[24,92]], PushBox.IDLE]],
        ]);

        this.animations = {
            [FighterState.IDLE]: [
                ['idle-1', 4], ['idle-2', 4], ['idle-3', 4],
                ['idle-4', 4], ['idle-3', 4], ['idle-2', 4],
            ],
            [FighterState.WALK_FORWARD]: [
                ['forwards-1', 3], ['forwards-2', 6], ['forwards-3', 4],
                ['forwards-4', 4], ['forwards-5', 4], ['forwards-6', 6],
            ],
            [FighterState.WALK_BACKWARD]: [
                ['backwards-1', 3], ['backwards-2', 6], ['backwards-3', 4],
                ['backwards-4', 4], ['backwards-5', 4],['backwards-6', 6],
            ],
            [FighterState.JUMP_START]: [
                ['jump-land', 3], ['jump-land', FrameDelay.TRANSITION]
            ],
            [FighterState.JUMP_UP]: [
                ['jumpUp-1', 8], ['jumpUp-2', 8], ['jumpUp-3', 8],
                ['jumpUp-4', 8], ['jumpUp-5', 8], ['jumpUp-6', FrameDelay.FREEZE], 
            ],
            [FighterState.JUMP_FORWARD]: [
                ['jumpRoll-1', 13], ['jumpRoll-2', 5], ['jumpRoll-3', 3],
                ['jumpRoll-4', 3], ['jumpRoll-5', 3], ['jumpRoll-6', 5],
                ['jumpRoll-6',FrameDelay.FREEZE], 
            ],
            [FighterState.JUMP_BACKWARD]: [
                ['jumpRoll-6', 15], ['jumpRoll-5', 3], ['jumpRoll-4', 3],
                ['jumpRoll-3', 3], ['jumpRoll-2', 3],
                ['jumpRoll-1', FrameDelay.FREEZE], 
            ],
            [FighterState.JUMP_LAND]: [
                ['jump-land', 2], ['jump-land', 5], ['jump-land', FrameDelay.TRANSITION],
            ],
            [FighterState.CROUCH]: [
                ['crouch-3', FrameDelay.FREEZE], 
            ],
            [FighterState.CROUCH_DOWN]: [
                ['crouch-1', 2], ['crouch-2', 2], ['crouch-3', 2],
                ['crouch-3', FrameDelay.TRANSITION], 
            ],
            [FighterState.CROUCH_UP]: [
                ['crouch-3', 2], ['crouch-2', 2], ['crouch-1', 2],
                ['crouch-1', FrameDelay.TRANSITION],
            ],
            [FighterState.IDLE_TURN]: [
                ['idle-turn-3', 2], ['idle-turn-2', 2], ['idle-turn-1', 2],
                ['idle-turn-1', FrameDelay.TRANSITION],
            ],
            [FighterState.CROUCH_TURN]: [
                ['crouch-turn-3', 2], ['crouch-turn-2', 2], ['crouch-turn-1', 2],
                ['crouch-turn-1', FrameDelay.TRANSITION],
            ],
            [FighterState.LIGHT_ATTACK]: [
                ['light-attack-1', 2], ['light-attack-2', 4], ['light-attack-1', 4],
                ['light-attack-1', FrameDelay.TRANSITION],
            ],
            [FighterState.MEDIUM_ATTACK]: [
                ['medium-attack-1', 1], ['medium-attack-2', 2], ['medium-attack-3', 4], 
                ['medium-attack-2', 3], ['medium-attack-1', 3],
                ['medium-attack-1', FrameDelay.TRANSITION],
            ],
            [FighterState.HEAVY_ATTACK]: [
                ['heavy-attack-1', 2], ['heavy-attack-2', 4], ['heavy-attack-3', 8], 
                ['heavy-attack-4', 10], ['heavy-attack-5', 7],
                ['heavy-attack-5', FrameDelay.TRANSITION],
            ],

            //OLD ATTACK -  HEAVY PUNCH
            // [FighterState.HEAVY_ATTACK]: [
            //     ['medium-attack-1', 50], ['medium-attack-2', 33], ['heavy-attack-1', 100], 
            //     ['medium-attack-2', 166], ['medium-attack-1', 199],
            //     ['medium-attack-1', FrameDelay.TRANSITION],
            // ],
        };

        this.initialVelocity = {
            x: {
                [FighterState.WALK_FORWARD]: 3 * 60,
                [FighterState.WALK_BACKWARD]: -(2 * 60),
                [FighterState.JUMP_FORWARD]: ((48*3) + (12*2)),
                [FighterState.JUMP_BACKWARD]: -((45*4) + (15*3)),
            },
            jump: -420,
        };

        this.gravity = 1000;
    }
}