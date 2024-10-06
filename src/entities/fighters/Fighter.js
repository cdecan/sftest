import { FIGHTER_HURT_DELAY, FIGHTER_START_DISTANCE, FighterAttackBaseData, FighterAttackStrength, FighterAttackType, FighterDirection, FighterHurtBox, FighterState, FrameDelay, PUSH_FRICTION, hurtStateValidFrom} from "../../constants/fighter.js";
import { STAGE_FLOOR, STAGE_MID_POINT, STAGE_PADDING } from "../../constants/stage.js";
import * as control from "../../engine/InputHandler.js";
import { boxOverlap, getActualBoxDimensions, rectsOverlap } from "../../utils/collisions.js";
import { FRAME_TIME } from "../../constants/game.js";
import { DEBUG_drawDebug } from "../../utils/fighterDebug.js";
import { playSound, stopSound } from "../../engine/soundHandler.js";

export class Fighter {
    image = new Image();
    frames = new Map();
    
    animations = {};
    animationFrame = 0;
    animationTimer = 0;
    
    currentState = FighterState.IDLE;
    opponent = undefined;

    hurtShake = 0;
    hurtShakeTimer = 0;
    slideVelocity = 0;
    slideFriction = 0;
    
    gravity = 0;
    velocity = {x: 0, y: 0};
    initialVelocity = {};
    attackStruck = false;


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
                FighterState.HURT_HEAD_LIGHT, FighterState.HURT_HEAD_MEDIUM, FighterState.HURT_HEAD_HEAVY,
                FighterState.HURT_BODY_LIGHT, FighterState.HURT_BODY_MEDIUM, FighterState.HURT_BODY_HEAVY,
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
                FighterState.JUMP_UP, FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD
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
                FighterState.CROUCH_DOWN, FighterState.CROUCH_TURN
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
    };

    soundLand = document.querySelector('audio#sound-fighter-land');

    constructor(playerId, onAttackHit){
        this.onAttackHit = onAttackHit;
        this.playerId = playerId;
        this.position = {
            x: STAGE_MID_POINT + STAGE_PADDING + (playerId === 0 ? -FIGHTER_START_DISTANCE : FIGHTER_START_DISTANCE),
            y: STAGE_FLOOR
        };
        
        this.direction = playerId === 0 ? FighterDirection.RIGHT : FighterDirection.LEFT;
    }

    changeState(newState){
        if(!this.states[newState].validFrom.includes(this.currentState)){
                console.warn(`Illegal transition from "${this.currentState}" to "${newState}"`)        
                return;
            }

        this.currentState = newState;
        this.animationFrame = 0;
        this.states[this.currentState].init();
    } 

    resetVelocities(){
        this.velocity = {x: 0, y: 0};
    }

    resetSlide(transfer=false){
        if(transfer){
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

    handleIdleState() {
        if(control.isUp(this.playerId)){
            this.changeState(FighterState.JUMP_START);
        }else if(control.isDown(this.playerId)){
            this.changeState(FighterState.CROUCH_DOWN);
        }else if(control.isBackward(this.playerId, this.direction)){
            this.changeState(FighterState.WALK_BACKWARD);
        }
        else if(control.isForward(this.playerId, this.direction)){
            this.changeState(FighterState.WALK_FORWARD);
        }else if(control.isLightAttack(this.playerId)){
            this.changeState(FighterState.LIGHT_ATTACK);
        }else if(control.isMediumAttack(this.playerId)){
            this.changeState(FighterState.MEDIUM_ATTACK);
        }else if(control.isHeavyAttack(this.playerId)){
            this.changeState(FighterState.HEAVY_ATTACK);
        }

        const newDirection = this.getDirection();

        if(newDirection !== this.direction){
            this.direction = newDirection;
            this.changeState(FighterState.IDLE_TURN);
        }
    }

    handleWalkForwardState(){
        if(!control.isForward(this.playerId, this.direction)){
            this.changeState(FighterState.IDLE);
        }else if(control.isUp(this.playerId)){
            this.changeState(FighterState.JUMP_START);
        }else if(control.isDown(this.playerId)){
            this.changeState(FighterState.CROUCH_DOWN);
        }else if(control.isLightAttack(this.playerId)){
            this.changeState(FighterState.LIGHT_ATTACK);
        }else if(control.isMediumAttack(this.playerId)){
            this.changeState(FighterState.MEDIUM_ATTACK);
        }else if(control.isHeavyAttack(this.playerId)){
            this.changeState(FighterState.HEAVY_ATTACK);
        }

        this.direction = this.getDirection();
    }

    handleWalkBackwardState(){
        if(!control.isBackward(this.playerId, this.direction)){
            this.changeState(FighterState.IDLE);
        }else if(control.isUp(this.playerId)){
            this.changeState(FighterState.JUMP_START);
        }else if(control.isDown(this.playerId)){
            this.changeState(FighterState.CROUCH_DOWN);
        }else if(control.isLightAttack(this.playerId)){
            this.changeState(FighterState.LIGHT_ATTACK);
        }else if(control.isMediumAttack(this.playerId)){
            this.changeState(FighterState.MEDIUM_ATTACK);
        }else if(control.isHeavyAttack(this.playerId)){
            this.changeState(FighterState.HEAVY_ATTACK);
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

    handleJumpState(time) {
        this.velocity.y += this.gravity * time.delta;
        if(this.position.y > STAGE_FLOOR){
            this.position.y = STAGE_FLOOR;
            this.changeState(FighterState.JUMP_LAND);
        }
    }

    handleJumpStartInit(){this.resetVelocities();}
    handleJumpStartState(){
        if(this.isAnimationCompleted()){
            if(control.isBackward(this.playerId, this.direction)){
                this.changeState(FighterState.JUMP_BACKWARD);
            }else if(control.isForward(this.playerId, this.direction)){
                this.changeState(FighterState.JUMP_FORWARD);
            }else{
                this.changeState(FighterState.JUMP_UP);
            }
        }
    }
    handleJumpLandInit(){
        this.resetVelocities();
        this.soundLand.play();
    }
    handleJumpLandState(){
        if (this.animationFrame < 1) return;

        let newState = FighterState.IDLE;


        if(!control.isIdle(this.playerId)){
            this.direction = this.getDirection();
            this.handleIdleState();
        } else {
            const newDirection = this.getDirection();
            if(newDirection !== this.direction){
                this.direction = newDirection;
                newState = FighterState.IDLE_TURN;
            }else{
                if (!this.isAnimationCompleted())return;
            }
            
            this.changeState(newState);
        }
    }

    handleCrouchState(){
        if(!control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_UP);

        const newDirection = this.getDirection();

        if(newDirection !== this.direction){
            this.direction = newDirection;
            this.changeState(FighterState.CROUCH_TURN);
        }
    }

    handleCrouchDownInit(){
        this.resetVelocities();
    }

    handleCrouchDownState(){
        if(this.isAnimationCompleted()){
            this.changeState(FighterState.CROUCH);
        }

        if(!control.isDown(this.playerId)) {
            this.currentState = FighterState.CROUCH_UP;
            this.animationFrame = this.animations[FighterState.CROUCH_UP][this.animationFrame].length
            - this.animationFrame;
        }
    }

    handleCrouchUpState(){
        if(this.isAnimationCompleted()){
            this.changeState(FighterState.IDLE);
        }
    }

    handleIdleTurnState(){
        this.handleIdleState();

        if (!this.isAnimationCompleted())return;
        this.changeState(FighterState.IDLE);
    }

    handleCrouchTurnState(){
        this.handleCrouchState();

        if (!this.isAnimationCompleted())return;
        this.changeState(FighterState.CROUCH);
    }

    handleAttackInit(){
        this.resetVelocities();

        stopSound(this.soundAttacks[this.states[this.currentState].attackStrength]);
        playSound(this.soundAttacks[this.states[this.currentState].attackStrength]);
    }

    handleLightAttackReset(){
        stopSound(this.soundAttacks[this.states[this.currentState].attackStrength]);
        playSound(this.soundAttacks[this.states[this.currentState].attackStrength]);
        this.animationFrame = 0;
        this.attackStruck = false;
    }

    handleLightAttackState(){
        if(this.animationFrame < 2) return;
        if(control.isLightAttack(this.playerId))this.handleLightAttackReset();
        if(!this.isAnimationCompleted()) return;
        this.changeState(FighterState.IDLE);
    }

    handleMediumAttackState(){
        if(!this.isAnimationCompleted()) return;
        this.changeState(FighterState.IDLE);
    }

    handleHurtInit(){
        this.resetVelocities();
        this.hurtShake = 2;
        this.hurtShakeTimer = performance.now();
    }

    handleHurtState(){
        if(!this.isAnimationCompleted()) return;
        this.hurtShake = 0;
        this.hurtShakeTimer = 0;
        this.changeState(FighterState.IDLE);
    }

    handleAttackHit(attackStrength, hitLocation){
        const newState = this.getHitState(attackStrength, hitLocation);
        const {velocity, friction} = FighterAttackBaseData[attackStrength].slide;

        this.slideVelocity = velocity;
        this.slideFriction = friction;
        this.changeState(newState);
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
        if(this.position.x > camera.position.x + context.canvas.width - this.boxes.push.width){
            this.position.x = camera.position.x + context.canvas.width - this.boxes.push.width;
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
                    camera.position.x + context.canvas.width - this.boxes.push.width
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

    updateAnimation(time){
        const animation = this.animations[this.currentState];
        const [, frameDelay] = animation[this.animationFrame];

        if(time.previous <= this.animationTimer + frameDelay * FRAME_TIME) return;
        this.animationTimer = time.previous;
    
        if(frameDelay <= FrameDelay.FREEZE) return;

        this.animationFrame++;
        if (this.animationFrame >= animation.length)this.animationFrame = 0;
        
        this.boxes = this.getBoxes(animation[this.animationFrame][0]);
    }

    updateAttackBoxCollided(time){
        if(!this.states[this.currentState].attackType || this.attackStruck) return;

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
            playSound(this.soundHits[attackStrength]);

            const strength = this.states[this.currentState].attackStrength;
            

            const hitPos = {
                x: (actualHitBox.x + (actualHitBox.width/2) + actualOpponentHurtBox.x + (actualOpponentHurtBox.width/2))/2,
                y: (actualHitBox.y + (actualHitBox.height/2) + actualOpponentHurtBox.y + (actualOpponentHurtBox.height/2))/2,
            }
            hitPos.x -= 4 - Math.random() * 8;
            hitPos.y -= 4 - Math.random() * 8;

            this.onAttackHit(time, this.playerId, this.opponent.playerId, hitPos, strength);
            this.opponent.handleAttackHit(attackStrength, hurtLocation);
            
            this.attackStruck = true;
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
    }

    update(time, context, camera){
        this.updatePosition(time);
        this.states[this.currentState].update(time,);
        this.updateSlide(time);
        this.updateAnimation(time);
        this.updateStageConstraints(time, context, camera);
        this.updateAttackBoxCollided(time);
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

}