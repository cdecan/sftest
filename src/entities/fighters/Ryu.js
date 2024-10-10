import { FighterState, FrameDelay, HurtBox, PushBox, FIGHTER_HURT_DELAY, SpecialMoveDirection, SpecialMoveButton, FighterAttackType, FighterAttackStrength } from '../../constants/fighter.js';
import { playSound } from '../../engine/soundHandler.js';
import { Fighter } from './Fighter.js';
import { Fireball } from './special/Fireball.js';

export class Ryu extends Fighter{
    image = document.querySelector('img[alt=ryu]');
    voiceHadouken = document.querySelector('audio#sound-voice-hadouken');

        // this.frame = [7,14,59,90];

    frames = new Map([
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
        ['light-attack-2', [[[98,365,92,91],[32,88]], PushBox.IDLE, HurtBox.IDLE, [11, -75, 50, 18]]],
        
        //Medium Attack
        ['medium-attack-1', [[[6,466,60,94],[29,92]], PushBox.IDLE, HurtBox.IDLE]],
        ['medium-attack-2', [[[86,465,74,95],[29,92]], PushBox.IDLE, HurtBox.PUNCH]],
        ['medium-attack-3', [[[175,465,108,94],[24,92]], PushBox.IDLE, HurtBox.PUNCH, [17, -78, 76, 14]]],

        //Heavy Attack
        ['heavy-attack-1', [[[5,1196,61,90],[37,87]], PushBox.IDLE, [[-41, -78, 20, 20],[-25, -78, 42, 42],[-11, -50, 42, 50]]]],
        ['heavy-attack-2', [[[72,1192,94,94],[44,91]], PushBox.IDLE, [[12, -90, 34, 34],[-25, -78, 42, 42],[-11, -50, 42, 50]], [15, -99, 40, 32]]],
        ['heavy-attack-3', [[[176,1191,120,94],[42,91]], PushBox.IDLE, [[13, -91, 62, 34],[-25, -78, 42, 42],[-11, -50, 42, 50]], [21, -97, 62, 24]]],
        ['heavy-attack-4', [[[306,1208,101,77],[39,74]], PushBox.IDLE, [[-41, -78, 20, 20],[-25, -78, 42, 42],[-11, -50, 42, 50]]]],
        ['heavy-attack-5', [[[418,1204,64,81],[38,78]], PushBox.IDLE, [[-41, -78, 20, 20],[-25, -78, 42, 42],[-11, -50, 42, 50]]]],

        //Crouching Light Attack
        ['crouching-light-attack-1', [[[894,953,71,64],[27,61]], PushBox.CROUCH, HurtBox.CROUCH]],
        ['crouching-light-attack-2', [[[977,953,112,64],[27,61]], PushBox.CROUCH, HurtBox.CROUCH, [25, -15, 65, 18]]],

        //Crouching Medium Attack
        ['crouching-medium-attack-1', [[[247,583,64,62],[25,59]], PushBox.CROUCH, HurtBox.CROUCH]],
        ['crouching-medium-attack-2', [[[318,586,66,62],[25,59]], PushBox.CROUCH, HurtBox.CROUCH]],
        ['crouching-medium-attack-3', [[[394,586,92,62],[25,59]], PushBox.CROUCH, HurtBox.CROUCH, [17, -50, 56, 14]]],

        //Crouching Heavy Attack
        ['crouching-heavy-attack-1', [[[1424,1222,53,60],[37,57]], PushBox.CROUCH, HurtBox.CROUCH]],
        ['crouching-heavy-attack-2', [[[1487,1223,121,59],[44,57]], PushBox.CROUCH, HurtBox.CROUCH, [15, -20, 70, 17]]],
        ['crouching-heavy-attack-3', [[[1611,1227,63,57],[32,57]], PushBox.CROUCH, HurtBox.CROUCH]],
        ['crouching-heavy-attack-4', [[[1681,1225,63,59],[49,57]], PushBox.CROUCH, HurtBox.CROUCH]],

        //Jumping Light Attack
        ['jumping-light-attack-1', [[[353,362,52,69],[27,91]], PushBox.JUMP_ATTACK, HurtBox.JUMP_ATTACK]],
        ['jumping-light-attack-2', [[[415,365,81,71],[27,91]], PushBox.JUMP_ATTACK, HurtBox.JUMP_ATTACK, [40, -65, 15, 18]]],

        //Jumping Medium Attack
        ['jumping-medium-attack-1', [[[4,572,70,77],[27,91]], PushBox.JUMP_ATTACK, HurtBox.JUMP_ATTACK]],
        ['jumping-medium-attack-2', [[[87,567,52,69],[27,91]], PushBox.JUMP_ATTACK, HurtBox.JUMP_ATTACK]],
        ['jumping-medium-attack-3', [[[149,576,88,64],[27,91]], PushBox.JUMP_ATTACK, HurtBox.JUMP_ATTACK, [40, -65, 25, 20]]],

        //Jumping Heavy Attack
        ['jumping-heavy-attack-1', [[[1172,1206,59,76],[27,91]], PushBox.JUMP_ATTACK, HurtBox.JUMP_ATTACK]],
        ['jumping-heavy-attack-2', [[[1241,1210,63,72],[27,91]], PushBox.JUMP_ATTACK, HurtBox.JUMP_ATTACK]],
        ['jumping-heavy-attack-3', [[[1307,1212,110,63],[27,91]], PushBox.JUMP_ATTACK, HurtBox.JUMP_ATTACK, [20, -70, 65, 45]]],


        //Hit Face
        ['hit-face-1', [[[167, 2043, 263-167, 2134-2043], [41, 87]], PushBox.IDLE, [[-25, -89, 20, 20], [-33, -74, 40, 46], [-30, -37, 40, 38]]]],
        ['hit-face-2', [[[237, 2153, 305-237, 2241-2153], [47, 86]], PushBox.IDLE, [[-42, -88, 20, 20], [-46, -74, 40, 46], [-33, -37, 40, 38]]]],
        ['hit-face-3', [[[314, 2152, 385-314, 2239-2152], [53, 85]], PushBox.IDLE, [[-52, -87, 20, 20], [-53, -71, 40, 46], [-33, -37, 40, 38]]]],
        ['hit-face-4', [[[314, 2152, 385-313, 2239-2152], [56, 90]], PushBox.IDLE, [[-57, -88, 20, 20], [-53, -71, 40, 46], [-33, -37, 40, 38]]]],

        //Hit Stomach
        ['hit-stomach-1', [[[396, 2156, 455-396, 2241-2156], [37, 83]], PushBox.IDLE, [[-15, -85, 28, 18], [-31, -69, 42, 42], [-30, -34, 42, 34]]]],
        ['hit-stomach-2', [[[469, 2159, 535-469, 2241-2159], [41, 80]], PushBox.IDLE, [[-17, 82, 28, 18], [-33, -65, 38, 36], [-34, -34, 42, 34]]]],
        ['hit-stomach-3', [[[542, 2166, 612-542, 2245-2166], [40, 81]], PushBox.IDLE, [[-17, 82, 28, 18], [-41, -59, 38, 30], [-34, -34, 42, 34]]]],
        ['hit-stomach-4', [[[635, 2163, 718-635, 2240-2163], [50, 69]], PushBox.IDLE, [[-28, -67, 28, 18], [-41, -59, 38, 30], [-40, -34, 42, 34]]]],

        //Stunned
        ['stun-1', [[[947, 1926, 77, 87], [28, 85]], PushBox.IDLE, [[8, -87, 28, 18], [-16, -75, 40, 46], [-26, -31, 40, 32]]]],
        ['stun-2', [[[1034, 1924, 65, 89], [28, 87]], PushBox.IDLE, [[-9, -89, 28, 18], [-23, -75, 40, 46], [-26, -31, 40, 32]]]],
        ['stun-3', [[[1108, 1923, 67, 90], [35, 88]], PushBox.IDLE, [[-22, -91, 28, 18], [-30, -72, 42, 40], [-26, -31, 40, 32]]]],

        //Hadouken
        ['hadouken-1', [[[16, 1790, 74, 90], [28, 89]], PushBox.IDLE, HurtBox.IDLE]],
        ['hadouken-2', [[[111, 1796, 85, 84], [25, 83]], PushBox.IDLE, HurtBox.IDLE]],
        ['hadouken-3', [[[209, 1798, 90, 83], [25, 82]], PushBox.IDLE, HurtBox.IDLE]],
        ['hadouken-4', [[[314, 1804, 106, 77], [23, 76]], PushBox.IDLE, [[38, -79, 26, 18],[21, -65, 40, 38],[-12, -30, 78, 30]]]],

        //Tatsumaki
        ['tatsu-1', [[[16, 1527, 70, 104], [28, 105]], PushBox.IDLE, HurtBox.IDLE]],
        ['tatsu-2', [[[99, 1525, 61, 83], [28, 89]], PushBox.IDLE, HurtBox.IDLE]],
        ['tatsu-3', [[[168, 1531, 49, 65], [28, 89]], PushBox.IDLE, HurtBox.IDLE]],
        ['tatsu-4', [[[235, 1526, 58, 74], [28, 89]], PushBox.IDLE, HurtBox.IDLE]],
        ['tatsu-5', [[[305, 1524, 95, 102], [28, 105]], PushBox.IDLE, HurtBox.IDLE]],
        ['tatsu-6', [[[410, 1529, 56, 96], [38, 99]], PushBox.IDLE, HurtBox.IDLE, [20, -70, 65, 45]]],
        ['tatsu-7', [[[477, 1533, 95, 90], [78, 89]], PushBox.IDLE, HurtBox.IDLE]],
        ['tatsu-8', [[[588, 1535, 58, 91], [28, 89]], PushBox.IDLE, HurtBox.IDLE]],
        ['tatsu-9', [[[651, 1544, 53, 102], [28, 105]], PushBox.IDLE, HurtBox.IDLE]],
        ['tatsu-10', [[[710, 1559, 53, 95], [28, 89]], PushBox.IDLE, HurtBox.IDLE]],
    ]);

