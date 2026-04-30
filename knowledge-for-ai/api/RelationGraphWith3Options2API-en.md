# **RelationGraphWith3Options2API Method Documentation**

This document is organized based on RelationGraphWith3Options2API.ts and types.ts, covering detailed functionality, comment explanations, and parameter type definitions for the class methods.

## **1\. Internal Methods**

### **getCreatingLine**

Tag: @inner  
Description:  
Gets the currently creating line information through data options.

* **Note**: This method is only for Hook (useCreatingLine) usage.  
* Usage Example:  
  import { RGHooks } from 'relation-graph-react';  
  const creatingLine \= RGHooks.useCreatingLine(graphInstance);

**Parameters**:

* options (Optional)  
  * **Type**: RGOptionsFull  
  * **Detail**: Global configuration options object. If not provided, it will automatically retrieve the current instance's options.

**Returns**:

* An object containing the line creation state:  
  {  
      creating: boolean,          // Whether a line is being created  
      fromTarget?: RGLineTarget,  // Starting target  
      toTarget?: RGLineTarget,    // Ending target  
      lineJson?: JsonLine         // Line data  
  }

### **getCreatingNode**

Tag: @inner  
Description:  
Gets the currently creating node information through data options.

* **Note**: This method is only for Hook (useCreatingNode) usage.  
* Usage Example:  
  import { RGHooks } from 'relation-graph-react';  
  const creatingNode \= RGHooks.useCreatingNode();

**Parameters**:

* options (Optional)  
  * **Type**: RGOptionsFull  
  * **Detail**: Global configuration options object. If not provided, it will automatically retrieve the current instance's options.

**Returns**:

* An object containing the node creation state:  
  {  
      creating: boolean,      // Whether a node is being created  
      nodeJson?: JsonNode     // Node data template  
  }  
