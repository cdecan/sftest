import { STAGE_PADDING, STAGE_MID_POINT } from "../constants/stage.js";
import { KenStage } from "../entities/stage/KenStage.js";
import { StatusBar } from "../entities/overlays/StatusBar.js";
import { Camera } from "../engine/Camera.js";
import { Ryu, Player, Cammy, ChunLi } from "../entities/fighters/index.js";
import { gameState } from "../state/gameState.js";
import { FIGHTER_HURT_DELAY, FighterAttackBaseData, FighterAttackStrength, FighterId, FighterState } from "../constants/fighter.js";
import { LighHitSplash, MediumHitSplash, HeavyHitSplash, Shadow } from "../entities/fighters/shared/index.js";
import { FRAME_TIME } from "../constants/game.js";
import { EntityList } from "../engine/EntityList.js";
import { pollControl } from "../engine/controlHistory.js";
import { SceneTypes } from "../constants/scenes.js";
import { frontendPlayers, socket } from "../index.js";
import { reviver } from "../utils/mapStringify.js";


export class BattleScene{
    fighters = [];
    camera = undefined;
    shadows = [];
    fighterDrawOrder = [0,1];
    hurtTimer = undefined;
    
    
    constructor(SFGame, fighterData=[]){
        this.fighterData = fighterData;
        this.SFGame = SFGame;
        this.stage = new KenStage();
        this.entities = new EntityList();

        this.startRound();

        this.overlays = [
            new StatusBar(this.fighters),
        ];
    }


    getHitSplashClass(strength){
        switch(strength){
            case FighterAttackStrength.LIGHT:
                return LighHitSplash;
            case FighterAttackStrength.MEDIUM:
                return MediumHitSplash;
            case FighterAttackStrength.HEAVY:
                return HeavyHitSplash;
            default:
                throw new Error('Unknown strength');
        }
    }

    

    handleAttackHit(time, playerId, opponentId, position, strength) {
        gameState.fighters[opponentId].hitPoints -= FighterAttackBaseData[strength].damage;
        
        
        this.hurtTimer = time.previous + (FIGHTER_HURT_DELAY * FRAME_TIME);
        this.fighterDrawOrder = [opponentId, playerId];
        if(!position) return;

        this.entities.add(this.getHitSplashClass(strength), time, position.x, position.y, playerId);
    }

    handleAttackBlocked(time, playerId, opponentId) {
        this.hurtTimer = time.previous + (FIGHTER_HURT_DELAY * FRAME_TIME);
        this.fighterDrawOrder = [opponentId, playerId];
    }

    startRound(){
        this.fighters = this.getFighterEntities();
        if(this.fighterData.length != 0){
            this.setFighterSpecials(this.fighters[0], this.fighterData[0].fighter)
            this.setFighterSpecials(this.fighters[1], this.fighterData[1].fighter)
        }
        
        this.camera = new Camera(STAGE_MID_POINT + STAGE_PADDING - 192, 16, this.fighters);
        this.shadows = this.fighters.map(fighter => new Shadow(fighter));
    }

    getFighterEntityClass(id){
        switch (id) {
            case FighterId.Ryu:
                return Ryu;
            case FighterId.Ken:
                return Ken;
            case FighterId.Player:
                return Player;
            default:
                throw new Error('Unimplemented fighter entity request')
        }
    }

    getFighterEntity(fighterState, index){
        const FighterEntityClass = this.getFighterEntityClass(fighterState.id);
        return new FighterEntityClass(index, this.handleAttackHit.bind(this), this.handleAttackBlocked.bind(this), this.entities);
    }

    getFighterEntities(){
        const fighterEntities = gameState.fighters.map(this.getFighterEntity.bind(this));
        fighterEntities[0].opponent = fighterEntities[1];
        fighterEntities[1].opponent = fighterEntities[0];
        fighterEntities[0].setSocketId(this.fighterData[0].socketId)
        fighterEntities[1].setSocketId(this.fighterData[1].socketId)
        //fighterEntities[0].sendToBackend()
        //fighterEntities[1].sendToBackend()
        return fighterEntities;
    }

    getOppositeIndex(index){
        if(index == 0){
            return 1;
        } else {
            return 0;
        }
    }

    updateFighters(time, context){
        for (const fighter of this.fighters) {
            pollControl(time, fighter.playerId, fighter.direction);
            
            if(time.previous < this.hurtTimer){
                fighter.updateHurtShake(time, this.hurtTimer);
                fighter.updateSpecialMoves(time);
            }else{
                if(fighter.mySocketId == socket.id){
                    fighter.update(time, context, this.camera);
                }
            }
        }
        for (const fighter of this.fighters) {
            if(fighter.mySocketId != socket.id){
                this.getFromBackend(fighter)
            }
        }
    }

