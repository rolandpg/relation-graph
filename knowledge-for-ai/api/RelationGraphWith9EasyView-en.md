# **RelationGraphWith9EasyView Method Documentation**

This document is organized based on RelationGraphWith9EasyView.ts and types.ts, covering detailed functionality, comment explanations, and parameter type definitions for the class methods.

## **1\. Internal Methods**

### **setEasyViewCanvas**

Tag: @inner  
Description:  
Sets the Canvas element used for Easy View.

* Internal call by relation-graph, please do not use externally.  
* Initializes the painter (currently uses RGCanvasImpl2D).

**Parameters**:

* canvas  
  * **Type**: HTMLCanvasElement  
  * **Detail**: The Canvas DOM element used for rendering the easy view.

### **updateEasyView**

Tag: @inner  
Description:  
Triggers an update for Easy View.

* Internal call by relation-graph, please do not use externally.  
* First updates the MiniView.  
* Checks if in performance mode (isPerformanceMode) and if EasyView is enabled (showEasyView).  
* Uses requestAnimationFrame to schedule \_updateEasyView execution to avoid duplicate calls.

**Parameters**:

* None

### **\_updateEasyView**

Modifier: protected  
Tag: @inner  
Description:  
Executes the specific drawing logic for Easy View.

* Calculates data needed for rendering.  
* Performs preparation before drawing (sizing, scaling, offsetting).  
* Draws all lines.  
* Draws all nodes.  
* Logs drawing time.

**Parameters**:

* time  
  * **Type**: number  
  * **Detail**: Timestamp passed by requestAnimationFrame.

### **evDosomethingBeforeDraw**

Modifier: protected  
Tag: @inner  
Description:  
Preparation work executed before drawing.

* Synchronizes the Canvas element's width and height with the view size.  
* Sets the size, scale, and view offset of the painter.  
* Calls the painter's beforeDraw method (usually used to clear the canvas).

**Parameters**:

* None

### **evDrawAllNodes**

Modifier: protected  
Tag: @inner  
Description:  
Draws all visible nodes.

* Iterates through all nodes, checks if the node is visible (rgShouldRender, rgCalcedVisibility, opacity).  
* Calls evDrawNode to draw individual nodes.

**Parameters**:

* None

### **evDrawNode**

Modifier: protected  
Tag: @inner  
Description:  
Dispatches drawing tasks based on node shape.

* If circle (RGNodeShape.circle), calls evDrawNode4Circle.  
* Otherwise (default rect), calls evDrawNode4Rect.

**Parameters**:

* node  
  * **Type**: RGNode

### **getNodeColor**

Modifier: protected  
Tag: @inner  
Description:  
Gets the display color of the node.

* If the node color is 'transparent', returns a light gray transparent value.  
* Otherwise, returns the set node color or the default color.

**Parameters**:

* node  
  * **Type**: RGNode

### **evDrawNode4Rect**

Modifier: private  
Tag: @inner  
Description:  
Draws a rectangular node.

* Retrieves node width, height, opacity, color, border radius, and border color.  
* Calls the painter's evDrawNode4Rect method to draw.

**Parameters**:

* node  
  * **Type**: RGNode

### **evDrawNode4Circle**

Modifier: private  
Tag: @inner  
Description:  
Draws a circular node.

* Retrieves node width, height, opacity, color, and border color.  
* Calls the painter's evDrawNode4Circle method to draw.

**Parameters**:

* node  
  * **Type**: RGNode

### **evDrawAllLines**

Modifier: protected  
Tag: @inner  
Description:  
Draws all visible lines.

* Iterates through all Links, checks if nodes at both ends are visible.  
* If visible, calls evDrawLine to draw the line.

**Parameters**:

* None

### **evDrawLine**

Modifier: private  
Tag: @inner  
Description:  
Draws a single line.

* Generates drawing path info for the line (createLineDrawInfo).  
* Retrieves line opacity, width, and color.  
* Calls the painter's evDrawLine method to draw.

**Parameters**:

* link: RGLink  
* line: RGLine