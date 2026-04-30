import { JsonLine, JsonNode, RGLineTarget, RGOptionsFull } from '../../types';
import { RelationGraphWith3Options1Update } from './RelationGraphWith3Options1Update';
/**
 * API class to obtain some derived or abstract information from options data
 */
export declare class RelationGraphWith3Options2API extends RelationGraphWith3Options1Update {
    constructor();
    /**
     * Get the currently creating line information through data options
     *  - This method is only for Hook (useCreatingLine). When using it, it should be obtained through the hook:
     *  ```ts
     *  import { RGHooks } from 'relation-graph-react';
     *  const creatingLine = RGHooks.useCreatingLine(graphInstance);
     *  ```
     * @param options
     * @inner
     *
     */
    getCreatingLine(options?: RGOptionsFull): {
        creating: boolean;
        fromTarget?: RGLineTarget;
        toTarget?: RGLineTarget;
        lineJson?: JsonLine;
    };
    /**
     * Get the currently creating node information through data options
     *  - This method is only for Hook (useCreatingNode). When using it, it should be obtained through the hook:
     *  ```ts
     *  import { RGHooks } from 'relation-graph-react';
     *  const creatingNode = RGHooks.useCreatingNode();
     *  ```
     * @param options
     * @inner
     */
    getCreatingNode(options?: RGOptionsFull): {
        creating: boolean;
        nodeJson?: JsonNode;
    };
}
