import {devLog, generateNewUUID} from '../utils/RGCommon';
import {
    JsonLine,
    JsonNode, ReactiveDataStores,
    RGEventEmitHook,
    RGEventHandler,
    RGEventNames,
    RGListeners,
    RGNode,
    RGOptionsFull,
    RGPosition,
    RGUserEvent
} from '../../types';
import {RGDataProvider} from "../data/RGDataProvider";

/**
 * relation-graph component base class, providing common API methods
 */
export class RelationGraphBase {
    listeners: RGListeners;
    protected useReactiveDataToAutoUpdateView = false;
    protected instanceId: string;
    dataProvider: RGDataProvider;
    options: RGOptionsFull;
    protected _previousUpdateTime = 0;

    constructor() {
        this.dataProvider = new RGDataProvider();
        this.options = this.dataProvider.getOptions();
        this.listeners = {};
        this.instanceId = 'RG-' + this.generateNewUUID(5);
    }

    /**
     * Generate a highly likely unique id, the probability of non-duplication depends on the parameter idLength (the length of the id)
     * @param idLength The length of the id, default is 5
     */
    generateNewUUID(idLength = 5) {
        return generateNewUUID(idLength);
    }

    /**
     * * Enable or disable logging functionality
     * @param enable
     */
    enableDebugLog(enable: boolean) {
        this.dataProvider.updateOptions({
            debug: enable
        });
        if ((typeof window !== 'undefined') && window) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.relationGraphDebug = enable;
        }
    }


    /**
     * Request view update
     * Used to update canvas drawing, subsequent canvas drawing will be upgraded to use WebGL to improve performance
     * @protected
     */
    protected _dataUpdated() {
        this._requestDataUpdate();
    }
    protected _beforeViewDataUpdated() {}
    protected _updateEditingControllerView() {}
    protected _updateEditingConnectControllerView() {}
    protected updateShouldRenderGraphData(_force?: boolean) {}
    protected updateEasyView() {}
    protected updateMiniView() {}
    private _dataUpdatedRequested = false;
    /**
     * @inner
     * Reuqest Trigger view update
     * @private
     */
    protected _requestDataUpdate() {
        if ((typeof window === 'undefined') || !window.requestAnimationFrame) {
            return;
        }
        if (this._dataUpdatedRequested) {
            return;
        }
        this._dataUpdatedRequested = true;
        requestAnimationFrame(this._doSomethingAfterDataUpdated.bind(this));
    }

    /**
     * Trigger view update for React/Svelte/Canvas
     * @private
     */
    private _doSomethingAfterDataUpdated() {
        // console.log('_dataUpdated:');
        try {
            this._beforeViewDataUpdated();
            if (!this.useReactiveDataToAutoUpdateView || this.dataProvider.isPerformanceMode()) {
                // devLog('_dataUpdated:');
                this._previousUpdateTime = Date.now();
                // The updateShouldRenderGraphData method will be implemented by subclasses
                this.updateShouldRenderGraphData();
                // The updateEasyView method will be implemented by subclasses
                this.updateEasyView();
                // The specific content of updateViewHook will be passed in by the user, generally used for React/Svelte/Canvas view updates
                if (this.dataProvider) this.dataProvider.dataUpdated();
                // console.log('Use _dataUpdated to update view, time:', Date.now() - this._previousUpdateTime);
            } else {
                this.updateMiniView();
            }
        } catch (e) {
            console.error('[relation-graph]Error:', e);
        } finally {
            this._dataUpdatedRequested = false;
        }

    }

    protected eventHandlers: RGEventHandler[] = [];

    /**
     * * Register event handler
     * @param handler: RGEventHandler
     */
    addEventHandler(handler: RGEventHandler) {
        if (!this.eventHandlers.includes(handler)) this.eventHandlers.push(handler);
    }

    /**
     * * Remove event handler
     * @param handler: RGEventHandler
     */
    removeEventHandler(handler: RGEventHandler) {
        const index = this.eventHandlers.indexOf(handler);
        index !== -1 && this.eventHandlers.splice(index, 1);
    }

    protected _emitHook: RGEventEmitHook;

    /**
     * * Set the event hook, For Vue2,Vue3 only
     * @param emitHook
     */
    setEventEmitHook(emitHook: RGEventEmitHook) {
        this._emitHook = emitHook;
        // console.warn('[setEventEmitHook]', this._emitHook);
    }

    /**
     * Trigger event
     * @param eventName Name of the event
     * @param object Parameters passed to the event handler
     */
    protected emitEvent(eventName: RGEventNames, ...args: any[]) {

        let {result, handled} = this.defaultEventHandler(eventName, ...args);
        for (const handler of this.eventHandlers) {
            const customResult = handler(eventName, ...args);
            // console.error('[custom event Handler]', eventName, ' => ', customResult);
            if (customResult !== undefined) {
                result = customResult;
                handled = true;
            }
        }
        // console.error('[custom event Handler]1', result, handled);
        if (!handled) {
            if (this._emitHook) {
                this._emitHook(eventName, ...args, (customReturnValue: any) => {
                    if (customReturnValue !== undefined) {
                        result = customReturnValue;
                    }
                });
            }
        }
        // devLog('[custom event Handler]', result);
        if (result !== undefined) {
            devLog('[custom event hook]Event:', eventName, ' => returnValue:', result);
            return result;
        }
    }

    /**
     * Protected Method to trigger the default event handler, i.e., trigger the events set in jsx
     * @param eventName
     * @param args
     * @protected
     */
    protected defaultEventHandler(eventName: RGEventNames, ...args: any[]) {
        let result;
        let handled = false;
        if (eventName === RGEventNames.onReady) {
            if (this.listeners.onReady) {
                handled = true;
                this.listeners.onReady(this);
            }
        } else if (eventName === RGEventNames.onNodeDragStart) {
            if (this.listeners.onNodeDragStart) {
                handled = true;
                this.listeners.onNodeDragStart(args[0], args[1]);
            }
        } else if (eventName === RGEventNames.onNodeDragging) {
            // console.log('xxxxxxxxxxx:emitEvent', eventName);
            if (this.listeners.onNodeDragging) {
                handled = true;
                const node = args[0];
                const x = args[1];
                const y = args[2];
                const buff_x = args[3];
                const buff_y = args[4];
                const e = args[5];
                result = this.listeners.onNodeDragging(node, x, y, buff_x, buff_y, e);
            }
        } else if (eventName === RGEventNames.onCanvasDragging) {
            // console.log('xxxxxxxxxxx:emitEvent', eventName);
            if (this.listeners.onCanvasDragging) {
                handled = true;
                const newX = args[0];
                const newY = args[1];
                const buffX = args[2];
                const buffY = args[3];
                result = this.listeners.onCanvasDragging(newX, newY, buffX, buffY);
            }
        } else if (eventName === RGEventNames.onNodeDragEnd) {
            const node = args[0];
            const e = args[1];
            const x_buff = args[2];
            const y_buff = args[3];
            if (this.listeners.onNodeDragEnd) {
                handled = true;
                this.listeners.onNodeDragEnd(node, e, x_buff, y_buff);
            }
        } else if (eventName === RGEventNames.onZoomEnd) {
            if (this.listeners.onZoomEnd) {
                handled = true;
                this.listeners.onZoomEnd();
            }
        } else if (eventName === RGEventNames.onNodeClick) {
            if (this.listeners.onNodeClick) {
                handled = true;
                const node = args[0];
                const e = args[1];
                this.listeners.onNodeClick(node, e);
            }
        } else if (eventName === RGEventNames.onLineClick) {
            if (this.listeners.onLineClick) {
                handled = true;
                const line = args[0];
                const link = args[1];
                const e = args[2];
                this.listeners.onLineClick(line, link, e);
            }
        } else if (eventName === RGEventNames.onNodeExpand) {
            if (this.listeners.onNodeExpand) {
                handled = true;
                const node = args[0];
                const e = args[1];
                this.listeners.onNodeExpand(node, e);
            }
        } else if (eventName === RGEventNames.onNodeCollapse) {
            if (this.listeners.onNodeCollapse) {
                handled = true;
                const node = args[0];
                const e = args[1];
                this.listeners.onNodeCollapse(node, e);
            }
        } else if (eventName === RGEventNames.onCanvasDragEnd) {
            if (this.listeners.onCanvasDragEnd) {
                handled = true;
                const e = args[0];
                this.listeners.onCanvasDragEnd(e);
            }
        } else if (eventName === RGEventNames.onCanvasClick) {
            if (this.listeners.onCanvasClick) {
                handled = true;
                const e = args[0];
                this.listeners.onCanvasClick(e);
            }
        } else if (eventName === RGEventNames.onCanvasSelectionEnd) {
            if (this.listeners.onCanvasSelectionEnd) {
                handled = true;
                const selectionView = args[0];
                const e = args[1];
                this.listeners.onCanvasSelectionEnd(selectionView, e);
            }
        } else if (eventName === RGEventNames.onContextmenu) {
            if (this.listeners.onContextmenu) {
                handled = true;
                const e = args[0];
                const objectType = args[1];
                const object = args[2];
                const eventPositionOnCanvas = args[3];
                const eventPositionOnView = args[4];
                this.listeners.onContextmenu(e, objectType, object, eventPositionOnCanvas, eventPositionOnView);
            }
        } else if (eventName === RGEventNames.onFullscreen) {
            if (this.listeners.onFullscreen) {
                handled = true;
                const fullscreen = args[0] as boolean;
                const callback = args[1];
                result = this.listeners.onFullscreen(fullscreen, callback);
            }
        } else if (eventName === RGEventNames.beforeAddNodes) {
            if (this.listeners.beforeAddNodes) {
                handled = true;
                const nodes = args[0] as JsonNode[];
                result = this.listeners.beforeAddNodes(nodes);
            }
        } else if (eventName === RGEventNames.beforeAddLines) {
            if (this.listeners.beforeAddLines) {
                handled = true;
                const lines = args[0] as JsonLine[];
                result = this.listeners.beforeAddLines(lines);
            }
        } else if (eventName === RGEventNames.onKeyboardDown) {
            if (this.listeners.onKeyboardDown) {
                handled = true;
                const event = args[0] as KeyboardEvent;
                result = this.listeners.onKeyboardDown(event);
            }
        } else if (eventName === RGEventNames.onKeyboardUp) {
            if (this.listeners.onKeyboardUp) {
                handled = true;
                const event = args[0] as KeyboardEvent;
                result = this.listeners.onKeyboardUp(event);
            }
        } else if (eventName === RGEventNames.onLineBeCreated) {
            if (this.listeners.onLineBeCreated) {
                handled = true;
                const rgActionParams: { fromNode: RGNode, toNode: RGNode, lineJson: JsonLine } = args[0];
                result = this.listeners.onLineBeCreated(rgActionParams);
            }
        } else if (eventName === RGEventNames.onCanvasDragStart) {
            if (this.listeners.onCanvasDragStart) {
                handled = true;
                const canvasPosition: RGPosition = args[0];
                const clientPosition: RGPosition = args[1];
                const event: RGUserEvent = args[2];
                result = this.listeners.onCanvasDragStart(canvasPosition, clientPosition, event);
            }
        } else if (eventName === RGEventNames.onResizeEnd) {
            if (this.listeners.onResizeEnd) {
                handled = true;
                const nodes: RGNode[] = args[0];
                const buff_x: number = args[1];
                const buff_y: number = args[2];
                const event: RGUserEvent = args[3];
                result = this.listeners.onResizeEnd(nodes, buff_x, buff_y, event);
            }
        } else if (eventName === RGEventNames.onResizeStart) {
            if (this.listeners.onResizeStart) {
                handled = true;
                const nodes: RGNode[] = args[0];
                const event: RGUserEvent = args[1];
                result = this.listeners.onResizeStart(nodes, event);
            }
        } else if (eventName === RGEventNames.beforeNodeResize) {
            if (this.listeners.beforeNodeResize) {
                handled = true;
                const node: RGNode = args[0];
                const newX: number = args[1];
                const newY: number = args[2];
                const newW: number = args[3];
                const newH: number = args[4];
                result = this.listeners.beforeNodeResize(node, newX, newY, newW, newH);
            }
        } else if (eventName === RGEventNames.onViewResize) {
            if (this.listeners.onViewResize) {
                handled = true;
                const newSize: {width:number, height: number} = args[0];
                result = this.listeners.onViewResize(newSize);
            }
        }
        return {
            result,
            handled
        }
    }

    /**
     * * Set event listeners
     * @param handler
     * @inner
     */
    setEventListener(handler: RGListeners) {
        Object.assign(this.listeners, handler);
    }
}
