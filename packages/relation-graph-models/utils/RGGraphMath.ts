export type SizeInfo = {
  canvas_width: number
  canvas_height: number
  node_width: number
  node_height: number
};

export type CreateJunctionPointParams = {
  from_x: number,
  from_y: number,
  to_x: number,
  to_y: number,
  f_W: number, // from_Width (原 n1w)
  f_H: number, // from_Height (原 n1h)
  t_W: number, // to_Width (原 n2w)
  t_H: number, // to_Height (原 n2h)
  nodeShape: number, // 对应 n1style
  isReverse?: boolean, // 设为可选，因为并非所有函数都用
  isEndPoint: boolean, // 是否是终点
  totalLinesBetweenNodes?: number, // 对应 allSize, 设为可选
  currentLineIndex?: number,     // 对应 indexOfAll, 设为可选
  lineDistance?: number,         // 设为可选，并提供默认值
};

// calculateNearestIntersection 函数保持不变，因为它不直接接受这些参数
function calculateNearestIntersection(x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number, distance: number) {
  // 计算两个矩形中心的连线的方向向量
  const dx = x2 - x1;
  const dy = y2 - y1;

  // 计算平行线的起点（移动距离distance沿垂直于连线的方向）
  const magnitude = Math.sqrt(dx * dx + dy * dy);
  if (magnitude === 0) return { x: x1, y: y1 }; // Prevent division by zero if points are identical
  const offsetDx = (distance * dy) / magnitude;
  const offsetDy = -(distance * dx) / magnitude;
  const lineX = x1 + offsetDx;
  const lineY = y1 + offsetDy;

  // 计算矩形n1的边界
  const left = x1 - w1 / 2;
  const right = x1 + w1 / 2;
  const top = y1 - h1 / 2;
  const bottom = y1 + h1 / 2;

  // 计算直线与矩形n1边界的交点
  let intersections = [];
  if (dx !== 0) {
    // 检查左侧和右侧边界
    let tLeft = (left - lineX) / dx;
    let yLeft = lineY + tLeft * dy;
    if (yLeft >= top && yLeft <= bottom) {
      intersections.push({ x: left, y: yLeft });
    }
    let tRight = (right - lineX) / dx;
    let yRight = lineY + tRight * dy;
    if (yRight >= top && yRight <= bottom) {
      intersections.push({ x: right, y: yRight });
    }
  }
  if (dy !== 0) {
    // 检查上侧和下侧边界
    let tTop = (top - lineY) / dy;
    let xTop = lineX + tTop * dx;
    if (xTop >= left && xTop <= right) {
      intersections.push({ x: xTop, y: top });
    }
    let tBottom = (bottom - lineY) / dy;
    let xBottom = lineX + tBottom * dx;
    if (xBottom >= left && xBottom <= right) {
      intersections.push({ x: xBottom, y: bottom });
    }
  }
  if (intersections.length === 0 && dx === 0 && dy === 0) { // If no intersections and points are same
    return {x: lineX, y: lineY}; // Should return a point on the parallel line
  }


  // 找出距离矩形n2中心最近的交点
  let nearestIntersection = null;
  let minDistance = Infinity;
  intersections.forEach(point => {
    const dist = Math.sqrt((point.x - x2) ** 2 + (point.y - y2) ** 2);
    if (dist < minDistance) {
      minDistance = dist;
      nearestIntersection = point;
    }
  });

  return nearestIntersection;
}

