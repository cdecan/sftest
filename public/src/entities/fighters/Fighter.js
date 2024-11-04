import { FIGHTER_HURT_DELAY, FIGHTER_START_DISTANCE, FighterAttackBaseData, FighterAttackStrength, FighterAttackType, FighterDirection, FighterHurtBox, FighterHurtBy, FighterState, FrameDelay, PUSH_FRICTION, hurtStateValidFrom} from "../../constants/fighter.js";
import { STAGE_FLOOR, STAGE_MID_POINT, STAGE_PADDING } from "../../constants/stage.js";
import * as control from "../../engine/InputHandler.js";
import { boxOverlap, getActualBoxDimensions, rectsOverlap } from "../../utils/collisions.js";
import { FRAME_TIME, SCREEN_WIDTH } from "../../constants/game.js";
import { DEBUG_drawDebug } from "../../utils/fighterDebug.js";
import { playSound, stopSound } from "../../engine/soundHandler.js";
import { hasSpecialMoveBeenExecuted } from "../../engine/controlHistory.js";
import { frontendPlayers, socket } from "../../index.js";
import { replacer } from "../../utils/mapStringify.js";

export class Fighter {
    image = new Image();
    frames = new Map();
    
    animations = {};
    animationFrame = 0;
    animationTimer = 0;
    
    currentState = FighterState.IDLE;
    opponent = undefined;
    winStart = false;
    winStop = false;

    hasHit = false;
    hurtBy = undefined;
    hurtShake = 0;
    hurtShakeTimer = 0;
    slideVelocity = 0;
    slideFriction = 0;
    
    velocity = {x: 0, y: 0};
    initialVelocity = {};
    attackStruck = false;
    gravity = 0;

    mySocketId = 0;


    boxes = {
        push: {x:0,y:0,width:0,height:0},
        hit: {x:0,y:0,width:0,height:0},
        hurt: {
            [FighterHurtBox.HEAD]: [0,0,0,0],
            [FighterHurtBox.BODY]: [0,0,0,0],
            [FighterHurtBox.FEET]: [0,0,0,0],
        },
    };
    
