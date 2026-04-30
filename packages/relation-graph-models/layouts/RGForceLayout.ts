import RGGraphMath from '../utils/RGGraphMath';
import {devLog} from '../utils/RGCommon';
import {RGNodesAnalytic} from '../utils/RGNodesAnalytic';
import RGBaseLayout from './RGBaseLayout';
import {
    CalcNode,
    RelationGraphInstance, RGEventNames,
    RGForceLayoutOptions,
    RGLayoutOptions,
    RGNode,
    RGOptionsFull
} from '../../types';
import {NodesAnalyticResult, RGLevelDirection} from "./analyzers/RGNetworkAnalyzer";

type CalcNode4Force = CalcNode & {
    Fx: number;
    Fy: number;
    dragging: boolean,
    force_weight: number,
    forceCenterOffset_X: number,
    forceCenterOffset_Y: number,
    fixed: boolean
};

export class RGForceLayout extends RGBaseLayout {
    layoutOptions: RGForceLayoutOptions;
    private fastStart = false;
    private skipInitLayout = false;
    private maxLayoutTimes = 300;
    private byNode = true;
    private byLine = true;
    private lockX = false;
    private lockY = false;
    private force_node_repulsion = 1;
    private force_line_elastic = 1;
    private disableLiveChanges = false;
    private force_x_coefficient = 1;
    private force_y_coefficient = 1;
    instanceId = '';
    constructor(layoutOptions: RGForceLayoutOptions, graphOptions: RGOptionsFull, graphInstance: RelationGraphInstance) {
        super(layoutOptions, graphOptions, graphInstance);
        this.layoutOptions = layoutOptions as RGForceLayoutOptions;
        this.updateOptions(layoutOptions);
        this.requireLinks = true;
        this.instanceId = graphInstance ? graphInstance.generateNewUUID(5) : 'error-id';
    }
    updateOptions(layoutOptions: Partial<RGForceLayoutOptions>) {
        if (layoutOptions.fastStart !== undefined) this.fastStart = layoutOptions.fastStart;
        if (layoutOptions.maxLayoutTimes !== undefined) this.maxLayoutTimes = layoutOptions.maxLayoutTimes;
        if (layoutOptions.byNode !== undefined) this.byNode = layoutOptions.byNode;
        if (layoutOptions.byLine !== undefined) this.byLine = layoutOptions.byLine;
        if (layoutOptions.force_node_repulsion !== undefined) this.force_node_repulsion = layoutOptions.force_node_repulsion;
        if (layoutOptions.force_line_elastic !== undefined) this.force_line_elastic = layoutOptions.force_line_elastic;
        if (layoutOptions.force_x_coefficient !== undefined) this.force_x_coefficient = layoutOptions.force_x_coefficient;
        if (layoutOptions.force_y_coefficient !== undefined) this.force_y_coefficient = layoutOptions.force_y_coefficient;
        if (layoutOptions.disableLiveChanges !== undefined) this.disableLiveChanges = layoutOptions.disableLiveChanges;
        if (layoutOptions.skipInitLayout !== undefined) this.skipInitLayout = layoutOptions.skipInitLayout;
        if (layoutOptions.maxTractionLength !== undefined) this.maxTractionLength = layoutOptions.maxTractionLength;
        if (layoutOptions.zeroForceLength !== undefined) this.zeroForceLength = layoutOptions.zeroForceLength;
        if (layoutOptions.maxRepulsionDistance !== undefined) this.maxRepulsionDistance = layoutOptions.maxRepulsionDistance;
        if (layoutOptions.nodeCollisionRadius !== undefined) this.nodeCollisionRadius = layoutOptions.nodeCollisionRadius;
    }
    calcNodes:RGNode[] = [];
    placeNodes(calcNodes: RGNode[], rootNode?: RGNode){
        devLog('RGForceLayout['+this.instanceId+'].placeNodes');
        this.calcNodes = calcNodes;
        if (this.allNodes.length === 0) {
            this.allNodes = calcNodes;
        }
        this.rootNode = rootNode;
        if (this.fastStart) {
            devLog('RGForceLayout['+this.instanceId+'] fastStart');
            this.calcNodes.forEach(thisNode => {
                if (thisNode.fixed === true) return;
                let x = thisNode.x;
                let y = thisNode.y;
                let updated = false;
                if (Number.isNaN(x) || x === undefined){
                    x = Math.floor(Math.random() * 200) - 100;
                    updated = true;
                }
                if (Number.isNaN(y) || y === undefined){
                    y = Math.floor(Math.random() * 200) - 100;
                    updated = true;
                }
                if (x === 0 && y === 0) {
                    x = Math.floor(Math.random() * 200) - 100;
                    y = Math.floor(Math.random() * 200) - 100;
                    updated = true;
                }
                if (updated) {
                    this.updateNodePosition(thisNode, x, y);
                }
            });
        } else if (this.skipInitLayout) {

        } else {
            devLog('!!!initNodesPosition.....');
            if (rootNode) {
                devLog('layout by root:', rootNode);
                if (Number.isNaN(rootNode.x) || rootNode.x === undefined) {
                    this.updateNodePosition(rootNode, 0, 0);
                }

                const {tree} = this.networkAnalyzer.analyzeNetwork(calcNodes, rootNode);
                const {networkNodes, analyticResult} = tree;
                if (rootNode.fixed || this.layoutOptions.fixedRootNode) {
                    // 什么都不做
                } else {
                    this.updateNodePosition(rootNode, 0, 0);
                }
                const rootLotXY = RGNodesAnalytic.getNodeLotXY({
                    alignItemsX: 'center',
                    alignItemsY: 'center',
                }, rootNode);
                rootNode.lot.x = rootLotXY.x;
                rootNode.lot.y = rootLotXY.y;

                this.placeRelativePosition(rootNode, networkNodes, analyticResult, 1, []);
                devLog('!!!initNodesPosition fixedRootNode:2:', rootNode.x, rootNode.y);
                networkNodes.forEach(thisNode => {
                    if (thisNode.fixed === true) return;
                    if (!thisNode.rgCalcedVisibility) return;
                    if (thisNode === rootNode) return;
                    const x = thisNode.lot.x! - RGNodesAnalytic.getNodeWidth(thisNode) / 2;
                    const y = thisNode.lot.y! - RGNodesAnalytic.getNodeHeight(thisNode) / 2;
                    this.updateNodePosition(thisNode, x, y);
                });
            }
        }
        this.allNodes.forEach(thisNode => {
            let x = thisNode.x;
            let y = thisNode.y;
            let updated = false;
            if (Number.isNaN(x) || x === undefined) {
                x = 0;
                updated = true;
            }
            if (Number.isNaN(y) || y === undefined) {
                y = 0;
                updated = true;
            }
            if (updated) {
                this.updateNodePosition(thisNode, x, y);
            }
        });
        devLog('['+this.instanceId+']Start Auto Layout.....');
        this.start();
    };
    protected getLevelR(levelDistanceArr: number[], level: number) {
        if (levelDistanceArr.length === 0) return;
        let distance = 0;
        for (let i = 0; i < level; i++) {
            distance += (levelDistanceArr[i] || levelDistanceArr[levelDistanceArr.length - 1]);
        }
        return distance;
    }

