import {JsonLine, JsonNode, RGLayoutOptions4Alignment, RGNode, RGNodeShape} from '../../types';

export const RGNodesAnalytic = {
  getDescendantNodes(node:RGNode, collectList: RGNode[] = []) {
    if (node.lot && node.lot.childs) {
      node.lot.childs.forEach(thisNode => {
        collectList.push(thisNode);
        RGNodesAnalytic.getDescendantNodes(thisNode, collectList);
      });
    }
    return collectList;
  },
  isVisibleNode(thisNode:RGNode, deep = 0):boolean {
    if (typeof deep !== 'number') deep = 0; // 兼容这样的写法：nodes.filter(RGNodesAnalytic.isVisibleNode)
    if (deep > 18) return true;
    if (thisNode.hidden) return false;
    if (thisNode.lot) {
      if (thisNode.lot.parent) {
        if (thisNode.lot.parent.expanded === false) {
          return false;
        } else {
          return RGNodesAnalytic.isVisibleNode(thisNode.lot.parent, deep + 1);
        }
      }
    }
    return true;
  },
  isAllowShowNode(thisNode:RGNode, deep = 0):boolean {
    return RGNodesAnalytic.isVisibleNode(thisNode, deep = 0);
  },
  getNodeWidth(thisNode:RGNode):number {
    return thisNode.el_W || thisNode.width || 50;
  },
  getNodeHeight(thisNode:RGNode):number {
    return thisNode.el_H || thisNode.height || 50;
  },
  getNodeXByLotX(nodeAlignOption:{alignItemsX: 'start'|'center'|'end'}, thisNode:RGNode):number {
    const x = thisNode.lot.x || 0;
    if (nodeAlignOption.alignItemsX === 'end') {
      return x - RGNodesAnalytic.getNodeWidth(thisNode);
    } else if (nodeAlignOption.alignItemsX === 'start') {
      return x;
    } else {
      return x - RGNodesAnalytic.getNodeWidth(thisNode) / 2;
    }
  },
  getNodeYByLotY(nodeAlignOption: {alignItemsY: 'start'|'center'|'end'}, thisNode:RGNode):number {
    const y = thisNode.lot.y || 0;
    if (nodeAlignOption.alignItemsY === 'end') {
      return y - RGNodesAnalytic.getNodeHeight(thisNode);
    } else if (nodeAlignOption.alignItemsY === 'start') {
      return y;
    } else {
      return y - RGNodesAnalytic.getNodeHeight(thisNode) / 2;
    }
  },
  getNodeLotXY(nodeAlignOption:RGLayoutOptions4Alignment, node:RGNode): {x:number, y: number} {
    let x = node.x || 0;
    let y = node.y || 0;
    if (nodeAlignOption.alignItemsX === 'end') {
      x = x + RGNodesAnalytic.getNodeWidth(node);
    } else if (nodeAlignOption.alignItemsX === 'start') {
    } else {
      x = x + RGNodesAnalytic.getNodeWidth(node) / 2;
    }
    if (nodeAlignOption.alignItemsY === 'end') {
      y = y + RGNodesAnalytic.getNodeHeight(node);
    } else if (nodeAlignOption.alignItemsY === 'start') {
    } else {
      y = y + RGNodesAnalytic.getNodeHeight(node) / 2;
    }
    return {x,y};
  },
  isRectangleOverlap(rectA, rectB) {
    const aX = rectA.x;
    const bX = rectB.x;
    const a_W = rectA.el_W;
    const b_W = rectB.el_W;
    const aY = rectA.y;
    const bY = rectB.y;
    const a_H = rectA.el_H;
    const b_H = rectB.el_H;
    return !(bX >= aX + a_W || bX + b_W <= aX || bY >= aY + a_H || bY + b_H <= aY);
  },
  isXOverlap(aX:number,bX:number,a_W:number,b_W:number) {
    return !(bX >= aX + a_W || bX + b_W <= aX);
  },
  isYOverlap(aY:number,bY:number,a_H:number,b_H:number) {
    return !(bY >= aY + a_H || bY + b_H <= aY);
  },
  // 检测两个形状是否重叠
  shapesOverlap(nodeA, nodeB, shapeA=1, shapeB=1) {
    return this.isRectangleOverlap(nodeA, nodeB);
  },
  getNoOverlapLimitedPosition(rectA, newX, newY, rectB) {
    const old_aX = rectA.x;
    const old_aY = rectA.y;
    const aX = newX;
    const bX = rectB.x;
    const a_W = rectA.el_W;
    const b_W = rectB.el_W;
    const aY = newY;
    const bY = rectB.y;
    const a_H = rectA.el_H;
    const b_H = rectB.el_H;
    let x = rectA.x;
    let y = rectA.y;
    const oX = this.isXOverlap(old_aX, bX, a_W, b_W);
    const oY = this.isYOverlap(old_aY, bY, a_H, b_H);
    if (oX) {
      if (aY < bY) {
        x = newX;
        y = bY - a_H;
      } else if (aY > bY) {
        x = newX;
        y = bY + b_H;
      }
    } else if (oY) {
      if (aX < bX) {
        x = bX - a_W;
        y = newY;
      } else if (aX > bX) {
        x = bX + b_W;
        y = newY;
      }
    }
    return {x, y};
  },
  flatNodeData(orignNodes:JsonNode[], parentNode:JsonNode|null, nodesCollect:JsonNode[], linksCollect:JsonLine[]) {
    orignNodes.forEach(thisOrignNode => {
      nodesCollect.push(thisOrignNode);
      if (parentNode) {
        linksCollect.push({
            id: `${parentNode.id}-to-${thisOrignNode.id}`,
          from: parentNode.id,
          to: thisOrignNode.id
        });
      }
      const _childs = thisOrignNode.children || thisOrignNode.childs;
      if (_childs && _childs.length > 0) {
        this.flatNodeData(_childs, thisOrignNode, nodesCollect, linksCollect);
      }
    });
  }
};
export const getNodeShape = (nodeShape: RGNodeShape, defaultNodeShape: RGNodeShape): RGNodeShape => {
    return (nodeShape || nodeShape === 0) ? nodeShape : defaultNodeShape
}
export default RGNodesAnalytic;