    states = {
        [FighterState.IDLE]: {
            init: this.handleIdleInit.bind(this),
            update: this.handleIdleState.bind(this),
            validFrom: [
                FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD,
                FighterState.JUMP_UP, FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD,
                FighterState.CROUCH_UP, FighterState.JUMP_LAND, FighterState.IDLE_TURN,
                FighterState.LIGHT_ATTACK, FighterState.MEDIUM_ATTACK, FighterState.HEAVY_ATTACK,
                FighterState.JUMPING_LIGHT_ATTACK, FighterState.JUMPING_MEDIUM_ATTACK, FighterState.JUMPING_HEAVY_ATTACK,
                FighterState.HURT_HEAD_LIGHT, FighterState.HURT_HEAD_MEDIUM, FighterState.HURT_HEAD_HEAVY,
                FighterState.HURT_BODY_LIGHT, FighterState.HURT_BODY_MEDIUM, FighterState.HURT_BODY_HEAVY,
                FighterState.BLOCKING,
            ],
        },
        [FighterState.WALK_FORWARD]: {
            init: this.handleMoveInit.bind(this),
            update: this.handleWalkForwardState.bind(this),
            validFrom: [
                FighterState.IDLE, FighterState.JUMP_LAND, FighterState.WALK_BACKWARD
            ],
        },
        [FighterState.WALK_BACKWARD]: {
            init: this.handleMoveInit.bind(this),
            update: this.handleWalkBackwardState.bind(this),
            validFrom: [
                FighterState.IDLE, FighterState.JUMP_LAND, FighterState.WALK_FORWARD
            ],
        },
        [FighterState.JUMP_START]: {
            init: this.handleJumpStartInit.bind(this),
            update: this.handleJumpStartState.bind(this),
            validFrom: [
                FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD,
                FighterState.JUMP_LAND
            ],
        },
        [FighterState.JUMP_LAND]: {
            init: this.handleJumpLandInit.bind(this),
            update: this.handleJumpLandState.bind(this),
            validFrom: [
                FighterState.JUMP_UP, FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD,
                FighterState.JUMPING_LIGHT_ATTACK, FighterState.JUMPING_MEDIUM_ATTACK, FighterState.JUMPING_HEAVY_ATTACK,
            ],
        },
        [FighterState.JUMP_UP]: {
            init: this.handleJumpInit.bind(this),
            update: this.handleJumpState.bind(this),
            validFrom: [
                FighterState.JUMP_START
            ],
        },
        [FighterState.JUMP_FORWARD]: {
            init: this.handleJumpInit.bind(this),
            update: this.handleJumpState.bind(this),
            validFrom: [
                FighterState.JUMP_START
            ],
        },
        [FighterState.JUMP_BACKWARD]: {
            init: this.handleJumpInit.bind(this),
            update: this.handleJumpState.bind(this),
            validFrom: [
                FighterState.JUMP_START
            ],
        },
        [FighterState.CROUCH]: {
            init: () => {},
            update: this.handleCrouchState.bind(this),
            validFrom: [
                FighterState.CROUCH_DOWN, FighterState.CROUCH_TURN,
                FighterState.CROUCHING_LIGHT_ATTACK, FighterState.CROUCHING_MEDIUM_ATTACK,
                FighterState.CROUCHING_HEAVY_ATTACK,
            ],
        },
        [FighterState.CROUCH_DOWN]: {
            init: this.handleCrouchDownInit.bind(this),
            update: this.handleCrouchDownState.bind(this),
            validFrom: [
                FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD, FighterState.JUMP_LAND,
            ],
        },
        [FighterState.CROUCH_UP]: {
            init: () => {},
            update: this.handleCrouchUpState.bind(this),
            validFrom: [
                FighterState.CROUCH,
            ],
        },
        [FighterState.IDLE_TURN]: {
            init: () => {},
            update: this.handleIdleTurnState.bind(this),
            validFrom: [
                FighterState.IDLE, FighterState.JUMP_LAND,
                FighterState.WALK_BACKWARD, FighterState.WALK_FORWARD,
            ],
        },
        [FighterState.CROUCH_TURN]: {
            init: () => {},
            update: this.handleCrouchTurnState.bind(this),
            validFrom: [
                FighterState.CROUCH,
            ],
        },
        [FighterState.LIGHT_ATTACK]: {
            attackType: FighterAttackType.STAND,
            attackStrength: FighterAttackStrength.LIGHT,
            init: this.handleAttackInit.bind(this),
            update: this.handleLightAttackState.bind(this),
            validFrom: [
                FighterState.IDLE, FighterState.WALK_BACKWARD, FighterState.WALK_FORWARD
            ],
        },
        [FighterState.MEDIUM_ATTACK]: {
            attackType: FighterAttackType.STAND,
            attackStrength: FighterAttackStrength.MEDIUM,
            init: this.handleAttackInit.bind(this),
            update: this.handleMediumAttackState.bind(this),
            validFrom: [
                FighterState.IDLE, FighterState.WALK_BACKWARD, FighterState.WALK_FORWARD
            ],
        },
        [FighterState.HEAVY_ATTACK]: {
            attackType: FighterAttackType.STAND,
            attackStrength: FighterAttackStrength.HEAVY,
            init: this.handleAttackInit.bind(this),
            update: this.handleMediumAttackState.bind(this),
            validFrom: [
                FighterState.IDLE, FighterState.WALK_BACKWARD, FighterState.WALK_FORWARD
            ],
        },
        [FighterState.CROUCHING_LIGHT_ATTACK]: {
            attackType: FighterAttackType.CROUCH,
            attackStrength: FighterAttackStrength.LIGHT,
            init: this.handleAttackInit.bind(this),
            update: this.handleCrouchingLightAttackState.bind(this),
            validFrom: [
                FighterState.CROUCH, FighterState.CROUCH_DOWN,
            ],
        },
        [FighterState.CROUCHING_MEDIUM_ATTACK]: {
            attackType: FighterAttackType.STAND,
            attackStrength: FighterAttackStrength.MEDIUM,
            init: this.handleAttackInit.bind(this),
            update: this.handleCrouchAttackState.bind(this),
            validFrom: [
                FighterState.CROUCH, FighterState.CROUCH_DOWN,
            ],
        },
        [FighterState.CROUCHING_HEAVY_ATTACK]: {
            attackType: FighterAttackType.CROUCH,
            attackStrength: FighterAttackStrength.HEAVY,
            shadow: [2.2, 1, 20, 0],
            init: this.handleAttackInit.bind(this),
            update: this.handleCrouchAttackState.bind(this),
            validFrom: [
                FighterState.CROUCH, FighterState.CROUCH_DOWN,
            ],
        },
        [FighterState.JUMPING_LIGHT_ATTACK]: {
            attackType: FighterAttackType.OVERHEAD,
            attackStrength: FighterAttackStrength.LIGHT,
            init: this.handleJumpAttackInit.bind(this),
            update: this.handleJumpingAttackState.bind(this),
            validFrom: [
                FighterState.JUMP_UP, FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD,
            ],
        },
        [FighterState.JUMPING_MEDIUM_ATTACK]: {
            attackType: FighterAttackType.OVERHEAD,
            attackStrength: FighterAttackStrength.MEDIUM,
            init: this.handleJumpAttackInit.bind(this),
            update: this.handleJumpingAttackState.bind(this),
            validFrom: [
                FighterState.JUMP_UP, FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD,
            ],
        },
        [FighterState.JUMPING_HEAVY_ATTACK]: {
            attackType: FighterAttackType.OVERHEAD,
            attackStrength: FighterAttackStrength.HEAVY,
            init: this.handleJumpAttackInit.bind(this),
            update: this.handleJumpingAttackState.bind(this),
            validFrom: [
                FighterState.JUMP_UP, FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD,
            ],
        },
        [FighterState.HURT_HEAD_LIGHT]: {
            init: this.handleHurtInit.bind(this),
            update: this.handleHurtState.bind(this),
            validFrom: hurtStateValidFrom,
        },
        [FighterState.HURT_HEAD_MEDIUM]: {
            init: this.handleHurtInit.bind(this),
            update: this.handleHurtState.bind(this),
            validFrom: hurtStateValidFrom,
        },
        [FighterState.HURT_HEAD_HEAVY]: {
            init: this.handleHurtInit.bind(this),
            update: this.handleHurtState.bind(this),
            validFrom: hurtStateValidFrom,
        },
        [FighterState.HURT_BODY_LIGHT]: {
            init: this.handleHurtInit.bind(this),
            update: this.handleHurtState.bind(this),
            validFrom: hurtStateValidFrom,
        },
        [FighterState.HURT_BODY_MEDIUM]: {
            init: this.handleHurtInit.bind(this),
            update: this.handleHurtState.bind(this),
            validFrom: hurtStateValidFrom,
        },
        [FighterState.HURT_BODY_HEAVY]: {
            init: this.handleHurtInit.bind(this),
            update: this.handleHurtState.bind(this),
            validFrom: hurtStateValidFrom,
        },
        [FighterState.BLOCKING]: {
            init: this.handleBlockInit.bind(this),
            update: this.handleBlockState.bind(this),
            validFrom: hurtStateValidFrom,
        },
        [FighterState.WIN]: {
            init: this.handleIdleInit.bind(this),
            update: () => {},
            validFrom: hurtStateValidFrom,
        },
        [FighterState.LOSE]: {
            init: this.handleIdleInit.bind(this),
            update: () => {},
            validFrom: hurtStateValidFrom,
        },
    }


