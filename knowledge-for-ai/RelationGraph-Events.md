# RGListeners Events Overview

The following are all event listeners defined in the `RGListeners` interface. Each event is used to listen for state changes or user actions in different lifecycle stages, interactions, and editing operations of the relation-graph component.

- **onReady**: Triggered when the graph instance has finished initialization and is ready to use.
- **onNodeClick**: Triggered when the user clicks a node.
- **onNodeExpand**: Triggered when a node is expanded.
- **onNodeCollapse**: Triggered when a node is collapsed.
- **onLineClick**: Triggered when the user clicks a line.
- **onNodeDragStart**: Triggered when node dragging starts.
- **onNodeDragEnd**: Triggered when node dragging ends.
- **onNodeDragging**: Continuously triggered while a node is being dragged.
- **onCanvasDragEnd**: Triggered when canvas dragging ends.
- **onCanvasDragging**: Continuously triggered while the canvas is being dragged.
- **onContextmenu**: Triggered when a context menu is opened on the canvas, a node, or a line.
- **onFullscreen**: Triggered when the fullscreen state changes.
- **onCanvasClick**: Triggered when the user clicks an empty area of the canvas.
- **onCanvasSelectionEnd**: Triggered when a canvas selection operation ends.
- **beforeZoomStart**: Triggered before zooming starts. It can be used to prevent zooming.
- **onZoomEnd**: Triggered when a zoom operation ends.
- **onViewResize**: Triggered when the view size changes.
- **onResizeStart**: Triggered when one or more nodes start being resized.
- **beforeNodeResize**: Triggered before a single node is resized. It can be used to prevent resizing.
- **onResizeEnd**: Triggered when node resizing ends.
- **onLineVertexDropped**: Triggered when a line endpoint is dragged and released.
- **beforeCreateLine**: Triggered after line creation or modification is completed, but before the line is actually created.
- **onLineBeCreated**: Triggered when a new line is created or when a line endpoint is modified.
- **beforeAddNodes**: Triggered before new nodes are added to the graph.
- **beforeAddLines**: Triggered before new lines are added to the graph.
- **onKeyboardDown**: Triggered when a keyboard key is pressed inside the graph area.
- **onKeyboardUp**: Triggered when a keyboard key is released inside the graph area.
- **onCanvasDragStart**: Triggered when canvas dragging starts.
- **onForceLayoutFinish**: Triggered when force-directed layout calculation finishes.
- **beforeScrollStart**: Triggered before canvas scrolling starts. It can be used to prevent scrolling.

---

## onReady

Triggered when the relation-graph instance has finished initialization and is in an interactive state.

**Callback signature**:
```
(graphInstance: RelationGraphInstance) => void
```

**Parameters**:
- `graphInstance`: The current relation-graph instance. It can be used to call graph APIs, such as adding nodes, adding lines, and operating the view.

---

## onNodeClick

Triggered when the user clicks a specific node.

**Callback signature**:
```
(node: RGNode, e: RGUserEvent) => boolean | void | Promise<boolean | void>
```

**Parameters**:
- `node`: The clicked node object.
- `e`: The user event object that triggered this event.

**Return value**:
- Can return `void`.
- Can return `boolean` or `Promise<boolean>` to affect subsequent default behavior.

---

## onNodeExpand

Triggered when a node is expanded, showing its related nodes or child nodes.

**Callback signature**:
```
(node: RGNode, e: RGUserEvent) => boolean | void | Promise<boolean | void>
```

**Parameters**:
- `node`: The expanded node object.
- `e`: The user event object that triggered this event.

---

## onNodeCollapse

Triggered when a node is collapsed, hiding its related nodes or child nodes.

**Callback signature**:
```
(node: RGNode, e: RGUserEvent) => boolean | void | Promise<boolean | void>
```

**Parameters**:
- `node`: The collapsed node object.
- `e`: The user event object that triggered this event.

---

## onLineClick

Triggered when the user clicks a line in the graph.

**Callback signature**:
```
(line: RGLine, link: RGLink, e: RGUserEvent) => boolean | void | Promise<boolean | void>
```

**Parameters**:
- `line`: The clicked line rendering object.
- `link`: The `RGLink` data object corresponding to the line.
- `e`: The user event object that triggered this event.

---

## onNodeDragStart

Triggered when the user starts dragging a node.

**Callback signature**:
```
(node: RGNode, e: RGUserEvent) => void
```

