import {
    ReactiveDataStores
} from '../../types';
import {DataCommits, RGDataProvider} from "./RGDataProvider";

/**
 * 数据提供者
 * 专门负责数据的增删改查，并自动触发视图更新
 */
export class RGDataProvider4React extends RGDataProvider {
    constructor(dataStores: ReactiveDataStores, updateViewHook: () => void) {
        super();
        // this.updateViewHook = updateViewHook;
        updateViewHook();
        this.updateViewHook = (commits: DataCommits) => {
            if (commits.optionsChanged) {
                dataStores.store4Options.set(this.getOptions());
                // console.log('[updateViewHook]optionsChanged');
            }
            if (commits.linesListChanged || commits.changedLines.length > 0 || commits.nodesListChanged || commits.changedNodes.length > 0) {
                const nodes = this.getShouldRenderNodes();
                dataStores.store4ShouldRenderNodes.set([...nodes]);
                // console.log('[updateViewHook]nodesListChanged:', nodes.length);
            // } else if (commits.changedNodes.length > 0) {
            //     dataStores.store4ShouldRenderNodes.set(this.getShouldRenderNodes());
            //     console.log('[updateViewHook]changedNodes:', commits.changedNodes.length);
            }
            if (commits.linesListChanged || commits.changedLines.length > 0) {
                const lines = this.getShouldRenderLines();
                dataStores.store4ShouldRenderLines.set(lines);
                // console.log('[updateViewHook]linesListChanged:', lines.length);
            // } else if (commits.changedLines.length > 0) {
            //     dataStores.store4ShouldRenderLines.set(this.getShouldRenderLines());
            //     console.log('[updateViewHook]changedLines:', commits.changedLines.length);
            }
            if (commits.fakeLinesListChanged) {
                dataStores.store4ShouldRenderFakeLines.set([...this.getShouldRenderFakeLines()]);
                // console.log('[updateViewHook]fakeLinesListChanged');
            } else if (commits.changedFakeLines.length > 0) {
                dataStores.store4ShouldRenderFakeLines.set(this.getShouldRenderFakeLines());
                // console.log('[updateViewHook]changedFakeLines:', commits.changedFakeLines.length);
            }
        };
    }

}