    soundAttacks = {
        [FighterAttackStrength.LIGHT]: document.querySelector('audio#sound-fighter-light-attack'),
        [FighterAttackStrength.MEDIUM]: document.querySelector('audio#sound-fighter-medium-attack'),
        [FighterAttackStrength.HEAVY]: document.querySelector('audio#sound-fighter-heavy-attack'),
    };

    soundHits = {
        [FighterAttackStrength.LIGHT]: document.querySelector('audio#sound-fighter-light-punch-hit'),
        [FighterAttackStrength.MEDIUM]: document.querySelector('audio#sound-fighter-medium-punch-hit'),
        [FighterAttackStrength.HEAVY]: document.querySelector('audio#sound-fighter-heavy-kick-hit'),
        [FighterAttackStrength.LAUNCHER]: document.querySelector('audio#sound-fighter-light-punch-hit'),
    };

    soundLand = document.querySelector('audio#sound-fighter-land');

    constructor(playerId, onAttackHit, onAttackBlocked){
        this.onAttackHit = onAttackHit;
        this.onAttackBlocked = onAttackBlocked;
        this.playerId = playerId;
        this.position = {
            x: STAGE_MID_POINT + STAGE_PADDING + (playerId === 0 ? -FIGHTER_START_DISTANCE : FIGHTER_START_DISTANCE),
            y: STAGE_FLOOR
        };
        
        this.direction = playerId === 0 ? FighterDirection.RIGHT : FighterDirection.LEFT;
    }

    changeState(newState, time, args){
        if(!this.states[newState].validFrom.includes(this.currentState)){
                console.warn(`Illegal transition from "${this.currentState}" to "${newState}"`)        
                return;
            }

        this.hasHit = false;
        console.log(this.currentState);
        socket.emit('changeState', newState);
        //this.currentState = frontendPlayers[socket.id].fighterData.currentState;
        console.log(this.currentState);
        this.setAnimationFrame(0, time);
        this.states[this.currentState].init(time, args);
    } 

