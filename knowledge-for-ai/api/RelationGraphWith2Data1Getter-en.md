# **RelationGraphWith2Data1Getter Method Documentation**

This document is organized based on RelationGraphWith2Data1Getter.ts and types.ts, covering detailed functionality, comment explanations, and parameter type definitions for the class methods.

## **1\. Common Methods**

### **getOptions**

Description:  
Gets the current options configuration.  
Returns the complete options object RGOptionsFull containing runtime states.  
**Parameters**:

* None

**Returns**:

* RGOptionsFull: The complete configuration options object.

### **getNodeById**

Description:  
Gets a node object by its ID.  
**Parameters**:

* nodeId  
  * **Type**: string  
  * **Detail**: The ID of the target node.

**Returns**:

* RGNode | undefined: Returns the node object if found; otherwise returns undefined.

### **getLineById**

Description:  
Gets a line object by its ID.  
**Parameters**:

* lineId  
  * **Type**: string  
  * **Detail**: The ID of the target line.

**Returns**:

* RGLine | undefined: Returns the line object if found; otherwise returns undefined.

### **getLinkByLineId**

Description:  
Gets a Link object by line ID.  
An RGLink object is a runtime derived object of a line, containing the line and its associated start node (fromNode) and end node (toNode).  
**Parameters**:

* lineId  
  * **Type**: string  
  * **Detail**: The ID of the line.

**Returns**:

* RGLink | undefined: Returns the link object if found; otherwise returns undefined.

### **getLinkByLine**

Description:  
Gets a Link object by the line object.  
Actually calls this.getLinkByLineId(line.id\!).  
**Parameters**:

* line  
  * **Type**: RGLine  
  * **Detail**: The line object.

**Returns**:

* RGLink | undefined: The corresponding link object.

### **getLines**

Description:  
Gets all normal lines.  
**Parameters**:

* None

**Returns**:

* RGLine\[\]: An array of normal line objects.

### **getFakeLines**

Description:  
Gets all fake lines.  
Fake lines are typically used to connect non-node objects or in special scenarios.  
**Parameters**:

* None

**Returns**:

* RGFakeLine\[\]: An array of fake line objects.

### **getFakeLineById**

Description:  
Gets a fake line object by its ID.  
**Parameters**:

* lineId  
  * **Type**: string  
  * **Detail**: The ID of the fake line.

**Returns**:

* RGFakeLine | undefined: Returns the fake line object if found; otherwise returns undefined.

### **getNodes**

Description:  
Gets all nodes.  
**Parameters**:

* None

**Returns**:

* RGNode\[\]: An array of node objects.

### **getLinks**

Description:  
Gets all link objects.  
Link objects contain the line and references to the nodes at both ends.  
**Parameters**:

* None

**Returns**:

* RGLink\[\]: An array of link objects.

### **getConnectTargets**

Description:  
Gets all connect targets.  
This may include nodes, points on the canvas, or other connectable elements.  
**Parameters**:

* None

**Returns**:

* RGLineTarget\[\]: An array of connect target objects.

### **getElementLineById**

Tag: @deprecated  
Description:  
Deprecated. Please use getFakeLineById instead of getElementLineById. This method is kept for compatibility with older API versions.  
Actually calls this.getFakeLineById(elLineId).  
**Parameters**:

* elLineId  
  * **Type**: string  
  * **Detail**: The ID of the fake line.

### **getElementLines**

Tag: @deprecated  
Description:  
Deprecated. Please use getFakeLines instead of getElementLines. This method is kept for compatibility with older API versions.  
Actually calls this.getFakeLines().  
**Parameters**:

* None