import React from 'react';
import {useGraphInstance} from "../hooks/useGraphInstance";
import {useGraphStore} from "../hooks/useGraphStore";

const RGGraphRefs: React.FC<{forElementLines?: boolean}> = ({forElementLines}) => {
  const {options} = useGraphStore();
  return (
    <defs>
      <marker
        id={`${options.instanceId  }-arrow-default`}
        markerWidth={options.defaultLineMarker!.markerWidth}
        markerHeight={options.defaultLineMarker!.markerHeight}
        refX={options.defaultLineMarker!.refX}
        refY={options.defaultLineMarker!.refY}
        markerUnits="userSpaceOnUse"
        orient="auto"
        viewBox={options.defaultLineMarker!.viewBox}
      >
        <path
            style={{fill: 'context-stroke'}}
          d={options.defaultLineMarker!.data}
        />
      </marker>
      <marker
        id={`${options.instanceId  }-start-arrow-default`}
        markerWidth={options.defaultLineMarker!.markerWidth}
        markerHeight={options.defaultLineMarker!.markerHeight}
        refX={options.defaultLineMarker!.refX}
        refY={options.defaultLineMarker!.refY}
        markerUnits="userSpaceOnUse"
        orient="auto-start-reverse"
        viewBox={options.defaultLineMarker!.viewBox}
      >
        <path
            style={{fill: 'context-stroke'}}
          d={options.defaultLineMarker!.data}
        />
      </marker>
    </defs>
  );
};

export default RGGraphRefs;