    resetVelocities(){
        this.velocity = {x: 0, y: 0};
    }

    invertVelocities(){
        this.velocity = {x: -this.velocity.x, y: this.velocity.y};
    }

    resetSlide(transfer=false){
        if(transfer && this.hurtBy === FighterHurtBy.FIGHTER){
            this.opponent.slideFriction = this.slideFriction;
            this.opponent.slideVelocity = this.slideVelocity;
        }
        this.slideVelocity = 0;
        this.slideFriction = 0;
    }

    isAnimationCompleted = () => this.animations[this.currentState][this.animationFrame][1]=== FrameDelay.TRANSITION;

    getDirection(){
        if(
            this.position.x + this.boxes.push.x + this.boxes.push.width
            <= this.opponent.position.x + this.opponent.boxes.push.x
        ){
            return FighterDirection.RIGHT;
        }else if(
            this.position.x + this.boxes.push.x
            >= this.opponent.position.x + this.opponent.boxes.push.x +this.opponent.boxes.push.width){
            return FighterDirection.LEFT;
        }
        return this.direction;
    } 

    getBoxes(frameKey){
        const [,
            [pushX = 0, pushY = 0, pushWidth = 0, pushHeight = 0] = [],
            [head = [0,0,0,0], body = [0,0,0,0], feet = [0,0,0,0]] = [],
            [hitX = 0, hitY = 0, hitWidth = 0, hitHeight = 0] = [],
        ] = this.frames.get(frameKey);

        return {
            push: {x:pushX,y:pushY,width:pushWidth,height:pushHeight},
            hit: {x:hitX,y:hitY,width:hitWidth,height:hitHeight},
            hurt: {
                [FighterHurtBox.HEAD]: head,
                [FighterHurtBox.BODY]: body,
                [FighterHurtBox.FEET]: feet,
            },
        };
    }

    hasCollidedWithOpponent = () => rectsOverlap(
        this.position.x + this.boxes.push.x,
        this.position.y + this.boxes.push.y,
        this.boxes.push.width,
        this.boxes.push.height,
        this.opponent.position.x + this.opponent.boxes.push.x,
        this.opponent.position.y + this.opponent.boxes.push.y,
        this.opponent.boxes.push.width,
        this.opponent.boxes.push.height
    )

    handleIdleInit() {
        this.resetVelocities();
        this.attackStruck = false;
    }

    handleIdleState(time) {
        if(control.isUp(this.playerId)){
            this.changeState(FighterState.JUMP_START, time);
        }else if(control.isDown(this.playerId)){
            this.changeState(FighterState.CROUCH_DOWN, time);
        }else if(control.isBackward(this.playerId, this.direction)){
            this.changeState(FighterState.WALK_BACKWARD, time);
        }else if(control.isForward(this.playerId, this.direction)){
            this.changeState(FighterState.WALK_FORWARD, time);
        }else if(control.isLightAttack(this.playerId)){
            this.changeState(FighterState.LIGHT_ATTACK, time);
        }else if(control.isMediumAttack(this.playerId)){
            this.changeState(FighterState.MEDIUM_ATTACK, time);
        }else if(control.isHeavyAttack(this.playerId)){
            this.changeState(FighterState.HEAVY_ATTACK, time);
        }

        const newDirection = this.getDirection();

        if(newDirection !== this.direction){
            this.direction = newDirection;
            this.changeState(FighterState.IDLE_TURN, time);
        }
    }

    handleWalkForwardState(time){
        if(!control.isForward(this.playerId, this.direction)){
            this.changeState(FighterState.IDLE, time);
        }else if(control.isUp(this.playerId)){
            this.changeState(FighterState.JUMP_START, time);
        }else if(control.isDown(this.playerId)){
            this.changeState(FighterState.CROUCH_DOWN, time);
        }else if(control.isLightAttack(this.playerId)){
            this.changeState(FighterState.LIGHT_ATTACK, time);
        }else if(control.isMediumAttack(this.playerId)){
            this.changeState(FighterState.MEDIUM_ATTACK, time);
        }else if(control.isHeavyAttack(this.playerId)){
            this.changeState(FighterState.HEAVY_ATTACK, time);
        }

        this.direction = this.getDirection();
    }

