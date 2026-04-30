# **RelationGraphWith6Layout Method Documentation**

This document is organized based on RelationGraphWith6Layout.ts and types.ts, covering detailed functionality, comment explanations, and parameter type definitions for the class methods.

## **1\. Common Methods**

### **doLayout**

Description:  
Assigns positions to the nodes in the current graph based on the layout configuration set in the options.

* By default, the first node in the graph is used as the root node for layout. You can also specify a custom root node by passing a node object or node ID as a parameter.  
* If nodes were added to the graph shortly before calling this method, it will wait for a short time (up to 300ms) to ensure that the addition of nodes is completed before performing the layout.  
* This is an asynchronous method.

**Parameters**:

* customRootNode (Optional)  
  * **Type**: RGNode | string  
  * **Detail**: Specifies a custom root node for layout; can be a node object or a node ID.

**Returns**:

* Promise\<void\>

### **toggleAutoLayout**

Description:  
If the current layout is a force-directed layout, calling this method can start or stop the real-time force-directed calculation.

* **Note**: The center layout inherits from the force layout and also supports auto layout functionality.

**Parameters**:

* None

### **startAutoLayout**

Description:  
If the current layout is a force-directed layout, calling this method can start the force-directed calculation.

* **Note**: The center layout inherits from the force layout and also supports auto layout functionality.

**Parameters**:

* None

### **stopAutoLayout**

Description:  
If the current layout is a force-directed layout, calling this method can stop the force-directed calculation.  
**Parameters**:

* None

### **createLayout**

Description:  
Creates a layout instance. After creating the layout instance, you can use the placeNodes method of the layout instance to layout nodes.

* Through this method, you can create multiple layout instances with different configurations to layout different parts of the same graph in different ways, forming a composite layout effect.  
* **Example**:  
  const layoutor \= graphInstance.createLayout({  
      layoutName: 'tree',  
      from: 'left',  
      treeNodeGapH: 200,  
      treeNodeGapV: 50,  
  });  
  layoutor.placeNodes(nodes, rootNode);

**Parameters**:

* layoutOptions  
  * **Type**: RGLayoutOptions  
  * **Detail**: Layout configuration items.  
* isMainLayout (Default: false)  
  * **Type**: boolean  
  * **Detail**: Whether it is the main layout instance.  
    * The main layout instance will affect the layout-related configuration items of the graph.  
    * The main layout instance can control the auto layout function through the startAutoLayout and stopAutoLayout methods of the graph.

**Returns**:

* Layout: A layout instance with a placeNodes method (e.g., RGTreeLayout, RGForceLayout, etc.).

## **2\. Internal Methods**

### **\_doLayout**

Modifier: private  
Tag: @inner  
Description:  
Internal method: Executes the specific layout logic.

* Updates node visibility properties.  
* Determines the root node.  
* Creates a layoutor and executes the layout.  
* If it is a force layout, binds the onFinish event.  
* If it is a static layout, after handling the main group nodes layout, calls placeOtherNodes to handle other non-main group nodes.  
* Finally, updates the coordinates of all nodes to the data provider and updates element lines.

**Parameters**:

* customRootNode (Optional)  
  * **Type**: RGNode | string

### **refresh**

Modifier: protected  
Tag: @inner  
Description:  
Refreshes the view.

* Resets the view size (resetViewSize).  
* If the doLayout parameter is true, re-executes the layout.  
* Updates element line positions.

**Parameters**:

* doLayout (Default: true)  
  * **Type**: boolean  
  * **Detail**: Whether to re-execute the layout.

### **placeOtherNodes**

Modifier: private  
Tag: @inner  
Description:  
Internal method: Handles the layout of non-main group nodes.

* If placeOtherGroup: true is configured, this method organizes and places nodes that do not belong to the main connected subgraph (isolated nodes or independent sub-networks) to prevent them from overlapping.  
* Divides nodes into "disconnected sub-networks" and "single isolated nodes", calls placeNextNetwork and placeSingleNodes respectively, and finally calls sortGroups to organize the positions of all groups.

**Parameters**:

* mainGroupNodes (Default: \[\])  
  * **Type**: RGNode\[\]  
  * **Detail**: List of nodes already processed in the main layout.

### **placeSingleNodes**

Modifier: private  
Tag: @inner  
Description:  
Internal method: Arranges single isolated nodes in a grid.  
**Parameters**:

* singleNodes  
  * **Type**: RGNode\[\]

### **sortGroups**

Modifier: private  
Tag: @inner  
Description:  
Internal method: Arranges all layout groups (main network, disconnected sub-networks, isolated node groups) in a grid to prevent overlapping.  
**Parameters**:

* groupList  
  * **Type**: {nodes: RGNode\[\]}\[\]

### **placeNextNetwork**

Modifier: private  
Tag: @inner  
Description:  
Internal method: Recursively handles disconnected connected subgraphs.

* For unplaced nodes, finds a new root node and builds a subgraph.  
* Uses the same layout algorithm as the main layout (but if it's a force layout, limits iteration count to 0 for static placement) to layout the subgraph.

**Parameters**:

* notPlacedNodes: RGNode\[\] (Nodes not yet laid out)  
* placedNodes: RGNode\[\] (Nodes already laid out, used for deduplication)  
* groupList: {nodes: RGNode\[\]}\[\] (Used to collect layout node groups)