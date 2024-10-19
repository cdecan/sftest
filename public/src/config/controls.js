import { GamepadThumbstick, Control } from "../constants/control.js";

export const controls = [
    {
        gamepad: {
            [GamepadThumbstick.DEAD_ZONE]: 0.5,
            [GamepadThumbstick.HORIZONTAL_AXE_ID]: 0,
            [GamepadThumbstick.VERTICAL_AXE_ID]: 1,

            [Control.UP]: 12,
            [Control.DOWN]: 13,
            [Control.LEFT]: 14,
            [Control.RIGHT]: 15,
            [Control.LIGHT_ATTACK]: 2,
            [Control.MEDIUM_ATTACK]: 3,
            [Control.HEAVY_ATTACK]: 4,
        },
        keyboard: {
            [Control.UP]: 'KeyW',
            [Control.DOWN]: 'KeyS',
            [Control.LEFT]: 'KeyA',
            [Control.RIGHT]: 'KeyD',
            [Control.LIGHT_ATTACK]: 'KeyU',
            [Control.MEDIUM_ATTACK]: 'KeyI',
            [Control.HEAVY_ATTACK]: 'KeyO',
        }
    },
    {
        gamepad: {
            [GamepadThumbstick.DEAD_ZONE]: 0.5,
            [GamepadThumbstick.HORIZONTAL_AXE_ID]: 0,
            [GamepadThumbstick.VERTICAL_AXE_ID]: 1,

            [Control.UP]: 12,
            [Control.DOWN]: 13,
            [Control.LEFT]: 14,
            [Control.RIGHT]: 15,
            [Control.LIGHT_ATTACK]: 2,
            [Control.MEDIUM_ATTACK]: 3,
            [Control.HEAVY_ATTACK]: 4,
        },
        keyboard: {
            // [Control.UP]: 'ArrowUp',
            // [Control.DOWN]: 'ArrowDown',
            // [Control.LEFT]: 'ArrowLeft',
            // [Control.RIGHT]: 'ArrowRight',//'KeyH',//'ArrowRight',
            // [Control.LIGHT_ATTACK]: 'Numpad1',
            // [Control.MEDIUM_ATTACK]: 'Numpad2',
            // [Control.HEAVY_ATTACK]: 'Numpad3',

            [Control.UP]: 'KeyW',
            [Control.DOWN]: 'KeyS',
            [Control.LEFT]: 'KeyA',
            [Control.RIGHT]: 'KeyD',
            [Control.LIGHT_ATTACK]: 'KeyU',
            [Control.MEDIUM_ATTACK]: 'KeyI',
            [Control.HEAVY_ATTACK]: 'KeyO',
        }
    },
];