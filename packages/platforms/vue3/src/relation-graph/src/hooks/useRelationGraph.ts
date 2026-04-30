import {
    defineComponent,
    h,
    onMounted,
    onBeforeUnmount, watch
} from "vue";
import {
    RGEventNames, RGJsonData, RGOptions
} from "../../../../../../types";
import {RelationGraphCore} from "../../../../../../relation-graph-models/models/RelationGraphCore";
import RelationGraphUI from "../core4vue3/RelationGraphUI.vue";
import {relationGraphVersionInfo} from "../../../../../../relation-graph-models/utils/RGCommon";
import {defineRGDataProviderComponent, getOrGenerateRGInstance} from "./useRGDataProvider";
import {RGEventsDefine4Vue3} from "../../../types-vue3";

/**
 * This is a sophisticated and decoupled pattern:
 *
 * `useRGDataProvider`: Uses `provide`/`inject` (Vue's Context API) to "provide" a single, markRaw-marked `graphInstance` instance.
 *
 * `useRelationGraph`: A Hook that dynamically creates and returns a `graphInstance` instance and a `<RelationGraph>` component bound to that instance.
 * @param emitProxy
 * @param relationGraphCore
 */
export function useRelationGraph({ relationGraphCore}: {
    relationGraphCore?: new (...args: any[]) => RelationGraphCore,
} = {}) {
    const graphInstance = getOrGenerateRGInstance(relationGraphCore);
    const rgDataProvider = defineRGDataProviderComponent(graphInstance);
    return {
        RelationGraph: defineComponent({
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
                emitProxy: {
                    required: false,
                    type: Function as () => (any | void),
                }
            },
            emits: RGEventsDefine4Vue3,
            setup(props, { slots, emit }) {
                // console.error('RelationGraph:props:', slots);
                onMounted(() => {
                    const eventEmit = props.emitProxy || emit;
                    graphInstance.setEventEmitHook((eventName: RGEventNames, ...eventArgs: any[]) => {
                        eventEmit(eventName, ...eventArgs);
                    });
                    // 注意：
                    // 根据MIT许可证的规定，允许您自由地使用、修改和分发源代码。您可以根据自己的需求对源代码进行更改。
                    // 然而，您仍然需要遵守MIT许可证的其他规定，如保留版权声明和免责声明等
                    // relation-graph是relation-graph的网址是它的版权声明，请勿注释掉这一行信息
                    relationGraphVersionInfo('Vue3');
                    if (props.options) {
                        graphInstance.setOptions(props.options || {});
                    }
                    graphInstance.ready();
                    if (props.initialData) {
                        graphInstance.applyInitialData(props.initialData)
                    }
                });
                // watch(props.options, (newOptions) => {
                //     graphInstance.setOptions(newOptions || {});
                // }, {deep: true, immediate: true});
                onBeforeUnmount(() => {
                    graphInstance!.beforeUnmount();
                })
                return () => h(rgDataProvider, {options: props.options}, {
                    default: () => h(RelationGraphUI, props, slots)
                });
            },
        }),
        graphInstance
    };
}
