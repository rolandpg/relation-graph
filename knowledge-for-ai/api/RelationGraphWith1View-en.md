# **RelationGraphWith1View Method Documentation**

This document is organized based on RelationGraphWith1View.ts and types.ts, covering detailed functionality, comment explanations, and parameter type definitions for the class methods.

## **1\. Common Methods**

### **getViewBoundingClientRect**

Description:  
Gets the bounding client rect of the RelationGraph component DOM.  
Returns the position and size information of the RelationGraph container DOM.  
**Parameters**:

* None

**Returns**:

* DOMRect

### **getBoundingClientRect**

Tag: @deprecated  
Description:  
Deprecated. Please use getViewBoundingClientRect instead of getBoundingClientRect. This method is kept for compatibility with older API versions.  
Calling this method will output a warning message to the console.  
**Parameters**:

* None

### **getViewXyByEvent**

Description:  
Gets the coordinates mapped on the "relation-graph Component viewport" from the Event object.  
This method automatically handles the differences between Mouse Events and Touch Events and calculates the coordinates relative to the top-left corner of the component container.  
**Parameters**:

* e  
  * **Type**: RGUserEvent (MouseEvent | TouchEvent)  
  * **Detail**: The user event object.

**Returns**:

* { x: number, y: number }: Coordinates relative to the component viewport.

### **getCanvasXyByClientXy**

Description:  
Converts client coordinates (usually browser window coordinates) to canvas coordinates.  
This method first converts client coordinates to viewport coordinates, and then to logical coordinates within the canvas (taking zoom and offset into account).  
**Parameters**:

* clientXY  
  * **Type**: RGCoordinate  
  * **Detail**: Coordinate object containing x (clientX) and y (clientY).

**Returns**:

* RGCoordinate: Logical coordinates within the canvas.

### **getCanvasXyByViewXy**

Description:  
Converts "relation-graph Component viewport" coordinates to canvas coordinates.  
This calculation considers the current canvas zoom ratio (canvasZoom) and offset (canvasOffset). If currently in "Connect Area" mode (\_rgAsConnectArea is true), it returns the viewport coordinates directly.  
**Parameters**:

* viewXy  
  * **Type**: RGCoordinate  
  * **Detail**: Coordinates relative to the component viewport. I.e., {x: e.clientX \- relationGraphViewBox.left, y: e.clientY \- relationGraphViewBox.top}.

**Returns**:

* RGCoordinate: Logical coordinates within the canvas.

### **getViewXyByCanvasXy**

Description:  
Converts canvas coordinates to "relation-graph Component viewport" coordinates.  
This is the inverse operation of getCanvasXyByViewXy.  
**Parameters**:

* canvasCoordinate  
  * **Type**: RGCoordinate  
  * **Detail**: Logical coordinates within the canvas (e.g., node's x, y coordinates).

**Returns**:

* RGCoordinate: Coordinates mapped onto the component viewport.

### **getCanvasCoordinateByClientCoordinate**

Tag: @deprecated  
Description:  
Deprecated. Please use getCanvasXyByClientXy instead. This method is kept for compatibility with older API versions.  
Calling this method will output a warning message to the console.  
**Parameters**:

* clientXY  
  * **Type**: RGCoordinate  
  * **Detail**: Client coordinate object.

### **isNode**

Description:  
Checks if the passed DOM element el belongs to a node element.  
If so, returns the corresponding node object (RGNode).

* You can use this method to determine if the element currently under the mouse is a node element and get the corresponding node object.

**Parameters**:

* el  
  * **Type**: HTMLElement  
  * **Detail**: The DOM element to check.

**Returns**:

* RGNode | undefined: Returns the node object if found; otherwise returns undefined.

### **isLine**

Description:  
Checks if the passed DOM element el belongs to a line element.  
If so, returns the corresponding line object (RGLine).

* You can use this method to determine if the element currently under the mouse is a line element and get the corresponding line object.

**Parameters**:

* el  
  * **Type**: HTMLElement  
  * **Detail**: The DOM element to check.

**Returns**:

* RGLine | undefined: Returns the line object if found; otherwise returns undefined.

### **isLink**

Tag: @deprecated  
Description:  
Deprecated. Please use isLine instead of isLink.  
This method is kept for compatibility with older API versions, but in the current implementation, it throws an error Error('Please use isLine').  
**Parameters**:

* el  
  * **Type**: HTMLElement

## **2\. Internal Methods (@inner Methods)**

### **getLineTextContainer**

Tag: @inner  
Description:  
Gets the container DOM element used to place line text.  
Returns the corresponding DOM container based on whether the passed line object is a normal line or a fake line (FakeLine).  
**Parameters**:

* line  
  * **Type**: RGLine  
  * **Detail**: The line object.

**Returns**:

* HTMLDivElement | undefined

### **\_getEventPoint**

Modifier: protected  
Tag: @inner  
Description:  
Internal method compatible with older API versions.  
Functionally equivalent to getViewXyByEvent.  
**Parameters**:

* e  
  * **Type**: RGUserEvent  
  * **Detail**: User event object.