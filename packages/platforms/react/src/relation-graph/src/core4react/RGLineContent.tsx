import React, {useMemo} from 'react';
import {RGLinePathInfo, RGLineShape, RGLineSlotProps} from "../../../../../../types";
import RGLineText from "./RGLineText";
import RGLinePath from "./RGLinePath";
import {useGraphInstance} from "../hooks/useGraphInstance";

const RGLineContent: React.FC<RGLineSlotProps> = (
    {
        lineConfig,
        defaultLineTextOnPath,
        graphInstanceId,
        checked
    }
) => {
    const graphInstance = useGraphInstance();
    const linePathInfo = useMemo<RGLinePathInfo>(() => graphInstance.generateLinePath(lineConfig), [lineConfig]);
    const onLineClick = (e: React.MouseEvent | React.TouchEvent) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        graphInstance.onLineClick(lineConfig.line, e.nativeEvent);
    };
    const useTextOnPath = (lineConfig.line.useTextOnPath || defaultLineTextOnPath);
    const useSvgTextPath = useTextOnPath && (lineConfig.line.lineShape !== RGLineShape.StandardStraight);
    const showNormalLineText = !useSvgTextPath;
    const textStyle = graphInstance.generateLineTextStyle(lineConfig, linePathInfo);
    return (<>
        <RGLinePath
            lineConfig={lineConfig}
            linePathInfo={linePathInfo}
            onLineClick={onLineClick}
            useTextOnPath={useSvgTextPath}
            checked={checked}
            graphInstanceId={graphInstanceId}
        />
        {lineConfig.line.text && showNormalLineText && <RGLineText
            lineConfig={lineConfig}
            linePathInfo={linePathInfo}
            checked={checked}
        >
            {
                <div
                    className={`rg-line-label ${useTextOnPath ? 'rg-line-label-on-path':''}`}
                    style={{
                        ...textStyle.cssStyles
                    }}
                    onTouchStart={onLineClick}
                    onClick={onLineClick}
                >
                    {textStyle.text}
                </div>
            }
        </RGLineText>}
    </>);
};

export default RGLineContent;