export const RGGraphMath = {
  // getRectPoint 看起来是 getBorderPoint4MultiLine 的辅助函数，我们先重构目标函数
  // 如果 getRectPoint 也需要重构，其参数与 getBorderPoint4MultiLine 非常相似
  getRectPoint(
      from_x: number, from_y: number, to_x: number, to_y: number,
      f_W: number, f_H: number, t_W: number, t_H: number,
      isReverse = false, totalLines = 1, currentIndex = 0, lineDistance = 14, isEndPoint = false
  ) {
    const fx = from_x + f_W / 2;
    const fy = from_y + f_H / 2;
    const tx = to_x + t_W / 2;
    const ty = to_y + t_H / 2;
    if (totalLines > 1) {
      const nodeSize = Math.min(lineDistance, f_W, f_H);
      const start = -nodeSize / 2;
      const step = nodeSize / (totalLines - 1);
      const distance = ((isReverse && isEndPoint) || !isReverse && !isEndPoint) ? (start * -1 - (currentIndex * step)) : (start + (currentIndex * step));
      const nearestIntersection = calculateNearestIntersection(
          fx, fy, f_W, f_H,
          tx, ty, t_W, t_H,
          distance
      );
      if (nearestIntersection) {
        return nearestIntersection;
      }
    }

    const _ar_x = fx < tx ? 1 : -1;
    const _ar_y = fy < ty ? 1 : -1;
    if (ty === fy) {
      return { x: fx + _ar_x * f_W / 2, y: fy };
    }
    const __tan = Math.abs((tx - fx) / (ty - fy));
    const rectAngle = f_W / f_H;
    let __w = 0;
    let __h = 0;
    if (__tan < rectAngle) {
      __w = _ar_x * f_H / 2 * __tan; // Removed additional complex terms for basic border point calculation
      __h = _ar_y * f_H / 2;
    } else {
      __w = _ar_x * f_W / 2;
      __h = _ar_y * f_W / 2 / __tan; // Removed additional complex terms
    }
    const x = fx + __w;
    const y = fy + __h;
    return { x, y };
  },

  getRectPointBasic(x1:number, y1:number, x2:number, y2:number, n1w:number, n1h:number, n2w:number, n2h:number) {
    // 此函数参数与 CreateJunctionPointParams 不完全匹配，暂时不修改
    // 如果也需要修改，请告知其与 CreateJunctionPointParams 的映射关系
    const fx = x1 + n1w / 2;
    const fy = y1 + n1h / 2;
    const tx = x2 + n2w / 2;
    const ty = y2 + n2h / 2;
    let __tanA = ty === fy ? 0 : (tx - fx) / (ty - fy);
    if (__tanA === 0 && ty === fy && tx === fx) __tanA = 1; // Avoid division by zero if centers are same
    else if (__tanA === 0) __tanA = (tx - fx) / (ty - fy + (ty > fy ? -1 : 1) * 0.0001); // Add small epsilon

    const rectAngle = n1w / n1h; // Note: Original code had n2h, assuming n1h was intended
    let __w = 0;
    let __h = 0;
    let _case = '1';
    if (Math.abs(__tanA) < rectAngle) { // Use Math.abs for angle comparison
      _case = '2';
      if (fy <= ty) { // If target is below or same level
        __h = n1h / 2;
        __w = __h * __tanA;
      } else { // Target is above
        __h = -n1h / 2;
        __w = __h * __tanA;
      }
    } else {
      _case = '3';
      if (fx <= tx) { // If target is to the right or same x
        __w = n1w / 2;
        __h = (__tanA === 0 && tx === fx) ? 0 : __w / __tanA; // Avoid division by zero if vertical
      } else { // Target is to the left
        __w = -n1w / 2;
        __h = (__tanA === 0 && tx === fx) ? 0 : __w / __tanA;
      }
    }
    return { x: fx + __w, y: fy + __h, _case };
  },

  getRectJoinPoint(params: CreateJunctionPointParams) {
      const { from_x, from_y, to_x, to_y, f_W, f_H, t_W, t_H } = params;

      // 1. 计算两个矩形的中心点
      const from_cx = from_x + f_W / 2;
      const from_cy = from_y + f_H / 2;
      const to_cx = to_x + t_W / 2;
      const to_cy = to_y + t_H / 2;

      // 2. 计算中心点的距离差
      const dx = to_cx - from_cx;
      const dy = to_cy - from_cy;

      // 3. 核心逻辑：根据矩形的长宽比进行归一化 (Normalize)
      // 如果不除以宽高的一半，我们就只能处理正方形。
      // 除以宽高的一半后，相当于把问题转换到了一个 [-1, 1] 的单位正方形空间内比较。
      // 如果 dist_x 的绝对值更大，说明目标偏向左右；如果 dist_y 的绝对值更大，说明目标偏向上下。
      const dist_x = dx / (f_W / 2);
      const dist_y = dy / (f_H / 2);

      if (Math.abs(dist_x) > Math.abs(dist_y)) {
          // --- 左右方向 (Horizontal) ---
          if (dist_x > 0) {
              // Right: 目标在右侧
              return { x: from_x + f_W, y: from_cy };
          } else {
              // Left: 目标在左侧
              return { x: from_x, y: from_cy };
          }
      } else {
          // --- 上下方向 (Vertical) ---
          // 注意：在浏览器坐标系中，y 向下增加，所以 dy > 0 代表“下方”
          if (dist_y > 0) {
              // Bottom: 目标在下方
              return { x: from_cx, y: from_y + f_H };
          } else {
              // Top: 目标在上方
              return { x: from_cx, y: from_y };
          }
      }
  },

  getRectHJoinPoint(params: CreateJunctionPointParams) {
    const { from_x, from_y, to_x, f_W, f_H, t_W } = params;
    const _hH = f_H / 2;
    if ((from_x + f_W) < to_x) { // Target is to the right of from_node
      return { x: from_x + f_W, y: from_y + _hH };
    } else { // Target is to the left or overlapping
      return { x: from_x, y: from_y + _hH };
    }
  },

  getRectLeftJoinPoint(params: CreateJunctionPointParams) {
    const { from_x, from_y, f_H } = params;
    return { x: from_x, y: from_y + f_H / 2 };
  },

  getRectRightJoinPoint(params: CreateJunctionPointParams) {
    const { from_x, from_y, f_W, f_H } = params;
    return { x: from_x + f_W, y: from_y + f_H / 2 };
  },

  getRectTopJoinPoint(params: CreateJunctionPointParams) {
    const { from_x, from_y, f_W } = params;
    return { x: from_x + f_W / 2, y: from_y };
  },

  getRectBottomJoinPoint(params: CreateJunctionPointParams) {
    const { from_x, from_y, f_W, f_H } = params;
    return { x: from_x + f_W / 2, y: from_y + f_H };
  },
  getRectHorizontalLineJoinPoint(params: CreateJunctionPointParams) {
    return this.getRectVJoinPoint(params);
  },
  getRectVerticalLineLineJoinPoint(params: CreateJunctionPointParams) {
    return this.getRectHJoinPoint(params);
  },

  getRectVJoinPoint(params: CreateJunctionPointParams) {
    const { from_x, from_y, to_y, f_W, f_H, t_H } = params;
    const _hW = f_W / 2;
    if ((from_y + f_H) < to_y) { // Target is below from_node
      return { y: from_y + f_H, x: from_x + _hW };
    } else { // Target is above or overlapping
      return { y: from_y, x: from_x + _hW };
    }
  },
  getBorderPoint(x1:number, y1:number, x2:number, y2:number, n1w:number, n1h:number, n2w:number, n2h:number, n1style:number) {
    if (n1style === 0) {
      return this.getCirclePoint(x1, y1, x2, y2, n1w, n1h, n2w, n2h);
    } else {
      return this.getRectPoint(x1, y1, x2, y2, n1w, n1h, n2w, n2h);
    }
  },
  getBorderPoint4MultiLine(params: CreateJunctionPointParams) {
    const {
      from_x, from_y, to_x, to_y,
      f_W, f_H, t_W, t_H,
      nodeShape, // n1style
      isReverse = false, // Default if not provided
      isEndPoint, // Default if not provided
      totalLinesBetweenNodes = 1, // Default if not provided
      currentLineIndex = 0,     // Default if not provided
      lineDistance = 50         // Default if not provided
    } = params;

    if (nodeShape === 0) { // Circle
      return this.getCirclePoint4MultiLine(
          from_x, from_y, to_x, to_y,
          f_W, f_H, t_W, t_H,
          isReverse, totalLinesBetweenNodes, currentLineIndex, lineDistance, isEndPoint
      );
    } else { // Rectangle
      // The existing getRectPoint has a slightly different signature interpretation for its last 4 params.
      // original getRectPoint: isReserve = false, allSize = 1, indexOfAll = 0, lineDistance = 14
      return this.getRectPoint(
          from_x, from_y, to_x, to_y,
          f_W, f_H, t_W, t_H,
          isReverse, totalLinesBetweenNodes, currentLineIndex, lineDistance, isEndPoint
      );
    }
  },
  getCirclePoint(x1:number, y1:number, x2:number, y2:number, n1w:number, n1h:number, n2w:number, n2h:number) {
    const fx = x2 + n2w / 2;
    const fy = y2 + n2h / 2;
    const tx = x1 + n1w / 2;
    const ty = y1 + n1h / 2;
    const buff_h = fx - tx;
    if (buff_h === 0) {
      return { x: tx, y: ty - (n1h / 2) * (fy < ty ? 1 : -1) };
    }
    const buff_v = fy - ty;
    const k = buff_v / buff_h;
    // var m = ty - tx * k
    const __x = Math.sqrt(1 / ((1 / (n1w / 2) ** 2) + (k ** 2 / (n1h / 2) ** 2))) * (fx < tx ? 1 : -1);
    const __y = k * __x;
    // this.c = Math.sqrt(this.h * this.h + this.s * this.s)
    // // this.l = this.c - radius
    // this.v = (this.c - n1w / 2) * this.h / this.c * -1
    // this.t = (this.c - n1h / 2) * this.s / this.c * -1
    // alert(this.h+","+this.s+","+this.c+","+this.l+","+this.v+","+this.t);
    return { x: tx - __x, y: ty - __y };
  },
  getCirclePoint4MultiLine(x1:number, y1:number, x2:number, y2:number, n1w:number, n1h:number, n2w:number, n2h:number, isReverse:boolean, totalLines:number, currentIndex:number, lineDistance:number, isEndPoint: boolean) {
    // if (isReserve) {
    //   indexOfAll = allSize - indexOfAll - 1;
    // }
    let to_x = x2 + n2w / 2;
    const to_y = y2 + n2h / 2;
    let from_x = x1 + n1w / 2;
    const from_y = y1 + n1h / 2;
    let buff_h = to_x - from_x;
    const isSameH = buff_h > -1 && buff_h < 1;
    if (isSameH) {
      to_x = to_x - 0.5;
      from_x = from_x + 0.5;
      buff_h = -1;
    }
    let distance = 0;
    if (totalLines > 1) {
      const nodeSize = Math.min(lineDistance, n1w, n1h);
      const start = -nodeSize / 2;
      const step = nodeSize / (totalLines - 1);
      distance = ((isReverse && isEndPoint) || !isReverse && !isEndPoint) ? (start * -1 - (currentIndex * step)) : (start + (currentIndex * step));
    }
    // const ri_angle_buff = (indexOfAll - ((allSize - 1) / 2));
    // const distance = ri_angle_buff * lineDistance;
    const buff_v = to_y - from_y;
    const b = Math.sqrt(buff_h ** 2 + buff_v ** 2) * distance / buff_h;
    const k = buff_v / buff_h;
    const m = n1w / 2;
    const n = n1h / 2;
    const __wow = (from_x < to_x ? -1 : 1);
    const __x = (-1 * (m ** 2) * k * b + (m * n * Math.sqrt(Math.abs(n ** 2 + (k ** 2) * (m ** 2) - b ** 2))) / __wow) / (n ** 2 + m ** 2 * k ** 2);
    const __y = (k * __x + b);
    return { x: from_x - __x, y: from_y - __y };
  },
  getCirclePointBasic(x1:number, y1:number, x2:number, y2:number, n1w:number, n1h:number, n2w:number, n2h:number, radius:number) {
    const fx = x1 + n1w / 2;
    const fy = y1 + n1h / 2;
    const tx = x2 + n2w / 2;
    const ty = y2 + n2h / 2;
    const h = tx - fx;
    const s = ty - fy;
    const c = Math.sqrt(h * h + s * s);
    const l = c - radius;
    const v = l * h / c * -1;
    const t = l * s / c * -1;
    // alert(this.h+","+this.s+","+this.c+","+this.l+","+this.v+","+this.t);
    return { x: tx + v, y: ty + t };
  },
  getCirclePointPlus(x1:number, y1:number, x2:number, y2:number, n1w:number, n1h:number, n2w:number, n2h:number) {
    const fx = x1 + n1w / 2;
    const fy = y1 + n1h / 2;
    const tx = x2 + n2w / 2;
    const ty = y2 + n2h / 2;
    const h = tx - fx;
    const s = ty - fy;
    const c = Math.sqrt(h * h + s * s);
    const v = (c - n1w / 2) * h / c * -1;
    const t = (c - n1h / 2) * s / c * -1;
    return { x: tx + v, y: ty + t };
  },
  getOvalPoint(c_x:number, c_y:number, c_r:number, c_i:number, c_n:number, startAngle = 180) {
    const deg_i = c_i * (360 / c_n);
    const angle_i = (180 - startAngle + deg_i) * Math.PI / 180;
    // console.log('getOvalPoint:', deg_i, 180 - startAngle + deg_i, angle_i);
    return {
      x: c_x + c_r * Math.sin(angle_i),
      y: c_y + c_r * Math.cos(angle_i) * -1
    };
  },
  /**
   * 获取点x,y以 c_x,c_y为中心旋转rotateDeg后的新坐标
   * @param c_x
   * @param c_y
   * @param x
   * @param y
   * @param rotateDeg 旋转角度，取值范围 0 - 360
   */
  getRotatedPoint(x:number, y:number, c_x:number, c_y:number, rotateDeg: number) {
    // 1. 将角度转换为弧度
    // JavaScript 的 Math.sin/cos 需要弧度
    const rad = (rotateDeg * Math.PI) / 180;

    // 2. 提前计算 sin 和 cos 值
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    // 3. 应用旋转矩阵公式
    // 首先将坐标系平移到旋转中心 (c_x, c_y)
    // 然后旋转
    // 最后平移回原始坐标系

    // x_new = (x - c_x) * cos - (y - c_y) * sin + c_x
    // y_new = (x - c_x) * sin + (y - c_y) * cos + c_y

    const x_new = (x - c_x) * cos - (y - c_y) * sin + c_x;
    const y_new = (x - c_x) * sin + (y - c_y) * cos + c_y;

    return { x: x_new, y: y_new };
  },
  /**
   * Returns the new x coordinate representing the point x after being horizontally flipped around the center point c_x
   * @param x
   * @param c_x
   */
  getFlippedX(x:number, c_x:number) {
    // 返回新的 x 坐标，表示点 x 绕中心点 c_x 水平翻转后的坐标
    return c_x - (x - c_x);
  },
  getFlippedY(y:number, c_y:number) {
    // 返回新的 x 坐标，表示点 x 绕中心点 c_x 水平翻转后的坐标
    return c_y - (y - c_y);
  },
  getAngleType(buffer_x:number, buffer_y:number) {
    if (buffer_x >= 0 && buffer_y >= 0) { // 第一象限
      return 1;
    } else if (buffer_x < 0 && buffer_y >= 0) { // 第二象限
      return 2;
    } else if (buffer_x < 0 && buffer_y < 0) { // 第三象限
      return 3;
    } else if (buffer_x >= 0 && buffer_y < 0) { // 第三象限
      return 4;
    }
  },
  /**
   * 获取一个文字旋转的角度,以便看起来是沿着线条的角度排版，但又要确保文字是从左向右展示的
   * @param fx
   * @param fy
   * @param tx
   * @param ty
   */
  getTextAngle(fx:number, fy:number, tx:number, ty:number) {
    let angle = Math.atan2(ty - fy, tx - fx) * 180 / Math.PI;
    // adjust angle to range 0-360
    if (angle < 0) {
      angle += 360;
    }
    // conditions to ensure text display is upright
    if (angle > 90 && angle <= 270) {
      angle += 180;
    }
    // Normalize final angle to be between 0-360
    if (angle >= 360) {
      angle -= 360;
    }

    return Math.round(angle);
  }
};

