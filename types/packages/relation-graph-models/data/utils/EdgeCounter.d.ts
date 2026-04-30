export declare class EdgeCounter {
    map: Map<string, number>;
    constructor();
    _key(a: string, b: string): string;
    addEdge(from: string, to: string): number;
    getCount(from: string, to: string): number;
    clear(): void;
}
