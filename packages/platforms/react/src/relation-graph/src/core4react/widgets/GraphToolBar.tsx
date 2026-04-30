import React, {PropsWithChildren} from 'react';
import RGIcons from "./RGIcons";
import {RGToolBarProps} from "../../../../../../../types";
import {useGraphInstance} from "../../hooks/useGraphInstance";
import {useGraphStore} from "../../hooks/useGraphStore";


const GraphToolBar: React.FC<PropsWithChildren<RGToolBarProps>> = ({children, direction, positionH, positionV}) => {
    const graphInstance = useGraphInstance();
    const {options} = useGraphStore();
    const refresh = async () => {
        await graphInstance.refresh();
        graphInstance.dataUpdated();
    };
    const updateViewLoop = () => {
        if (graphInstance.options.layout.autoLayouting) {
            graphInstance.dataUpdated();
            requestAnimationFrame(() => {
                updateViewLoop();
            });
        }
    };
    const toggleAutoLayout = () => {
        graphInstance.toggleAutoLayout();
        // updateViewLoop();
    };
    const toogleFullScreen = async () => {
        await graphInstance.fullscreen();
        graphInstance.dataUpdated();
    };
    const zoomToFit = async () => {
        graphInstance.setZoom(100);
        graphInstance.moveToCenter();
        graphInstance.enableCanvasAnimation();
        graphInstance.zoomToFit();
        setTimeout(() => {
            graphInstance.disableCanvasAnimation();
        }, 300);
    };
    const addZoom = (buff: number) => {
        graphInstance.zoom(buff);
        graphInstance.dataUpdated();
    };
    return (
        <div
            className={[
                'rg-toolbar',
                'rg-toolbar-h-' + (positionH || options.toolBarPositionH),
                'rg-toolbar-v-' + (positionV || options.toolBarPositionV),
                'rg-toolbar-' + (direction || options.toolBarDirection)
            ].join(' ')}
        >
            <div className="rg-mb-button" onClick={() => {
                toogleFullScreen();
            }}>
                <RGIcons iconName="icon-quanping"/>
            </div>
            <React.Fragment>
                <div className="rg-mb-button" onClick={() => {
                    addZoom(20);
                }}>
                    <RGIcons iconName="icon-fangda"/>
                </div>
                <div className="rg-current-zoom" onClick={() => {
                    zoomToFit();
                }}>{Math.round(options.canvasZoom)}%
                </div>
                <div className="rg-mb-button" onClick={() => {
                    addZoom(-20);
                }}>
                    <RGIcons iconName="icon-suoxiao"/>
                </div>
            </React.Fragment>

            {options.layout.supportAutoLayout &&
                <div
                    title={options.layout.autoLayouting ? 'Stop force' : 'Start force'}
                    className={[
                        'rg-mb-button',
                        options.layout.autoLayouting && 'rg-mb-button-on'
                    ].join(' ')}
                    onClick={() => {
                        toggleAutoLayout();
                    }}
                >
                    {
                        !options.layout.autoLayouting ?
                            <RGIcons iconName="icon-zidong"/>
                            :
                            <RGIcons iconName="icon-lianjiezhong" className="rg-loading-icon"/>
                    }
                </div>
            }
            <div className="rg-mb-button" onClick={() => {
                refresh();
            }}>
                <RGIcons iconName="icon-ico_reset"/>
            </div>
            {/*<div className="rg-mb-button" onClick={()=>{downloadAsImage();}}>*/}
            {/*  <RGIcons iconName="icon-tupian" />*/}
            {/*</div>*/}
            {children}
            <div style={{clear: 'both'}}></div>
        </div>
    );
};

export default GraphToolBar;