    handleWalkBackwardState(time){
        if(!control.isBackward(this.playerId, this.direction)){
            this.changeState(FighterState.IDLE, time);
        }else if(control.isUp(this.playerId)){
            this.changeState(FighterState.JUMP_START, time);
        }else if(control.isDown(this.playerId)){
            this.changeState(FighterState.CROUCH_DOWN, time);
        }else if(control.isLightAttack(this.playerId)){
            this.changeState(FighterState.LIGHT_ATTACK, time);
        }else if(control.isMediumAttack(this.playerId)){
            this.changeState(FighterState.MEDIUM_ATTACK, time);
        }else if(control.isHeavyAttack(this.playerId)){
            this.changeState(FighterState.HEAVY_ATTACK, time);
        }

        this.direction = this.getDirection();
    }

    handleMoveInit() {
        this.velocity.x = this.initialVelocity.x[this.currentState] ?? 0;
    }

    handleJumpInit() {
        this.velocity.y = this.initialVelocity.jump;
        this.handleMoveInit();
    }

    updateY(time){
        if(this.position.y == STAGE_FLOOR) return;
        if(this.position.y < STAGE_FLOOR){
            this.velocity.y += this.gravity * time.delta;
        }
        if(this.position.y > STAGE_FLOOR){
            this.position.y = STAGE_FLOOR;
            this.velocity.y = 0;
        }
    }

    handleJumpState(time) {
        if(this.position.y == STAGE_FLOOR){
            this.changeState(FighterState.JUMP_LAND, time);
        }

        if(control.isLightAttack(this.playerId)){
            this.changeState(FighterState.JUMPING_LIGHT_ATTACK, time);
        }else if(control.isMediumAttack(this.playerId)){
            this.changeState(FighterState.JUMPING_MEDIUM_ATTACK, time);
        }else if(control.isHeavyAttack(this.playerId)){
            this.changeState(FighterState.JUMPING_HEAVY_ATTACK, time);
        }
    }

    handleJumpStartInit(){this.resetVelocities();}
    handleJumpStartState(time){
        if(this.isAnimationCompleted()){
            if(control.isBackward(this.playerId, this.direction)){
                this.changeState(FighterState.JUMP_BACKWARD, time);
            }else if(control.isForward(this.playerId, this.direction)){
                this.changeState(FighterState.JUMP_FORWARD, time);
            }else{
                this.changeState(FighterState.JUMP_UP, time);
            }
        }
    }
    handleJumpLandInit(){
        this.resetVelocities();
        this.soundLand.play();
    }
    handleJumpLandState(time){
        if (this.animationFrame < 1) return;

        let newState = FighterState.IDLE;


        if(!control.isIdle(this.playerId)){
            this.direction = this.getDirection();
            this.handleIdleState(time);
        } else {
            const newDirection = this.getDirection();
            if(newDirection !== this.direction){
                this.direction = newDirection;
                newState = FighterState.IDLE_TURN;
            }else{
                if (!this.isAnimationCompleted())return;
            }
            
            this.changeState(newState, time);
        }
    }

    handleCrouchState(time){
        if(!control.isDown(this.playerId)){
            this.changeState(FighterState.CROUCH_UP, time);
        }else if(control.isLightAttack(this.playerId)){
            this.changeState(FighterState.CROUCHING_LIGHT_ATTACK, time);
        }else if(control.isMediumAttack(this.playerId)){
            this.changeState(FighterState.CROUCHING_MEDIUM_ATTACK, time);
        }else if(control.isHeavyAttack(this.playerId)){
            this.changeState(FighterState.CROUCHING_HEAVY_ATTACK, time);
        }

        const newDirection = this.getDirection();

        if(newDirection !== this.direction){
            this.direction = newDirection;
            this.changeState(FighterState.CROUCH_TURN, time);
        }
    }

    handleCrouchDownInit(){
        this.resetVelocities();
    }

    handleCrouchDownState(time){
        if(this.isAnimationCompleted()){
            this.changeState(FighterState.CROUCH, time);
        }

        if(!control.isDown(this.playerId)) {
            this.currentState = FighterState.CROUCH_UP;
            this.setAnimationFrame(
                Math.max(0, this.animations[FighterState.CROUCH_UP][this.animationFrame].length - this.animationFrame), 
                time,
            );
        }else if(control.isLightAttack(this.playerId)){
            this.changeState(FighterState.CROUCHING_LIGHT_ATTACK, time);
        }else if(control.isMediumAttack(this.playerId)){
            this.changeState(FighterState.CROUCHING_MEDIUM_ATTACK, time);
        }else if(control.isHeavyAttack(this.playerId)){
            this.changeState(FighterState.CROUCHING_HEAVY_ATTACK, time);
        }
    }

    handleCrouchUpState(time){
        if(this.isAnimationCompleted()){
            this.changeState(FighterState.IDLE, time);
        }
    }

    handleIdleTurnState(time){
        this.handleIdleState(time);

        if (!this.isAnimationCompleted())return;
        this.changeState(FighterState.IDLE, time);
    }