**Parameters**:
- `node`: The node currently being dragged.
- `e`: The user event object that triggered the start of dragging.

---

## onNodeDragEnd

Triggered when node dragging ends.

**Callback signature**:
```
(node: RGNode, e: RGUserEvent, x_buff: number, y_buff: number) => void
```

**Parameters**:
- `node`: The dragged node.
- `e`: The user event object that triggered the end of dragging.
- `x_buff`: The X-axis offset when dragging ends.
- `y_buff`: The Y-axis offset when dragging ends.

---

## onNodeDragging

Continuously triggered while a node is being dragged.

**Callback signature**:
```
(node: RGNode, newX: number, newY: number, buffX: number, buffY: number, e: RGUserEvent) => void | RGPosition | undefined
```

**Parameters**:
- `node`: The node currently being dragged.
- `newX`: The new X coordinate that is about to be applied to the node.
- `newY`: The new Y coordinate that is about to be applied to the node.
- `buffX`: The X-axis offset from the start of dragging to the current position.
- `buffY`: The Y-axis offset from the start of dragging to the current position.
- `e`: The user event object that triggered this dragging process.

**Return value**:
- Return `void` or `undefined`: use the default calculated new position.
- Return `RGPosition`: use the `x` and `y` values in the returned object as the node's new position.

---

## onCanvasDragEnd

Triggered when dragging the whole canvas ends.

**Callback signature**:
```
(e: RGUserEvent) => void
```

**Parameters**:
- `e`: The user event object that triggered the end of dragging.

---

## onCanvasDragging

Continuously triggered while the canvas is being dragged.

**Callback signature**:
```
(newX: number, newY: number, buffX: number, buffY: number) => void | RGPosition | undefined
```

**Parameters**:
- `newX`: The new X offset that is about to be applied to the canvas.
- `newY`: The new Y offset that is about to be applied to the canvas.
- `buffX`: The X-axis offset from the start of dragging to the current position.
- `buffY`: The Y-axis offset from the start of dragging to the current position.

**Return value**:
- When `RGPosition` is returned, the returned value is used as the new canvas offset position.

---

## onContextmenu

Triggered when the user opens a context menu on the canvas, a node, or a line.

**Callback signature**:
```
(e: RGUserEvent, objectType: RGEventTargetType, object: RGNode | RGLine | undefined, eventPositionOnCanvas: RGCoordinate, eventPositionOnView: RGCoordinate) => void
```

**Parameters**:
- `e`: The user event object that triggered the context menu event.
- `objectType`: The type of object that triggered the event. Possible values are `'canvas'`, `'node'`, or `'line'`.
- `object`: The clicked object. It may be `undefined`, `RGNode`, or `RGLine`.
- `eventPositionOnCanvas`: The event position in the canvas coordinate system.
- `eventPositionOnView`: The event position in the view, relative to the top-left corner of `<RelationGraph>`.

---

## onFullscreen

Triggered when the fullscreen state changes.

**Callback signature**:
```
(newValue: boolean, defaultFullscreen: () => Promise<void>) => void
```

**Parameters**:
- `newValue`: The new fullscreen state. `true` means entering fullscreen, and `false` means exiting fullscreen.
- `defaultFullscreen`: A function used to execute the default fullscreen toggle logic.

---

## onCanvasClick

Triggered when the user clicks an empty area of the canvas.

**Notes**:
- This event is not triggered when a node or line is clicked.

**Callback signature**:
```
(e: RGUserEvent) => void
```

---

## onCanvasSelectionEnd

Triggered when a canvas selection operation ends.

**Callback signature**:
```
(selectionView: RGSelectionView, e: RGUserEvent) => void
```

**Parameters**:
- `selectionView`: Information about the selected area, including `x`, `y`, `width`, and `height`.
- `e`: The user event object that triggered the end of selection.

---

## beforeZoomStart

Triggered before a zoom operation starts.

**Callback signature**:
```
() => void | false
```

**Return value**:
- Return `false` to prevent this zoom operation.

---

## onZoomEnd

Triggered when a zoom operation is completed.

**Callback signature**:
```
() => void
```

---

## onViewResize

Triggered when the relation-graph view size changes.

**Callback signature**:
```
() => void
```

---

## onResizeStart

Triggered when one or more nodes start being resized through `RGEditingResize`.

