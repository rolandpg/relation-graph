# **RelationGraphWith7Event Method Documentation**

This document is organized based on RelationGraphWith7Event.ts and types.ts, covering detailed functionality, comment explanations, and parameter type definitions for the class methods.

## **1\. Common Methods**

### **onNodeClick**

Description:  
Triggered when the user clicks on a node.

* Includes debounce logic (200ms) to avoid triggering on double clicks or frequent clicks.  
* If currently in "Creating Line Mode" (creatingLinePlot), it calls onNodeClickWhenCreatingLinePlot to handle line logic.  
* By default (if Shift key is not pressed and node click is not disabled), it updates the checked status (checkedNodeId) and clears checked lines.  
* Finally triggers the onNodeClick event.

**Parameters**:

* node  
  * **Type**: RGNode  
  * **Detail**: The clicked node object.  
* e  
  * **Type**: RGUserEvent  
  * **Detail**: The mouse or touch event object triggering the click.

### **onNodeDragStart**

Description:  
Triggered when the user starts dragging a node.

* If the user presses but does not move the node, it is considered a click operation and triggers onNodeClick instead.  
* Contains logic to check if dragging is disabled, if inside an input, initialize drag state, set drag end callback, etc.  
* During dragging, triggers the onNodeDragging event and supports custom node positioning via return value.  
* Includes support for canvas auto-scrolling (when dragging to the edge).

**Parameters**:

* willMoveNode  
  * **Type**: RGNode  
  * **Detail**: The node object that will be moved.  
* e  
  * **Type**: RGUserEvent  
  * **Detail**: The mouse or touch event object triggering the drag.

### **onLineClick**

Description:  
Triggered when the user clicks on a line.

* Triggered whether clicking on the line path or line text.  
* If line click is not disabled, updates the checked status (checkedLineId) and clears checked nodes.  
* Finally triggers the onLineClick event.

**Parameters**:

* line  
  * **Type**: RGLine  
  * **Detail**: The clicked line object.  
* link  
  * **Type**: RGLink  
  * **Detail**: The Link object the line belongs to.  
* e  
  * **Type**: RGUserEvent  
  * **Detail**: The event object triggering the click.

### **expandOrCollapseNode**

Description:  
Triggered when the node's expand/collapse button is clicked.

* Calls expandNode or collapseNode based on the node's current expansion state.

**Parameters**:

* node  
  * **Type**: RGNode  
  * **Detail**: The target node.  
* e  
  * **Type**: RGUserEvent  
  * **Detail**: Event object.

### **expandNode**

Description:  
Expands the specified node.

* Sets the node's expanded property to true, making its children visible.  
* Triggers the onNodeExpand event.  
* Calls \_effectWhenExpandedOrCollapsed to handle side effects (like re-layout).

**Parameters**:

* node  
  * **Type**: RGNode  
  * **Detail**: The node to expand.  
* e (Optional)  
  * **Type**: RGUserEvent

### **collapseNode**

Description:  
Collapses the specified node.

* Sets the node's expanded property to false, hiding its children.  
* Triggers the onNodeCollapse event.  
* Calls \_effectWhenExpandedOrCollapsed to handle side effects.

**Parameters**:

* node  
  * **Type**: RGNode  
  * **Detail**: The node to collapse.  
* e (Optional)  
  * **Type**: RGUserEvent

### **onCanvasClick**

Description:  
Triggered when the user clicks on the canvas.

* If in "Creating Line Mode", calls onCanvasClickWhenCreatingLinePlot.  
* If in performance mode and a node is clicked (checked via getNodeAtEvent), forwards to onNodeClick.  
* Otherwise, triggers the onCanvasClick event.

**Parameters**:

* e  
  * **Type**: RGUserEvent

### **startCreatingNodePlot**

Description:  
Starts the "creating node" interaction state.

* Allows the user to drag a node template on the canvas and create a new node upon release.  
* You can set the node template, creation callback, etc., via the setting parameter.  
* Supports adding the node via graphInstance.addNodes(\[newNodeJson\]) in the onCreateNode callback.

**Parameters**:

