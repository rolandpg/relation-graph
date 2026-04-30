# **RelationGraphWith2Data Method Documentation**

This document is organized based on RelationGraphWith2Data.ts and types.ts, covering detailed functionality, comment explanations, and parameter type definitions for the class methods.

## **1\. Common Methods**

### **generateNewNodeId**

Description:  
Generates a unique Node ID relative to the current existing nodes.  
This method generates a random ID and checks if a node with that ID already exists in the graph. If it does, it recursively calls itself with an increased ID length until a unique ID is found.  
**Parameters**:

* idLength (Default: 5\)  
  * **Type**: number  
  * **Detail**: The minimum length of the ID. Defaults to 5\.

**Returns**:

* string: A unique node ID.

## **2\. Internal Methods (@inner Methods)**

### **setReactiveData4Vue2**

Tag: @inner  
Description:  
\[Used internally by relation-graph\] Sets reactive data objects for Vue2.  
Initializes RGDataProvider4Vue2 and sets useReactiveDataToAutoUpdateView to true.  
**Parameters**:

* graphData  
  * **Type**: RGGraphData  
  * **Detail**: The basic graph data object containing nodes, lines, etc.  
* reactiveOptions  
  * **Type**: RGOptions  
  * **Detail**: The reactive configuration options object.  
* runtimeData  
  * **Type**: any  
  * **Detail**: Runtime data object.  
* initRawPropertyFn  
  * **Type**: (item: any, propertyName: string, initialValue: any) \=\> void  
  * **Detail**: Callback function used to initialize raw properties.

### **setReactiveData4Vue3**

Tag: @inner  
Description:  
\[Used internally by relation-graph\] Sets reactive data objects for Vue3.  
Initializes RGDataProvider4Vue3 and sets up dataStores for state management in Vue3 environment.  
**Parameters**:

* dataStores  
  * **Type**: ReactiveDataStores  
  * **Detail**: Object containing reactive data stores like store4Options, store4ShouldRenderNodes, etc.  
* graphData  
  * **Type**: RGGraphData  
  * **Detail**: Basic graph data.  
* reactiveOptions  
  * **Type**: RGOptions  
  * **Detail**: Reactive configuration options.  
* runtimeData  
  * **Type**: any  
  * **Detail**: Runtime data.  
* initRawPropertyFn  
  * **Type**: (item: any, propertyName: string, initialValue: any) \=\> void  
  * **Detail**: Callback to initialize properties.

### **setReactiveData4React**

Tag: @inner  
Description:  
\[Used internally by relation-graph\] Sets reactive data objects for React.  
Initializes RGDataProvider4React and configures React-specific update hooks.  
**Parameters**:

* dataStores  
  * **Type**: ReactiveDataStores  
  * **Detail**: Reactive data store object.  
* updateViewHook  
  * **Type**: () \=\> void  
  * **Detail**: Callback function used to trigger React view updates.

### **setReactiveData4Svelte**

Tag: @inner  
Description:  
\[Used internally by relation-graph\] Sets reactive data objects for Svelte.  
Initializes RGDataProvider4Svelte and configures Svelte data updaters.  
**Parameters**:

* dataStores  
  * **Type**: ReactiveDataStores  
  * **Detail**: Reactive data store object.  
* updaters  
  * **Type**: ReactiveDataUpdaters  
  * **Detail**: Object containing functions like updateStore4Options used to update Svelte stores.