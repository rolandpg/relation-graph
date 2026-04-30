# **RelationGraphWith91Editing Method Documentation**

This document is organized based on RelationGraphWith91Editing.ts and types.ts, covering detailed functionality, comment explanations, and parameter type definitions for the class methods.

## **1\. Common Methods**

### **setEditingNodes**

Description:  
Sets the nodes currently being edited.

* Set to null or an empty array to cancel all nodes being edited.  
* After setting, the position and size of the editing controller (\<RGEditingNodeController\>) will be automatically updated. If there are no editing nodes, the controller will be hidden.

**Parameters**:

* nodes  
  * **Type**: RGNode\[\] | null  
  * **Detail**: An array of node objects or null.

### **addEditingNode**

Description:  
Adds a node to the editing nodes.  
**Parameters**:

* node  
  * **Type**: RGNode  
  * **Detail**: The node object to add.

### **removeEditingNode**

Description:  
Removes a node from the editing nodes.  
**Parameters**:

* node  
  * **Type**: RGNode  
  * **Detail**: The node object to remove.

### **toggleEditingNode**

Description:  
Toggles the editing state of a node.

* If the node is in the editing list, removes it; otherwise, adds it.

**Parameters**:

* node  
  * **Type**: RGNode  
  * **Detail**: The target node.

### **updateEditingControllerView**

Description:  
Updates the view of the editing controller.

* This method is automatically called when the editing nodes are set or changed.

**Parameters**:

* None

### **onResizeStart**

Description:  
User starts resizing the editing controller (and thus the nodes).

* Records initial state (mouse position, controller size, node sizes, etc.).  
* Binds mouse move and up events, starts the resize loop (requestAnimationFrame).  
* Triggers the onResizeStart event.

**Parameters**:

* type  
  * **Type**: RGResizeHandlePosition  
  * **Type Definition**: 't' | 'r' | 'b' | 'l' | 'tl' | 'tr' | 'bl' | 'br'  
  * **Detail**: The position of the resize handle manipulated by the user.  
* e  
  * **Type**: RGUserEvent  
  * **Detail**: Mouse or touch event.

### **setEditingLine**

Description:  
Sets the line being edited.

* When set to null, the line being edited is canceled.  
* When not null, the \<RGEditingLineController\> controller will automatically display and update its position.

**Parameters**:

* line  
  * **Type**: RGLine | null  
  * **Detail**: The line object being edited.

### **hideEditingLineView**

Description:  
Hides the editing line view.

* Generally used in this scenario: when editing a line, the line editing controller may block the display of the line. When modifying the appearance of the line (such as arrows, etc.), this method can be called to hide the line editing controller view, allowing users to preview the final effect of the line in time.

**Parameters**:

* None

### **updateEditingLineView**

Description:  
Updates the view of the editing line controller.

* This method is automatically called when the editing line is set or changed.

**Parameters**:

* None

### **startMoveLineVertex**

Description:  
Starts dragging the start or end point of the line to reselect the start or end point of the line.

* During the process of changing the start or end point of the line, the original line will be removed.  
* When reconnecting, you can get the new line information (the new line information id and other attributes will be retained) through onLineConnectEventHandler (or through the onLineBeCreated event of the component).  
* You need to complete the data change through graphInstance.addLines(\[newJsonLine\]) to finally complete the modification of the line endpoint.

**Parameters**:

* type  
  * **Type**: 'start' | 'end'  
  * **Detail**: Choose to drag the start point or end point.  
* $event  
  * **Type**: RGUserEvent  
* onLineConnectEventHandler  
  * **Type**: RGLineConnectEventHandler  
  * **Detail**: Callback function after line connection is completed, getting the new line information through parameters.

### **startCreateLineFromNode**

Description:  
Starts creating a line from a specified starting point.

* The \<RGConnectSource\> and \<RGConnectTarget\> components will use this method, and you can call this method yourself to create a line from a specified node.  
* Note: fromNode can be empty. If it is empty, it will try to automatically find the starting point (logic: check template \-\> check single editing node).  
* When the user completes the connection of the line, the onLineConnectEventHandler callback will be triggered.

**Parameters**:

* fromNode  
  * **Type**: RGNode | null | undefined  
  * **Detail**: The starting node.  
* useLineTemplate  
  * **Type**: JsonLineLike  
  * **Detail**: Line template data.  
* $event  
  * **Type**: RGUserEvent  
* onLineConnectEventHandler  
  * **Type**: RGLineConnectEventHandler

### **startMoveLine44CtrlPoint**

