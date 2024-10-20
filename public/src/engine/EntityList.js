import { HeavyHitSplash } from "../entities/fighters/shared/HeavyHitSplash.js";
import { LighHitSplash } from "../entities/fighters/shared/LightHitSplash.js";
import { MediumHitSplash } from "../entities/fighters/shared/MediumHitSplash.js";
import { frontendPlayers, socket } from "../index.js";

export class EntityList{

    entities = [];

    add(EntityClass, time, ...args){
        this.entities.push(new EntityClass(args, time, this));
        socket.emit('entitiesChanged', this.serialize(this.entities));
    }
    
    remove(entity) {
        const index = this.entities.indexOf(entity);
        if(index < 0) return;
        this.entities.splice(index, 1);
        socket.emit('entitiesChanged', this.serialize(this.entities));
    }
    
    update(time, context, camera){
        if(frontendPlayers[socket.id].fighterSceneData.needEntityUpdate){
            this.entities = this.deserialize(frontendPlayers[socket.id].fighterSceneData.entityList, time)
            socket.emit('entitiesSet');
        }

        for (const entity of this.entities) {
            entity.update(time, context, camera);
        }
    }
    
    draw(context, camera){
        for (const entity of this.entities) {
            entity.draw(context, camera);
        }
    }

    serialize(entities){
        var serializedList = []
        for(var item of entities){
            serializedList.push(item.serialize());
        }
        return serializedList
    }

    deserialize(serializedList, time){
        var deserializedList = [];
        for(var item of serializedList){
            //console.log(item)
            deserializedList.push(this.getDeserializedItem(item, time));
        }
        //console.log(deserializedList);
        return deserializedList;
    }

    getDeserializedItem(item, time){
        switch (item.type) {
            case 'LightHitSplash':
                return new LighHitSplash([item.position.x, item.position.y, item.playerId], time, this)
            case 'MediumHitSplash':
                return new MediumHitSplash([item.position.x, item.position.y, item.playerId], time, this)
            case 'HeavyHitSplash':
                return new HeavyHitSplash([item.position.x, item.position.y, item.playerId], time, this)
            default:
                break;
        }
    }
}
