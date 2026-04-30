import {devLog} from '../utils/RGCommon';
import {
    RGLine,
    RGNode,
    RGOptions, RGOptionsFull
} from '../../types';
import {RelationGraphWith2Data5LineConfig} from "./RelationGraphWith2Data5LineConfig";
import {appendDefaultOptions4Layout} from "../data/RGOptionsDataUtils";

/**
 * Class related to options data update of relation-graph component
 */
export class RelationGraphWith3Options1Update extends RelationGraphWith2Data5LineConfig {
    constructor() {
        super();
    }

    /**
     * @inner
     */
    protected _updateOptions(options: RGOptions) {
        if (!options.instanceId && this.getOptions().instanceId !== options.instanceId) options.instanceId = this.instanceId;
        // console.log('[RelationGraphWith2Data] _updateOptions:', JSON.stringify(options), this.options);
        const _newOptions = Object.assign({}, options);
        if (_newOptions['layouts']) {
            throw new Error('Graph options do not support setting "layouts" properties, Please use "layout"!');
        }
        if (_newOptions['lineUseTextPath']) {
            throw new Error('Graph options do not support setting "lineUseTextPath" properties, Please use "defaultLineTextOnPath"!');
        }
        // console.log('xxxxxxxxxxxxxxxx', userOptions.defaultPolyLineRadius, userOptions.defaultPloyLineRadius);
        // if (_newOptions.defaultPloyLineRadius) { // Fixed spelling errors in variable names in old versions
        //     _newOptions.defaultPolyLineRadius = _newOptions.defaultPloyLineRadius;
        // }
        if (_newOptions.debug !== undefined) {
            const _debug = _newOptions.debug === true;
            if (_debug) devLog('RGOptions:user instance options:', _newOptions);
            if ((typeof window !== 'undefined') && window) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                window.relationGraphDebug = _debug;
            }
        }
        if (_newOptions.layout) {
            this.dataProvider.updateOptions({
                ..._newOptions,
                layout: {
                    ...this.getOptions().layout,
                    ..._newOptions.layout
                }
            });
            if (this.layoutor && this.layoutor.updateOptions) {
                this.layoutor.updateOptions(_newOptions.layout);
            }
        } else {
            this.dataProvider.updateOptions(_newOptions);
        }
    }

    /**
     * When the size of the parent element of the relation-graph component changes, you can call this method to recalculate the view size
     * @param zoomTo100
     * @protected
     * @inner
     */
    protected resetViewSize(zoomTo100 = false) {
        const viewRectBox = this.getViewBoundingClientRect();
        const newOptions: Partial<RGOptionsFull> = {};
        newOptions.viewSize = {
            width: viewRectBox.width,
            height: viewRectBox.height
        }
        if (this._rgAsConnectArea) {
            newOptions.canvasZoom = 100;
            newOptions.canvasOffset = {
                x: 0,
                y: 0
            }
        } else {
            if (zoomTo100) {
                newOptions.canvasZoom = 100;
                newOptions.canvasOffset = {
                    x: newOptions.viewSize.width / 2,
                    y: newOptions.viewSize.height / 2
                }
            }
        }
        this.dataProvider.updateOptions(newOptions);
        devLog('resetViewSize:1:', newOptions);
        this._dataUpdated();
    }

    /**
     * Lock the graph component screen and display a piece of text
     * @param graphLoadingText The text to display
     */
    loading(graphLoadingText = '') {
        this.dataProvider.updateOptions({
            graphLoading: true,
            graphLoadingText: graphLoadingText
        })
        this._dataUpdated();
    }

    /**
     * Clear the lock on the graph component screen
     */
    clearLoading() {
        this.dataProvider.updateOptions({
            graphLoading: false,
            graphLoadingText: ''
        })
        this._dataUpdated();
    }

    /**
     * Set the checked node
     * @param node
     */
    setCheckedNode(node: string | RGNode) {
        // console.log('setCheckedNode:', node)
        this.dataProvider.updateOptions({
            checkedNodeId: node ? (typeof node === 'string' ? node : node.id as string) : ''
        });
        this._dataUpdated();
    }

    /**
     * Set the checked line
     * @param line
     */
    setCheckedLine(line: string | RGLine) {
        this.dataProvider.updateOptions({
            checkedLineId: line ? (typeof line === 'string' ? line : line.id as string) : ''
        });
    }

    /**
     * Clear all checked nodes and lines
     */
    clearChecked() {
        this.dataProvider.clearChecked();
        this._dataUpdated();
    }

    /**
     * Clear all selected nodes and lines
     */
    clearSelected() {
        const selectedNodes = this.getNodes().filter(node => node.selected);
        const selectedLines = this.getLines().filter(line => line.selected);
        const selectedFakeLines = this.getFakeLines().filter(line => line.selected);
        selectedNodes.forEach(node => this.dataProvider.updateNode(node.id, {selected: false}));
        selectedLines.forEach(line => this.dataProvider.updateLine(line.id, {selected: false}));
        selectedFakeLines.forEach(line => this.dataProvider.updateFakeLine(line.id, {selected: false}));
        this._dataUpdated();
    }

    /**
     * Set the canvas offset, used when dragging the canvas
     * @param x
     * @param y
     */
    setCanvasOffset(x: number, y: number) {
        this.dataProvider.setCanvasOffset(x, y);
        this._updateEditingControllerView();
        this.updateShouldRenderGraphData();
        this._dataUpdated();
    }

    /**
     * Set the current canvas to move mode
     * @param newValue
     * @protected
     * @inner
     */
    protected setCanvasMoveMode(newValue: boolean) {
        this.dataProvider.updateOptions({
            canvasMoveMode: newValue
        });
        this._dataUpdated();
    }

    /**
     * @inner
     */
    onMiniViewMounted() {
        this.dataProvider.updateOptions({
            showMiniView: true
        });
        this._dataUpdated();
    }

    /**
     * @inner
     */
    onMiniViewUnMounted() {
        this.dataProvider.updateOptions({
            showMiniView: false
        });
    }

    /**
     * @inner
     */
    onReferenceLineMounted(adsorption: boolean) {
        this.dataProvider.updateOptions({
            referenceLineAdsorption: adsorption || false,
            showReferenceLine: true
        });
    }

    /**
     * @inner
     */
    onReferenceLineUnMounted() {
        this.dataProvider.updateOptions({
            // editingReferenceLine: {
            //     ...this.getOptions().editingReferenceLine,
            //     show: false
            // },
            referenceLineAdsorption: false,
            showReferenceLine: false
        });
    }
}
