import React, {PropsWithChildren, useEffect} from 'react';
import {RGToolBarProps} from '../../../../../../../types';
import RGIcons from "./RGIcons";
import {useAutoUpdateView, useGraphInstance} from "../../hooks/useGraphInstance";
import {useGraphStore} from "../../hooks/useGraphStore"; // You need to create this context similar to Vue's inject

const GraphXsToolBar: React.FC<PropsWithChildren<RGToolBarProps>> = ({
                                                      direction = '',
                                                      positionH = '',
                                                      positionV = '',
                                                      children
                                                  }) => {
    const graphInstance = useGraphInstance();
    useAutoUpdateView();
    const {options} = useGraphStore();

    const toggleAutoLayout = () => {
        graphInstance?.toggleAutoLayout();
    };

    const zoomToFit = async () => {
        if (graphInstance) {
            graphInstance.enableCanvasAnimation();
            graphInstance.setZoom(100);
            graphInstance.moveToCenter();
            graphInstance.zoomToFit();
            setTimeout(() => {
                graphInstance.disableCanvasAnimation();
            }, 300);
        }
    };

    const doZoom = async (value: number) => {
        await graphInstance?.zoom(value);
    };

    const fullscreen = async () => {
        await graphInstance?.fullscreen();
    };

    useEffect(() => {
        // Equivalent to onMounted in Vue
        // console.log('Component mounted');
    }, []);

    return (
        <div
            className={`rg-toolbar rg-xs-toolbar rg-toolbar-h-${(positionH || options.toolBarPositionH || 'left')} rg-toolbar-v-${(positionV || options.toolBarPositionV || 'bottom')} rg-toolbar-${(direction || options.toolBarDirection || 'h')}`}>
            <div title="Full Screen" className="rg-mb-button" style={{marginTop: 0}} onClick={fullscreen}>
                <RGIcons iconName="icon-quanping"/>
            </div>
            <>
                <div className="rg-mb-button" onClick={() => doZoom(20)}>
                    <RGIcons iconName="icon-fangda"/>
                </div>
                <div className="rg-current-zoom" onClick={zoomToFit}>{`${Math.round(options.canvasZoom)}%`}</div>
                <div className="rg-mb-button" style={{marginTop: 0}} onClick={() => doZoom(-20)}>
                    <RGIcons iconName="icon-suoxiao"/>
                </div>
            </>
            {options.layout.supportAutoLayout && (
                <div
                    title={options.layout.autoLayouting ? 'Stop Force Layout' : 'Start Force Layout'}
                    className={`rg-mb-button ${options.layout.autoLayouting ? 'rg-mb-button-on' : ''}`}
                    onClick={toggleAutoLayout}
                >
                    {
                        !options.layout.autoLayouting ? <RGIcons iconName="icon-zidong"/>
                            : <RGIcons iconName="icon-lianjiezhong" className="rg-loading-icon"/>
                    }
                </div>
            )}
            {children}
        </div>
    );
};

export default GraphXsToolBar;
