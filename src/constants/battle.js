import { FRAME_TIME } from "./game.js";

export const TIME_DELAY = 30 * FRAME_TIME;
export const TIME_FLASH_DELAY = 3 * FRAME_TIME;
export const TIME_FRAME_KEYS = ['time', 'time-flash'];

export const HEALTH_MAX_HP = 144;
export const HEALTH_COLOR = '#F3F300';
export const HEALTH_DAMAGE_COLOR = '#F30000';
export const HEALTH_CRITICAL_HP = 45;

export const KO_FLASH_DELAY = [4 * FRAME_TIME, 7 * FRAME_TIME];
export const KO_ANIMATION = ['ko-white', 'ko-red'];