# **RelationGraphWith2Data2Analysis Method Documentation**

This document is organized based on RelationGraphWith2Data2Analysis.ts and types.ts, covering detailed functionality, comment explanations, and parameter type definitions for the class methods.

## **1\. Common Methods**

### **getRelatedLinesByNode**

Description:  
Gets all lines related to the given node (whether as source or target).

* **Example**:  
  A \--\> B  
  A \--\> C  
  D \--\> A  
  getRelatedLinesByNode(A) will return \[A--\>B, A--\>C, D--\>A\]

**Parameters**:

* node  
  * **Type**: RGNode  
  * **Detail**: The target node object.

**Returns**:

* RGLine\[\]: Array of related lines.

### **getLinksBetweenNodes**

Description:  
Gets all links between the given nodes.  
A link is returned only if both its source and target nodes are in the provided nodes array.

* **Example**:  
  A \--\> B  
  A \--\> C  
  B \--\> C  
  D \--\> E  
  getLinksBetweenNodes(\[A,B,C\]) will return \[A--\>B, A--\>C, B--\>C\]

**Parameters**:

* nodes  
  * **Type**: RGNode\[\]  
  * **Detail**: Array of node objects.

**Returns**:

* RGLink\[\]: Array of Link objects satisfying the condition.

### **getLinesBetweenNodes**

Description:  
Gets all lines between the given nodes.  
Functionally same as getLinksBetweenNodes, but returns an array of RGLine.

* **Example**:  
  A \--\> B  
  A \--\> C  
  B \--\> C  
  D \--\> E  
  getLinesBetweenNodes(\[A,B,C\]) will return \[A--\>B, A--\>C, B--\>C\]

**Parameters**:

* nodes  
  * **Type**: RGNode\[\]  
  * **Detail**: Array of node objects.

**Returns**:

* RGLine\[\]: Array of Line objects satisfying the condition.

### **getNodeRelatedNodes**

Description:  
Gets all nodes that have a direct relationship (incoming or outgoing) with the given node.

* **Example**:  
  A \--\> X  
  B \--\> X  
  C \--\> X  
  X \--\> F  
  X \--\> M  
  getNodeRelatedNodes(X) will return \[A,B,C,F,M\]

**Parameters**:

* node  
  * **Type**: RGNode  
  * **Detail**: The target node.

**Returns**:

* RGNode\[\]: Array of related nodes.

### **getNodeIncomingNodes**

Description:  
Gets all nodes that have an incoming relationship to the given node (upstream nodes).

* **Example**:  
  A \--\> X  
  B \--\> X  
  C \--\> X  
  X \--\> F  
  X \--\> M  
  getNodeIncomingNodes(X) will return \[A,B,C\]

**Parameters**:

* node  
  * **Type**: RGNode  
  * **Detail**: The target node.

**Returns**:

* RGNode\[\]: Array of upstream nodes.

### **getNodeOutgoingNodes**

Description:  
Gets all nodes that have an outgoing relationship from the given node (downstream nodes).

* **Example**:  
  A \--\> X  
  B \--\> X  
  C \--\> X  
  X \--\> F  
  X \--\> M  
  getNodeOutgoingNodes(X) will return \[F,M\]

**Parameters**:

* node  
  * **Type**: RGNode  
  * **Detail**: The target node.

**Returns**:

* RGNode\[\]: Array of downstream nodes.

### **findGroupNodes**

Tag: @deprecated  
Description:  
Deprecated. Please use getNetworkNodesByNode instead.  
Gets all nodes that have a direct or indirect relationship with a given node.  
**Parameters**:

* node: RGNode  
* groupNodes: RGNode\[\] (Optional)

### **getGroupNodesByNode**

Tag: @deprecated  
Description:  
Deprecated. Please use getNetworkNodesByNode instead.  
Gets all nodes that have a direct or indirect relationship with a given node.  
**Parameters**:

* node: RGNode  
* groupNodes: RGNode\[\] (Optional)

### **getNetworkNodesByNode**

Description:  
Gets all nodes that have a direct or indirect relationship with a given node (i.e., gets the connected subgraph containing the node).  
**Parameters**:

* node  
  * **Type**: RGNode  
  * **Detail**: The target node.

**Returns**:

