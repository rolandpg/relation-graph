<script lang="ts">
import {RelationGraphCore} from '../../../../relation-graph-models/models/RelationGraphCore';
import {initRawProperty4Vue2} from "../../../../relation-graph-models/utils/RGCommon";
import {createDefaultConfig} from "../../../../relation-graph-models/data/RGOptionsDataUtils";

export default {
    name: 'RGProvider',
    components: {},
    props: {
        relationGraphCore: {
            mustUseProp: false,
            default: null,
            type: Function
        },
        forLinker: {
            mustUseProp: false,
            default: false,
            type: Boolean
        }
    },
    data() {
        return {
            graphData: {
                rootNode: null,
                nodes: [],
                normalLines: [],
                fakeLines: []
            },
            runtimeData: {
                runtimeDATA4Links: [],
                runtimeDATA4ElLineTargets: [],
                runtimeDATA4ConnectTargets: [],
                runtimeDATA4NodeMap: new Map(),
                runtimeDATA4LinkMap: new Map(),
                runtimeDATA4ShouldRenderItems: {nodes: [], lines: [], fakeLines: []}
            },
            graphStore: {
                options: createDefaultConfig({}),
                graphInstance: null
            }
        };
    },
    provide() {
        return {
            graphStore: this.graphStore
        };
    },
    created() {
        this._selfGraphInstance = this.relationGraphCore ? Reflect.construct(this.relationGraphCore, []) : new RelationGraphCore();
        this._selfGraphInstance._rgAsConnectArea = this.forLinker;
        initRawProperty4Vue2(this.graphStore, 'graphInstance', this._selfGraphInstance);
        // console.log('Generate new graphInstance:', this.graphStore.graphInstance);
        this._selfGraphInstance.setReactiveData4Vue2(this.graphData, this.graphStore.options, this.runtimeData, initRawProperty4Vue2);
        this.$emit('onReady', this._selfGraphInstance);
    },
    render(h) {
        return this.$slots.default ? this.$slots.default[0] : null;
    }
};
</script>
