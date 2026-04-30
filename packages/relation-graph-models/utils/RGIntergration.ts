import {RelationGraphProps} from "../../types";

export const getEventListeners = (props: RelationGraphProps) => {
  const listeners = {
    onReady: props.onReady,
    onNodeClick: props.onNodeClick,
    onNodeExpand: props.onNodeExpand,
    onNodeCollapse: props.onNodeCollapse,
    onLineClick: props.onLineClick,
    onNodeDragStart: props.onNodeDragStart,
    onNodeDragEnd: props.onNodeDragEnd,
    onNodeDragging: props.onNodeDragging,
    onCanvasDragEnd: props.onCanvasDragEnd,
    onCanvasDragging: props.onCanvasDragging,
    onContextmenu: props.onContextmenu,
    onFullscreen: props.onFullscreen,
    onCanvasClick: props.onCanvasClick,
    onCanvasSelectionEnd: props.onCanvasSelectionEnd,
    beforeZoomStart: props.beforeZoomStart,
    onZoomEnd: props.onZoomEnd,
    onViewResize: props.onViewResize,
    onResizeStart: props.onResizeStart,
    beforeNodeResize: props.beforeNodeResize,
    onResizeEnd: props.onResizeEnd,
    onLineVertexDropped: props.onLineVertexDropped,
    beforeCreateLine: props.beforeCreateLine,
    onLineBeCreated: props.onLineBeCreated,
    beforeAddNodes: props.beforeAddNodes,
    beforeAddLines: props.beforeAddLines,
    onKeyboardDown: props.onKeyboardDown,
    onKeyboardUp: props.onKeyboardUp,
    onCanvasDragStart: props.onCanvasDragStart,
    onForceLayoutFinish: props.onForceLayoutFinish,
    beforeScrollStart: props.beforeScrollStart,
    // onLineTextDragEnd: props.onLineTextDragEnd
  };
  return listeners;
};