* e  
  * **Type**: RGUserEvent  
* setting  
  * **Type**: CreatingNodePlotOptions  
  * **Detail**: Configuration object containing templateNode, onCreateNode, etc.

### **startCreatingLinePlot**

Description:  
Starts the "creating line" interaction state.

* Initializes line template and state.  
* Listens for mouse move events to update the line end point in real-time.  
* Supports specifying a starting node (fromNode).

**Parameters**:

* e  
  * **Type**: RGUserEvent  
* setting  
  * **Type**: CreatingLinePlotOptions  
  * **Detail**: Configuration object containing template, onCreateLine, fromNode, etc.

### **stopCreatingLinePlot**

Description:  
Stops the "creating line" interaction state.

* Clears relevant states, listeners, and callbacks.  
* Generally called automatically by relation-graph, but can be called manually for complex interaction logic.

**Parameters**:

* None

### **onContextmenu**

Description:  
User right-click context menu event.

* Prevents the default browser menu.  
* Identifies the type of object clicked (canvas, node, line).  
* Triggers the onContextmenu event passing position, object type, and object info.

**Parameters**:

* e  
  * **Type**: RGUserEvent

### **fullscreen**

Description:  
Toggles fullscreen mode.

* If newValue is true, enters fullscreen; if false, exits; if undefined, toggles.  
* Calls browser fullscreen API and updates state.

**Parameters**:

* newValue (Optional)  
  * **Type**: boolean

### **onMouseWheel**

Description:  
User scroll mouse wheel event.

* Supports touchpad and mouse wheel.  
* Decides whether to zoom or scroll the canvas based on Ctrl/Cmd key press and options.wheelEventAction.  
* Does not respond if disableWheelEvent is true.

**Parameters**:

* e  
  * **Type**: WheelEvent

### **scrollView**

Description:  
Scrolls the canvas.

* Adjusts canvas position based on the passed offsets.

**Parameters**:

* buffX  
  * **Type**: number  
  * **Detail**: Scroll amount for X axis.  
* buffY  
  * **Type**: number  
  * **Detail**: Scroll amount for Y axis.

### **onLineDragEnd**

Description:  
Handles line drag end.

* Updates element line positions.

**Parameters**:

* x\_buff: number  
* y\_buff: number  
* e: RGUserEvent

### **onCanvasDragStart**

Description:  
User starts dragging the canvas.

* Decides whether to move canvas, create selection, or just click based on user action (Shift key) and config (dragEventAction).  
* Includes checks for input focus.

**Parameters**:

* e  
  * **Type**: RGUserEvent

### **startMoveCanvas**

Description:  
User starts moving the canvas.

* Handles mouse drag and touch gestures (supports pinch-to-zoom).  
* Starts a drag loop to update canvas offset in real-time.

**Parameters**:

* e  
  * **Type**: RGUserEvent  
* forceStartMove (Default: false)  
  * **Type**: boolean

### **sleep**

Description:  
Sleeps for a specified amount of time.

* Actually calls utility sleep(1000), parameter time seems unused/fixed in code.

**Parameters**:

* time: number

## **2\. Internal Methods**

### **\_nodeXYMappingBeforeDrag**

Modifier: protected  
Tag: @inner  
Description:  
Property: Records node coordinate mapping before drag.

### **canvasAutoMoving**

Modifier: protected  
Tag: @inner  
Description:  
Automatically moves the canvas when dragging a node near the edge.  
**Parameters**:

* draggingEventXy: RGCoordinate

### **\_onNodeDragEnd**

Modifier: private  
Tag: @inner  
Description:  
Internal method: Node drag end handling.  
**Parameters**:

* node: RGNode  
* x\_buff: number  
* y\_buff: number  
* e: RGUserEvent

### **\_effectWhenExpandedOrCollapsed**

Modifier: private  
Tag: @inner  
Description:  
Side effect handling after node expansion or collapse.

* Recalculates visibility of related nodes.  
* Updates element lines.  
* Triggers re-layout if reLayoutWhenExpandedOrCollapsed is configured.

**Parameters**:

* node: RGNode

### **onCanvasDragEnd**

