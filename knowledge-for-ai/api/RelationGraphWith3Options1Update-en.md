# **RelationGraphWith3Options1Update Method Documentation**

This document is organized based on RelationGraphWith3Options1Update.ts and types.ts, covering detailed functionality, comment explanations, and parameter type definitions for the class methods.

## **1\. Common Methods**

### **loading**

Description:  
Locks the graph component screen and displays a piece of text.  
This is typically used during data loading or layout calculations to prevent user interaction and provide visual feedback.  
**Parameters**:

* graphLoadingText (Default: '')  
  * **Type**: string  
  * **Detail**: The text to display as a loading prompt.

### **clearLoading**

Description:  
Clears the lock on the graph component screen.  
Restores the interaction capability of the graph and hides the loading prompt.  
**Parameters**:

* None

### **setCheckedNode**

Description:  
Sets the checked node (Checked state).  
Usually used for single-selection operations, updates options.checkedNodeId.  
**Parameters**:

* node  
  * **Type**: string | RGNode  
  * **Detail**: The node object or node ID to be checked. If undefined or empty, it is treated as unchecking.

### **setCheckedLine**

Description:  
Sets the checked line (Checked state).  
Usually used for single-selection operations, updates options.checkedLineId.  
**Parameters**:

* line  
  * **Type**: string | RGLine  
  * **Detail**: The line object or line ID to be checked.

### **clearChecked**

Description:  
Clears all checked nodes and lines (Checked state).  
**Parameters**:

* None

### **clearSelected**

Description:  
Clears all selected nodes and lines (Selected state).

* The Selected state is typically used for multi-selection (e.g., box selection) scenarios.  
* This method iterates through all nodes, lines, and fake lines in the selected state and sets their selected property to false.

**Parameters**:

* None

### **setCanvasOffset**

Description:  
Sets the canvas offset.  
Used when dragging the canvas to update the viewport position of the canvas.  
**Parameters**:

* x  
  * **Type**: number  
  * **Detail**: Canvas X-axis offset.  
* y  
  * **Type**: number  
  * **Detail**: Canvas Y-axis offset.

## **2\. Internal Methods**

### **\_updateOptions**

Modifier: protected  
Tag: @inner  
Description:  
Updates graph options.

* Handles option merging and correction of special properties (e.g., instanceId, defaultPolyLineRadius spelling compatibility).  
* If debug mode is enabled, sets the global debug flag.  
* If layout configuration is included, applies default layout options.  
* **Note**: Directly setting the layouts property is not supported; use layout instead.

**Parameters**:

* options  
  * **Type**: RGOptions  
  * **Detail**: Partial options configuration object.

### **resetViewSize**

Modifier: protected  
Tag: @inner  
Description:  
When the size of the parent element of the relation-graph component changes, this method can be called to recalculate the view size.

* Retrieves the current view container size and updates options.viewSize.  
* If zoomTo100 is true, resets the canvas zoom to 100% and centers it.  
* If currently in "Connect Area Mode" (\_rgAsConnectArea), also resets zoom and offset.

**Parameters**:

* zoomTo100 (Default: false)  
  * **Type**: boolean  
  * **Detail**: Whether to reset the zoom level to 100%.

### **setCanvasMoveMode**

Modifier: protected  
Tag: @inner  
Description:  
Sets the current canvas to move mode.  
Updates options.canvasMoveMode.  
**Parameters**:

* newValue  
  * **Type**: boolean  
  * **Detail**: true enables move mode, false disables it.

### **onMiniViewMounted**

Tag: @inner  
Description:  
Called when the MiniView component is mounted.  
Sets options.showMiniView to true.  
**Parameters**:

* None

### **onMiniViewUnMounted**

Tag: @inner  
Description:  
Called when the MiniView component is unmounted.  
Sets options.showMiniView to false.  
**Parameters**:

* None

### **onReferenceLineMounted**

Tag: @inner  
Description:  
Called when the Reference Line component is mounted.  
Enables reference line display and sets whether to enable adsorption based on the parameter.  
**Parameters**:

* adsorption  
  * **Type**: boolean  
  * **Detail**: Whether to enable adsorption.

### **onReferenceLineUnMounted**

Tag: @inner  
Description:  
Called when the Reference Line component is unmounted.  
Disables reference line display and adsorption.  
**Parameters**:

* None