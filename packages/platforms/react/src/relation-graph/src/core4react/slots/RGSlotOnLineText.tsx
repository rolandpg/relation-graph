import React, {PropsWithChildren} from 'react';
import {createPortal} from "react-dom";
import {RGGenerateLineConfig} from "../../../../../../../types";
import {useGraphInstance} from "../../hooks/useGraphInstance";

const RGSlotOnLineText: React.FC<PropsWithChildren<{lineConfig: RGGenerateLineConfig}>> = ({ children, lineConfig }) => {
  const graphInstance = useGraphInstance();
  if (!graphInstance) return null;
  const lineTextContainer = graphInstance.getLineTextContainer(lineConfig?.line);
  if (!lineTextContainer) return null;
  return createPortal(children, lineTextContainer);
};
export default RGSlotOnLineText;
