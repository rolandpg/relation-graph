export class EdgeCounter {
    map: Map<string, number>;
    constructor() {
        // key -> count
        this.map = new Map();
        // 可选：保存所有原始边（用于需要返回具体边时使用）
        // this.edges = new Map(); // key -> Array<{from,to,meta}>
    }

    // 归一化 key（不区分方向）
    _key(a: string, b: string) {
        // 使用不可见字符作为分隔符以降低冲突概率
        return a <= b ? `${a}\u0001${b}` : `${b}\u0001${a}`;
    }

    // 添加一条边（默认为计数 +1）
    addEdge(from: string, to: string) {
        const key = this._key(from, to);
        const cur = this.map.get(key) || 0;
        this.map.set(key, cur + 1);
        return cur;
    }

    // 获取 from,to 之间的无向关系数量（不区分方向）
    getCount(from: string, to: string) {
        const key = this._key(from, to);
        return this.map.get(key) || 0;
    }

    // 清空
    clear() {
        this.map.clear();
    }
}