**Callback signature**:
```
(nodes: RGNode[], e: RGUserEvent) => void
```

**Parameters**:
- `nodes`: The array of nodes currently being resized.
- `e`: The user event object that triggered this operation.

---

## beforeNodeResize

Triggered before a single node is resized.

**Callback signature**:
```
(node: RGNode, newX: number, newY: number, newW: number, newH: number) => void | false
```

**Parameters**:
- `node`: The node being resized.
- `newX`: The target X coordinate after resizing.
- `newY`: The target Y coordinate after resizing.
- `newW`: The target width after resizing.
- `newH`: The target height after resizing.

**Return value**:
- Return `false` to prevent the resize operation for this node.

---

## onResizeEnd

Triggered after one or more nodes have finished resizing.

**Callback signature**:
```
(nodes: RGNode[], buffX: number, buffY: number, e: RGUserEvent) => void
```

**Parameters**:
- `nodes`: The array of nodes that have finished resizing.
- `buffX`: The X-axis offset when resizing ends.
- `buffY`: The Y-axis offset when resizing ends.
- `e`: The user event object that triggered this event.

---

## onLineVertexDropped

Triggered when the start point or end point of a line is dragged and released.

**Callback signature**:
```
(lineInfo: { newLineTemplate: JsonLine; fromNode: RGLineTarget | RGNode; toNode: RGLineTarget | RGNode }) => void
```

**Parameters**:
- `newLineTemplate`: The new line template data (`JsonLine`).
- `fromNode`: The starting node or target of the line.
- `toNode`: The ending node or target of the line.

---

## beforeCreateLine

Triggered after line creation or endpoint modification is completed, but before the line is actually created.

**Callback signature**:
```
(lineInfo: { lineJson: JsonLine; fromNode: RGLineTarget | RGNode; toNode: RGLineTarget | RGNode }) => void | false
```

**Parameters**:
- `lineJson`: The line data that is about to be created.
- `fromNode`: The starting node.
- `toNode`: The target node.

**Return value**:
- Return `false` to prevent this line from being created.

---

## onLineBeCreated

Triggered when a new line is created, or when the endpoint of an existing line is modified.

**Important notes**:
- The process of modifying a line endpoint is essentially: delete the original line first, then create a new line with the same ID through this event.
- The new line must be added to the graph through `graphInstance.addLines` in this event. Otherwise, the line will not actually take effect.

**Callback signature**:
```
(lineInfo: { lineJson: JsonLine; fromNode: RGLineTarget | RGNode; toNode: RGLineTarget | RGNode }) => void
```

---

## beforeAddNodes

Triggered before new nodes are added to the graph through the `setJsonData` or `addNodes` method.

**Callback signature**:
```
(nodes: JsonNode[]) => void
```

**Parameters**:
- `nodes`: The array of node data that is about to be added.

---

## beforeAddLines

Triggered before new lines are added to the graph through the `setJsonData` or `addLines` method.

**Callback signature**:
```
(lines: JsonLine[]) => void
```

**Parameters**:
- `lines`: The array of line data that is about to be added.

---

## onKeyboardDown

Triggered when the user presses a keyboard key inside the graph area.

**Callback signature**:
```
(e: KeyboardEvent) => void
```

---

## onKeyboardUp

Triggered when the user releases a keyboard key inside the graph area.

**Callback signature**:
```
(e: KeyboardEvent) => void
```

---

## onCanvasDragStart

Triggered when canvas dragging starts.

**Callback signature**:
```
(canvasMoveStartPosition: RGPosition, eventClientStartPosition: RGPosition, e: RGUserEvent) => void
```

**Parameters**:
- `canvasMoveStartPosition`: The initial canvas position when canvas dragging starts.
- `eventClientStartPosition`: The starting position of the user event in the client coordinate system.
- `e`: The user event object that triggered this event.

---

## onForceLayoutFinish

Triggered when force-directed layout calculation has fully completed.

**Callback signature**:
```
() => void
```

---

## beforeScrollStart

Triggered before the canvas is about to scroll.

**Callback signature**:
```
(buffX: number, buffY: number, e: Event) => true | undefined | void
```

**Parameters**:
- `buffX`: The X-axis offset that is about to be scrolled.
- `buffY`: The Y-axis offset that is about to be scrolled.
- `e`: The original event object that triggered scrolling.

**Return value**:
- Return `true` to interrupt and prevent this scroll operation.
