import React, {PropsWithChildren} from 'react';
import {createPortal} from "react-dom";
import {RGLineTextProps} from "../../../../../../types";
import {useGraphInstance} from "../hooks/useGraphInstance";

const RGLineText: React.FC<PropsWithChildren<RGLineTextProps>> = ({children, lineConfig, checked}) => {
    const graphInstance = useGraphInstance();
    if (!graphInstance) return null;
    const lineTextContainer = graphInstance.getLineTextContainer(lineConfig?.line);
    if (!lineTextContainer) return null;
    const line = lineConfig.line;
    const selected = line.selected;
    return createPortal(<div
        className={[
            'rg-line-peel',
            line.className,
            (checked && 'rg-line-checked'),
            ((line.disablePointEvent || line.opacity === 0) && 'rg-line-disable-events'),
            (selected && 'rg-line-selected')
        ].filter(Boolean).join(' ')}
        data-id={line.id}
        style={{
            '--rg-line-color': line.color,
            '--rg-line-fontsize': (lineConfig.line.fontSize ? `${lineConfig.line.fontSize}px` : undefined),
            '--rg-line-opacity': line.opacity,
            '--rg-line-fontcolor': line.fontColor,
            ...(line.cssVars || {})
        }}
    >
        {children}
    </div>, lineTextContainer);
};
export default RGLineText;
