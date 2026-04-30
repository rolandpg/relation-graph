import React from 'react';
import RGIcons from "./RGIcons";
import {useGraphInstance} from "../../hooks/useGraphInstance";
import {useGraphStore} from "../../hooks/useGraphStore";

const GraphLoading: React.FC = () => {
  const graphInstance = useGraphInstance();
  const {options} = useGraphStore();
  const clickGraphMask = (e) => {
    graphInstance.clearLoading();
  }
  return (
    <>
    {
      options && <div
    className={`rg-graph-loading ${!options.graphLoading ? 'rg-graph-loading-hide' : ''}`}
    onClick={(e) => {clickGraphMask(e);}}
  >
    <div className="rg-graph-loading-message">
      <RGIcons iconName="icon-lianjiezhong" className="rg-graph-loading-icon" />
        {options.graphLoadingText || 'Loading...'}
    </div>
  </div>
}
    </>
  );
};

export default GraphLoading;
