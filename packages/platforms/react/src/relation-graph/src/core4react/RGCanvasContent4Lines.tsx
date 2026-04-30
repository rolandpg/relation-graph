import React from 'react';
import {
    RGLine,
    RGLineSlotProps
} from '../../../../../../types';
import RGGraphRefs from './RGGraphRefs';
import RGLinePeel from "./RGLinePeel";

export interface RGCanvasContent4LinesProps {
    showEasyView: boolean,
    lineSlot?: React.FC<RGLineSlotProps> | ((props: RGLineSlotProps) => React.ReactNode)
    defaultLineTextOnPath?: boolean,
    checkedLineId?: string,
    graphInstanceId?: string,
    allLineConfigList: RGLine[]
}

const RGCanvasContent4LinesContent: React.FC<RGCanvasContent4LinesProps> = (
    {
        showEasyView,
        lineSlot,
        defaultLineTextOnPath,
        checkedLineId,
        graphInstanceId,
        allLineConfigList
    }
) => {
    // console.log('shouldRenderLines::::', allLineConfigList.length);
    return (
        <div className="rg-lines-container rg-lines-container-normal-lines">
            <svg className="rg-lines-svg" xmlns="http://www.w3.org/2000/svg">
                <RGGraphRefs />
                {
                    !showEasyView && allLineConfigList.map(line =>
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
            <div className="rg-linetext-container"/>
        </div>
    );
};

const RGCanvasContent4Lines = React.memo(RGCanvasContent4LinesContent, (p1, p2) => {
    if (p1.allLineConfigList !== p2.allLineConfigList) {
        // console.log('shouldRenderLines:::::::props[allLineConfigList]changed:::');
        return false;
    } else if (p1.graphInstanceId !== p2.graphInstanceId) {
        // console.log('shouldRenderLines:::::::props[graphInstanceId]changed:::');
        return false;
    } else if (p1.checkedLineId !== p2.checkedLineId) {
        // console.log('shouldRenderLines:::::::props[checkedLineId]changed:::');
        return false;
    } else if (p1.lineSlot !== p2.lineSlot) {
        // console.log('shouldRenderLines:::::::props[lineSlot]changed:::');
        return false;
    } else if (p1.defaultLineTextOnPath !== p2.defaultLineTextOnPath) {
        // console.log('shouldRenderLines:::::::props[defaultLineTextOnPath]changed:::');
        return false;
    }
    return true;
});
export default RGCanvasContent4LinesContent;