    animations = {
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
        [FighterState.CROUCHING_LIGHT_ATTACK]: [
            ['crouching-light-attack-1', 1], ['crouching-light-attack-2', 4], ['crouching-light-attack-1', 2],
            ['crouching-light-attack-1', FrameDelay.TRANSITION],
        ],
        [FighterState.CROUCHING_MEDIUM_ATTACK]: [
            ['crouching-medium-attack-1', 1], ['crouching-medium-attack-2', 2], ['crouching-medium-attack-3', 4], 
            ['crouching-medium-attack-2', 3], ['crouching-medium-attack-1', 3],
            ['crouching-medium-attack-1', FrameDelay.TRANSITION],
        ],
        [FighterState.CROUCHING_HEAVY_ATTACK]: [
            ['crouching-heavy-attack-1', 3], ['crouching-heavy-attack-2', 8],
            ['crouching-heavy-attack-3', 8], ['crouching-heavy-attack-4', 8],
            ['crouching-heavy-attack-4', FrameDelay.TRANSITION],
        ],
        [FighterState.JUMPING_LIGHT_ATTACK]: [
            ['jumping-light-attack-1', 1], ['jumping-light-attack-2', 4], ['jumping-light-attack-1', 2],
            ['jumping-light-attack-1', FrameDelay.TRANSITION],
        ],
        [FighterState.JUMPING_MEDIUM_ATTACK]: [
            ['jumping-medium-attack-1', 1], ['jumping-medium-attack-2', 2], ['jumping-medium-attack-3', 8], 
            ['jumping-medium-attack-2', 3], ['jumping-medium-attack-1', 3],
            ['jumping-medium-attack-1', FrameDelay.TRANSITION],
        ],
        [FighterState.JUMPING_HEAVY_ATTACK]: [
            ['jumping-heavy-attack-1', 1], ['jumping-heavy-attack-2', 2], ['jumping-heavy-attack-3', 99],
            ['jumping-heavy-attack-1', FrameDelay.TRANSITION],
        ],
        [FighterState.HURT_HEAD_LIGHT]: [
            ['hit-face-1', FIGHTER_HURT_DELAY], ['hit-face-1', 3],
            ['hit-face-2', 8], ['hit-face-2', FrameDelay.TRANSITION],
        ],
        [FighterState.HURT_HEAD_MEDIUM]: [
            ['hit-face-1', FIGHTER_HURT_DELAY], ['hit-face-1', 3],
            ['hit-face-2', 4], ['hit-face-3', 9], ['hit-face-3', FrameDelay.TRANSITION],
        ],
        [FighterState.HURT_HEAD_HEAVY]: [
            ['hit-face-3', FIGHTER_HURT_DELAY], ['hit-face-3', 7],
            ['hit-face-4', 4], ['hit-face-3', 9], ['hit-face-3', FrameDelay.TRANSITION],
        ],
        [FighterState.HURT_BODY_LIGHT]: [
            ['hit-stomach-1', FIGHTER_HURT_DELAY], ['hit-stomach-1', 11],
            ['hit-stomach-1', FrameDelay.TRANSITION],
        ],
        [FighterState.HURT_BODY_MEDIUM]: [
            ['hit-stomach-1', FIGHTER_HURT_DELAY], ['hit-stomach-1', 7],
            ['hit-stomach-2', 9], ['hit-stomach-2', FrameDelay.TRANSITION],
        ],
        [FighterState.HURT_BODY_HEAVY]: [
            ['hit-stomach-2', FIGHTER_HURT_DELAY], ['hit-stomach-2', 3],
            ['hit-stomach-3', 4], ['hit-stomach-4', 4],
            ['stun-3', 9], ['stun-3', FrameDelay.TRANSITION],
        ],
        [FighterState.BLOCKING]: [
            ['idle-1', 4], ['idle-1', 4], ['idle-1', FrameDelay.TRANSITION],
        ],
        [FighterState.SPECIAL_1]: [
            ['hadouken-1', 2], ['hadouken-2', 8], ['hadouken-3', 2], ['hadouken-4', 40],
            ['hadouken-4', FrameDelay.TRANSITION],
        ],
        [FighterState.SPECIAL_2]: [
            ['tatsu-1', 3], ['tatsu-2', 3], ['tatsu-3', 3], ['tatsu-4', 3], ['tatsu-5', 3],
            ['tatsu-6', 3], ['tatsu-7', 3], ['tatsu-8', 3], ['tatsu-9', 3], ['tatsu-10', 3],
            ['tatsu-10', FrameDelay.TRANSITION],
        ],
    };

