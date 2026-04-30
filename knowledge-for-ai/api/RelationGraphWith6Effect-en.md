# **RelationGraphWith6Effect Method Documentation**

This document is organized based on RelationGraphWith6Effect.ts and types.ts, covering detailed functionality, comment explanations, and parameter type definitions for the class methods.

## **1\. Common Methods**

### **fitContentHeight**

Description:  
Automatically adjusts the height of the \<RelationGraph/\> canvas to fit the content, while maintaining the width of the canvas unchanged.

* By default, the height of the \<RelationGraph/\> component is the height of the parent element. Sometimes we want to automatically adjust the height according to the amount of content to fit the content. This method can achieve this function.  
* **Note**: This method will modify the height attribute of the canvas. Please ensure that the parent element allows the height of the child element to change; otherwise, it may not achieve the expected effect.  
* **Note**: This method is suitable for scenarios where there is less content and you want the canvas height to adapt to the content. If there is more content, it is recommended to use the zoomToFit method to ensure that the content is fully displayed.

**Parameters**:

* padding (Default: 20\)  
  * **Type**: number  
  * **Detail**: Padding around the content, in pixels.

### **setCanvasCenter**

Description:  
Moves the specified coordinates on the canvas to the center of the visible area.  
**Parameters**:

* x  
  * **Type**: number  
  * **Detail**: X coordinate on the canvas.  
* y  
  * **Type**: number  
  * **Detail**: Y coordinate on the canvas.

### **zoomToFit**

Description:  
Zooms to fit the appropriate size, making the specified nodes visible in the view and occupying the view as much as possible.  
**Parameters**:

* nodes (Optional)  
  * **Type**: (RGNode | RGRectTarget)\[\]  
  * **Detail**: Specifies the set of nodes to fit. Defaults to all nodes in the graph if not provided.

### **enableNodeXYAnimation**

Description:  
Enables node position animation.

* After enabling, when the node position changes, there will be a smooth transition animation effect.

**Parameters**:

* None

### **disableNodeXYAnimation**

Description:  
Disables node position animation.

* After disabling, when the node position changes, it will directly jump to the new position without animation.

**Parameters**:

* None

### **enableCanvasAnimation**

Description:  
Enables canvas transformation animation.

* After enabling, when the canvas is panned or zoomed, there will be a smooth transition animation effect.

**Parameters**:

* None

### **disableCanvasAnimation**

Description:  
Disables canvas transformation animation.

* After disabling, when the canvas is panned or zoomed, it will directly jump to the new position or scale without animation.

**Parameters**:

* None

### **focusNodeById**

Description:  
Focuses on the specified node by its ID (centers the node in the view).  
**Parameters**:

* nodeId  
  * **Type**: string  
  * **Detail**: The ID of the node to focus on.

### **focusRootNode**

Tag: @deprecated  
Description:  
Deprecated. Please use focusNodeById instead.  
Calling this method will throw an error.  
**Parameters**:

* None

## **2\. Internal Methods (Internal Methods)**

### **\_moveToCenter**

Modifier: protected  
Tag: @inner  
Description:  
Moves the specified nodes (or all nodes) to the center of the visible area.  
Calculates the center point of the node collection and sets the canvas center.  
**Parameters**:

* nodes (Optional)  
  * **Type**: (RGNode | RGRectTarget)\[\]  
  * **Detail**: Defaults to all nodes in the graph.

### **focusNode**

Modifier: private  
Tag: @inner  
Description:  
Internal method: Focuses on the specified node object.

* Resets zoom level to 100%.  
* Calculates offsets to place the node in the center of the view.  
* Sets the node as checked (checkedNodeId).

**Parameters**:

* thisNode  
  * **Type**: RGNode