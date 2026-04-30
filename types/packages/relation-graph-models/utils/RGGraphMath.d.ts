export type SizeInfo = {
    canvas_width: number;
    canvas_height: number;
    node_width: number;
    node_height: number;
};
export type CreateJunctionPointParams = {
    from_x: number;
    from_y: number;
    to_x: number;
    to_y: number;
    f_W: number;
    f_H: number;
    t_W: number;
    t_H: number;
    nodeShape: number;
    isReverse?: boolean;
    isEndPoint: boolean;
    totalLinesBetweenNodes?: number;
    currentLineIndex?: number;
    lineDistance?: number;
};
export declare const RGGraphMath: {
    getRectPoint(from_x: number, from_y: number, to_x: number, to_y: number, f_W: number, f_H: number, t_W: number, t_H: number, isReverse?: boolean, totalLines?: number, currentIndex?: number, lineDistance?: number, isEndPoint?: boolean): {
        x: number;
        y: number;
    };
    getRectPointBasic(x1: number, y1: number, x2: number, y2: number, n1w: number, n1h: number, n2w: number, n2h: number): {
        x: number;
        y: number;
        _case: string;
    };
    getRectJoinPoint(params: CreateJunctionPointParams): {
        x: number;
        y: number;
    };
    getRectHJoinPoint(params: CreateJunctionPointParams): {
        x: number;
        y: number;
    };
    getRectLeftJoinPoint(params: CreateJunctionPointParams): {
        x: number;
        y: number;
    };
    getRectRightJoinPoint(params: CreateJunctionPointParams): {
        x: number;
        y: number;
    };
    getRectTopJoinPoint(params: CreateJunctionPointParams): {
        x: number;
        y: number;
    };
    getRectBottomJoinPoint(params: CreateJunctionPointParams): {
        x: number;
        y: number;
    };
    getRectHorizontalLineJoinPoint(params: CreateJunctionPointParams): {
        y: number;
        x: number;
    };
    getRectVerticalLineLineJoinPoint(params: CreateJunctionPointParams): {
        x: number;
        y: number;
    };
    getRectVJoinPoint(params: CreateJunctionPointParams): {
        y: number;
        x: number;
    };
    getBorderPoint(x1: number, y1: number, x2: number, y2: number, n1w: number, n1h: number, n2w: number, n2h: number, n1style: number): {
        x: number;
        y: number;
    };
    getBorderPoint4MultiLine(params: CreateJunctionPointParams): {
        x: number;
        y: number;
    };
    getCirclePoint(x1: number, y1: number, x2: number, y2: number, n1w: number, n1h: number, n2w: number, n2h: number): {
        x: number;
        y: number;
    };
    getCirclePoint4MultiLine(x1: number, y1: number, x2: number, y2: number, n1w: number, n1h: number, n2w: number, n2h: number, isReverse: boolean, totalLines: number, currentIndex: number, lineDistance: number, isEndPoint: boolean): {
        x: number;
        y: number;
    };
    getCirclePointBasic(x1: number, y1: number, x2: number, y2: number, n1w: number, n1h: number, n2w: number, n2h: number, radius: number): {
        x: number;
        y: number;
    };
    getCirclePointPlus(x1: number, y1: number, x2: number, y2: number, n1w: number, n1h: number, n2w: number, n2h: number): {
        x: number;
        y: number;
    };
    getOvalPoint(c_x: number, c_y: number, c_r: number, c_i: number, c_n: number, startAngle?: number): {
        x: number;
        y: number;
    };
    /**
     * 获取点x,y以 c_x,c_y为中心旋转rotateDeg后的新坐标
     * @param c_x
     * @param c_y
     * @param x
     * @param y
     * @param rotateDeg 旋转角度，取值范围 0 - 360
     */
    getRotatedPoint(x: number, y: number, c_x: number, c_y: number, rotateDeg: number): {
        x: number;
        y: number;
    };
    /**
     * Returns the new x coordinate representing the point x after being horizontally flipped around the center point c_x
     * @param x
     * @param c_x
     */
    getFlippedX(x: number, c_x: number): number;
    getFlippedY(y: number, c_y: number): number;
    getAngleType(buffer_x: number, buffer_y: number): 1 | 2 | 3 | 4 | undefined;
    /**
     * 获取一个文字旋转的角度,以便看起来是沿着线条的角度排版，但又要确保文字是从左向右展示的
     * @param fx
     * @param fy
     * @param tx
     * @param ty
     */
    getTextAngle(fx: number, fy: number, tx: number, ty: number): number;
};
export declare const getNodeDistance: (fx: number, fy: number, tx: number, ty: number) => number;
export declare function rgSimpleGridLayout<ItemType extends {
    width: number;
    height: number;
}>(columns: number, gap: number, items: ItemType[], eachFn: (item: ItemType, x: number, y: number) => void, startX?: number, startY?: number): void;
export default RGGraphMath;
