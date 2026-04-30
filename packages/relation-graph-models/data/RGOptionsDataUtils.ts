import {devLog} from '../utils/RGCommon';
import {json2Line} from './RGLineDataUtils';
import {json2Node, newNodeTemplate} from './RGNodeDataUtils';
import {
    RGCenterLayoutOptions,
    RGJunctionPoint,
    RGLayoutOptions,
    RGLineShape,
    RGNodeShape,
    RGOptions,
    RGOptionsFull,
    RGTreeLayoutOptions
} from '../../types';

export const createDefaultConfig = (userOptions: RGOptions = {}): RGOptionsFull => {
    const _options: RGOptionsFull = {
        definitelyNoDataProviderNeeded: false,
        instanceId: '',
        debug: true, // v3 UI
        graphLoading: false,
        graphLoadingText: '',
        showToolBar: true, // v3 UI
        backgroundColor: 'transparent', // v3 UI
        checkedItemBackgroundColor: undefined,
        selectionMode: false,
        disableWheelEvent: false, // v3 UI
        wheelEventAction: 'zoom', // v3 UI
        dragEventAction: 'move', // v3 UI
        fullscreenElementXPath: '', // v3 UI
        disableDragNode: false, // v3 UI
        disableDragLine: true,
        canvasMoveMode: false, // v3 UI
        disableNodePointEvent: false,
        disableLinePointEvent: false,
        // moveToCenterWhenRefresh: true,
        // zoomToFitWhenRefresh: true,
        enableNodeXYAnimation: false,
        enableCanvasTransformAnimation: false,
        reLayoutWhenExpandedOrCollapsed: false,
        defaultExpandHolderPosition: 'hide', // v3 UI
        // defaultFocusRootNode: true,
        toolBarDirection: 'h', // v/h // v3 UI
        toolBarPositionH: 'left', // right/center/right // v3 UI
        toolBarPositionV: 'bottom', //  top/center/bottom // v3 UI
        defaultNodeColor: '#ffffff',
        defaultNodeBorderColor: '#666666',
        defaultNodeBorderWidth: 1,
        defaultNodeBorderRadius: 4,
        defaultNodeShape: RGNodeShape.rect,
        defaultNodeWidth: undefined,
        defaultNodeHeight: undefined,
        // defaultNodeFontColor: '#ffffff',
        defaultLineColor: '#cccccc',
        defaultLineWidth: 2,
        // defaultLineFontColor: undefined,
        defaultLineShape: RGLineShape.StandardStraight,
        defaultLineTextOffsetX: undefined,
        defaultLineTextOffsetY: undefined,
        // defaultShowLineLabel: true,
        // hideNodeContentByZoom: false,
        defaultJunctionPoint: RGJunctionPoint.border,
        defaultLineJunctionOffset: 3,
        defaultPolyLineRadius: 5, // v3 UI
        // placeSingleNode: true,
        placeOtherGroup: true,
        defaultLineTextOnPath: false,
        lineTextMaxLength: 66,
        multiLineDistance: 30, // v3 UI
        defaultLineMarker: {
            viewBox: '0 0 12 12',
            markerWidth: 20,
            markerHeight: 20,
            refX: 3,
            refY: 3,
            data: "M 0 0, V 6, L 4 3, Z"
        },
        viewSize: {width: 300, height: 300},
        canvasSize: {
            width: 300,
            height: 300
        },
        canvasOffset: {
            x: 25,
            y: 27
        },
        fullscreen: false, // private
        checkedNodeId: '', // private
        checkedLineId: '', // private
        draggingNodeId: '', // private
        layout: {
            layoutName: 'center'
        }, // v3 UI
        canvasZoom: 100, // private
        mouseWheelSpeed: 10, // v3 UI
        minCanvasZoom: 5, // 5%
        maxCanvasZoom: 500, // 500%
        showEasyView: false, // private
        performanceMode: false, // private
        viewHeight: '100%',
        canvasOpacity: 1, // private
        creatingSelection: false,
        selectionView: {
            x: 25,
            y: 27,
            width: 0,
            height: 0
        },
        creatingNodePlot: false,
        showTemplateNode: true,
        newNodeTemplate: json2Node(JSON.parse(JSON.stringify(newNodeTemplate)), {}),
        creatingLinePlot: false,
        newLineTemplate: {
            from: 'newRelationTemplate-from',
            to: 'newRelationTemplate-to',
            color: '',
            text: ''
        },
        newLinkTemplate: {
            fromNode: null,
            toNodeObject: null,
            toNode: {
                nothing: true,
                x: 400,
                y: 400,
                el_W: 30,
                el_H: 30
            },
            totalLinesBetweenNodes: 1,
            currentLineIndex: 0,
            line: {}
        },
        data: {},
        editingLineController: {
            show: false,
            line: null,
            startPoint: {x: 0, y: 0},
            endPoint: {x: 0, y: 0},
            text: {
                show: true,
                x: 0,
                y: 0,
                width: 10,
                height: 10
            },
            ctrlPoints: [],
            selectedLines: [],
            line44Splits: [],
            line49Points: [],
            ctrlPoint1: {x: 0, y: 0},
            ctrlPoint2: {x: 0, y: 0},
            toolbar: {x: 0, y: 0},
        },
        editingController: {
            show: false,
            nodes: [],
            x: 0,
            y: 0,
            width: 100,
            height: 100
        },
        nodeConnectController: {
            show: false,
            node: undefined,
            x: 0,
            y: 0,
            width: 100,
            height: 100
        },
        showReferenceLine: false,
        referenceLineAdsorption: false,
        editingReferenceLine: {
            show: false,
            directionV: false,
            directionH: false,
            v_x: 0,
            v_y: 0,
            v_height: 0,
            h_x: 0,
            h_y: 0,
            h_width: 0
        },
        showMiniView: false, // v3 UI
        miniViewVisibleHandle: {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            emptyContent: false
        },
        snapshotting: false
    };
    _options.newLineTemplate = json2Line(_options.newLineTemplate, _options);
    // console.log('userOptions layout:', userOptions);
    const optionsKeys = Object.keys(_options);
    if (userOptions) {
        Object.keys(userOptions).forEach(key => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const _thisUserValue = userOptions[key];
            if (!optionsKeys.includes(key)) {
                devLog('RGOptions: unknow option key:', key);
                return;
            }
            if (typeof _thisUserValue === 'object') {
                devLog('RGOptions:user setting object:', key, _thisUserValue);
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const _objectValue = _options[key];
                if (key === 'layout') {
                    _options[key] = JSON.parse(JSON.stringify(_thisUserValue));
                } else if (_objectValue && !Array.isArray(_objectValue) && _thisUserValue) {
                    Object.keys(_objectValue).forEach(l2Key => {
                        _objectValue[l2Key] = _thisUserValue[l2Key];
                    });
                } else if (Array.isArray(_objectValue)) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    const _new_arr = [];
                    _thisUserValue.forEach((thisItem: any) => {
                        if (thisItem && typeof thisItem === 'object') {
                            _new_arr.push(JSON.parse(JSON.stringify(thisItem)));
                        } else {
                            _new_arr.push(thisItem);
                        }
                    });
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    _options[key] = _new_arr;
                } else {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    _options[key] = _thisUserValue;
                }
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                _options[key] = _thisUserValue;
            }
        });
    }
    return _options;
};

