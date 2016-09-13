interface Memory {
    structures: { [structureId: string]: Object | undefined };
}

interface CreepMemory {
    spawnName: string;
    homeRoomName: string;
    role: string | null | undefined;
    [key: string]: any;

    _move?: {
    };
}



interface Creep {
    cmem: CreepMemory;
    role: string | null | undefined;

    spawn: Spawn;

    //Custom MoveTo
    travelTo(
        target: RoomPosition | RoomObject
        //, opts?: MoveToOpts & FindPathOpts
    ): number;

    /**
     * Home room of the creep.
     * Unavailable if fog of war is occluding access.
     */
    homeRoom?: Room;
    recycle(): void;
}


interface Flag {
    id: string;
    lookForStructureAtPosition<T extends Structure>(this: Flag, structureType: string): T | undefined;
}

interface LookForInBoxTerrainResult {
    x: number;
    y: number;
    terrain: string;
}

interface RoomPositionConstructor {
    new (x: number, y: number, roomName: string): RoomPosition;
    toUnicode(this: void, pos: PointLike): string;
    fromUnicode(this: void, character: string, roomName: string): RoomPosition;
    fromUnicodeFast(this: void, character: string): PointLike;
}

interface RoomPosition {
    getRangeToLinearSqr(this: RoomPosition, other: RoomPosition): number;
    getClosest<T extends RoomObject | { pos: RoomPosition }>(this: RoomPosition, targets: T[]): T | undefined;
    getClosestLinear<T extends RoomObject | { pos: RoomPosition }>(this: RoomPosition, targets: T[]): T | undefined;
    lookForStructure<T extends Structure>(this: RoomPosition, structureType: string): T | undefined;
    lookForInBox<T extends Creep | Flag | Structure | Resource | Source | ConstructionSite | LookForInBoxTerrainResult>(this: RoomPosition, structureType: string, radius: number): T[];
    lookTerrainInBox(this: RoomPosition, radius: number): LookForInBoxTerrainResult[];

    toUnicode(this: RoomPosition): string;
}

interface Room {
    findFirstStructureOfType<T extends Structure>(this: Room, structureType: string, onlyMine?: Boolean): T | undefined;
    findStructuresOfType<T extends Structure>(this: Room, structureType: string, onlyMine?: Boolean): T[];

    findFirstStructureOfTypeMatching<T extends Structure>(this: Room, structureType: string, condition: (structure: T) => boolean, onlyMine?: Boolean): T | undefined;
    findFirstStructureOfTypeMatching<TReturn extends TCallback, TCallback extends Structure>(this: Room, structureType: string, condition: (structure: TCallback) => boolean, onlyMine?: Boolean): TReturn | undefined;

    findStructuresOfTypeMatching<T extends Structure>(this: Room, structureType: string, condition: (structure: T) => boolean, onlyMine?: Boolean): T[];
    findStructuresOfTypeMatching<TReturn extends TCallback, TCallback extends Structure>(this: Room, structureType: string, condition: (structure: TCallback) => boolean, onlyMine?: Boolean): TReturn[];
}


interface Global {
    fromId<T>(id: string | null | undefined): T | undefined;
}

interface String {
    padRight(length: number): string;
    padRight(length: number, character: string): string;
    padLeft(length: number): string;
    padLeft(length: number, character: string): string;
}

interface ObjectConstructor {
    values<T>(object: { [key: string]: T;[key: number]: T; }): T[];
}

declare function fromId<T>(id: string | null | undefined): T | undefined;

interface PointLike {
    x: number;
    y: number;
}

interface RoomPositionLike extends PointLike {
    roomName: string;
}