    protected placeRelativePosition(rootNode: RGNode, groupNodes: RGNode[], analyticResult: NodesAnalyticResult, distanceCoefficient: number, levelDistanceArr: number[]) {
        devLog('analyticResult:', this.layoutOptions, analyticResult, distanceCoefficient, levelDistanceArr);
        const centerXy = {x: rootNode.lot.x!, y: rootNode.lot.y!};
        const level1Nodes = groupNodes.filter(node => node.lot.level === 1);
        this.placeNodesInFanRegion(level1Nodes, 0, 360, centerXy, 1, analyticResult.max_strength, levelDistanceArr, 1, distanceCoefficient, 0);
    }
    private calculateMinimumRadius(nodes: RGNode[], padding: number = 0): number {
        if (nodes.length === 0) return 0;
        if (nodes.length === 1) return 0;

        // 1. 计算每个节点的“安全半径”（这里采用对角线的一半，确保任何角度不重叠）
        // 如果你确定节点只是水平/垂直排列，也可以取 max(w, h) / 2
        const nodeRadii = nodes.map(node => {
            const w = node.width || node.el_W;
            const h = node.height || node.el_H;
            return Math.sqrt(w * w + h * h) / 2 + padding / 2;
        });

        // 2. 计算相邻节点中心之间的最小弦长
        const chords: number[] = [];
        for (let i = 0; i < nodeRadii.length; i++) {
            const next = (i + 1) % nodeRadii.length;
            chords.push(nodeRadii[i] + nodeRadii[next]);
        }

        // 3. 二分查找半径 R
        // 最小半径至少要能容纳最大的弦（即 R >= max(chord)/2）
        let minR = Math.max(...chords) / 2;
        // 最大半径设为一个足够大的值（例如所有弦长之和）
        let maxR = chords.reduce((a, b) => a + b, 0);

        const iterations = 100; // 迭代100次可达到极高精度
        let resultR = maxR;

        for (let iter = 0; iter < iterations; iter++) {
            const midR = (minR + maxR) / 2;
            let totalAngle = 0;

            for (const MathChord of chords) {
                // 如果 midR 太小导致 asin 无法计算，说明半径太小了
                const ratio = MathChord / (2 * midR);
                if (ratio > 1) {
                    totalAngle = 10; // 强制设为一个大于 2*PI 的值
                    break;
                }
                totalAngle += 2 * Math.asin(ratio);
            }

            if (totalAngle > 2 * Math.PI) {
                // 角度太大，说明圆太小了，需要增大半径
                minR = midR;
            } else {
                // 角度太小，说明圆太大了，可以尝试缩小半径
                maxR = midR;
                resultR = midR;
            }
        }

        return resultR;
    }
    protected placeNodesInFanRegion(nodes: RGNode[], startDeg: number, endDeg: number, centerXy: {x:number, y:number}, level: number, parentStrength: number, levelDistanceArr: number[], deep: number, distanceCoefficient: number, currentR: number) {
        // console.warn('[center]levelNodes:', level, nodes.length, parentStrength);
        let currentDeg = startDeg;
        const totalDeg = endDeg - startDeg;
        const defaultLevelR = 200;
        let circleR = this.getLevelR(levelDistanceArr, level) || (currentR + (defaultLevelR * distanceCoefficient));
        if (level === 1) {
            if (distanceCoefficient === 1 && (!this.layoutOptions.levelGaps || this.layoutOptions.levelGaps.length === 0)) {
                circleR = this.calculateMinimumRadius(nodes, 10);
                circleR = Math.min(Math.max(circleR, 200), 500)
            }
        }
        for (const node of nodes) {
            const degPercent = node.lot?.strengthWithChilds! / parentStrength;
            const x = centerXy.x + circleR;
            const y = centerXy.y;
            const degWidth = degPercent * totalDeg;
            const degValue = (currentDeg + degWidth / 2);
            const nodeXy = RGGraphMath.getRotatedPoint(x, y, centerXy.x, centerXy.y, degValue);
            node.lot.x = nodeXy.x;
            node.lot.y = nodeXy.y;
            if (node.lot.childs && node.lot.childs.length > 0) {
                this.placeNodesInFanRegion(node.lot.childs, currentDeg, currentDeg + degWidth, centerXy, level + 1, node.lot?.strengthWithChilds!, levelDistanceArr, deep + 1, distanceCoefficient, circleR);
            }
            currentDeg += degWidth;
        }
    }