export const appendDefaultOptions4Layout = (layoutOptions: RGLayoutOptions) => {
    const layoutName = layoutOptions.layoutName || '';
    if (layoutName === 'center') {
        const thisLayout = layoutOptions as RGCenterLayoutOptions;
        thisLayout.layoutDirection = undefined;
    } else if (layoutName.includes('tree')) {
        const thisLayout = layoutOptions as RGTreeLayoutOptions;
        if (thisLayout.from === undefined) thisLayout.from = 'left';
        if (thisLayout.levelGaps === undefined) thisLayout.levelGaps = [];
        if (thisLayout.from === 'top' || thisLayout.from === 'bottom') {
            if (thisLayout.layoutDirection === undefined) thisLayout.layoutDirection = 'v';
            devLog('set layoutDirection=v');
            devLog('set defaultJunctionPoint=tb');
        }
        if (thisLayout.from === 'left' || thisLayout.from === 'right') {
            if (thisLayout.layoutDirection === undefined) thisLayout.layoutDirection = 'h';
            devLog('set defaultJunctionPoint=lr');
        }
    } else if (layoutName === 'fixed') {
        layoutOptions.layoutDirection = undefined;
    } else if (layoutName === 'force') {
        layoutOptions.layoutDirection = undefined;
    }
    // layoutOptions.supportAutoLayout = false;
    // layoutOptions.autoLayouting = false;
}
export default {
    createDefaultConfig
};