    handleCrouchTurnState(time){
        this.handleCrouchState();

        if (!this.isAnimationCompleted())return;
        this.changeState(FighterState.CROUCH, time);
    }

    handleAttackInit(){
        this.resetVelocities();

        stopSound(this.soundAttacks[this.states[this.currentState].attackStrength]);
        playSound(this.soundAttacks[this.states[this.currentState].attackStrength]);
    }

    handleJumpAttackInit(){
        stopSound(this.soundAttacks[this.states[this.currentState].attackStrength]);
        playSound(this.soundAttacks[this.states[this.currentState].attackStrength]);
    }

    handleLightAttackReset(time){
        if(this.opponent.hurtBy === undefined){
            stopSound(this.soundAttacks[this.states[this.currentState].attackStrength]);
            playSound(this.soundAttacks[this.states[this.currentState].attackStrength]);
            this.setAnimationFrame(0, time);
            this.attackStruck = false;
        }
    }

    handleLightAttackState(time){
        if(this.animationFrame < 2) return;
        if(control.isLightAttack(this.playerId))this.handleLightAttackReset(time);
        if(!this.isAnimationCompleted()) return;
        this.changeState(FighterState.IDLE, time);
    }

    handleMediumAttackState(time){
        if(!this.isAnimationCompleted()) return;
        this.changeState(FighterState.IDLE, time);
    }

    handleCrouchingLightAttackState(time){
        if(this.animationFrame < 2) return;
        if(control.isLightAttack(this.playerId))this.handleLightAttackReset(time);
        if(!this.isAnimationCompleted()) return;
        this.changeState(FighterState.CROUCH, time);
    }

    handleCrouchAttackState(time){
        if(!this.isAnimationCompleted()) return;
        this.changeState(FighterState.CROUCH, time);
    }

    handleJumpingAttackState(time){
        this.handleJumpState(time);
        if(this.position.y === STAGE_FLOOR){
            this.resetVelocities();
            this.changeState(FighterState.IDLE, time);
            this.position.y = STAGE_FLOOR;
        }else{
            if(!this.isAnimationCompleted()) return;
            this.changeState(FighterState.JUMP_UP, time);
            //this.currentState = FighterState.JUMP_UP;
        }
    }

    handleHurtInit(time){
        if(this.position.y < STAGE_FLOOR) this.invertVelocities();
        this.hurtShake = 2;
        this.hurtShakeTimer = time.previous + FRAME_TIME;
    }

    handleHurtState(time){
        if(!this.isAnimationCompleted()) return;
        this.hurtShake = 0;
        this.hurtShakeTimer = 0;
        this.hurtBy = undefined;
        if(this.position.y == STAGE_FLOOR) this.changeState(FighterState.IDLE, time);
    }

    handleBlockInit(time){
        this.resetVelocities();
        this.hurtShake = 2;
        this.hurtShakeTimer = time.previous + FRAME_TIME;
    }

    handleBlockState(time){
        //console.log("BLOCKING");
        if(!this.isAnimationCompleted()) return;
        this.changeState(FighterState.IDLE, time);
    }

    handleWin(time){
        this.resetVelocities();
        this.changeState(FighterState.WIN, time);
        this.opponent.changeState(FighterState.LOSE, time)
        this.winStart = true;
    }

    updateWin(time){
        if(this.currentState != FighterState.WIN) this.changeState(FighterState.WIN, time);
        if(!this.isAnimationCompleted()) return;
        this.changeState(FighterState.IDLE, time);
        this.winStart = false;
        this.winStop = true;
    }

