import {
    defineComponent,
    isReactive,
    markRaw,
    provide,
    ref,
    onMounted, inject, shallowRef, triggerRef
} from "vue";
import {
    ReactiveDataStores, RGFakeLine,
    RGGraphData, RGLine, RGLineTarget, RGNode, RGOptions, RGOptionsFull, WriteableData
} from "../../../../../../types";
import {RelationGraphCore} from "../../../../../../relation-graph-models/models/RelationGraphCore";
import {RelationGraphProvideKey} from "../../../constants";
import {RGProviderData} from "../../../types-vue3";

export function generateNewRGInstance(relationGraphCore?: new (...args: any[]) => RelationGraphCore, forLinker = false) {
    // console.log('No parent RGProvider found, creating new graphInstance', forLinker);
    const graphInstance = markRaw(relationGraphCore ? Reflect.construct(relationGraphCore, []) : new RelationGraphCore());
    graphInstance._rgAsConnectArea = forLinker;
    return graphInstance;
}
export function getOrGenerateRGInstance(relationGraphCore?: new (...args: any[]) => RelationGraphCore, forLinker = false) {
    const parentProvider = inject<RGProviderData | null>(RelationGraphProvideKey, null);
    if (parentProvider) {
        // console.log('Use existing graphInstance from parent RGProvider');
        return parentProvider.graphInstance;
    } else {
        return generateNewRGInstance(relationGraphCore, forLinker);
    }
}

