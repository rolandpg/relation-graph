import React from 'react';
import {RGLine, RGFakeLine, RGLineSlotProps, RGLinePeelProps} from "../../../../../../types";
import RGLineContent from "./RGLineContent";
import {useAutoUpdateView, useGraphInstance} from "../hooks/useGraphInstance";

const RGLinePeel: React.FC<RGLinePeelProps & {
    lineSlot?: React.FC<RGLineSlotProps> | ((props: RGLineSlotProps) => React.ReactNode)
}> = (
    {
        line,
        defaultLineTextOnPath,
        graphInstanceId,
        checked,
        lineSlot
    }
) => {
    const graphInstance = useGraphInstance();
    useAutoUpdateView();
    const config = line.isFakeLine ? graphInstance.generateFakeLineConfig(line as RGFakeLine) : graphInstance.generateLineConfig(line as RGLine);
    return <>
        {config && (
            lineSlot ?
                lineSlot({lineConfig: config, defaultLineTextOnPath, graphInstanceId, checked})
                : <RGLineContent
                    lineConfig={config}
                    defaultLineTextOnPath={defaultLineTextOnPath}
                    graphInstanceId={graphInstanceId}
                    checked={checked}
                />
        )
        }
    </>;
};

export default RGLinePeel;
