
export const garages = {
    simple: {
        name: "simple",
        pos: {x: 228, y: -990, z: -99.6, w: 22},
        out: {x: 228, y: -990, z: -100},
        places: [
            {pos: {x: 223, y: -978, z: -99.63}, rot: {x: 0, y: 0, z: -2}},
            {pos: {x: 223, y: -982, z: -99.63}, rot: {x: 0, y: 0, z: -2}},
            {pos: {x: 223, y: -986, z: -99.63}, rot: {x: 0, y: 0, z: -2}},
            {pos: {x: 223, y: -990, z: -99.63}, rot: {x: 0, y: 0, z: -2}},
            {pos: {x: 223, y: -994, z: -99.63}, rot: {x: 0, y: 0, z: -2}},
            {pos: {x: 223, y: -998, z: -99.63}, rot: {x: 0, y: 0, z: -2}},

            {pos: {x: 234, y: -982, z: -99.63}, rot: {x: 0, y: 0, z: 2}},
            {pos: {x: 234, y: -986, z: -99.63}, rot: {x: 0, y: 0, z: 2}},
            {pos: {x: 234, y: -990, z: -99.63}, rot: {x: 0, y: 0, z: 2}},
            {pos: {x: 234, y: -994, z: -99.63}, rot: {x: 0, y: 0, z: 2}},
            {pos: {x: 234, y: -998, z: -99.63}, rot: {x: 0, y: 0, z: 2}},
        ],
        exitPoints: [{x:240.5, y: -1004.9, z: -99, w: 1.5}, {x:228.2, y: -1005, z: -99, w: 2.5}],
    },

    casino: {
        name: "casino",
        pos: {x: 1285, y: 235.5, z: -50, w: 40},
        places: [],
        exitPoints: [],
    },
}

export let garageInteriors = {
    simple: {},
    casino: {},
}