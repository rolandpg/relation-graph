import React, {useEffect} from 'react';
import RGGraphRefs from './RGGraphRefs';
import RGLinePeel from "./RGLinePeel";
import {useGraphInstance} from "../hooks/useGraphInstance";
import {useGraphStore} from "../hooks/useGraphStore";
import type {RGLineSlotProps} from "../../../../../../types";

export interface RGCanvasContent4FakeLinesProps {
    showEasyView: boolean,
    lineSlot?: React.FC<RGLineSlotProps> | ((props: RGLineSlotProps) => React.ReactNode)
    defaultLineTextOnPath?: boolean,
    checkedLineId?: string,
    graphInstanceId?: string,
}

const RGCanvasContent4FakeLines: React.FC<RGCanvasContent4FakeLinesProps> = (
    {
        showEasyView,
        lineSlot,
        defaultLineTextOnPath,
        checkedLineId,
        graphInstanceId,
    }
) => {
    const graphInstance = useGraphInstance();
    const { shouldRenderFakeLines } = useGraphStore();
    const allFakeLineConfigList = !showEasyView ? graphInstance.getShouldRenderFakeLines(shouldRenderFakeLines) : [];
    return (
        <div className="rg-lines-container rg-lines-container-el-lines">
            <div className="rg-linetext-container"/>
            <svg className="rg-lines-svg rg-lines-svg-el-lines"
                 xmlns="http://www.w3.org/2000/svg">
                {<RGGraphRefs forElementLines={true}/>}
                {
                    !showEasyView && allFakeLineConfigList.map(line =>
                        (line.hidden !== true) &&
                        <RGLinePeel
                            key={line.id}
                            line={line}
                            lineSlot={lineSlot}
                            defaultLineTextOnPath={defaultLineTextOnPath}
                            checked={line.id === checkedLineId}
                            graphInstanceId={graphInstanceId}
                        />
                    )
                }
            </svg>
        </div>
    );
};

export default RGCanvasContent4FakeLines;