Modifier: private  
Tag: @inner  
Description:  
Canvas drag end handling.  
Triggers onCanvasDragEnd event.  
**Parameters**:

* e: RGUserEvent

### **getNodeAtEvent**

Modifier: private  
Tag: @inner  
Description:  
Gets the node at the event coordinates.  
Used for click detection in performance mode.  
**Parameters**:

* e: RGUserEvent

### **onCanvasSelectionEnd**

Modifier: private  
Tag: @inner  
Description:  
Canvas selection end handling.  
Triggers onCanvasSelectionEnd event.  
**Parameters**:

* selectionView: RGSelectionView  
* e: RGUserEvent

### **onMovingWhenCreatingLinePlot**

Modifier: private  
Tag: @inner  
Description:  
Handles mouse move events during line creation mode.

* Calculates line end point.  
* Handles node adsorption and Junction Point detection.

**Parameters**:

* $event: MouseEvent

### **onCanvasClickWhenCreatingLinePlot**

Modifier: private  
Tag: @inner  
Description:  
Handles canvas click during line creation mode.

* Attempts to complete line creation (connecting to canvas position).

**Parameters**:

* $event: RGUserEvent

### **onNodeClickWhenCreatingLinePlot**

Modifier: private  
Tag: @inner  
Description:  
Handles node click during line creation mode.

* Step 1: Set start point.  
* Step 2: Set end point and attempt to create line.

**Parameters**:

* node: RGNode

### **onReadyToCreateLine**

Modifier: protected  
Description:  
Triggered when line creation is ready.

* Triggers beforeCreateLine event (can be aborted).  
* Executes onCreateLineCallback.  
* Triggers onLineBeCreated event.

**Parameters**:

* from: RGNode  
* to: RGNode | RGPosition

### **\_applyWheelEvent**

Modifier: private  
Tag: @inner  
Description:  
Applies wheel event (with inertia smoothing).  
**Parameters**:

* e: WheelEvent

### **\_onMouseWheel**

Modifier: private  
Tag: @inner  
Description:  
Handles specific wheel logic (zoom or scroll).  
**Parameters**:

* e: WheelEvent  
* deltaX: number  
* deltaY: number

### **onLineDragStart**

Modifier: private  
Tag: @inner  
Description:  
Line drag start handling (impl seems moved to EditingLineController).  
**Parameters**:

* line: RGLine  
* e: RGUserEvent

### **onCanvasDragging**

Modifier: protected  
Tag: @inner  
Description:  
Canvas dragging handling.  
Triggers onCanvasDragging event and updates canvas offset.  
**Parameters**:

* newX, newY, buffX, buffY: number

### **onCanvasDragStop**

Modifier: private  
Tag: @inner  
Description:  
Canvas drag stop handling.  
Triggers selection end logic if creating selection.  
**Parameters**:

* x\_buff: number  
* y\_buff: number  
* e: RGUserEvent

### **startCreateSelection**

Modifier: private  
Tag: @inner  
Description:  
Starts creating selection.  
Starts drag loop to calculate selection size and position.  
**Parameters**:

* e: RGUserEvent

### **addFullscreenListener**

Modifier: protected  
Tag: @inner  
Description:  
Adds fullscreen status listener.  
**Parameters**:

* None

### **removeFullscreenListener**

Modifier: protected  
Tag: @inner  
Description:  
Removes fullscreen status listener.  
**Parameters**:

* None

### **defaultLineConnectEndHandler**

Modifier: private  
Tag: @inner  
Description:  
Default line connect end handler.  
Currently makes no data changes.  
**Parameters**:

* from, to: RGNode | RGLineTarget | RGPosition  
* newLine: JsonLine

### **defaultLineVertexBeChangedHandler**

Modifier: private  
Tag: @inner  
Description:  
Default line vertex change handler.  
**Parameters**:

* from, to: RGNode | RGLineTarget | RGPosition  
* newLine: JsonLine

### **forceLayoutTickCallback**

Modifier: private  
Tag: @inner  
Description:  
Callback after each iteration of force layout to update the view.  
**Parameters**:

* None