    protected graphEventHandle(eventName: RGEventNames, ...args: any[]) {
        if (eventName === RGEventNames.onNodeDragStart) {
            const node = args[0];
            const calcNode = this.calcNodeMap.get(node);
            if (calcNode) {
                calcNode.dragging = true;
            }
        } else if (eventName === RGEventNames.onNodeDragging) {
            const node = args[0];
            const x = args[1];
            const y = args[2];
            const calcNode = this.calcNodeMap.get(node);
            // console.log('[force]onNodeDragging:', node.id, calcNode);
            if (calcNode) {
                calcNode.x = x;
                calcNode.y = y;
            }
        } else if (eventName === RGEventNames.onNodeDragEnd) {
            const node = args[0];
            const calcNode = this.calcNodeMap.get(node);
            if (calcNode) {
                calcNode.dragging = false;
            }
        }
    }

    protected _graphEventHandler;

    protected connectToGraphInstance() {
        this._graphEventHandler = this.graphEventHandle.bind(this);
        if (this.graphInstance) this.graphInstance.addEventHandler(this._graphEventHandler);
    }

    protected disConnectToGraphInstance() {
        if (this.graphInstance) this.graphInstance.removeEventHandler(this._graphEventHandler);
    }

    layoutTimes = 0;
    prev10: number[] = [];
    visibleNodes: RGNode[] = [];

