import { FighterState, FrameDelay, HurtBox, PushBox } from "../../constants/fighter.js";
import { Ryu } from "./index.js";

export class Player extends Ryu{

    constructor(playerId, onAttackHit, onAttackBlocked, entityList, special1=undefined, special2=undefined, special3=undefined, specialMoveChar=undefined){
        super(playerId, onAttackHit, onAttackBlocked, entityList);

        if(special1) this.changeSpecial(1, special1, specialMoveChar);
        if(special2) this.changeSpecial(2, special2, specialMoveChar);
        if(special3) this.changeSpecial(3, special3, specialMoveChar);

        //this.changeSpecial(1, FighterState.SPECIAL_3, new Ryu(playerId, onAttackHit, onAttackBlocked));
    }

    changeSpecial(specialNumber, specialMoveID, specialMoveChar){
        let initName = specialMoveChar.states[specialMoveID].init.name;
        initName = initName.substring(6, initName.length);
        let updateName = specialMoveChar.states[specialMoveID].update.name;
        updateName = updateName.substring(6, updateName.length);
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
}