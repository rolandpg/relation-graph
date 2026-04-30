# **RelationGraphWith93Image Method Documentation**

This document is organized based on RelationGraphWith93Image.ts and types.ts, covering detailed functionality, comment explanations, and parameter type definitions for the class methods.

## **1\. Internal Methods**

### **setWatermarkDom**

Tag: @inner  
Description:  
Sets the watermark DOM element.

* Automatically called when using the \<RGWatermark\> component to set the watermark.  
* **Note**: This is an internal method, please do not use it externally.

**Parameters**:

* watermarkDom  
  * **Type**: HTMLDivElement | null  
  * **Detail**: The DOM element of the watermark.  
* forImage (Default: true)  
  * **Type**: boolean  
  * **Detail**: Whether it is used for image generation.  
* forDisplay (Default: false)  
  * **Type**: boolean  
  * **Detail**: Whether it is used for display on screen.  
* position (Default: 'br')  
  * **Type**: string  
  * **Detail**: Watermark position (e.g., 'br' for bottom-right).

### **setBackgroundDom**

Tag: @inner  
Description:  
Sets the background DOM element.

* Automatically called when using the \<RGBackground\> component to set the background.  
* If null is passed, restores the original background color and clears the background DOM.  
* If a DOM element is passed, sets the canvas background color to transparent to display the background DOM.  
* **Note**: This is an internal method, please do not use it externally.

**Parameters**:

* backgroundDom  
  * **Type**: HTMLDivElement | null  
  * **Detail**: The DOM element of the background.  
* forImage (Default: true)  
  * **Type**: boolean  
  * **Detail**: Whether it is used for image generation.  
* forDisplay (Default: true)  
  * **Type**: boolean  
  * **Detail**: Whether it is used for display on screen.

### **prepareForImageGeneration**

Description:  
Switches to a state suitable for image generation.

* Makes relation-graph enter a state suitable for generating images (e.g., adjusting canvas size, position, hiding unnecessary UI elements, etc.).  
* **Note**: This is an asynchronous method.  
* (Currently marked as todo in the code).

**Parameters**:

* None

**Returns**:

* Promise\<HTMLElement\>: Returns the DOM element used to generate the image (usually $canvasDom).

### **restoreAfterImageGeneration**

Description:  
Restores relation-graph to the previous state after image generation.

* (Currently marked as todo in the code).

**Parameters**:

* None

**Returns**:

* Promise\<void\>