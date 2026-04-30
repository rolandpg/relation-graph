import React, {PropsWithChildren} from 'react';
import {useGraphStore} from "../../hooks/useGraphStore";

const RGEditingNodeController:React.FC<PropsWithChildren<{
    hideBorderForSingleNode?: boolean
}>> = ({ children, hideBorderForSingleNode }) => {
  const {options} = useGraphStore();

  if (!options.editingController.show) {
    return null;
  }
  const style = {
    width: options.editingController.width + 'px',
    height: options.editingController.height + 'px',
    transform: `translate(${options.editingController.x}px, ${options.editingController.y}px)`
  };
  return (
    <div className={`rg-editing-ctrl ${hideBorderForSingleNode && options.editingController.nodes.length === 1 ? 'rg-ctrl-hide-border':''}`} style={style}>
      {children}
    </div>
  );
};

export default RGEditingNodeController;
