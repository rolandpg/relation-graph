import React from 'react';
import {
    RGLineSlotProps,
} from '../../../../../../types';
import RGLineContent from "./RGLineContent";
import {useGraphInstance} from "../hooks/useGraphInstance";
import {useGraphStore} from "../hooks/useGraphStore";

export interface RGCanvasContent4CreatingLineProps {
    lineSlot?: React.FC<RGLineSlotProps> | ((props: RGLineSlotProps) => React.ReactNode)
    defaultLineTextOnPath?: boolean,
    checkedLineId?: string,
    graphInstanceId?: string,
}

const RGCanvasContent4CreatingLine: React.FC<RGCanvasContent4CreatingLineProps> = (
    {
        lineSlot,
        defaultLineTextOnPath,
        graphInstanceId
    }
) => {
    const graphInstance = useGraphInstance();
    const {options} = useGraphStore();
    const creatingLineConfig = graphInstance.generateCreatingLineConfig(options);
    return (
        <div className="rg-lines-container rg-lines-container-el-lines">
            <div className="rg-linetext-container"/>
            <svg className="rg-lines-svg rg-lines-svg-el-lines"
                 xmlns="http://www.w3.org/2000/svg">
                {
                    lineSlot ?
                        lineSlot({lineConfig: creatingLineConfig})
                        : <RGLineContent
                            lineConfig={creatingLineConfig}
                            defaultLineTextOnPath={defaultLineTextOnPath}
                            graphInstanceId={graphInstanceId}
                        />
                }
            </svg>
        </div>
    );
};

export default RGCanvasContent4CreatingLine;
