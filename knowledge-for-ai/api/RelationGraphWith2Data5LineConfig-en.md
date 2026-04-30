# **RelationGraphWith2Data5LineConfig Method Documentation**

This document is organized based on RelationGraphWith2Data5LineConfig.ts and types.ts, covering detailed functionality, comment explanations, and parameter type definitions for the class methods.

## **1\. Common Methods**

### **generateLineConfig**

Description:  
Generates configuration information for drawing lines based on line information.  
This method retrieves the corresponding RGLink object for the line and extracts information required for drawing, such as start point, end point, and line index.

* Returns false if the corresponding Link is not found.  
* Note: The visibility of the line is not checked here, because invisible lines will not call this method to render them.

**Parameters**:

* line  
  * **Type**: RGLine  
  * **Detail**: The line object.

**Returns**:

* RGGenerateLineConfig | false: Returns the line drawing configuration object if successful, otherwise returns false.

### **generateFakeLineConfig**

Description:  
Generates configuration information for drawing fake lines based on fake line information.

* If it is a fake line connecting two HTML elements, it calculates the total number of lines and the index between the same targets.  
* Calls getFakeLineTarget to retrieve the target information for the start and end points.

**Parameters**:

* fakeLine  
  * **Type**: RGFakeLine  
  * **Detail**: The fake line object.

**Returns**:

* RGGenerateLineConfig | false: Returns the line drawing configuration object if successful, otherwise returns false.

### **setFakeLineTargetRender**

Description:  
Sets a custom render method for fake line targets.  
This method allows providing more types of target rendering capabilities for fake lines (e.g., connecting to custom non-node, non-DOM element targets).  
**Parameters**:

* fakeLineTargetRender  
  * **Type**: RGFakeLineTargetRender  
  * **Type Definition**: (targetType: string, targetId: string, fakeLine: RGFakeLine) \=\> RGLineTarget  
  * **Detail**: The custom render function.

### **getFakeLineTarget**

Description:  
Gets the target information of a fake line based on the target type and target ID.  
Supports handling the following types:

1. HTMLElementId: HTML Element ID.  
2. Node: Normal Node.  
3. NodePoint / CanvasPoint: Connection point inside a node or on the canvas.  
4. Custom types: Handled via fakeLineTargetRender.

**Parameters**:

* targetType  
  * **Type**: string  
  * **Detail**: The target type (e.g., 'node', 'HTMLElementId', etc.).  
* targetId  
  * **Type**: string  
  * **Detail**: The target ID.  
* fakeLine  
  * **Type**: RGFakeLine  
  * **Detail**: The fake line object.

**Returns**:

* RGLineTarget | undefined: Returns the calculated target object (containing coordinates, dimensions, etc.).

## **2\. Internal Methods**

### **generateCreatingLineConfig**

Tag: @inner  
Description:  
Generates configuration for the line currently being created (being dragged).  
Used to calculate the start and end points (which may be the mouse position or a target) of the line in real-time when the user is dragging to create a connection.  
**Parameters**:

* options (Optional)  
  * **Type**: RGOptionsFull  
  * **Detail**: Global configuration options.

**Returns**:

* RGGenerateLineConfig: Line drawing configuration object.