    // var ___this = this
    updateVisibleNodes(allNode?: RGNode[]) {
        this.visibleNodes = [];
        if (allNode) this.allNodes = allNode;
        this.allNodes.forEach(thisNode => {
            if (!thisNode.lot) {
                devLog('node miss lot:', thisNode.text);
                thisNode.lot = {
                    x: thisNode.x,
                    y: thisNode.y,
                    childs: []
                };
            }
            this.visibleNodes.push(thisNode);
        });
        this.resetCalcNodes();
        devLog('visibleNodes:', this.visibleNodes.length);
    }

    protected viewUpdate() {
        if (this._onTickCallback) {
            this._onTickCallback();
        }
        if (this.graphInstance) {
            this.graphInstance.forceLayoutTickCallback();
        }
    }

    autoLayout(forceLayout = false) {
        this.updateVisibleNodes();
        if (this.isMainLayouer) {
            const options = this.graphInstance.dataProvider.getOptions();
            this.graphInstance.dataProvider.updateOptions({
                layout: {
                    ...options.layout,
                    autoLayouting: true
                }
            });
        }
        this.doForceLayout(0);
    }

    protected _onFinishCallback: () => void;

    onFinish(onFinishCallback: () => void) {
        this._onFinishCallback = onFinishCallback;
    }
    _onTickCallback: () => void;
    onTick(_onTickCallback: () => void) {
        this._onTickCallback = _onTickCallback;
    }

    applyFBuffToNodes() {
        for (const node of this.forCalcNodes) {
            this.applyToNodePosition(node);
        }
    }

    applyPositionToNodes() {
        this.visibleNodes.forEach(thisNode => {
            if (thisNode.fixed) return;
            const calcNode = this.calcNodeMap.get(thisNode);
            if (calcNode) {
                thisNode.x = calcNode.x;
                thisNode.y = calcNode.y;
            }
        });
        this.viewUpdate();
    }

    protected layoutFinished() {
        cancelAnimationFrame(this.animationFrameTimer);
        if (this.isMainLayouer) {
            const options = this.graphInstance.dataProvider.getOptions();
            this.graphInstance.dataProvider.updateOptions({
                layout: {
                    ...options.layout,
                    autoLayouting: false
                }
            });
        }
        // console.warn('Force Layout['+this.instanceId+'] finished on:', this.layoutTimes, 'of', this.maxLayoutTimes);
        devLog('Force Layout['+this.instanceId+'] finished');
        this.applyFBuffToNodes();
        this.applyPositionToNodes();
        this.disConnectToGraphInstance();
        try {
            this._onFinishCallback && this._onFinishCallback();
        } catch (e) {
            console.error(e);
        }
    }

