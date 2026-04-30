# **RelationGraphBase Method Documentation**

This document is organized based on RelationGraphBase.ts and types.ts, covering detailed functionality, comment explanations, and parameter type definitions for the class methods.

## **1\. Common Methods**

### **generateNewUUID**

Description:  
Generates a highly likely unique ID. The probability of non-duplication depends on the parameter idLength.  
**Parameters**:

* idLength (Default: 5\)  
  * **Type**: number  
  * **Detail**: The length of the ID. Defaults to 5\.

### **enableDebugLog**

Description:  
Enables or disables logging functionality. This method updates the options.debug configuration and sets window.relationGraphDebug to the corresponding state.  
**Parameters**:

* enable  
  * **Type**: boolean  
  * **Detail**: true to enable debug logs, false to disable.

### **\_dataUpdated**

Modifier: protected  
Description:  
Requests a view update.  
Used to update canvas drawing; subsequent canvas drawings will be upgraded to use WebGL to improve performance.  
**Parameters**:

* None

### **\_doSomethingAfterDataUpdated**

Modifier: private  
Description:  
Triggers view update for React/Svelte/Canvas.  
This method handles logic after data updates:

1. Checks if reactive data is used to auto-update the view or if performance mode is active.  
2. If so, records time, calls updateShouldRenderGraphData (implemented by subclass) and updateEasyView (implemented by subclass).  
3. If dataProvider is defined, calls its dataUpdated method.  
4. If not in performance mode, calls updateMiniView.  
5. Includes error handling (try-catch) and state reset (finally sets \_dataUpdatedRequested to false).

**Parameters**:

* None

### **addEventHandler**

Description:  
Registers an event handler. Adds the new handler to the eventHandlers array (if it doesn't already exist).  
**Parameters**:

* handler  
  * **Type**: RGEventHandler  
  * **Type Definition**: (eventName: RGEventNames, ...args: any\[\]) \=\> void | any  
  * **Detail**: A function that receives an event name eventName and variable arguments args.

### **removeEventHandler**

Description:  
Removes an event handler. Deletes the specified handler from the eventHandlers array.  
**Parameters**:

* handler  
  * **Type**: RGEventHandler  
  * **Type Definition**: (eventName: RGEventNames, ...args: any\[\]) \=\> void | any  
  * **Detail**: The event handler function to be removed.

### **setEventEmitHook**

Description:  
Sets the event emit hook.

* **Note**: Only applicable for Vue2 and Vue3 versions.

**Parameters**:

* emitHook  
  * **Type**: RGEventEmitHook  
  * **Type Definition**: (eventName: RGEventNames, ...args: any\[\]) \=\> void | any  
  * **Detail**: A hook function triggered during event emission, used to intercept or handle events.

### **emitEvent**

Modifier: protected  
Description:  
Triggers an event.  
This method executes in order:

1. defaultEventHandler (Default event handling).  
2. All custom handlers in the eventHandlers queue.  
3. \_emitHook (if exists and the event is not marked as handled).

**Parameters**:

* eventName  
  * **Type**: RGEventNames  
  * **Type Definition**: Enum string containing all supported event names like 'onNodeClick', 'onNodeDragStart', 'onReady', etc.  
  * **Detail**: The name of the event to trigger.  
* ...args  
  * **Type**: any\[\]  
  * **Detail**: List of arguments passed to the event handler (e.g., node objects, coordinates, event objects).

### **defaultEventHandler**

Modifier: protected  
Description:  
Protected method used to trigger default event handlers (i.e., triggering props events set in JSX/templates).  
It contains a large if-else logic block that dispatches to the corresponding callback functions in this.listeners based on eventName and parses arguments.  
**Supported events include but are not limited to**:

* onReady: Graph is ready.  
* onNodeDragStart, onNodeDragging, onNodeDragEnd: Node drag related.  
* onCanvasDragStart, onCanvasDragging, onCanvasDragEnd: Canvas drag related.  
* onNodeClick, onLineClick, onCanvasClick: Click events.  
* onNodeExpand, onNodeCollapse: Node expansion/collapse.  
* onContextmenu: Context menu (Right-click).  
* onFullscreen: Fullscreen toggle.  
* beforeAddNodes, beforeAddLines: Hooks before adding data.  
* onLineBeCreated: Connection line creation completed.

**Parameters**:

* eventName  
  * **Type**: RGEventNames  
  * **Detail**: The name of the event.  
* ...args  
  * **Type**: any\[\]  
  * **Detail**: List of arguments corresponding to the event. For example, for onNodeDragging, arguments include node, x, y, buff\_x, buff\_y, e.

## **2\. Internal Methods (@inner Methods)**

### **\_requestDataUpdate**

Modifier: protected  
Tag: @inner  
Description:  
Requests to trigger a view update.

* Uses requestAnimationFrame to schedule the update, avoiding duplicate triggers within the same frame.  
* If an update has already been requested (\_dataUpdatedRequested is true), it returns immediately.

**Parameters**:

* None

### **setEventListener**

Tag: @inner  
Description:  
Sets event listeners.  
Merges the passed handler object into this.listeners.  
**Parameters**:

* handler  
  * **Type**: RGListeners  
  * **Type Definition**: An object interface containing various optional callback functions.  
  * **Detail**:  
    {  
        onReady?: (graphInstance: RelationGraphInstance) \=\> void;  
        onNodeClick?: (node: RGNode, e: RGUserEvent) \=\> boolean | void;  
        onLineClick?: (line: RGLine, link: RGLink, e: RGUserEvent) \=\> boolean | void;  
        // ... and callbacks for other RGEventNames  
    }  
