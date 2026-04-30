import React from 'react';
import {RGJunctionPoint} from "../../../../../../../types";

const RGEditingConnectPoints: React.FC<{
    mouseUpOnJunctionPointWithOffset: (junctionPoint: RGJunctionPoint, event: any) => void;
    mouseUpOnJunctionPoint: (junctionPoint: RGJunctionPoint, event: any) => void;
}> = ({mouseUpOnJunctionPointWithOffset, mouseUpOnJunctionPoint}) => {
  // const graphInstance = useGraphInstance();

  // const onMouseUp = (type: RGJunctionPoint, event: React.MouseEvent) => {
  //   graphInstance.onLineVertexBeDropped(type, event.nativeEvent);
  // };

  return (
    <div
        className="rg-connect-ctl"
        onMouseUp={($event) => mouseUpOnJunctionPoint('', $event)}
        onTouchEnd={($event) => mouseUpOnJunctionPoint('', $event)}
    >
      <div
        className="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-t"
        data-point="top"
        onMouseUp={(event) => mouseUpOnJunctionPoint('top', event)}
        onTouchEnd={(event) => mouseUpOnJunctionPoint('top', event)}
      />
      <div
        className="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-b"
        data-point="bottom"
        onMouseUp={(event) => mouseUpOnJunctionPoint('bottom', event)}
        onTouchEnd={(event) => mouseUpOnJunctionPoint('bottom', event)}
      />
      <div
        className="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-center"
        data-point="border"
        onMouseUp={(event) => mouseUpOnJunctionPoint('border', event)}
        onTouchEnd={(event) => mouseUpOnJunctionPoint('border', event)}
      />
      <div
        className="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-l"
        data-point="left"
        onMouseUp={(event) => mouseUpOnJunctionPoint('left', event)}
        onTouchEnd={(event) => mouseUpOnJunctionPoint('left', event)}
      />
      <div
        className="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-r"
        data-point="right"
        onMouseUp={(event) => mouseUpOnJunctionPoint('right', event)}
        onTouchEnd={(event) => mouseUpOnJunctionPoint('right', event)}
      />
      <div
        className="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-lr"
        data-point="lr"
        onMouseUp={(event) => mouseUpOnJunctionPoint('lr', event)}
        onTouchEnd={(event) => mouseUpOnJunctionPoint('lr', event)}
      />
      <div
        className="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-tb"
        data-point="tb"
        onMouseUp={(event) => mouseUpOnJunctionPoint('tb', event)}
        onTouchEnd={(event) => mouseUpOnJunctionPoint('tb', event)}
      />
    <div className="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-bottom-bar" data-point="bottom" data-innode="true" onMouseUp={($event) => mouseUpOnJunctionPointWithOffset('bottom', $event)} onTouchEnd={($event) => onMouseUpWithOffset('bottom', $event)}></div>
    <div className="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-top-bar" data-point="top" data-innode="true" onMouseUp={($event) => mouseUpOnJunctionPointWithOffset('top', $event)} onTouchEnd={($event) => onMouseUpWithOffset('top', $event)}></div>
    <div className="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-left-bar" data-point="left" data-innode="true" onMouseUp={($event) => mouseUpOnJunctionPointWithOffset('left', $event)} onTouchEnd={($event) => onMouseUpWithOffset('left', $event)}></div>
    <div className="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-right-bar" data-point="right" data-innode="true" onMouseUp={($event) => mouseUpOnJunctionPointWithOffset('right', $event)} onTouchEnd={($event) => onMouseUpWithOffset('right', $event)}></div>

</div>
  );
};

export default RGEditingConnectPoints;
