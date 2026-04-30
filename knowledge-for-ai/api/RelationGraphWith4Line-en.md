# **RelationGraphWith4Line Method Documentation**

This document is organized based on RelationGraphWith4Line.ts and types.ts, covering detailed functionality, comment explanations, and parameter type definitions for the class methods.

## **1\. Common Methods**

### **createLineDrawInfo**

Description:
Generates line drawing information based on line information.

* This method is generally used internally by components, but can also be called for external custom rendering of lines to obtain line drawing information.
* If link is provided, it uses information from the link; otherwise, it attempts to retrieve start and end targets from line (usually for fake lines).

**Parameters**:

* link
  * **Type**: RGLink | RGElementLine
  * **Detail**: The connection line object that contains the starting and ending point object information.
* line
  * **Type**: RGLine
  * **Detail**: The line object.

**Returns**:

* RGLinePathInfo | undefined: Returns the line drawing information object, or undefined if configuration is invalid.

### **generateLinePath**

Description:
Generates line path data.

* This method is generally used internally by components, but can also be called for external custom rendering of lines to obtain line drawing information.
* This method handles exceptions; if an error occurs during generation (e.g., invalid coordinates), it returns a line path object containing error information.

**Parameters**:

* generateConfig
  * **Type**: RGGenerateLineConfig
  * **Detail**: Data configuration for generating line paths. Includes line, from, to, totalLinesBetweenNodes, currentLineIndex, etc.

**Returns**:

* RGLinePathInfo: Returns the line path information object.

### **getArrowMarkerId**

Description:
Gets the arrow marker ID based on the line information, used to set the SVG marker-start or marker-end attribute value.

* Returns result based on whether the line shows arrows, is reversed (isReverse), and if a custom markerId is set.

**Parameters**:

* line
  * **Type**: RGLine
  * **Detail**: The line object.
* isStartArrow (Default: false)
  * **Type**: boolean
  * **Detail**: Whether it is the start arrow. Default is false, indicating the end arrow.

**Returns**:

* string | undefined: Returns the arrow marker ID string (e.g., url('\#xxx')), or undefined if the arrow is not displayed.

### **generateLineTextStyle**

Description:
Generates text style information on the line, including position, alignment, rotation, and other CSS styles.

* If the text length exceeds the configured maximum length, it truncates and adds an ellipsis.
* Calculates transform and transformOrigin based on line shape (e.g., straight line) and user configuration.

**Parameters**:

* lineConfig
  * **Type**: RGGenerateLineConfig
  * **Detail**: Configuration parameters used when generating the line.
* linePathInfo
  * **Type**: RGLinePathInfo
  * **Detail**: Line path information, including path data, text position, etc.

**Returns**:

* { text: string, cssStyles: { transform: string, transformOrigin: string } }: Returns an object containing text content and CSS styles.

### **generateLineTextStyle4TextOnPath**

Description:
Generates text style information for textPath on the line, including position, alignment, rotation, and other CSS styles.

* Applicable for lines with useTextOnPath enabled, allowing text to be arranged along the path.

**Parameters**:

* lineConfig
  * **Type**: RGGenerateLineConfig
  * **Detail**: Configuration parameters used when generating the line.

**Returns**:

* { text: string, textOffset: string, textAnchor: string, onPathStartOffset: string, textRotate: number } | null: Returns an object containing text content and textPath related styles.

### **createLinePath**

Tag: @deprecated
Description:
Deprecated. Please use createLineDrawInfo() instead.
Calling this method will throw an error.
**Parameters**:

* link: RGLink | RGElementLine
* line: RGLine
* ri: number

## **2\. Internal Methods**

### **\_getJunctionPoint**

Modifier: private
Description:
Gets the specific coordinate position of the junction point according to the junction point style.
Calls utility methods in RGGraphMath to calculate coordinates for different positions (border, left, right, top, bottom, etc.).
**Parameters**:

* junctionPointStyle
  * **Type**: RGJunctionPoint
  * **Detail**: Junction point position definition.
* createJunctionPointParams
  * **Type**: CreateJunctionPointParams
  * **Detail**: Parameters required to create junction points.

### **throwLineError**

Modifier: private
Tag: @inner
Description:
Helper method to throw line generation errors.
Returns an object containing error code and coordinates.
**Parameters**:

* errorCode: string
* x: number
* y: number

### **createErrorLineValue**

Modifier: private
Tag: @inner
Description:
Creates a line path info object representing an error.
When line generation fails, generates a simple straight line pointing to the error coordinates for debugging visualization.
**Parameters**:

* errorCode: string
* x: number
* y: number

**Returns**:

* RGLinePathInfo

### **withLineJunctionPoints**

Modifier: private
Tag: @inner
Description:
Calculates the start/end junction point coordinates and related parameters for the line.

* Handles node coordinate checking, junction offset, multi-line distance calculation, etc.
* Determines the line shape, direction, and specific coordinates for start (fx, fy) and end (tx, ty).

**Parameters**:

* config
  * **Type**: RGGenerateLineConfig

**Returns**:

* RGGenerateLinePrams: Object containing detailed coordinates and parameters for line generation.

### **createLinePathData**

Modifier: private
Tag: @inner
Description:
Generates SVG path data by calling specific path generators based on calculated parameters.
Dispatches to different generator functions (e.g., generateLineForCurve, generateLineFor44) based on lineShape.
**Parameters**:

* linePathGenerateParmas
  * **Type**: RGGenerateLinePrams

**Returns**:

* RGLinePathInfo

### **getLineArrow**

Modifier: private
Tag: @inner
Description:
Gets the default line arrow ID.
**Parameters**:

* \_color: string | undefined
* isStartArrow: boolean (Default false)
* checked: boolean (Default false)

### **getTextTransform**

Tag: @deprecated, @inner
Description:
Deprecated. Will be removed in future versions.
Gets the transform attribute string for text.
**Parameters**:

* line: RGLine
* textPosition: RGLineTextPosition
