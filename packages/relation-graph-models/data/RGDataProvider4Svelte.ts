import {
    ReactiveDataStores, ReactiveDataUpdaters
} from '../../types';
import {DataCommits, RGDataProvider} from "./RGDataProvider";

/**
 * 数据提供者
 * 专门负责数据的增删改查，并自动触发视图更新
 */
export class RGDataProvider4Svelte extends RGDataProvider {
    dataStores: ReactiveDataStores;
    // updaters: ReactiveDataUpdaters;
    constructor(dataStores: ReactiveDataStores, updaters: ReactiveDataUpdaters) {
        super();
        this.dataStores = dataStores;
        // this.updaters = updaters;
        this.updateViewHook = (commits: DataCommits) => {
            //
            // this.updaters.updateStore4Options(this.getOptions());
            // this.updaters.updateStore4ShouldRenderNodes(this.getShouldRenderNodes());
            // this.updaters.updateStore4ShouldRenderLines(this.getShouldRenderLines());
            // this.updaters.updateStore4FakeLines(this.getFakeLines());
            // this._updateViewHook(commits);
            // console.log('[RGDataProvider4Svelte] updateViewHook called with commits:', commits);
            if (commits.optionsChanged) {
                this.dataStores.store4Options.set(this.getOptions());
            }
            if (commits.nodesListChanged || commits.changedNodes.length > 0) {
                this.dataStores.store4ShouldRenderNodes.set(this.getShouldRenderNodes());
                // console.log('[updateViewHook]nodesListChanged');
            // } else if (commits.changedNodes.length > 0) {
            //     this.dataStores.store4ShouldRenderNodes.set(this.getShouldRenderNodes());
                // console.log('[updateViewHook]changedNodes:', commits.changedNodes.length);
            }
            if (commits.nodesListChanged || commits.linesListChanged || commits.changedLines.length > 0) {
                this.dataStores.store4ShouldRenderLines.set(this.getShouldRenderLines());
                // console.log('[updateViewHook]linesListChanged');
            // } else if (commits.changedLines.length > 0) {
            //     this.dataStores.store4ShouldRenderLines.set(this.getShouldRenderLines());
                // console.log('[updateViewHook]changedLines:', commits.changedLines.length);
            }
            if (commits.fakeLinesListChanged || commits.changedFakeLines.length > 0) {
                this.dataStores.store4ShouldRenderFakeLines.set([...this.getShouldRenderFakeLines()]);
                // console.log('[updateViewHook]fakeLinesListChanged');
            // } else if (commits.changedFakeLines.length > 0) {
            //     this.dataStores.store4ShouldRenderFakeLines.set(this.getShouldRenderFakeLines());
                // console.log('[updateViewHook]changedFakeLines:', commits.changedFakeLines.length);
            }
        };
    }
}