export const getNodeDistance = (fx:number, fy:number, tx:number, ty:number) => {
  const buff_x = fx - tx;
  const buff_y = fy - ty;
  return Math.sqrt(buff_x ** 2 + buff_y ** 2);
};
export function rgSimpleGridLayout<ItemType extends {width: number, height: number }>(
    columns: number,
    gap: number,
    items: ItemType[],
    eachFn: (item: ItemType, x:number, y:number) => void,
    startX = 0,
    startY = 0
)  {
  // console.warn('rgSimpleGridLayout:', columns, gap, items.length);
  let currentColIndex = 1;
  let currentRowUsedWidth = startX;
  let currentPrevRowsUsedHeight = startY;
  let currentRowMaxHeight = 0;
  for (let node of items) {
    const nodeWidth = node.width;
    const nodeHeight = node.height;
    if (nodeHeight > currentRowMaxHeight) {
      currentRowMaxHeight = nodeHeight;
    }
    // console.warn('rgSimpleGridLayout:', currentColIndex, currentRowUsedWidth, currentPrevRowsUsedHeight);
    eachFn(node, currentRowUsedWidth, currentPrevRowsUsedHeight);
    currentRowUsedWidth += (nodeWidth + gap);
    if (currentColIndex > columns) {
      currentPrevRowsUsedHeight += (currentRowMaxHeight + gap);
      currentColIndex = 1;
      currentRowUsedWidth = 0;
      currentRowMaxHeight = 0;
    } else {
      currentColIndex++;
    }
  }
};

export default RGGraphMath;