    handleAttackHit(attackStrength, attackType, hitPosition, hitLocation, hurtBy, time){
        
        if(attackStrength === FighterAttackStrength.LAUNCHER){
            this.velocity.y = FighterAttackBaseData[attackStrength].launch;
            attackStrength = FighterAttackStrength.LIGHT;
        }
        
        if(attackType === FighterAttackType.COMBO){
            attackType = FighterAttackType.STAND;
        }
        
        const {velocity, friction} = FighterAttackBaseData[attackStrength].slide;
        
        this.hurtBy = hurtBy;
        this.slideVelocity = velocity;
        this.slideFriction = friction;
        this.attackStruck = true;
        if(this.currentState === FighterState.BLOCKING 
            || this.currentState === FighterState.WALK_BACKWARD 
            || this.currentState === FighterState.CROUCH)
            {
            if(attackType === FighterAttackType.CROUCH && control.isBlockingLow(this.playerId, this.direction)){
                this.onAttackBlocked(time, this.opponent.playerId, this.playerId);
            } else if(attackType === FighterAttackType.OVERHEAD && control.isBlockingHigh(this.playerId, this.direction)){
                this.onAttackBlocked(time, this.opponent.playerId, this.playerId);
                this.changeState(FighterState.BLOCKING, time);
            } else if(attackType === FighterAttackType.STAND && (control.isBlockingHigh(this.playerId, this.direction))){
                this.onAttackBlocked(time, this.opponent.playerId, this.playerId);
                this.changeState(FighterState.BLOCKING, time);
            } else if(attackType === FighterAttackType.STAND && control.isBlockingLow(this.playerId, this.direction)){
                this.onAttackBlocked(time, this.opponent.playerId, this.playerId);
            }else {
                const newState = this.getHitState(attackStrength, hitLocation);
                playSound(this.soundHits[attackStrength]);
                this.onAttackHit(time, this.opponent.playerId, this.playerId, hitPosition, attackStrength);
                this.changeState(newState, time);
            }
        } else {
            const newState = this.getHitState(attackStrength, hitLocation);
            playSound(this.soundHits[attackStrength]);
            this.onAttackHit(time, this.opponent.playerId, this.playerId, hitPosition, attackStrength);
            this.changeState(newState, time);
        }
    }

    getHitState(attackStrength, hitLocation){
        switch (attackStrength){
            case FighterAttackStrength.LIGHT:
                if(hitLocation===FighterHurtBox.HEAD) return FighterState.HURT_HEAD_LIGHT;
                return FighterState.HURT_BODY_LIGHT;
            case FighterAttackStrength.MEDIUM:
                if(hitLocation===FighterHurtBox.HEAD) return FighterState.HURT_HEAD_MEDIUM;
                return FighterState.HURT_BODY_MEDIUM;
            case FighterAttackStrength.HEAVY:
                if(hitLocation===FighterHurtBox.HEAD) return FighterState.HURT_HEAD_HEAVY;
                return FighterState.HURT_BODY_HEAVY;
        }
    }

    updateStageConstraints(time, context, camera) {
        if(this.position.x > camera.position.x + SCREEN_WIDTH - this.boxes.push.width){
            this.position.x = camera.position.x + SCREEN_WIDTH - this.boxes.push.width;
            this.resetSlide(true);
        }
        if(this.position.x < camera.position.x + this.boxes.push.width){
            this.position.x = camera.position.x + this.boxes.push.width;
            this.resetSlide(true);
        }

        if(this.hasCollidedWithOpponent()){
            if(this.position.x <= this.opponent.position.x){
                this.position.x = Math.max(
                    (this.opponent.position.x + this.opponent.boxes.push.x) - (this.boxes.push.x + this.boxes.push.width),
                    camera.position.x + this.boxes.push.width,
                );

                if ([
                    FighterState.IDLE, FighterState.CROUCH, 
                    FighterState.JUMP_BACKWARD, FighterState.JUMP_FORWARD, FighterState.JUMP_UP
                ].includes(this.opponent.currentState)){
                    this.opponent.position.x += PUSH_FRICTION * time.delta;
                }
            }

            if(this.position.x >= this.opponent.position.x){
                this.position.x = Math.min(
                    (this.opponent.position.x + this.opponent.boxes.push.x + this.opponent.boxes.push.width)
                    + (this.boxes.push.x + this.boxes.push.width),
                    camera.position.x + SCREEN_WIDTH - this.boxes.push.width
                );

                if ([
                    FighterState.IDLE, FighterState.CROUCH, 
                    FighterState.JUMP_BACKWARD, FighterState.JUMP_FORWARD, FighterState.JUMP_UP
                ].includes(this.opponent.currentState)){
                    this.opponent.position.x -= PUSH_FRICTION * time.delta;
                }
            }
        }
    }

    setAnimationFrame(frame, time){

        const animation = this.animations[this.currentState];

        this.animationFrame = frame;
        if (this.animationFrame >= animation.length)this.animationFrame = 0;
        
        const [frameKey, frameDelay] = animation[this.animationFrame];
        this.boxes = this.getBoxes(frameKey);
        this.animationTimer = time.previous + frameDelay*FRAME_TIME;
    }

    updateAnimation(time){
        const animation = this.animations[this.currentState];
        if(animation[this.animationFrame][1] <= FrameDelay.FREEZE || time.previous <= this.animationTimer) return;
        
        this.setAnimationFrame(this.animationFrame + 1, time);
    }

