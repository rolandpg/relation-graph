import { RGListeners } from '../../types';
import { RelationGraphWith99API } from './RelationGraphWith99API';
/**
 * The final instance class of the relation-graph component, the class that is actually instantiated
 * - Each <RGProvider><RelationGraph /></RGProvider> component creates and binds a RelationGraphCore instance, which allows the component UI and user to call the API for data logic and interaction
 * - It will have all the capabilities of the following classes through integration:
 *      - RelationGraphBase.ts
 *      - RelationGraphWith1View.ts
 *      - RelationGraphWith2Data.ts
 *      - RelationGraphWith2Data1Getter.ts
 *      - RelationGraphWith2Data2Analysis.ts
 *      - RelationGraphWith2Data3Update.ts
 *      - RelationGraphWith2Data4ConnectTarget.ts
 *      - RelationGraphWith2Data5LineConfig.ts
 *      - RelationGraphWith3Options1Update.ts
 *      - RelationGraphWith3Options2API.ts
 *      - RelationGraphWith4Line.ts
 *      - RelationGraphWith5Zoom.ts
 *      - RelationGraphWith6Effect.ts
 *      - RelationGraphWith6Layout.ts
 *      - RelationGraphWith7Event.ts
 *      - RelationGraphWith9EasyView.ts
 *      - RelationGraphWith91Editing.ts
 *      - RelationGraphWith92MiniView.ts
 *      - RelationGraphWith93Image.ts
 *      - RelationGraphWith95Dom.ts
 *      - RelationGraphWith99API.ts
 *
 */
export declare class RelationGraphCore extends RelationGraphWith99API {
    constructor();
    setListeners(listeners: RGListeners): void;
    /**
     * [Used internally by relation-graph], this method will be called to initialize some configurations based on options (such as creating a layoutor based on the options.layout configuration), and to obtain information such as viewport size.
     * @inner
     */
    ready(): void;
    /**
     * @inner
     */
    viewComponentUnmounted: boolean;
    /**
     * @inner
     */
    beforeUnmount(): void;
}
