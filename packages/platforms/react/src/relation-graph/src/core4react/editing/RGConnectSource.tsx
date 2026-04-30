import React, {PropsWithChildren} from 'react';
import {RGConnectSourceProps} from '../../../../../../../types';
import {useGraphInstance} from "../../hooks/useGraphInstance";

const RGConnectSource:React.FC<PropsWithChildren<RGConnectSourceProps>> = ({ lineTemplate, onConnectStart, onConnectEnd, children, className, style }) => {
  const graphInstance = useGraphInstance();

  const onMouseDown = ($event: React.MouseEvent) => {
    onConnectStart && onConnectStart(lineTemplate, $event.nativeEvent);
    $event.stopPropagation();
    graphInstance.startCreateLineFromNode(null, lineTemplate, $event.nativeEvent, (from, to, newLine) => {
      onConnectEnd && onConnectEnd(from, to, newLine);
      graphInstance.defaultLineConnectEndHandler(from, to, newLine);
    });
  };
  return (
    <div
      className={`rg-connect-source-handle ${className || ''}`}
      style={style}
      onMouseDown={(event) => onMouseDown(event)}
      onClick={(event) => { event.stopPropagation(); }}
    >
      {children}
    </div>
  );
};

export default RGConnectSource;
