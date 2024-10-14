import { FRAME_TIME } from "./game.js";

export const PUSH_FRICTION = 66;
export const FIGHTER_START_DISTANCE = 88;
export const FIGHTER_HURT_DELAY = 7 + 8;

export const FighterDirection = {
    LEFT: -1,
    RIGHT: 1,
};

export const FighterAttackType = {
  STAND: 'stand',  
  CROUCH: 'crouch',
  OVERHEAD: 'overhead',
};

export const FighterState = {
    IDLE: 'idle',
    WALK_FORWARD: 'walk-forwards',
    WALK_BACKWARD: 'walk-backwards',
    JUMP_START: 'jump-start',
    JUMP_UP: 'jump-up',
    JUMP_FORWARD: 'jump-forwards',
    JUMP_BACKWARD: 'jump-backwards',
    JUMP_LAND: 'jump-land',
    CROUCH: 'crouch',
    CROUCH_DOWN: 'crouch-down',
    CROUCH_UP: 'crouch-up',
    IDLE_TURN: 'idle-turn',
    CROUCH_TURN: 'crouch-turn',
    LIGHT_ATTACK: 'light-attack',
    MEDIUM_ATTACK: 'medium-attack',
    HEAVY_ATTACK: 'heavy-attack',
    CROUCHING_LIGHT_ATTACK: 'crouching-light-attack',
    CROUCHING_MEDIUM_ATTACK: 'crouching-medium-attack',
    CROUCHING_HEAVY_ATTACK: 'crouching-heavy-attack',
    JUMPING_LIGHT_ATTACK: 'jumping-light-attack',
    JUMPING_MEDIUM_ATTACK: 'jumping-medium-attack',
    JUMPING_HEAVY_ATTACK: 'jumping-heavy-attack',
    HURT_HEAD_LIGHT: 'hurt-head-light',
    HURT_HEAD_MEDIUM: 'hurt-head-medium',
    HURT_HEAD_HEAVY: 'hurt-head-heavy',
    HURT_BODY_LIGHT: 'hurt-body-light',
    HURT_BODY_MEDIUM: 'hurt-body-medium',
    HURT_BODY_HEAVY: 'hurt-body-heavy',
    BLOCKING: 'blocking',
    SPECIAL_1: 'special-1',
    SPECIAL_2: 'special-2',
    SPECIAL_3: 'special-3',
    WIN: 'win',
    LOSE: 'lose',
};

export const PushBox = {
    IDLE: [-16,-80,32,78],
    JUMP: [-16, -91, 32, 66],
    BEND: [-16, -58, 32, 58],
    CROUCH: [-16, -50, 32, 50],
    JUMP_ATTACK: [-16, -80, 32, 50],
}

export const HurtBox = {
    INVINCIBLE: [[0,0,0,0],[0,0,0,0],[0,0,0,0]],
    IDLE: [[-8, -88, 24, 16],[-26, -74, 40, 42],[-26, -31, 40, 32]],
    BACKWARD: [[-19, -88, 24, 16],[-26, -74, 40, 42],[-26, -31, 40, 32]],
    FORWARD: [[-3, -88, 24, 16],[-26, -74, 40, 42],[-26, -31, 40, 32]],
    JUMP: [[-13, -106, 28, 18],[-26, -90, 40, 42],[-22, -66, 38, 18]],
    BEND: [[-2, -68, 24, 18],[-16, -53, 44, 24],[-16, -24, 44, 24]],
    CROUCH: [[6, -61, 24, 18],[-16, -46, 44, 24],[-16, -24, 44, 24]],
    PUNCH: [[11, -94, 24, 18],[-7, -77, 40, 43],[-7, -33, 40, 33]],
    JUMP_ATTACK: [[6, -91, 24, 18],[-16, -76, 44, 24],[-16, -54, 44, 24]],
};

export const FighterHurtBox = {
    HEAD: 'head',
    BODY: 'body',
    FEET: 'feet',
};

export const FrameDelay = {
    FREEZE: 0,
    TRANSITION: -1,
};

export const FighterId = {
    Ryu: 'Ryu',
    Ken: 'Ken',
    Player: 'Player',
};

export const FighterAttackStrength = {
    LIGHT: 'light',
    MEDIUM: 'medium',
    HEAVY: 'heavy',
};

export const FighterHurtBy = {
    FIGHTER: 'fighter',
    FIREBALL: 'fireball',
};

export const FighterAttackBaseData = {
    [FighterAttackStrength.LIGHT]: {
        //score:
        damage: 12,
        slide: {
            velocity: -12 * FRAME_TIME,
            friction: 600,
        },
    },
    [FighterAttackStrength.MEDIUM]: {
        //score:
        damage: 20,
        slide: {
            velocity: -16 * FRAME_TIME,
            friction: 600,
        },
    },
    [FighterAttackStrength.HEAVY]: {
        //score:
        damage: 28,
        slide: {
            velocity: -22 * FRAME_TIME,
            friction: 800,
        },
    },
};

export const hurtStateValidFrom = [
    FighterState.IDLE, FighterState.WALK_BACKWARD, FighterState.WALK_FORWARD,
    FighterState.JUMP_LAND, FighterState.JUMP_START, FighterState.IDLE_TURN,
    FighterState.LIGHT_ATTACK, FighterState.MEDIUM_ATTACK, FighterState.HEAVY_ATTACK,
    FighterState.CROUCHING_LIGHT_ATTACK, FighterState.CROUCHING_MEDIUM_ATTACK, FighterState.CROUCHING_HEAVY_ATTACK,
    FighterState.JUMPING_LIGHT_ATTACK, FighterState.JUMPING_MEDIUM_ATTACK, FighterState.JUMPING_HEAVY_ATTACK,
    FighterState.HURT_HEAD_LIGHT, FighterState.HURT_HEAD_MEDIUM, FighterState.HURT_HEAD_HEAVY,
    FighterState.HURT_BODY_LIGHT, FighterState.HURT_BODY_MEDIUM, FighterState.HURT_BODY_HEAVY,
    FighterState.SPECIAL_1, FighterState.SPECIAL_2, FighterState.SPECIAL_3, FighterState.BLOCKING,
];

export const specialStateValidFrom = [
        FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD,
        FighterState.CROUCH, FighterState.CROUCH_DOWN, FighterState.CROUCH_UP,
        FighterState.IDLE_TURN, FighterState.CROUCH_TURN,
        FighterState.LIGHT_ATTACK, FighterState.MEDIUM_ATTACK, FighterState.HEAVY_ATTACK,
        FighterState.CROUCHING_LIGHT_ATTACK, FighterState.CROUCHING_MEDIUM_ATTACK, FighterState.CROUCHING_HEAVY_ATTACK,

];

export const SpecialMoveDirection = {
    BACKWARD: 'backward',
    BACKWARD_UP: 'backward-up',
    UP: 'up',
    FORWARD_UP: 'forward-up',
    FORWARD: 'forward',
    FORWARD_DOWN: 'forward-down',
    DOWN: 'down',
    BACKWARD_DOWN: 'backward-down',
    NONE: 'none',
}

export const SpecialMoveButton = {
    ANY: 'any',
};