import React, {PropsWithChildren, useEffect, useRef} from 'react';
import {RGWatermarkProps} from "../../../../../../../types";
import {useAutoUpdateView, useGraphInstance} from "../../hooks/useGraphInstance";
import {useGraphStore} from "../../hooks/useGraphStore";

const GraphWatermark: React.FC<PropsWithChildren<RGWatermarkProps>> = ({children, forDisplay, forImage, position, width, height}) => {
    const graphInstance = useGraphInstance();
    useAutoUpdateView();
    const {options} = useGraphStore();
    const $watermarkRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Replace the following line with the appropriate logic for setting the watermark in your React app
        graphInstance.setWatermarkDom($watermarkRef.current!, forImage, forDisplay, position);
        return () => {
            graphInstance.setWatermarkDom(null, forDisplay, forImage);
        };
    }, [width, height]);
    let show = false;
    if (options.snapshotting) {
        if (forImage === false) {
            show = false;
        } else {
            show = true;
        }
    } else {
        if (forDisplay === true) {
            show = true;
        } else {
            show = false;
        }
    }
    return (
        <div
            className={`rg-watermark rg-watermark-${position || 'br'}`}
            style={{
                display: show ? 'block' : 'none',
                '--watermark-width': width,
                '--watermark-height': height
            }}
            ref={$watermarkRef}
        >
            {children}
        </div>
    );
};

export default GraphWatermark;
