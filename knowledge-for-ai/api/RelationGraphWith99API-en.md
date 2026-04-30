# **RelationGraphWith99API Method Documentation**

This document is organized based on RelationGraphWith99API.ts and types.ts, covering detailed functionality, comment explanations, and parameter type definitions for the class methods.

## **1\. Common Methods**

### **dataUpdated**

Description:  
Calls this method to notify the relation-graph component to update when the data changes.

* In general, there is no need to call this method manually; the relation-graph component will automatically monitor data changes and update.  
* However, in some special cases, you may need to call this method manually to ensure that the relation-graph component updates the display correctly.

**Parameters**:

* None

### **setOptions**

Description:  
Sets the configuration options of the relation-graph component.

* You only need to set the configuration items you want to modify.  
* Internally calls \_updateOptions and triggers a view update.

**Parameters**:

* options  
  * **Type**: RGOptions  
  * **Detail**: The configuration items that need to be modified; no need to pass in a complete object.

### **updateOptions**

Description:  
Updates the configuration options of the relation-graph component.

* You only need to pass in the configuration items you want to modify.  
* Functionally equivalent to setOptions.

**Parameters**:

* options  
  * **Type**: Partial\<RGOptionsFull\>  
  * **Detail**: The configuration items that need to be modified; no need to pass in a complete object.

### **moveToCenter**

Description:  
Moves the canvas to the center position based on the distribution of nodes.  
**Parameters**:

* nodes (Optional)  
  * **Type**: (RGNode | RGRectTarget)\[\]  
  * **Detail**: Specifies a group of nodes or rectangle target objects. If this parameter is not passed in, all nodes in the current graph are used by default.

### **setRootNodeId**

Description:  
Sets the root node ID of the graph.

* After setting the root node, it only affects the layout starting point when calling the graphInstance.doLayout() method subsequently.

**Parameters**:

* rootNodeId  
  * **Type**: string  
  * **Detail**: The specified root node ID.

### **getRootNode**

Description:  
Gets the root node object set in the current graph.  
**Parameters**:

* None

**Returns**:

* RGNode | undefined

### **getCheckedNode**

Description:  
Gets the currently selected (Checked) node object in the graph.

* Retrieves based on options.checkedNodeId.

**Parameters**:

* None

**Returns**:

* RGNode | undefined

### **getCheckedLine**

Description:  
Gets the currently selected (Checked) line object in the graph.

* Attempts to retrieve a normal line, if not found, attempts to retrieve a fake line.

**Parameters**:

* None

**Returns**:

* RGLine | RGFakeLine | undefined

### **getSelectedNodes**

Description:  
Gets all selected nodes in the graph.

* "Selected" here refers to nodes with selected: true (usually used for multi-select/box-select scenarios).

**Parameters**:

* None

**Returns**:

* RGNode\[\]

### **getEditingNodes**

Description:  
Gets all nodes currently being edited in the graph.

* Returns a copy of options.editingController.nodes.

**Parameters**:

* None

**Returns**:

* RGNode\[\]

### **setJsonData**

Description:  
Sets the entire data of the graph and performs layout based on the rootId in the data.

* Uses options.layout as the layout options.  
* This is an asynchronous method.

**Parameters**:

* jsonData  
  * **Type**: RGJsonData  
  * **Detail**: Complete data object containing nodes, lines, and root ID.

### **appendJsonData**

Description:  
Appends data to the graph.

* Loads new JSON data and adds it to the existing graph.  
* If isRelayout is true, re-executes the layout after appending.

**Parameters**:

* jsonData  
  * **Type**: RGJsonData  
  * **Detail**: The data object to append.  
* isRelayout (Default: true)  
  * **Type**: boolean  
  * **Detail**: Whether to re-layout after appending data.

### **applyInitialData**

Description:  
Applies initial data to the graph, centering and zooming to fit.

* Sequentially executes: setJsonData \-\> moveToCenter \-\> zoomToFit.

**Parameters**:

* initialData  
  * **Type**: RGJsonData  
  * **Detail**: Initial data object.

### **getGraphJsonData**

Description:  
Gets all nodes and lines JSON data in the current graph.

* Converts runtime node and line objects into serializable JSON format.

**Parameters**:

* None

**Returns**:

* RGJsonData: Data object containing rootId, nodes, lines.

### **transRGNodeToJsonObject**

Description:  
Converts an RGNode object to a JSON-serializable object.  
**Parameters**:

* node  
  * **Type**: RGNode  
  * **Detail**: Runtime node object.

**Returns**:

* JsonNode

### **transRGLinkToJsonObject**

Description:  
Converts an RGLink object to a JSON-serializable object.  
**Parameters**:

* link  
  * **Type**: RGLink  
  * **Detail**: Runtime link object.

**Returns**:

* JsonLine

### **transRGLineToJsonObject**

Description:  
Converts an RGLine object to a JSON-serializable object.  
**Parameters**:

* line  
  * **Type**: RGLine  
  * **Detail**: Runtime line object.

**Returns**:

* JsonLine

### **getGraphJsonOptions**

Description:  
Gets the configuration information of the current graph.

* Returns a filtered options object, ignoring internal state properties (like canvasZoom, canvasOffset, etc.).

**Parameters**:

* None

**Returns**:

* object: Configuration options object.

### **clearGraph**

Description:  
Clears the current graph data.

* Including: All node data, all line data, all fake line data.  
* Resets root node ID, selected elements, editing elements.

**Parameters**:

* None

### **printOptions**

Description:  
Prints the current graph configuration information to the console.

* Prints object and JSON string.

**Parameters**:

* None

### **printData**

Description:  
Prints all data of the current graph to the console.

* Prints object and JSON string.

**Parameters**:

* None

### **printGraphJsonData**

Description:  
Prints the current graph configuration and JSON data to the console.

* Calls printOptions and printData.

**Parameters**:

* None

## **2\. Internal Methods**

### **transToLinker**

Tag: @inner  
Description:  
\[relation-graph internal call\] Switches to "Connect Area Mode" or exits it.

* Sets \_rgAsConnectArea state.  
* Resets view size.  
* Updates connect targets on canvas slots.  
* Adds or removes keyboard listener based on mode.

**Parameters**:

* newValue (Default: true)  
  * **Type**: boolean  
  * **Detail**: Whether to switch to linker mode.