# **RelationGraphWith95Dom Method Documentation**

This document is organized based on RelationGraphWith95Dom.ts and types.ts, covering detailed functionality, comment explanations, and parameter type definitions for the class methods.

## **1\. Internal Methods**

### **setDom**

Description:  
\[Used internally by relation-graph\] This method is called after the RelationGraph component is mounted to facilitate DOM operations in the JS instance object (it only obtains visual information of the DOM and monitors changes in size and position).  
**Parameters**:

* relationGraphDom  
  * **Type**: HTMLDivElement  
  * **Detail**: The RelationGraph container DOM element.

### **setCanvasDom**

Description:  
\[Used internally by relation-graph\] This method is called after the RelationGraph component's canvas element is mounted to facilitate DOM operations in the JS instance object.

* Initializes MutationObserver listeners.  
* Retrieves and caches DOM references for line text containers.

**Parameters**:

* canvasDom  
  * **Type**: HTMLDivElement  
  * **Detail**: The canvas DOM element.

### **getResizeObserver**

Modifier: private  
Tag: @inner  
Description:  
Gets or creates the ResizeObserver instance.

* Uses a singleton pattern to manage resizeObserver.  
* The observer callback iterates through all observed entries, attempts to retrieve the corresponding handler from resizeListenerMap, and executes it.  
* If no specific handler exists, it defaults to calling \_onNodeDomResize to handle node DOM size changes.

**Parameters**:

* None

**Returns**:

* ResizeObserver: The ResizeObserver instance.

### **initDom**

Modifier: protected  
Tag: @inner  
Description:  
Initializes DOM-related listeners.

* Adds a size change listener to the main container ($dom):  
  * Resets view size, updates EasyView, updates connect target positions, and updates editing controller position when the container size changes.  
  * Triggers the onViewResize event.  
* Adds keyboard event listeners if not acting as a connect area (\_rgAsConnectArea).

**Parameters**:

* None

### **reinitMutationObservers**

Modifier: private  
Tag: @inner  
Description:  
Re-initializes MutationObservers.

* Destroys old observers first.  
* Observes the node container (.rg-nodes-container-wrapper) and updates node connection points when the DOM changes.  
* Observes canvas slots (behind and above) and updates connection points on slots when their content changes.

**Parameters**:

* None

### **destroyMutationObserver**

Modifier: protected  
Tag: @inner  
Description:  
Destroys all MutationObserver instances, stopping DOM change monitoring.  
**Parameters**:

* None

### **addKeyboardListener**

Modifier: protected  
Tag: @inner  
Description:  
Adds keyboard event listeners (keydown, keyup).

* Handles Space key: Toggles canvas move mode when Space is pressed.  
* Triggers onKeyboardDown and onKeyboardUp events.

**Parameters**:

* None

### **removeKeyboardListener**

Modifier: protected  
Tag: @inner  
Description:  
Removes keyboard event listeners.  
**Parameters**:

* None

### **addResizeListener**

Modifier: protected  
Tag: @inner  
Description:  
Uses ResizeObserver to monitor size changes of a specified DOM element.  
**Parameters**:

* dom  
  * **Type**: HTMLElement  
  * **Detail**: The DOM element to observe.  
* callback  
  * **Type**: (width: number, height: number) \=\> void  
  * **Detail**: Callback function when size changes.

### **\_onNodeDomResize**

Modifier: private  
Tag: @inner  
Description:  
Entry point for node DOM resize event handling.

* Finds the corresponding node ID in domToNodeIdMap based on the DOM element.  
* Calls \_onNodeResize.

**Parameters**:

* dom: Element  
* width: number  
* height: number

### **\_onNodeResize**

Modifier: private  
Tag: @inner  
Description:  
Specific logic for handling node size changes.

* Updates connection point positions on the node.  
* Updates the node's offset size (updateNodeOffsetSize).

**Parameters**:

* dom: Element  
* nodeId: string  
* width: number  
* height: number

### **addNodeResizeListener**

Tag: @inner  
Description:  
\[Used internally by relation-graph\] Called when the Node component is mounted to monitor changes in the size of the Node's DOM element.

* Records the mapping between the DOM and Node ID.  
* Immediately triggers \_onNodeResize once to initialize the size.  
* Starts observing the DOM element.

**Parameters**:

* dom  
  * **Type**: HTMLElement  
  * **Detail**: The DOM element corresponding to the Node component.  
* node  
  * **Type**: RGNode  
  * **Detail**: The JS data object of the Node.

### **removeNodeResizeListener**

Tag: @inner  
Description:  
\[Used internally by relation-graph\] Called when the Node component is destroyed to remove monitoring of the corresponding DOM element of the Node.

* Deletes the mapping relationship.  
* Stops observing the DOM element.

**Parameters**:

* dom  
  * **Type**: HTMLElement

### **removeResizeListener**

Modifier: protected  
Description:  
Removes size change monitoring for the specified DOM element.  
**Parameters**:

* dom  
  * **Type**: HTMLElement

### **destroyResizeObserver**

Modifier: protected  
Tag: @inner  
Description:  
Disconnects the ResizeObserver, stopping all size monitoring.  
**Parameters**:

* None