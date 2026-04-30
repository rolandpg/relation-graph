import {
    JsonLine, JsonNode,
    RelationGraphInstance,
    RGLineTarget
} from "../../../../../../types";
import {useContext} from "react";
import {RelationGraphStoreContext, RGUpdateSignalContext} from "../core4react/store/reducers/RGStore";
import {useGraphStore} from "./useGraphStore";

export function useGraphInstance<InstanceType extends RelationGraphInstance>(
): InstanceType {
    const graphInstance = useContext(RelationGraphStoreContext);
    if (!graphInstance) {
        throw new Error("'useGraphInstance' must be used within 'RGProvider'");
    }
    return graphInstance as InstanceType;
}

export function useAutoUpdateView(): number {
    const updateSignal = useContext(RGUpdateSignalContext);
    if (updateSignal === undefined) {
        throw new Error("'useAutoUpdateView' must be used within 'RGProvider'");
    }
    return updateSignal;
}
