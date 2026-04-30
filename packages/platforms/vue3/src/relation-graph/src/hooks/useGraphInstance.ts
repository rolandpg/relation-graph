import {
    RelationGraphInstance,
} from "../../../../../../types";
import {inject} from "vue";
import {RelationGraphProvideKey} from "../../../constants";
import {RGProviderData} from "../../../types-vue3";

export function useGraphInstance<InstanceType extends RelationGraphInstance>(
): InstanceType {
    const relationGraphContext = inject<RGProviderData | null>(RelationGraphProvideKey, null);
    if (!relationGraphContext) {
        // 可根据需要抛错或提供降级数据
        throw new Error('RGHooks.useGraphInstance must be used inside RGProvider or RelationGraph tag.');
    }
    return relationGraphContext?.graphInstance as InstanceType;
}


// export function useCreatingLine(): {
//     creating: boolean,
//     fromTarget?: RGLineTarget,
//     toTarget?: RGLineTarget,
//     lineJson?: JsonLine
// } {
//     const relationGraphContext = inject<RGProviderData>(RelationGraphProvideKey);
//     if (!relationGraphContext) {
//         // 可根据需要抛错或提供降级数据
//         throw new Error('RGHooks.useGraphInstance must be used inside RGProvider or RelationGraph tag.');
//     }
//     const graphInstance = relationGraphContext?.graphInstance;
//     if (!graphInstance.options.creatingLinePlot) {
//         return {
//             creating: false
//         };
//     }
//     const {line, from, to} = graphInstance.generateCreatingLineConfig();
//     return {
//         creating: true,
//         fromTarget: from,
//         toTarget: to,
//         lineJson: line
//     };
// }
//
// export function useCreatingNode(): {
//     creating: boolean,
//     nodeJson?: JsonNode
// } {
//     const relationGraphContext = inject<RGProviderData>(RelationGraphProvideKey);
//     if (!relationGraphContext) {
//         // 可根据需要抛错或提供降级数据
//         throw new Error('RGHooks.useGraphInstance must be used inside RGProvider or RelationGraph tag.');
//     }
//     const graphInstance = relationGraphContext?.graphInstance;
//     // if (!graphInstance.options.creatingNodePlot) {
//     //     return {
//     //         creating: false
//     //     };
//     // }
//     return {
//         creating: graphInstance.options.creatingNodePlot,
//         nodeJson: graphInstance.options.newNodeTemplate
//     };
// }
