export const GamepadThumbstick = {
    DEAD_ZONE: 'deadZone',
    HORIZONTAL_AXE_ID: 'horizontalAxeId',
    VERTICAL_AXE_ID: 'verticalAxeId',
};

export const Control = {
    LEFT: 'left',
    RIGHT: 'right',
    UP: 'up',
    DOWN: 'down',
};

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
        },
        keyboard: {
            [Control.UP]: 'KeyW',
            [Control.DOWN]: 'KeyS',
            [Control.LEFT]: 'KeyA',
            [Control.RIGHT]: 'KeyD',
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
        },
        keyboard: {
            [Control.UP]: 'ArrowUp',
            [Control.DOWN]: 'ArrowDown',
            [Control.LEFT]: 'ArrowLeft',
            [Control.RIGHT]: 'ArrowRight',
        }
    },
];