    initialVelocity = {
        x: {
            [FighterState.WALK_FORWARD]: 3 * 60,
            [FighterState.WALK_BACKWARD]: -(2 * 60),
            [FighterState.JUMP_FORWARD]: ((48*3) + (12*2)),
            [FighterState.JUMP_BACKWARD]: -((45*4) + (15*3)),
        },
        jump: -420,
    };

    specialMoves = [
        {
            state: FighterState.SPECIAL_1,
            sequence: [
                SpecialMoveDirection.DOWN, SpecialMoveDirection.FORWARD_DOWN, SpecialMoveDirection.FORWARD,
                SpecialMoveButton.ANY
            ],
            cursor: 0,
        },
        {
            state: FighterState.SPECIAL_2,
            sequence: [
                SpecialMoveDirection.DOWN, SpecialMoveDirection.BACKWARD_DOWN, SpecialMoveDirection.BACKWARD,
                SpecialMoveButton.ANY
            ],
            cursor: 0,
        },
        {
            state: FighterState.SPECIAL_3,
            sequence: [
                SpecialMoveDirection.FORWARD, SpecialMoveDirection.DOWN, SpecialMoveDirection.FORWARD_DOWN,
                SpecialMoveButton.ANY
            ],
            cursor: 0,
        },
    ];

