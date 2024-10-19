import { FighterState } from "../../constants/fighter.js";
import { frontendPlayers, socket } from "../../index.js";
import { DEBUG_drawDebug } from "../../utils/fighterDebug.js";
import { ChunLi, Ryu } from "./index.js";

export class Player extends Ryu{

    images = {
        'ryu': this.image,
    };
    currentImage = this.images['ryu'];


    constructor(playerId, onAttackHit, onAttackBlocked, entityList){
        super(playerId, onAttackHit, onAttackBlocked, entityList);

        //this.changeSpecial(1, FighterState.SPECIAL_1, new ChunLi());
    }

    changeSpecial(specialNumber, specialMoveID, specialMoveChar){

        let initName = specialMoveChar.states[specialMoveID].init.name;
        initName = initName.substring(6, initName.length);
        let updateName = specialMoveChar.states[specialMoveID].update.name;
        updateName = updateName.substring(6, updateName.length);

        if(!this.images[specialMoveChar.image.alt]){
            this.images[specialMoveChar.image.alt] = specialMoveChar.image;
        }


        this.frames = new Map([...this.frames, ...specialMoveChar.frames]);

        switch (specialNumber) {
            case 1:
                this.states[FighterState.SPECIAL_1] = specialMoveChar.states[specialMoveID];
                this.states[FighterState.SPECIAL_1].init = specialMoveChar[initName].bind(this);
                this.states[FighterState.SPECIAL_1].update = specialMoveChar[updateName].bind(this);
                this.animations[FighterState.SPECIAL_1] = specialMoveChar.animations[specialMoveID];
                break;
            case 2:
                this.states[FighterState.SPECIAL_2] = specialMoveChar.states[specialMoveID];
                this.states[FighterState.SPECIAL_2].init = specialMoveChar[initName].bind(this);
                this.states[FighterState.SPECIAL_2].update = specialMoveChar[updateName].bind(this);
                this.animations[FighterState.SPECIAL_2] = specialMoveChar.animations[specialMoveID];
                break;
            case 3:
                this.states[FighterState.SPECIAL_3] = specialMoveChar.states[specialMoveID];
                this.states[FighterState.SPECIAL_3].init = specialMoveChar[initName].bind(this);
                this.states[FighterState.SPECIAL_3].update = specialMoveChar[updateName].bind(this);
                this.animations[FighterState.SPECIAL_3] = specialMoveChar.animations[specialMoveID];
                break;
            default:
                break;
        }
    }

    changeState(newState, time, args){
        if(!this.states[newState].validFrom.includes(this.currentState)){
            console.warn(`Illegal transition from "${this.currentState}" to "${newState}"`)        
            return;
        }

        this.currentImage = this.images['ryu'];
        this.hasHit = false;


        this.currentState = newState;
        //socket.emit('changeState', newState, this.mySocketId);
        //this.currentState = frontendPlayers[this.mySocketId].fighterData.currentState;
        this.setAnimationFrame(0, time);
        this.states[this.currentState].init(time, args);
    }

    setEntityList(entityList){
        this.entityList = entityList;
    }

    draw(context, camera){

        const [frameKey] = this.animations[this.currentState][this.animationFrame];
        const[[
            [x,y,width,height],
            [originX, originY],
        ]] = this.frames.get(frameKey);

        context.scale(this.direction, 1);
        context.drawImage(
            this.currentImage,
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