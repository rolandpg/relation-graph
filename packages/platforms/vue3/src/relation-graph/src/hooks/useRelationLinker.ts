import {
    defineComponent,
    defineEmits,
    h,
    onMounted,
    onBeforeUnmount,
    ShortEmitsToObject, watch
} from "vue";
import {
    RGEventNames, RGLine,RGOptions, JsonLine
} from "../../../../../../types";
import {RelationGraphCore} from "../../../../../../relation-graph-models/models/RelationGraphCore";
import {relationGraphVersionInfo} from "../../../../../../relation-graph-models/utils/RGCommon";
import RelationLinkerUI from "../core4vue3/RelationLinkerUI.vue";
import {defineRGDataProviderComponent, getOrGenerateRGInstance} from "./useRGDataProvider";
import type {RGEventEmits} from "../../../types-vue3";


function defineRelationLinkerUIFrameComponent(graphInstance: RelationGraphCore, {options, emitProxy}: {
    options?: RGOptions,
    emitProxy?: ShortEmitsToObject<RGEventEmits>
}) {
    return defineComponent({
        name: 'RelationLinkerUIFrame',
        props: {
            lines: {
                type: Array<JsonLine>,
                required: true
            }
        },
        setup(linkerProps: {lines: JsonLine[]}, { slots }) {
            const emit = emitProxy ?? defineEmits<RGEventEmits>();
            graphInstance.setEventEmitHook((eventName: RGEventNames, ...eventArgs: any[]) => {
                emit(eventName, ...eventArgs);
            });

            const applyReactiveData = async(lines: JsonLine[]) => {
                if (lines) {
                    graphInstance.clearGraph();
                    graphInstance.addFakeLines(lines);
                    // console.error('applyReactiveData:', lines);
                }
            }
            watch(
                () => linkerProps.lines,
                async (newLines) => {
                    await applyReactiveData(newLines);
                },
                {deep: true}
            )
            onMounted(() => {
                // 注意：
                // 根据MIT许可证的规定，允许您自由地使用、修改和分发源代码。您可以根据自己的需求对源代码进行更改。
                // 然而，您仍然需要遵守MIT许可证的其他规定，如保留版权声明和免责声明等
                // relation-graph是relation-graph的网址是它的版权声明，请勿注释掉这一行信息
                relationGraphVersionInfo('Vue-Linker')
                graphInstance.ready();
                // console.error('RelationLinkerUIFrame mounted, data:', linkerProps);
                // console.error('RelationLinkerUIFrame mounted, lines:', linkerProps.lines);
                if (linkerProps.lines) {
                    applyReactiveData(linkerProps.lines);
                }
            })
            onBeforeUnmount(() => {
                graphInstance!.beforeUnmount();
            })
            return () => h(RelationLinkerUI, {}, slots);
        },
    });
}
export function useRelationLinker({relationGraphCore, options, emitProxy}: {
    options?: RGOptions,
    relationGraphCore?: new (...args: any[]) => RelationGraphCore,
    emitProxy?: ShortEmitsToObject<RGEventEmits>,
} = {}) {
    const graphInstance = getOrGenerateRGInstance(relationGraphCore, true);
    const rgDataProvider = defineRGDataProviderComponent(graphInstance);
    const RelationLinkerUIFrame = defineRelationLinkerUIFrameComponent(graphInstance, {
        options, emitProxy
    });
    const RelationLinkerWrapper = defineComponent({
        name: 'RelationLinker',
        props: {
          lines: {
                type: Array<RGLine>,
                required: true
          }
        },
        setup(linkerProps: {lines: RGLine[]}, { attrs, slots }) {
            // console.error('RelationLinker', linkerProps);
            onMounted(() => {
                // console.error('RelationLinker mounted', linkerProps);
            });
            return () => h(rgDataProvider, {}, {
                default: () => h(RelationLinkerUIFrame, linkerProps, slots)
            });
        },
    });
    return {
        RGProvider: rgDataProvider,
        RelationLinker: RelationLinkerWrapper,
        VueLinker: RelationLinkerWrapper,
        graphInstance
    };
}
export const useVueLinker = useRelationLinker;