    gravity = 1000;

    fireballFired = false;


    constructor(playerId, onAttackHit, entityList){
        super(playerId, onAttackHit);

        this.entityList = entityList;
        
        this.states[FighterState.SPECIAL_1] = {
            init: this.handleHadoukenInit.bind(this),
            update: this.handleHadoukenState.bind(this),
            shadow: [1.6, 1, 22, 0],
            validFrom: [
                FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.IDLE_TURN,
                FighterState.CROUCH, FighterState.CROUCH_DOWN, FighterState.CROUCH_UP,
                FighterState.CROUCH_TURN, 
            ]
        }
        this.states[FighterState.IDLE].validFrom.push(FighterState.SPECIAL_1);

        this.states[FighterState.SPECIAL_2] = {
            init: this.handleTatsuInit.bind(this),
            update: this.handleTatsuState.bind(this),
            attackType: FighterAttackType.STAND,
            attackStrength: FighterAttackStrength.HEAVY,
            validFrom: [
                FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.IDLE_TURN,
                FighterState.CROUCH, FighterState.CROUCH_DOWN, FighterState.CROUCH_UP,
                FighterState.CROUCH_TURN,
            ]
        }
        this.states[FighterState.IDLE].validFrom.push(FighterState.SPECIAL_2);

        this.states[FighterState.SPECIAL_3] = {
            init: this.handleShoryuInit.bind(this),
            update: this.handleShoryuState.bind(this),
            attackType: FighterAttackType.STAND,
            attackStrength: FighterAttackStrength.HEAVY,
            validFrom: [
                FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.IDLE_TURN,
                FighterState.CROUCH, FighterState.CROUCH_DOWN, FighterState.CROUCH_UP,
                FighterState.CROUCH_TURN,
            ]
        }
        this.states[FighterState.IDLE].validFrom.push(FighterState.SPECIAL_3);
    }

    handleHadoukenInit(_, __){
        this.resetVelocities();
        playSound(this.voiceHadouken, 0.3);
        this.fireballFired = false;
    }
    handleHadoukenState(time){
        if(!this.fireballFired && this.animationFrame === 3){
            this.fireballFired = true;
            this.entityList.add.call(this.entityList, Fireball, time, this);
        }

        if(!this.isAnimationCompleted()) return;
        this.changeState(FighterState.IDLE, time);
    }

    handleTatsuInit(_, __){
        this.resetVelocities();
    }

    handleTatsuState(time){
        this.velocity.x = 250;
        if(!this.isAnimationCompleted()) return;
        this.velocity.x = 0;
        this.changeState(FighterState.IDLE, time);
    }

    handleShoryuInit(_, __){
        this.resetVelocities();
    }

    handleShoryuState(time){
        this.velocity.x = 300;
        if(!this.isAnimationCompleted()) return;
        this.velocity.x = 0;
        this.changeState(FighterState.IDLE, time);
    }
}