* RGNode\[\]: Array of all nodes in the connected subgraph.

### **\_getNetworkNodesByNode**

Modifier: private  
Description:  
Internal recursive implementation of getNetworkNodesByNode.  
Uses depth-first traversal to find all associated nodes.  
**Parameters**:

* node: RGNode  
* networkNodes: RGNode\[\] (Result accumulator for recursion)

### **getStuffSize**

Modifier: protected  
Tag: @deprecated  
Description:  
Deprecated. Please use getNodesRectBox instead of getStuffSize. This method is kept for compatibility with older API versions.  
**Parameters**:

* nodes: (RGNode | RGRectTarget)\[\] (Optional)

### **getNodesViewInfo**

Modifier: protected  
Tag: @deprecated  
Description:  
Deprecated. Please use getNodesRectBox instead of getNodesViewInfo. This method is kept for compatibility with older API versions.  
**Parameters**:

* nodes: (RGNode | RGRectTarget)\[\] (Optional)

### **getNodesRectBox**

Description:  
Calculates the plane space information (bounding box) occupied by all nodes (or a specified set of nodes).  
If nodes is not specified, it is calculated based on all visible nodes in the graph.  
**Parameters**:

* nodes (Optional)  
  * **Type**: (RGNode | RGRectTarget)\[\]  
  * **Detail**: Specified set of nodes to calculate. Defaults to all nodes if not provided.

**Returns**:

* RGNodesRectBox: Object containing width, height, minX, minY, maxX, maxY.

### **getNodesCenter**

Description:  
Gets the center coordinates of the plane space occupied by the node collection.  
Calculates the center point based on the result of getNodesRectBox.  
**Parameters**:

* nodes (Optional)  
  * **Type**: (RGNode | RGRectTarget)\[\]  
  * **Detail**: Specified set of nodes.

**Returns**:

* { x: number, y: number }: Center coordinates.

### **getDescendantNodes**

Description:  
Gets all descendant nodes in the relationship network where the node is located.

* Descendant nodes are completely calculated based on the connection relationship and the root node used by the current layout (for the same node, using different root nodes for layout will result in different descendants).  
* Actually calls RGNodesAnalytic.getDescendantNodes(node).

**Parameters**:

* node  
  * **Type**: RGNode  
  * **Detail**: The target node.

**Returns**:

* RGNode\[\]: Array of all descendant nodes.

### **getNodesInSelectionView**

Description:  
Gets nodes within the selection area.

* This method is generally used in conjunction with the onCanvasSelectionEnd event, where you can obtain information about the selection area through the event's parameters.  
* After obtaining the nodes within this area, you can use the graphInstance.getLinesBetweenNodes(nodesInSelection) method to get the lines between the nodes in the area.

**Parameters**:

* selectionView  
  * **Type**: RGSelectionView  
  * **Detail**: The position and size of the selection area in the view (x, y, width, height).

**Returns**:

* RGNode\[\]: Array of nodes within the selection area.

### **getShouldRenderNodes**

Description:  
Gets the list of nodes to be rendered.

* This method is used internally by relation-graph.  
* Returns passed nodes directly if in performance mode; otherwise retrieves from dataProvider.  
* To get the list of nodes to be rendered outside the component, please use hook: const { shouldRenderNodes } \= useGraphStore();.

**Parameters**:

* nodes (Optional)  
  * **Type**: (RGNode | RGRectTarget)\[\]

**Returns**:

* RGNode\[\]

### **getShouldRenderLines**

Description:  
Gets the list of lines to be rendered.

* This method is used internally by relation-graph.  
* To get the list of lines to be rendered outside the component, please use hook: const { shouldRenderLines } \= useGraphStore();.

**Parameters**:

* lines (Optional)  
  * **Type**: RGLine\[\]

**Returns**:

* RGLine\[\]

### **getShouldRenderFakeLines**

Description:  
Gets the list of fake lines to be rendered.

* This method is used internally by relation-graph.  
* To get the list of fake lines to be rendered outside the component, please use hook: const { shouldRenderFakeLines } \= useGraphStore();.

**Parameters**:

* fakeLines (Optional)  
  * **Type**: RGFakeLine\[\]

**Returns**:

* RGFakeLine\[\]