    protected resetCalcNodes() {
        this.forCalcNodes = [];
        this.calcNodeMap = new WeakMap();
        this.visibleNodes.forEach(thisNode => {
            const calcNode: CalcNode4Force = {
                rgNode: thisNode,
                Fx: 0,
                Fy: 0,
                x: thisNode.x,
                y: thisNode.y,
                dragging: false,
                force_weight: thisNode.force_weight || 1,
                forceCenterOffset_X: (thisNode.width || thisNode.el_W || 60) / 2,
                forceCenterOffset_Y: (thisNode.height || thisNode.el_H || 60) / 2,
                fixed: thisNode.fixed || false
            };
            this.forCalcNodes.push(calcNode);
            this.calcNodeMap.set(thisNode, calcNode);
        });
        this.allLinks = this.graphInstance.getLinksBetweenNodes(this.visibleNodes);
    }

    protected calcNodeMap = new WeakMap<RGNode, CalcNode4Force>();
    protected forCalcNodes: CalcNode4Force[] = [];
    protected recentGraphVelocity: number[] = [];
    protected graphVelocityBalancedValue = 0.1;

    start() {
        if (this.stoped && this.layoutTimes === 0) {
            return;
        }
        this.stoped = false;
        this.layoutTimes = 0;
        this.updateVisibleNodes();
        this.connectToGraphInstance();
        this.autoLayout(true);
    }
    doForceLayout(useTime: number) {
        if (this.graphInstance.viewComponentUnmounted) {
            devLog('['+this.instanceId+']stop layout:viewComponentUnmounted');
            this.layoutFinished();
            return;
        }
        let layoutHz = '0';
        if (useTime > 0) {
            if (this.prev10.length >= 10) {
                this.prev10.splice(0, 1);
                const prev10Time = this.prev10[this.prev10.length - 1] - this.prev10[0];
                layoutHz = (1000 / (prev10Time / 10)).toFixed(1);
            }
            this.prev10.push(useTime);
        } else { // 如果是第一次运行
            if (this.visibleNodes.length === 0) {
                this.updateVisibleNodes();
            }
        }

        this.layoutTimes++;
        const needApply = this.calcNodesPosition();
        this.applyFBuffToNodes();
        if (!this.disableLiveChanges) {
            if (this.layoutTimes % 2 === 0) {
                this.applyPositionToNodes();
            }
        }
        if (this.layoutTimes <= this.maxLayoutTimes) {
            if (Date.now() - this.prevLogTime > 3000) {
                devLog('Force Layout['+this.instanceId+'] Is Working...layoutTimes:', this.layoutTimes, 'of', this.maxLayoutTimes,  layoutHz, 'Hz', this.visibleNodes.length);
                this.prevLogTime = Date.now();
            }
            this.animationFrameTimer = requestAnimationFrame(this.doForceLayout.bind(this));
        } else {
            this.layoutFinished();
        }
    }
    private prevLogTime = 0;
    private animationFrameTimer = 0;
    // calc4Parents(node: CalcNode4Force, parentNode: RGNode | undefined) {
    //   if (!parentNode) return;
    //   const parentCalcNode = this.calcNodeMap.get(parentNode);
    //   this.addGravityByNode(node, parentCalcNode);
    //   this.calc4Parents(parentCalcNode, parentNode.lot.parent);
    // }
    private prevNodeLevel1Index = 0;
    private prevNodeLevel2Index = 0;
    syncNodePosition(nodeId: string, x: number, y: number) {
        const node = this.allNodes.find(n => n.id === nodeId);
        const calcNode = this.calcNodeMap.get(node);
        if (calcNode) {
            calcNode.x = x;
            calcNode.y = y;
        }
    }
    calcNodesPosition(): false | undefined {
        // let calcLines = true;
        // let calcTimes = 0;
        if (this.byNode) {
            const fastLayout = false; // this.graphOptions.performanceMode && this.layoutTimes < 20;
            for (let i = this.prevNodeLevel1Index; i < this.forCalcNodes.length; i++) {
                const __node1 = this.forCalcNodes[i];
                if (__node1.dragging) {
                    continue;
                }
                if (__node1.fixed) {
                    continue;
                }
                // 循环点，综合点与其他所有点点斥力及方向
                for (let j = this.prevNodeLevel2Index; j < this.forCalcNodes.length; j++) {
                    // 循环点，计算i点与j点点斥力及方向
                    if (i !== j) {
                        if (fastLayout && Math.random() < 0.5) {
                            continue;
                        }
                        const __node2 = this.forCalcNodes[j];
                        if (__node2.dragging) {
                            continue;
                        }
                        this.addGravityByNode(__node1, __node2);
                        // calcTimes++;
                        // if (calcTimes > 10000) {
                        //     this.prevNodeLevel2Index = j;
                        //     break;
                        // }
                    }
                }
                // if (calcTimes > 10000) {
                //     calcLines = false;
                //     this.prevNodeLevel1Index = i;
                //     break;
                // }
            }
        }
        // if (!calcLines) {
        //     console.log('start at:', this.prevNodeLevel1Index, this.prevNodeLevel2Index, calcTimes);
        //     return false;
        // }
        // this.prevNodeLevel1Index = 0;
        if (this.byLine) {
            // console.log('start at:line:xxxxxxxxxxxx', this.prevNodeLevel1Index, this.prevNodeLevel2Index, calcTimes);
            if (this.allLinks && this.allLinks.length > 0) {
                for (const link of this.allLinks) {
                    if (!link.line.forDisplayOnly) {
                        let force_elastic = link.line.force_elastic === undefined ? 1:link.line.force_elastic;
                        if (this.visibleNodes.includes(link.fromNode) && this.visibleNodes.includes(link.toNode)) {
                            const _node1 = this.calcNodeMap.get(link.fromNode);
                            const _node2 = this.calcNodeMap.get(link.toNode);
                            this.addElasticByLine(
                                _node1,
                                _node2,
                                force_elastic
                            );
                        }
                    }
                }
            } else {
                for (const thisNode of this.visibleNodes) {
                    // 循环线,设置每个点承受点力及力点方向
                    if (thisNode.lot && thisNode.lot.parent) {
                        const _node1 = this.calcNodeMap.get(thisNode.lot.parent);
                        const _node2 = this.calcNodeMap.get(thisNode);
                        this.addElasticByLine(
                            _node1,
                            _node2,
                            1
                        );
                        // break
                    }
                }
            }
        }
        return true;
    }
    private stoped = false;
    stop() {
        this.stoped = true;
        if (this.layoutTimes === 0) {
            return;
        }
        const options = this.graphInstance.dataProvider.getOptions();
        cancelAnimationFrame(this.animationFrameTimer);
        devLog('[RGForceLayout]['+this.instanceId+']stop:', options.layout.autoLayouting, this.layoutTimes);
        this.layoutTimes = Number.MAX_VALUE;
        this.layoutFinished();
    }

