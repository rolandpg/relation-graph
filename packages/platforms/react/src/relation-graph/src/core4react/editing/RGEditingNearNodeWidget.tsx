import React, {PropsWithChildren} from 'react';
import {RGWidgetPosition, RGWidgetProps} from '../../../../../../../types';

const RGEditingNearNodeWidget: React.FC<PropsWithChildren<RGWidgetProps>> = ({ position, children }) => {
  const _position: RGWidgetPosition = position || 'top';
  return (
    <div
      className={`rg-editing-bar rg-editing-bar-${_position}`}
    >
      {children}
    </div>
  );
};

export default RGEditingNearNodeWidget;
