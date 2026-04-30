import React, {PropsWithChildren, useRef, useEffect} from 'react';
import {RGBackgroundProps} from "../../../../../../../types";
import {useGraphInstance} from "../../hooks/useGraphInstance";

const GraphBackground:React.FC<PropsWithChildren<RGBackgroundProps>> = ({ children, forDisplay, forImage }) => {
  const graphInstance = useGraphInstance();
  const $backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    graphInstance.setBackgroundDom($backgroundRef.current, forDisplay, forImage);
    return () => {
      graphInstance.setBackgroundDom(null, forDisplay, forImage);
    };
  }, []);
  return (
    <div
      className={`rg-background`}
      ref={$backgroundRef}
    >
      {children}
    </div>
  );
};

export default GraphBackground;