    getFromBackend(fighter){
        fighter.currentState = frontendPlayers[fighter.mySocketId].fighterData.currentState;
        fighter.animationFrame = frontendPlayers[fighter.mySocketId].fighterData.animationFrame;
        fighter.animationTimer = frontendPlayers[fighter.mySocketId].fighterData.animationTimer;
        fighter.position = frontendPlayers[fighter.mySocketId].fighterData.position;
        fighter.velocity = frontendPlayers[fighter.mySocketId].fighterData.velocity;
        fighter.hasHit = frontendPlayers[fighter.mySocketId].fighterData.hasHit;
        fighter.hurtBy = frontendPlayers[fighter.mySocketId].fighterData.hurtBy;
        fighter.hurtShake = frontendPlayers[fighter.mySocketId].fighterData.hurtShake;
        fighter.hurtShakeTimer = frontendPlayers[fighter.mySocketId].fighterData.hurtShakeTimer;
        fighter.slideVelocity = frontendPlayers[fighter.mySocketId].fighterData.slideVelocity;
        fighter.slideFriction = frontendPlayers[fighter.mySocketId].fighterData.slideFriction;
        fighter.boxes = frontendPlayers[fighter.mySocketId].fighterData.boxes;
        //fighter.states = frontendPlayers[fighter.mySocketId].fighterData.states;
        fighter.frames = JSON.parse(frontendPlayers[fighter.mySocketId].fighterData.frames, reviver);
        fighter.animations = frontendPlayers[fighter.mySocketId].fighterData.animations;
        fighter.gravity = frontendPlayers[fighter.mySocketId].fighterData.gravity;
    }

    updateShadows(time, context){
        for (const shadow of this.shadows) {
            shadow.update(time, context, this.camera);
        }
    }

    

    updateOverlays(time, context){
        for (const overlay of this.overlays) {
            overlay.update(time, context, this.camera);
        }
    }

    updateGameOver(time){
        if(this.overlays[0].time <= 0){
            if(this.overlays[0].healthBars[0].hitPoints > this.overlays[0].healthBars[1].hitPoints){
                this.overlays[0].healthBars[1].hitPoints = 0;
            }else if(this.overlays[0].healthBars[0].hitPoints < this.overlays[0].healthBars[1].hitPoints){
                this.overlays[0].healthBars[0].hitPoints = 0;
            }
        }

        for(const index in this.overlays[0].healthBars){
            if(this.overlays[0].healthBars[index].hitPoints === 0){
                const winner = this.getOppositeIndex(index);
                if(!this.fighters[winner].winStart) this.fighters[winner].handleWin(time);
                if(this.fighters[winner].winStop){
                    this.fighters[winner].winStart = false;
                    this.fighters[winner].winStop = false;
                    this.SFGame.changeScene(SceneTypes.MOVE_SELECT, winner, this.fighters);
                }
            }
        }
    }

    update(time, context, socket){
        this.updateFighters(time, context, socket);
        this.updateShadows(time, context);
        this.stage.update(time);
        this.entities.update(time, context, this.camera);
        this.updateOverlays(time, context);
        this.camera.update(time, context);
        this.updateGameOver(time);
    }

    drawFighters(context){
        for (const fighterId of this.fighterDrawOrder) {
            this.fighters[fighterId].draw(context, this.camera);
        }
    }
    drawShadows(context){
        for (const shadow of this.shadows) {
            shadow.draw(context, this.camera);
        }
    }
    
    drawOverlays(context){
        for (const overlay of this.overlays) {
            overlay.draw(context, this.camera);
        }
    }

    draw(context, camera){
        this.stage.drawBackground(context, this.camera);
        this.drawShadows(context);
        this.drawFighters(context);
        this.entities.draw(context, this.camera);
        this.stage.drawForeground(context, this.camera);
        this.drawOverlays(context); 
    }

    setFighterSpecials(fighter, specials){
        fighter.changeSpecial(1, FighterState.SPECIAL_1, this.getNewFighter(specials['special-1']))
        fighter.changeSpecial(2, FighterState.SPECIAL_2, this.getNewFighter(specials['special-2']))
        fighter.changeSpecial(3, FighterState.SPECIAL_3, this.getNewFighter(specials['special-3']))
    }

    getNewFighter(id){
        switch (id) {
            case 'ryu':
                return new Ryu();
            case 'cammy':
                return new Cammy();
            case 'chunli':
                return new ChunLi();
            default:
                throw new Error('Unimplemented fighter entity request')
        }
    }
}