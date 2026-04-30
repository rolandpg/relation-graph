# **RelationGraphWith2Data3Update Method Documentation**

This document is organized based on RelationGraphWith2Data3Update.ts and types.ts, covering detailed functionality, comment explanations, and parameter type definitions for the class methods.

## **1\. Common Methods**

### **removeLine**

Description:  
Removes a line.  
**Parameters**:

* line  
  * **Type**: RGLine  
  * **Detail**: The line object to remove.

### **removeLines**

Description:  
Removes multiple lines.  
**Parameters**:

* lines  
  * **Type**: RGLine\[\]  
  * **Detail**: An array of line objects to remove.

### **removeLineById**

Description:  
Removes a line by its lineId.  
**Parameters**:

* lineId  
  * **Type**: string  
  * **Detail**: The ID of the line.

### **removeLineByIds**

Description:  
Removes multiple lines by their lineIds.  
**Parameters**:

* lineIds  
  * **Type**: string\[\]  
  * **Detail**: An array of line IDs.

### **removeFakeLine**

Description:  
Removes a fake line.  
**Parameters**:

* line  
  * **Type**: RGFakeLine  
  * **Detail**: The fake line object to remove.

### **removeFakeLineById**

Description:  
Removes a fake line by its lineId.  
**Parameters**:

* lineId  
  * **Type**: string  
  * **Detail**: The ID of the fake line.

### **removeLink**

Description:  
Removes a Link object (and its corresponding line).  
**Parameters**:

* link  
  * **Type**: RGLink  
  * **Detail**: The Link object to remove.

### **removeLinkByLineId**

Description:  
Removes a Link (and its corresponding line) by lineId.

* Deleting the line will automatically delete the related Link.

**Parameters**:

* lineId  
  * **Type**: string  
  * **Detail**: The ID of the line.

### **removeNodeById**

Description:  
Removes a node by its nodeId.  
**Parameters**:

* nodeId  
  * **Type**: string  
  * **Detail**: The ID of the node.

### **removeNodesByIds**

Description:  
Removes multiple nodes by their nodeIds.  
**Parameters**:

* nodeIds  
  * **Type**: string\[\]  
  * **Detail**: An array of node IDs.

### **removeNodes**

Description:  
Removes multiple nodes.  
**Parameters**:

* nodes  
  * **Type**: RGNode\[\]  
  * **Detail**: An array of node objects to remove.

### **removeNode**

Description:  
Removes a node.  
**Parameters**:

* node  
  * **Type**: RGNode  
  * **Detail**: The node object to remove.

### **removeELementLineById**

Tag: @deprecated  
Description:  
Deprecated. Please use removeFakeLineById instead of removeELementLineById. This method is kept for compatibility with older API versions.  
**Parameters**:

* elementLineId  
  * **Type**: string

### **addNode**

Description:  
Adds a node.  
**Parameters**:

* node  
  * **Type**: JsonNode  
  * **Detail**: The node data object.

### **addNodes**

Description:  
Adds multiple nodes.  
**Parameters**:

* nodes  
  * **Type**: JsonNode\[\]  
  * **Detail**: An array of node data objects.

### **addLine**

Description:  
Adds a line.  
**Parameters**:

* line  
  * **Type**: JsonLine  
  * **Detail**: The line data object.

### **addLines**

Description:  
Adds multiple lines.  
This method automatically distinguishes between normal lines and fake lines and handles them separately.  
**Parameters**:

* lines  
  * **Type**: JsonLine\[\]  
  * **Detail**: An array of line data objects.

### **addFakeLines**

Description:  
Adds multiple fake lines.  
**Parameters**:

* lines  
  * **Type**: JsonLine\[\]  
  * **Detail**: An array of line data objects.

### **updateElementLines**

Description:  
Updates the position information of all element lines.

* Generally, there is no need to call this method, relation-graph will automatically call this method to update the position information of element lines at appropriate times. This method is only for special scenarios.

**Parameters**:

* None

### **addElementLines**

Tag: @deprecated  
Description:  
Deprecated. Please use addFakeLines instead of addElementLines. This method is kept for compatibility with older API versions.  
**Parameters**:

* lines  
  * **Type**: JsonLine\[\]

### **clearFakeLines**

Description:  
Clears all fake lines.  
**Parameters**:

* None

### **clearElementLines**

Tag: @deprecated  
Description:  
Deprecated. Please use clearFakeLines instead of clearElementLines. This method is kept for compatibility with older API versions.  
**Parameters**:

* None

### **updateNode**

Description:  
Modifies node property values.  
You only need to pass in the properties you want to modify; properties that are not passed in will remain unchanged.  
**Parameters**:

* nodeId  
  * **Type**: string  
  * **Detail**: The ID of the target node.  
* nodeProperties  
  * **Type**: Partial\<RGNode\>  
  * **Detail**: Partial node object containing properties to update.

### **updateNodeData**

Description:  
Modifies specified attribute values in node.data.  
It is a shortcut method, equivalent to:  
this.updateNode(node.id, {  
    data: {...node.data, ...nodeData}  
});

**Parameters**:

* nodeId  
  * **Type**: string  
  * **Detail**: The ID of the target node.  
* nodeData  
  * **Type**: Record\<string, any\>  
  * **Detail**: The data object to update.