Description:  
Starts dragging the line control point (applicable to lines with line type RGLineShape.StandardOrthogonal).

* Handles dragging logic specific to orthogonal lines.

**Parameters**:

* split  
  * **Type**: RGCtrlPointForLine44  
  * **Detail**: Control point information for the line.  
* $event  
  * **Type**: RGUserEvent  
* onLinePathChanged  
  * **Type**: (line: RGLine) \=\> void  
  * **Detail**: Callback after path changes.

## **2\. Internal Methods (Internal Methods)**

### **\_updateEditingControllerView**

Modifier: protected  
Tag: @inner  
Description:  
Internal method: Updates the position and size of the editing node controller.  
Calculates x, y, width, height based on the bounding box of the currently edited nodes.  
**Parameters**:

* None

### **onResizing**

Modifier: private  
Tag: @inner  
Description:  
Handles mouse move event during resizing.  
Records the current event object; actual logic is executed in onResizingRequest.  
**Parameters**:

* e: RGUserEvent

### **onResizingRequest**

Modifier: private  
Tag: @inner  
Description:  
Executes resizing logic (called within requestAnimationFrame).  
Calculates offsets, updates the editing controller's position and size, and applies scaling to nodes.  
**Parameters**:

* None

### **\_applyResizeScale**

Modifier: private  
Tag: @inner  
Description:  
Applies the resize scale of the editing controller to all nodes being edited.  
Updates node coordinates and dimensions, and triggers beforeNodeResize event.  
**Parameters**:

* e: RGUserEvent

### **onResizeEnd**

Modifier: private  
Tag: @inner  
Description:  
Handles the end of resizing.  
Clears listeners and timers, triggers onResizeEnd event.  
**Parameters**:

* e: RGUserEvent

### **draggingSelectedNodes**

Modifier: protected  
Tag: @inner  
Description:  
Updates the positions of the dragged node and other editing nodes when dragging a node.  
Also handles reference line (alignment line) updates and snapping logic.  
**Parameters**:

* draggedNode: RGNode  
* newX, newY, buff\_x, buff\_y: number

### **\_updateEditingConnectControllerView**

Modifier: protected  
Tag: @inner  
Description:  
Updates the view of the node connect controller (connection box).  
**Parameters**:

* None

### **updateReferenceLineView**

Modifier: private  
Tag: @inner  
Description:  
Updates reference line (alignment line) view.  
Calculates distances between the dragged node and other nodes, shows vertical or horizontal alignment lines, and returns snap offsets.  
**Parameters**:

* draggedNode: RGNode  
* newX, newY, buff\_x, buff\_y: number

### **\_updateEditingLineView**

Modifier: protected  
Tag: @inner  
Description:  
Updates the view of the editing line controller.  
Calculates line control points, text position, etc., and renders corresponding handles in the view.  
Has different control point calculation logic for different line shapes (StandardOrthogonal, HardOrthogonal, Curve, etc.).  
**Parameters**:

* None

### **onLineVertexBeDropped**

Tag: @inner  
Description:  
Called when the start or end point of the line is connected to the junction point of a node.  
Updates the junction point info in the line template, triggers onLineVertexDropped event, and attempts to complete line creation.  
**Parameters**:

* type: RGJunctionPoint  
* $event: RGUserEvent  
* junctionPointOffset: {x: number, y: number}  
* onLineVertexBeDropped: RGLineVertexBeDroppedEventHandler

### **startMoveLineText**

Tag: @inner  
Description:  
Starts dragging the line text position.  
Updates the line's textOffset\_x and textOffset\_y.  
**Parameters**:

* $event: RGUserEvent  
* moveEndCallback: () \=\> void

### **startMoveLine6CtrlPoint**

Tag: @inner  
Description:  
Starts dragging the line control point (applicable to lines with curved line types).  
Updates the line's ctrlPoints.  
**Parameters**:

* ctrlPointIndex: number  
* $event: RGUserEvent  
* onLinePathChanged: (line: RGLine) \=\> void

### **onLineVertexBeDroppedOnConnectController**

Tag: @inner  
Description:  
Called when the line endpoint is dropped onto the connection point on the node connection controller (\<RGEditingConnectController /\>).  
Calculates the specific connection position (Top/Bottom/Left/Right) and calls onLineVertexBeDropped.  
**Parameters**:

* junctionPoint: RGJunctionPoint  
* $event: RGUserEvent  
* connectBoxDom: HTMLElement  
* lineVertexBeDroppedEventHandler: RGLineVertexBeDroppedEventHandler