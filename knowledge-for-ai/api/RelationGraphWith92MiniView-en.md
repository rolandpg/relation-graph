# **RelationGraphWith92MiniView Method Documentation**

This document is organized based on RelationGraphWith92MiniView.ts and types.ts, covering detailed functionality, comment explanations, and parameter type definitions for the class methods.

## **1\. Internal Methods**

### **setMiniViewCanvas**

Tag: @inner  
Description:  
Sets the Canvas element used for the MiniView.

* Internal call by relation-graph, please do not use externally.  
* Gets and stores the 2D drawing context (CanvasRenderingContext2D) of the canvas.

**Parameters**:

* canvas  
  * **Type**: HTMLCanvasElement  
  * **Detail**: The Canvas DOM element for the mini view.

### **updateMiniView**

Tag: @inner  
Description:  
Updates the MiniView.

* Internal call by relation-graph, please do not use externally.  
* If showMiniView is not enabled in options, it returns immediately.  
* Sequentially calls updateMiniViewVisibleArea (updates viewport handle) and \_updateMiniView (redraws content).

**Parameters**:

* None

### **\_updateMiniView**

Modifier: private  
Tag: @inner  
Description:  
Executes the specific drawing logic for the MiniView.

* Records start time.  
* Performs preparation before drawing (mvDosomethingBeforeDraw).  
* Draws all nodes (mvDrawAllNodes).  
* (Note: The mvDrawAllLines call is currently commented out in the code).  
* Logs drawing time.

**Parameters**:

* None

### **mvDosomethingBeforeDraw**

Modifier: protected  
Tag: @inner  
Description:  
Preparation work executed before drawing the MiniView.

* Calculates the bounding box (MinX, MinY, MaxX, MaxY) of all visible nodes in the graph.  
* Calculates the scale factor (scale) to fit all nodes within the mini view canvas based on the bounding box size and canvas container size.  
* Updates the width/height properties and styles of the Canvas element.  
* Sets the scale and transform of the Canvas context, preparing for drawing.

**Parameters**:

* None

### **updateMiniViewVisibleArea**

Modifier: private  
Tag: @inner  
Description:  
Updates the "Viewport Handle" (visible area indicator) in the MiniView.

* Calculates the position and size of the current main view (View) in the global coordinate system.  
* Maps it to the mini view's coordinate system to calculate the x, y, width, and height of the handle.  
* Updates options.miniViewVisibleHandle data.

**Parameters**:

* None

### **mvDrawAllNodes**

Modifier: protected  
Tag: @inner  
Description:  
Draws all visible nodes.

* Iterates through all nodes, skipping invisible ones or those with 0 opacity.  
* Includes a minimum size limit (\_canvasItemMiniSizeLimit) to ensure nodes remain visible (at least 1px) even at very small zoom levels.  
* Calls mvDrawNode to draw individual nodes.

**Parameters**:

* None

### **mvDrawNode**

Modifier: protected  
Tag: @inner  
Description:  
Dispatches drawing tasks based on node shape.

* Circle (RGNodeShape.circle/0) calls mvDrawNode4Circle.  
* Rect (others) calls mvDrawNode4Rect.

**Parameters**:

* node  
  * **Type**: RGNode  
  * **Detail**: The node object.  
* nodeWidth  
  * **Type**: number  
  * **Detail**: Calculated node width.  
* nodeHeight  
  * **Type**: number  
  * **Detail**: Calculated node height.

### **mvDrawNode4Rect**

Modifier: protected  
Tag: @inner  
Description:  
Draws a rectangular node.

* Uses ctx.rect and ctx.fill / ctx.stroke to draw the rectangle and its border.

**Parameters**:

* node: RGNode  
* nodeWidth: number  
* nodeHeight: number

### **mvDrawNode4Circle**

Modifier: protected  
Tag: @inner  
Description:  
Draws a circular node.

* Uses ctx.ellipse to draw the ellipse/circle.

**Parameters**:

* node: RGNode  
* nodeWidth: number  
* nodeHeight: number

### **mvDrawAllLines**

Modifier: protected  
Tag: @inner  
Description:  
Draws all visible lines.

* Iterates through all Links, calls mvDrawLine if nodes at both ends are visible.

**Parameters**:

* None

### **mvDrawLine**

Modifier: protected  
Tag: @inner  
Description:  
Draws a single line.

* Generates line path information (createLineDrawInfo).  
* Parses SVG path data and draws it on Canvas (mvDrawSvgPathOnCanvas).  
* Sets line color, width, and opacity.

**Parameters**:

* link: RGLink  
* line: RGLine

### **mvDrawSvgPathOnCanvas**

Modifier: protected  
Tag: @inner  
Description:  
Parses SVG Path strings and converts them to Canvas drawing commands.

* Supported commands: M (MoveTo), L (LineTo), C (BezierCurveTo), Q (QuadraticCurveTo \- simplified to line here), V (VerticalLineTo), H (HorizontalLineTo), Z (ClosePath).  
* This is a simple SVG Path parser used to reproduce connection paths on the Canvas.

**Parameters**:

* ctx: CanvasRenderingContext2D  
* svgPath: string

### **onVisibleViewHandleDragStart**

Tag: @inner  
Description:  
Triggered when dragging the "Visible View Handle" in the MiniView.

* Starts drag logic, calculating canvas offset (canvasOffset) based on mouse movement distance.  
* Updates the main view's canvas position in real-time, enabling navigation via the MiniView.

**Parameters**:

* e  
  * **Type**: RGUserEvent

### **resetByVisiableView**

Tag: @inner  
Description:  
Triggered when the reset function in the MiniView is clicked (usually when content is empty or lost).

* Only executes when miniViewVisibleHandle.emptyContent is true.  
* Resets zoom (setZoom(100)), moves to center (\_moveToCenter), and zooms to fit (zoomToFit).

**Parameters**:

* e  
  * **Type**: RGUserEvent