### **updateLine**

Description:  
Modifies line property values.  
You only need to pass in the properties you want to modify; properties that are not passed in will remain unchanged.  
**Parameters**:

* lineId  
  * **Type**: string  
  * **Detail**: The ID of the target line.  
* lineProperties  
  * **Type**: Partial\<RGLine\>  
  * **Detail**: Partial line object containing properties to update.

### **updateLineData**

Description:  
Modifies specified attribute values in line.data.  
It is a shortcut method, equivalent to:  
this.updateLine(line.id, {  
    data: {...line.data, ...lineData}  
});

**Parameters**:

* lineId  
  * **Type**: string  
  * **Detail**: The ID of the target line.  
* lineData  
  * **Type**: Record\<string, any\>  
  * **Detail**: The data object to update.

### **updateFakeLine**

Description:  
Modifies fake line property values.  
You only need to pass in the properties you want to modify; properties that are not passed in will remain unchanged.  
**Parameters**:

* lineId  
  * **Type**: string  
  * **Detail**: The ID of the target fake line.  
* lineProperties  
  * **Type**: Partial\<RGFakeLine\>  
  * **Detail**: Partial fake line object containing properties to update.

### **flatNodeData**

Description:  
Expands tree-structured data into flattened data.  
**Parameters**:

* orign\_nodes  
  * **Type**: JsonNode\[\]  
  * **Detail**: Tree-structured data, e.g., \[{id:'a',children:\[{id:'a-1'}\]}\].  
* parentNode  
  * **Type**: JsonNode | null  
  * **Detail**: Parent node. Please pass null for the root level.  
* nodes\_collect  
  * **Type**: JsonNode\[\]  
  * **Detail**: All expanded nodes will be stored here.  
* lines\_collect  
  * **Type**: JsonLine\[\]  
  * **Detail**: All expanded lines will be stored here.

### **updateNodesVisibleProperty**

Description:  
Updates the visibility property of nodes.

* When you expand/collapse nodes, there is no need to call this method outside of relation-graph, because relation-graph will automatically call this method.  
* However, when you directly modify the visible property of a node (for example, if you modify a node's parent node to be hidden, then you need to call this method to make the child node invisible), you need to call this method to update the visibility of the nodes.

**Parameters**:

* nodes (Optional)  
  * **Type**: RGNode\[\]

## **2\. Internal Methods (@inner Methods)**

### **\_addFakeLines**

Tag: @inner  
Description:  
Internal method: Adds fake lines.  
**Parameters**:

* lines: JsonLine\[\]

### **\_updateElementLines**

Tag: @inner  
Description:  
Internal method: Executes the update logic for element line positions.  
Updates canvas info and iterates to update each element target.  
**Parameters**:

* None

### **\_updateCanvasBoxInfo**

Tag: @inner  
Description:  
Internal method: Updates the canvas bounding box info (position and scale).  
**Parameters**:

* None

### **updateElementTarget**

Tag: @inner  
Description:  
Internal method: Updates the position information of a single element target.  
Calculates its coordinates in the canvas based on the DOM element.  
**Parameters**:

* elementTarget: RGLineTarget

### **\_getElementTargetPosition**

Tag: @inner  
Description:  
Internal method: Gets the DOM element's coordinates and size relative to the canvas.  
**Parameters**:

* el: HTMLElement

### **updateNodeOffsetSize**

Tag: @inner  
Description:  
Internal method: Updates the node's offset size (width and height).  
Usually called when the node DOM size changes.  
**Parameters**:

* nodeId: string  
* width: number  
* height: number

### **\_addNodes**

Tag: @inner  
Description:  
Internal method: Converts JsonNode to RGNode objects and adds them to the graph.  
Handles data conversion, ID conflict checking, etc. Triggers beforeAddNodes event.  
**Parameters**:

* \_nodes: JsonNode\[\]

### **\_addLines**

Tag: @inner  
Description:  
Internal method: Converts JsonLine to RGLine objects and adds them to the graph.  
Handles data conversion, source/target validation, ID generation, etc. Triggers beforeAddLines event.  
**Parameters**:

* \_lines: JsonLine\[\]

### **loadGraphJsonData**

Tag: @inner  
Description:  
Internal method: Loads graph JSON data.  
Compatible with older configurations (like relations, links, edges), automatically converts tree data, and adds nodes and lines.  
**Parameters**:

* jsonData: RGJsonData

### **updateShouldRenderGraphData**

Tag: @inner  
Description:  
Internal method: Recalculates all visible nodes.  
There is no need to call this method outside of relation-graph, because relation-graph will automatically call this method after you modify the data.  
**Parameters**:

* force: boolean (Default false)

### **updateVisibleNodesSize**

Tag: @inner  
Description:  
Internal method: Updates the size information of all visible nodes.  
Iterates through the currently rendered list of nodes and updates their DOM sizes.  
**Parameters**:

* None

### **\_clearGraph**

Tag: @inner  
Description:  
Internal method: Clears graph data.  
Clears reactive data, selection state, editing state, etc.  
**Parameters**:

* None

### **\_setJsonData**

Tag: @inner  
Description:  
Internal method: Sets JSON data.  
First clears the graph, then loads new data.  
**Parameters**:

* jsonData: RGJsonData  
* resetViewSize: boolean (Default false)