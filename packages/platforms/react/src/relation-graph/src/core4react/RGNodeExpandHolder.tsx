import React from 'react';
import {RGNodeExpandHolderProps} from "../../../types-react";
import RGIcons from "./widgets/RGIcons";

const RGNodeExpandHolder: React.FC<RGNodeExpandHolderProps> = ({node, expandOrCollapseNode, expandHolderPosition}) => {
  const expandButtonClass = node.expanded === false ? 'rg-node-expand-button c-expanded' : 'rg-node-expand-button c-collapsed';

  return (
    <div
      className={`rg-node-expand-holder c-expand-positon-${expandHolderPosition}`}
    >

      <div
        className={expandButtonClass}
        onClickCapture={expandOrCollapseNode}
        onTouchEnd={expandOrCollapseNode}
      >
        {node.expanded === false ? <RGIcons iconName="icon-fangda" /> : <RGIcons iconName="icon-suoxiao" />}
      </div>
    </div>
  );
};

export default RGNodeExpandHolder;
