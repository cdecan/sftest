import { Fighter } from './Fighter.js';

export class Ken extends Fighter{
    constructor(x,y,velocity){
        super(x,y,'Ken',velocity);
        this.image = document.querySelector('img[alt=ken]');

        this.frames = new Map([
            //original: [2,687,59,90]
            //new:  [2,523,62,95]
            //delta: [0,-164,3,5]
            // ['forwards-1', [8,872,53,83]],
            // ['forwards-2', [70,867,60,88]],
            // ['forwards-3', [140,866,64,90]],
            // ['forwards-4', [215,865,63,89]],
            // ['forwards-5', [288,866,54,89]],
            // ['forwards-6', [357,867,50,89]],
            ['forwards-1', [8,708,56,88]],
            ['forwards-2', [70,703,63,93]],
            ['forwards-3', [140,702,67,95]],
            ['forwards-4', [215,701,66,94]],
            ['forwards-5', [288,702,57,94]],
            ['forwards-6', [357,703,53,94]],
        ]);

        this.animations = {
            'walkForwards': ['forwards-1', 'forwards-2', 'forwards-3', 'forwards-4', 'forwards-5','forwards-6'],
            'walkBackwards': ['backwards-1', 'backwards-2', 'backwards-3', 'backwards-4', 'backwards-5','backwards-6'],
        };
    }
}