interface Global {
    [key: string]: any;
}

declare var global: Global;

type CreepBodyPart = "move" | "work" | "carry" | "attack" | "ranged_attack" | "tough" | "heal" | "claim";

interface CoreConfiguration {
    noisy: boolean;
}

interface Memory {
    config: CoreConfiguration;
}

declare const enum Direction {
    TOP = 1,
    TOP_RIGHT = 2,
    RIGHT = 3,
    BOTTOM_RIGHT = 4,
    BOTTOM = 5,
    BOTTOM_LEFT = 6,
    LEFT = 7,
    TOP_LEFT = 8,
}
