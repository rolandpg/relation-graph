<script lang="ts">
import {
    RGJsonData,
    RGOptions,
} from '../../../../../../types';
import {RelationGraphCore} from "../../../../../../relation-graph-models/models/RelationGraphCore";
import {defineComponent, h, PropType} from "vue";
import {useRelationGraph} from "../hooks/useRelationGraph";
import {RGTips} from "../../../../../../relation-graph-models/utils/RGTips";
import {RGEventsDefine4Vue3} from "../../../types-vue3";
type RelationGraphClass = new (...args: any[]) => RelationGraphCore;
export default defineComponent({
    name: 'RelationGraph',
    props: {
        options: {
            required: false,
            type: Object as () => RGOptions
        },
        initialData: {
            required: false,
            type: Object as () => RGJsonData
        },
        relationGraphCore: {
            required: false,
            type: Function as unknown as PropType<RelationGraphClass>
        },
    },
    emits: RGEventsDefine4Vue3,
    setup(props, {slots, emit, expose, attrs}) {
        const {RelationGraph, graphInstance} = useRelationGraph({
            relationGraphCore: props.relationGraphCore,
        });
        /**
         * Slot name change:
         * graph-plug -> view
         * canvas-plug -> canvas
         * canvas-plug-above -> canvas-above
         * node-expand-holder -> node-expand-button
         */
        if (slots['graph-plug']) {
            throw new Error('Slot name "#graph-plug" has been renamed to "#view". Please update your code accordingly.');
        }
        if (slots['canvas-plug']) {
            throw new Error('Slot name "#canvas-plug" has been renamed to "#canvas". Please update your code accordingly.');
        }
        if (slots['canvas-plug-above']) {
            throw new Error('Slot name "#canvas-plug-above" has been renamed to "#canvas-above". Please update your code accordingly.');
        }
        if (slots['node-expand-holder']) {
            throw new Error('Slot name "#node-expand-holder" has been renamed to "#node-expand-button". Please update your code accordingly.');
        }
        // const propsListeners = getEventListeners(attrs);
        // if (Object.values(propsListeners).filter(fn => !!fn).length > 0) {
        //     for (const key of Object.keys(propsListeners)) {
        //         if (propsListeners[key]) {
        //             console.error('event:', key);
        //         }
        //     }
        //     throw new Error('Please use the @ tag to register events[' + Object.values(propsListeners).filter(fn => !!fn).join(',') + '] for your components. Example: @onNodeClick');
        // }
        expose({
            getInstance() {
                if (!props.options?.definitelyNoDataProviderNeeded) console.warn('[relation-graph]', RGTips.Vue3GetInstance);
                return graphInstance;
            },
            async setJsonData() {
                throw new Error(RGTips.setJsonData)
            }
        })
        return () => h(RelationGraph, {
            options: props.options,
            initialData: props.initialData,
            emitProxy: emit
        }, {
            ...slots
        });
    }
});
</script>