const createFakeRef = (getter: () => any) => {
    return {
        get value() {
            return getter();
        }
    }
}
export function defineRGDataProviderComponent(graphInstance: RelationGraphCore) {
    return defineComponent({
        name: 'RGDataProvider',
        props: {
            options: {
                required: false,
                type: Object as () => RGOptions
            }
        },
        setup(props, { slots }) {
            const parentProvider = inject<RGProviderData | null>(RelationGraphProvideKey, null);
            if (!parentProvider) {
                // console.error('RGDataProvider');
                const graphData = ref<RGGraphData>({
                    rootNode: undefined,
                    nodes: [],
                    normalLines: [],
                    fakeLines: []
                });
                const graphOptions = ref<RGOptions>({});
                const runtimeDATA4ShouldRenderItems = ref<{
                    nodes: RGNode[],
                    lines: RGLine[],
                    fakeLines: RGFakeLine[],
                }>({
                    nodes: [],
                    lines: [],
                    fakeLines: [],
                });
                const textContainer4FakeLineRef = ref(null);
                const textContainer4NormalRef = ref(null);
                const runtimeDATA4ElLineTargets = ref([]);
                const runtimeDATA4ConnectTargets = ref([]);
                const runtimeDATA4Links = ref([]);
                const runtimeDATA4NodeMap = ref(new Map());
                const runtimeDATA4LinkMap = ref(new Map());
                const runtimeDATA4ShouldRenderNodes = createFakeRef(() => runtimeDATA4ShouldRenderItems.value.nodes);
                const runtimeDATA4ShouldRenderLines = createFakeRef(() => runtimeDATA4ShouldRenderItems.value.lines);
                const runtimeDATA4ShouldRenderFakeLines = createFakeRef(() => runtimeDATA4ShouldRenderItems.value.fakeLines);
                // const runtimeDATA4ShouldRenderNodes = createFakeRef(() => graphData.value.nodes);
                // const runtimeDATA4ShouldRenderLines = createFakeRef(() => graphData.value.normalLines);
                // const runtimeDATA4ShouldRenderFakeLines = createFakeRef(() => graphData.value.fakeLines);
                // const runtimeDATA4ShouldRenderNodes = shallowRef<RGNode[]>([]);
                // const runtimeDATA4ShouldRenderLines = shallowRef<RGLine[]>([]);
                // const runtimeDATA4ShouldRenderFakeLines = shallowRef<RGFakeLine[]>([]);
                // const graphOptions = shallowRef<RGOptions>(graphInstance.options);
                // const runtimeDATA4ElLineTargets = shallowRef([]);
                // const runtimeDATA4ConnectTargets = shallowRef([]);
                // const runtimeDATA4Links = shallowRef([]);
                // const runtimeDATA4NodeMap = shallowRef(new Map());
                // const runtimeDATA4LinkMap = shallowRef(new Map());

                const store4Options: WriteableData<RGOptionsFull> = {
                    set: (newOptions: RGOptionsFull) => {
                        // // graphOptions.value = newOptions;
                        // triggerRef(graphOptions);
                        // console.error('graphOptions set triggerRef:');
                    },
                };
                const store4ShouldRenderNodes: WriteableData<RGNode[]> = {
                    set: (nodes: RGNode[]) => {
                        // if (runtimeDATA4ShouldRenderNodes.value.length !== nodes.length) {
                        //     runtimeDATA4ShouldRenderNodes.value = nodes;
                        // } else {
                        //     console.error('store4ShouldRenderNodes triggerRef:', nodes.length);
                        //     triggerRef(runtimeDATA4ShouldRenderNodes);
                        // }
                    },
                };
                const store4ShouldRenderLines: WriteableData<RGLine[]> = {
                    set: (lines: RGLine[]) => {
                        // if (runtimeDATA4ShouldRenderLines.value.length !== lines.length) {
                        //     runtimeDATA4ShouldRenderLines.value = lines;
                        // } else {
                        //     console.error('store4ShouldRenderLines triggerRef', lines.length);
                        //     triggerRef(runtimeDATA4ShouldRenderLines);
                        // }
                    },
                };
                const store4ShouldRenderFakeLines: WriteableData<RGFakeLine[]> = {
                    set: (fakeLines: RGFakeLine[]) => {
                        // if (runtimeDATA4ShouldRenderFakeLines.value.length !== fakeLines.length) {
                        //     runtimeDATA4ShouldRenderFakeLines.value = fakeLines;
                        // } else {
                        //     console.error('store4ShouldRenderFakeLines set triggerRef:', fakeLines.length);
                        //     triggerRef(runtimeDATA4ShouldRenderFakeLines);
                        // }
                    },
                }
                const dataStores: ReactiveDataStores = {
                    store4Options,
                    store4ShouldRenderNodes,
                    store4ShouldRenderLines,
                    store4ShouldRenderFakeLines,
                    optionsRef: graphOptions,
                    shouldRenderNodesRef: runtimeDATA4ShouldRenderNodes,
                    shouldRenderLinesRef: runtimeDATA4ShouldRenderLines,
                    shouldRenderFakeLinesRef: runtimeDATA4ShouldRenderFakeLines,
                    textContainer4FakeLineRef,
                    textContainer4NormalRef
                }
                graphInstance.setReactiveData4Vue3(dataStores, graphData.value, graphOptions.value, {
                    runtimeDATA4Links: runtimeDATA4Links.value,
                    runtimeDATA4ElLineTargets: runtimeDATA4ElLineTargets.value,
                    runtimeDATA4ConnectTargets: runtimeDATA4ConnectTargets.value,
                    runtimeDATA4NodeMap: runtimeDATA4NodeMap.value,
                    runtimeDATA4LinkMap: runtimeDATA4LinkMap.value,
                    runtimeDATA4ShouldRenderItems: runtimeDATA4ShouldRenderItems.value
                }, (item: any, propertyName: string, initialValue: any) => {
                    item[propertyName] = markRaw(initialValue);
                });
                graphInstance.setOptions(props.options || {});
                // console.log('Providing new graphInstance on RelationGraph component', dataStores.optionsRef.value);
                provide(RelationGraphProvideKey, {graphInstance});
            }
            onMounted(() => {
                // console.error('RGDataProvider mounted');
            });
            return () => slots.default ? slots.default() : null;
        },
    });
}