    updateAttackBoxCollided(time){
        
        if(this.hasHit) return;

        const attackType = this.states[this.currentState].attackType
        if(!attackType || this.attackStruck) return;

        const actualHitBox = getActualBoxDimensions(this.position, this.direction, this.boxes.hit);

        for(const [hurtLocation, hurtBox] of Object.entries(this.opponent.boxes.hurt)) {
            const [x, y, width, height] = hurtBox;
            const actualOpponentHurtBox = getActualBoxDimensions(
                this.opponent.position,
                this.opponent.direction,
                { x, y, width, height},
            );
            if(!boxOverlap(actualHitBox, actualOpponentHurtBox)) continue;
            
            const attackStrength = this.states[this.currentState].attackStrength;

            stopSound(this.soundHits[attackStrength]);            
            
            const hitPos = {
                x: (actualHitBox.x + (actualHitBox.width/2) + actualOpponentHurtBox.x + (actualOpponentHurtBox.width/2))/2,
                y: (actualHitBox.y + (actualHitBox.height/2) + actualOpponentHurtBox.y + (actualOpponentHurtBox.height/2))/2,
            }
            hitPos.x -= 4 - Math.random() * 8;
            hitPos.y -= 4 - Math.random() * 8;
            
            if(attackType !== FighterAttackType.COMBO){
                this.hasHit = true;
            } else {
                this.boxes.hit = {x:0,y:0,width:0,height:0};
            }
            this.opponent.handleAttackHit(attackStrength, attackType, hitPos, hurtLocation, FighterHurtBy.FIGHTER, time);
            return;
        }
    }

    updateHurtShake(time, delay){
        if(this.hurtShakeTimer === 0 || time.previous <= this.hurtShakeTimer) return;

        const shakeAmount = (delay - time.previous < (FIGHTER_HURT_DELAY * FRAME_TIME) / 2 ? 1 : 2);

        this.hurtShake = shakeAmount - this.hurtShake;
        this.hurtShakeTimer = time.previous + FRAME_TIME;
    }

    updateSlide(time){
        if(this.slideVelocity >= 0) return;

        this.slideVelocity += this.slideFriction * time.delta;
        if(this.slideVelocity < 0) return;

        this.resetSlide();
    }

    updatePosition(time){
        this.position.x += ((this.velocity.x + this.slideVelocity) * this.direction) * time.delta;
        this.position.y += this.velocity.y * time.delta;
        this.updateY(time);
    }

    updateSpecialMoves(time){
        for (const specialMove of this.specialMoves) {
            const resultArgs = hasSpecialMoveBeenExecuted(specialMove, this.playerId, time);

            if(resultArgs) this.changeState(specialMove.state, time, resultArgs);
        }
    }

    update(time, context, camera){
        this.updateSpecialMoves(time);
        this.updatePosition(time);
        //this.states[this.currentState].update(time);
        this.updateSlide(time);
        this.updateAnimation(time);
        this.updateStageConstraints(time, context, camera);
        this.updateAttackBoxCollided(time);
        //if(this.winStart) this.updateWin(time);
    }

    draw(context, camera){
        const [frameKey] = this.animations[this.currentState][this.animationFrame];
        const[[
            [x,y,width,height],
            [originX, originY],
        ]] = this.frames.get(frameKey);

        context.scale(this.direction, 1);
        context.drawImage(
            this.image,
            x, y,
            width, height,
            Math.floor((this.position.x - this.hurtShake - camera.position.x) * this.direction) - originX,
            Math.floor(this.position.y - camera.position.y) - originY,
            width, height
        );
        context.setTransform(1,0,0,1,0,0);

        DEBUG_drawDebug(this, context, camera);
    }

    reset(playerId){
        this.playerId = playerId;
        this.position = {
            x: STAGE_MID_POINT + STAGE_PADDING + (playerId === 0 ? -FIGHTER_START_DISTANCE : FIGHTER_START_DISTANCE),
            y: STAGE_FLOOR
        };
        
        this.direction = playerId === 0 ? FighterDirection.RIGHT : FighterDirection.LEFT;

        this.animationFrame = 0;
        this.animationTimer = 0;
        
        this.currentState = FighterState.IDLE;
        //this.opponent = undefined;
        this.winStart = false;
        this.winStop = false;

        this.hasHit = false;
        this.hurtBy = undefined;
        this.hurtShake = 0;
        this.hurtShakeTimer = 0;
        this.slideVelocity = 0;
        this.slideFriction = 0;
        
        this.velocity = {x: 0, y: 0};

    }

    setSocketId(id){
        this.mySocketId = id;
    }

    getSocketId(){
        return this.mySocketId;
    }

}