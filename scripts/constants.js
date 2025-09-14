export const tileSizeInRem = 2;
export const boardRowTileCount = 10;
export const boardColumnTileCount = 10;

export const baseShips = [
    { name: "Carrier", size: 5 },
    { name: "Battleship", size: 4 },
    { name: "Cruiser", size: 3 },
    { name: "Submarine", size: 3 },
    { name: "Destroyer", size: 2 }
];

export const captains = {
    admiral: {
        name: "Admiral Nelson",
        ships: [...baseShips]
    },
    pirate: {
        name: "Captain Blackbeard",
        ships: [
            { name: "Black Pearl", size: 5 },
            { name: "Raider", size: 3 },
            { name: "Smuggler", size: 2 }
        ]
    },
    sciFi: {
        name: "Commander Shepard",
        ships: [
            { name: "Normandy", size: 4 },
            { name: "Interceptor", size: 3 },
            { name: "Scout Drone", size: 1 }
        ]
    }
};
