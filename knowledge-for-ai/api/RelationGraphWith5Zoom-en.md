# **RelationGraphWith5Zoom Method Documentation**

This document is organized based on RelationGraphWith5Zoom.ts and types.ts, covering detailed functionality, comment explanations, and parameter type definitions for the class methods.

## **1\. Common Methods**

### **zoom**

Description:  
Zooms based on the current zoom level.

* This method triggers the beforeZoomStart event; if the event handler returns true, the zoom operation is aborted.  
* Checks if the zoom level exceeds the limits of minCanvasZoom and maxCanvasZoom.  
* Calculates the canvas offset after zooming to ensure the zoom is centered around userZoomCenter.  
* Triggers the onZoomEnd event after zooming is complete.  
* Calls \_performanceModeLogicHook to handle logic under performance mode (e.g., automatically switching EasyView).

**Parameters**:

* buff  
  * **Type**: number  
  * **Detail**: The additional zoom level to be added based on the current zoom level. A positive number indicates zooming in, and a negative number indicates zooming out, in percentage. For example: 10 means zoom in by 10%, \-10 means zoom out by 10%.  
* userZoomCenter (Optional)  
  * **Type**: RGClientXy (RGCoordinate)  
  * **Detail**: User zoom center point coordinates, default is the center point of the view.  
* e (Optional)  
  * **Type**: WheelEvent  
  * **Detail**: Mouse wheel event object.

### **setZoom**

Description:  
Sets the canvas zoom to the specified zoom level.  
This method works by calculating the difference between the target zoom level and the current level, and then internally calling the zoom method.  
**Parameters**:

* finalZoom  
  * **Type**: number  
  * **Detail**: Target zoom level, expressed as a percentage, for example: 100 means 100%.  
* userZoomCenter (Optional)  
  * **Type**: RGClientXy  
  * **Detail**: User zoom center point coordinates, default is the center point of the view.

## **2\. Internal Methods**

### **\_performanceModeLogicHook**

Modifier: protected  
Tag: @inner  
Description:  
Performance mode logic hook.  
Called during the zoom process to dynamically adjust display strategies based on changes in zoom level to optimize performance.

* When the zoom level changes from ≤40% to \>40% (zooming in), if performance mode is enabled, it recalculates render data, disables EasyView, and updates element lines.  
* When the zoom level changes from \>40% to ≤40% (zooming out), if performance mode is enabled, it enables EasyView to reduce rendering details and improve performance.

**Parameters**:

* oldZoomValue  
  * **Type**: number  
  * **Detail**: The zoom level before the change.  
* newZoomValue  
  * **Type**: number  
  * **Detail**: The zoom level after the change.