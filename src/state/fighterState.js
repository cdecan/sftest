import { HEALTH_MAX_HP } from "../constants/battle.js";

export const createDefaultFighterState = (id) => ({
    id,
    score: 0,
    battles: 0,
    hitPoints: HEALTH_MAX_HP,
});