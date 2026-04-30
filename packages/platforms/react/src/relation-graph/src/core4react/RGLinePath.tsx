import React, {PropsWithChildren} from 'react';
import {RGLinePathProps} from "../../../../../../types";
import {useGraphInstance} from "../hooks/useGraphInstance";

const RGLinePath: React.FC<PropsWithChildren<RGLinePathProps & {
    onLineClick: (e: React.MouseEvent | React.TouchEvent) => void,
}>> = ({lineConfig, linePathInfo, useTextOnPath, checked, graphInstanceId, onLineClick, children}) => {
    const graphInstance = useGraphInstance();
    const line = lineConfig.line;
    const selected = line.selected;
    const startArrowMarkerId = graphInstance.getArrowMarkerId(line, true);
    const endArrowMarkerId = graphInstance.getArrowMarkerId(line, false);
    const lineWidth = line.lineWidth ? (line.lineWidth + 'px') : undefined;
    const onPathTextStyle = useTextOnPath ? graphInstance.generateLineTextStyle4TextOnPath(lineConfig) : null;
    const pathId = graphInstanceId + '-' + line.id;
    return <g
        className={[
            'rg-line-peel',
            line.className,
            (checked && 'rg-line-checked'),
            (selected && 'rg-line-selected'),
            ((line.disablePointEvent || line.opacity === 0) && 'rg-line-disable-events'),
        ].filter(Boolean).join(' ')}
        data-id={line.id}
        style={{
            '--rg-line-width': lineWidth,
            '--rg-line-color': line.color,
            '--rg-line-opacity': line.opacity,
            '--rg-line-fontcolor': line.fontColor,
            '--rg-line-marker-end': endArrowMarkerId,
            '--rg-line-marker-start': startArrowMarkerId,
            ...(line.cssVars || {})
        }}
    >
        <path
            d={linePathInfo.pathData}
            className="rg-line-bg"
            onTouchStart={onLineClick}
            onClick={onLineClick}
        />
        <path
            id={pathId}
            d={linePathInfo.pathData}
            className={[
                'rg-line',
                line.dashType ? ('rg-line-dashtype-' + line.dashType) : undefined,
                line.animation ? ('rg-line-anm-' + line.animation) : undefined,
            ].filter(Boolean).join(' ')}
            // markerStart={startArrowMarkerId}
            // markerEnd={endArrowMarkerId}
        />
        {
            onPathTextStyle && <g>
                <text
                    className={`rg-line-text rg-line-text-on-path`}
                    dx={onPathTextStyle.textOffset.x + 'px'}
                    dy={onPathTextStyle.textOffset.y + 'px'}
                    onTouchStart={onLineClick}
                    onClick={onLineClick}
                >
                    <textPath xlinkHref={`#${pathId}`}
                              startOffset={onPathTextStyle.onPathStartOffset}
                              textAnchor={onPathTextStyle.textAnchor}
                              method="align"
                              spacing="auto"
                    >
                        {onPathTextStyle.text}
                    </textPath>
                </text>
            </g>
        }
        {children}
    </g>;
};
export default RGLinePath;
