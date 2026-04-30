# **RelationGraphWith2Data4ConnectTarget Method Documentation**

This document is organized based on RelationGraphWith2Data4ConnectTarget.ts and types.ts, covering detailed functionality, comment explanations, and parameter type definitions for the class methods.

## **1\. Common Methods**

### **updateConnectTargetsByNodeId**

Description:
Updates the positions of all Connect Targets on the specified node.

* In general, relation-graph automatically updates the positions of connection points.
* This method is only used for manual calls in some special scenarios.
* It is provided for external calls to update the connection point positions of the specified node and is not suitable for high-frequency calls.

**Parameters**:

* nodeId
  * **Type**: string
  * **Detail**: The ID of the target node.

## **2\. Internal Methods**

### **updateConnectTargetsOnCanvas**

Modifier: protected
Description:
Updates the positions of Connect Targets on the Canvas Slot.

* In general, relation-graph automatically updates the positions of connection points.
* This method is only used for manual calls in some special scenarios.
* It is provided for external calls to update the connection point positions of the specified canvas slot and is not suitable for high-frequency calls.

**Parameters**:

* by
  * **Type**: string
  * **Detail**: Source identifier (for debug logging).
* canvasSlotDom
  * **Type**: Element
  * **Detail**: The DOM element of the canvas slot.

### **getNodeElByNodeId**

Modifier: private
Tag: @inner
Description:
Gets the corresponding DOM element based on the node ID.
**Parameters**:

* nodeId
  * **Type**: string

### **updateConnectTargetsOnNode**

Modifier: protected
Tag: @inner
Description:
Updates all Connect Target positions on the specified node DOM.
**Parameters**:

* by: string
* nodeId: string
* nodeEl: HTMLDivElement

### **updateConnectTargetList**

Modifier: protected
Tag: @inner
Description:
Updates the positions of a list of Connect Targets.
Iterates through the list, finds the corresponding DOM elements, and requests offset updates.
**Parameters**:

* by: string
* relativeNodeEl: Element (The relative parent container element)
* connectTargetList: RGConnectTargetData\[\]

### **\_requestUpdateConnectTargetOffset**

Modifier: private
Tag: @inner
Description:
Requests an update for the Connect Target offset.
Uses a debounce mechanism (setTimeout) to avoid frequent updates.
**Parameters**:

* by: string
* connectTarget: RGConnectTargetData
* connectTargetEl: Element
* relativeEl: Element
* scale: number

### **\_updateAllRequestedConnectTargetOffsets**

Modifier: private
Tag: @inner
Description:
Executes all requested Connect Target offset updates.
Batch processes update requests in \_connectTargetUpdateRequestedSet.
**Parameters**:

* None

### **\_updateConnectTargetOffset**

Modifier: private
Tag: @inner
Description:
Calculates and updates the offset of a single Connect Target.
Compares the new calculated position with the old position and updates data if changed.
**Parameters**:

* by: string
* connectTarget: RGConnectTargetData
* connectTargetEl: Element
* relativeEl: Element
* scale: number

### **\_onConnectTargetMounted**

Modifier: private
Tag: @inner
Description:
Triggered when the Connect Target DOM is mounted.
Immediately requests a position update.
**Parameters**:

* by: string
* connectTarget: RGConnectTargetData
* connectTargetEl: HTMLDivElement
* relativeNodeOrCanvasDom: HTMLDivElement

### **getNodeElByChildrenTarget**

Modifier: private
Tag: @inner
Description:
Finds the parent node DOM element based on the Connect Target element.
**Parameters**:

* connectTargetEl: HTMLDivElement

### **registerConnectTarget**

Tag: @inner
Description:
Registers a new Connect Target.

* If the Connect Target already exists, it reuses and updates it.
* Adds it to nodeConnectTargetsMap or canvasConnectTargetsMap depending on its location (inside a node or on the canvas).

**Parameters**:

* connectTargetEl
  * **Type**: HTMLDivElement
  * **Detail**: The DOM element of the Connect Target.
* targetId
  * **Type**: string
  * **Detail**: The ID of the target.
* targetType
  * **Type**: string
  * **Detail**: The type of the target (e.g., NodePoint or CanvasPoint).
* junctionPoint
  * **Type**: RGJunctionPoint
  * **Detail**: The junction point direction.
* targetData (Optional)
  * **Type**: Record\<string, any\>
  * **Detail**: Additional data.

### **\_addConnectTargetToNodeMap**

Modifier: private
Tag: @inner
Description:
Adds the Connect Target to the node's map.
**Parameters**:

* nodeId: string
* connectTarget: RGConnectTargetData
* connectTargetEl: HTMLDivElement
* nodeEl: HTMLDivElement

### **\_addConnectTargetToCanvasMap**

Modifier: private
Tag: @inner
Description:
Adds the Connect Target to the canvas's map.
**Parameters**:

* connectTarget: RGConnectTargetData
* connectTargetEl: HTMLDivElement

### **unregisterConnectTarget**

Tag: @inner
Description:
Unregisters a Connect Target.
Removes the Connect Target from maps and the data provider.
**Parameters**:

* targetId
  * **Type**: string

### **reuseConnectTarget**

Modifier: private
Tag: @inner
Description:
Reuses data from a removed Connect Target.
If a Connect Target with this ID was previously removed, restores its previous coordinates and size information.
**Parameters**:

* connectTarget: RGConnectTargetData