    // getX(node:RGNode) {
    //   if (node.lot.fcalc_ing) {
    //     return node.lot.fcalc_x;
    //   }
    //   return node.x + (node.lot.forceCenterOffset_X || 30);
    // }
    // getY(node:RGNode) {
    //   if (node.lot.fcalc_ing) {
    //     return node.lot.fcalc_y;
    //   }
    //   return node.y + (node.lot.forceCenterOffset_Y || 30);
    // }
    addElasticByLine(node1: CalcNode4Force, node2: CalcNode4Force, force_elastic = 1) {
        const x1 = node1.x;
        const y1 = node1.y;
        const x2 = node2.x;
        const y2 = node2.y;
        let length = Math.sqrt((y1 - y2) ** 2 + (x1 - x2) ** 2);
        if (length < this.zeroForceLength) {
            return;
        }
        if (length > this.maxTractionLength) {
            length = this.maxTractionLength;
        }
        const Kf = (length - this.zeroForceLength) * 0.02 * this.force_line_elastic * force_elastic;
        const Kf_1 = Kf;
        const Kf_2 = Kf;
        const _buff_x = (x1 - x2) / length;
        const _buff_y = (y1 - y2) / length;
        this.addFtoNode(node1, _buff_x * Kf_1 * -1, _buff_y * Kf_1 * -1);
        this.addFtoNode(node2, _buff_x * Kf_2, _buff_y * Kf_2);
    }

