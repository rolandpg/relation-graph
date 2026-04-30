import { RGEventEmitHook, RGEventHandler, RGEventNames, RGListeners, RGOptionsFull } from '../../types';
import { RGDataProvider } from '../data/RGDataProvider';
/**
 * relation-graph component base class, providing common API methods
 */
export declare class RelationGraphBase {
    listeners: RGListeners;
    private useReactiveDataToAutoUpdateView;
    protected instanceId: string;
    dataProvider: RGDataProvider;
    options: RGOptionsFull;
    constructor();
    /**
     * Generate a highly likely unique id, the probability of non-duplication depends on the parameter idLength (the length of the id)
     * @param idLength The length of the id, default is 5
     */
    generateNewUUID(idLength?: number): string;
    /**
     * * Enable or disable logging functionality
     * @param enable
     */
    enableDebugLog(enable: boolean): void;
    /**
     * Request view update
     * Used to update canvas drawing, subsequent canvas drawing will be upgraded to use WebGL to improve performance
     * @protected
     */
    protected _dataUpdated(): void;
    private _dataUpdatedRequested;
    /**
     * @inner
     * Reuqest Trigger view update
     * @private
     */
    protected _requestDataUpdate(): void;
    /**
     * Trigger view update for React/Svelte/Canvas
     * @private
     */
    private _doSomethingAfterDataUpdated;
    protected eventHandlers: RGEventHandler[];
    /**
     * * Register event handler
     * @param handler: RGEventHandler
     */
    addEventHandler(handler: RGEventHandler): void;
    /**
     * * Remove event handler
     * @param handler: RGEventHandler
     */
    removeEventHandler(handler: RGEventHandler): void;
    protected _emitHook: RGEventEmitHook;
    /**
     * * Set the event hook, For Vue2,Vue3 only
     * @param emitHook
     */
    setEventEmitHook(emitHook: RGEventEmitHook): void;
    /**
     * Trigger event
     * @param eventName Name of the event
     * @param object Parameters passed to the event handler
     */
    protected emitEvent(eventName: RGEventNames, ...args: any[]): false | import('../../types').RGCoordinate | undefined;
    /**
     * Protected Method to trigger the default event handler, i.e., trigger the events set in jsx
     * @param eventName
     * @param args
     * @protected
     */
    protected defaultEventHandler(eventName: RGEventNames, ...args: any[]): {
        result: false | void | import('../../types').RGCoordinate;
        handled: boolean;
    };
    /**
     * * Set event listeners
     * @param handler
     * @inner
     */
    setEventListener(handler: RGListeners): void;
}
