import React, {PropsWithChildren} from 'react';
import {useGraphInstance} from "../../hooks/useGraphInstance";

const RGSlotOnNodeExpandHandle: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const graphInstance = useGraphInstance();
  if (!graphInstance) {
    return null;
  }
  return <>{children}</>;
};
export default RGSlotOnNodeExpandHandle;