    maxTractionLength = 400; // 线条最大牵引力时的长度
    zeroForceLength = 40; // 线条零牵引力时的长度
    maxRepulsionDistance = 600; // 节点之间斥力消失的距离（意思是节点之间超过这个距离则没有相互的斥力）
    nodeCollisionRadius = 40; // 节点之间强制保持的距离

    maxMoveSpeed = 100;
    n2nMaxForce = 50;

    addGravityByNode(node1: CalcNode4Force, node2: CalcNode4Force, coefficient = 1) {
        const x1 = node1.x;
        const y1 = node1.y;
        const x2 = node2.x;
        const y2 = node2.y;
        // const x1 = this.getX(node1);
        // const y1 = this.getY(node1);
        // const x2 = this.getX(node2);
        // const y2 = this.getY(node2);
        // const length = (Math.abs(y1 - y2) + Math.abs(x1 - x2)) / 1.5;
        if (coefficient === 1) {
            if (Math.abs(x1 - x2) > this.maxRepulsionDistance || Math.abs(y1 - y2) > this.maxRepulsionDistance) {
                return;
            }
        }
        const length = Math.sqrt((y1 - y2) ** 2 + (x1 - x2) ** 2);
        if (coefficient === 1 && length > this.maxRepulsionDistance) {
            return;
        }
        let Kf = (this.maxRepulsionDistance - length) * 0.02 * this.force_node_repulsion * coefficient;
        if (length < this.nodeCollisionRadius) { // 如果离得太近，把斥力加倍
            Kf = Kf * 2;
        }
        // if (length < 100)Kf = Kf * 2
        const _buff_x = (x1 - x2) / length;
        const _buff_y = (y1 - y2) / length;
        // if (_buff_x < 30)_buff_x = 1
        // if (_buff_y < 30)_buff_y = 1
        this.addFtoNode(node1, _buff_x * Kf, _buff_y * Kf);
        // this.addFtoNode(node2, _buff_x * Kf * -1, _buff_y * Kf * -1);
    }

    addFtoNode(node: CalcNode4Force, x: number, y: number) {
        if (node.fixed) return;
        if (node.dragging) return;
        if (Number.isNaN(x) || Number.isNaN(y)) {
            return;
        }
        if (x > this.n2nMaxForce) x = this.n2nMaxForce;
        if (y > this.n2nMaxForce) y = this.n2nMaxForce;
        if (x < -this.n2nMaxForce) x = -this.n2nMaxForce;
        if (y < -this.n2nMaxForce) y = -this.n2nMaxForce;
        const weight = node.force_weight || 1;
        if (!this.lockX) node.Fx += (x * (1 / weight));
        if (!this.lockY) node.Fy += (y * (1 / weight));
    }

    applyToNodePosition(node: CalcNode4Force) {
        if (node.fixed) return 0;
        if (node.dragging) {
            const rgNode: RGNode = node.rgNode;
            this.updateNodePosition(rgNode, node.x, node.y);
            return 0;
        }
        if (this.calcNodes !== this.allNodes && !this.calcNodes.includes(node.rgNode)) return 0;
        let __buff_x = node.Fx;
        let __buff_y = node.Fy;
        if (__buff_x > this.maxMoveSpeed) __buff_x = this.maxMoveSpeed;
        if (__buff_y > this.maxMoveSpeed) __buff_y = this.maxMoveSpeed;
        if (__buff_x < -this.maxMoveSpeed) __buff_x = -this.maxMoveSpeed;
        if (__buff_y < -this.maxMoveSpeed) __buff_y = -this.maxMoveSpeed;
        node.x = node.x + __buff_x * this.force_x_coefficient;
        node.y = node.y + __buff_y * this.force_y_coefficient;
        if (!this.disableLiveChanges) {
            const rgNode: RGNode = node.rgNode;
            this.updateNodePosition(rgNode, node.x, node.y);
        }
        node.Fx = 0;
        node.Fy = 0;
    }
}

export default RGForceLayout;
