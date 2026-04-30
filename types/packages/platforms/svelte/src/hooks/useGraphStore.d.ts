import { RGDataStore, RGSvelteHooksStore } from '../types-svelte';
import { RGConnectingNode, RGCreatingLine, RGEditingLine, RGEditingNodes, RGSelectionView, RGViewInformation } from '../../../../types';
export declare function useGraphStore(): RGDataStore;
export declare function useHookStore(): RGSvelteHooksStore;
export declare function useCreatingLine(): import('svelte/store').Readable<RGCreatingLine>;
export declare function useCreatingNode(): import('svelte/store').Readable<import('..').RGCreatingNode>;
export declare function useEditingNodes(): import('svelte/store').Readable<RGEditingNodes>;
export declare function useEditingLine(): import('svelte/store').Readable<RGEditingLine>;
export declare function useConnectingNode(): import('svelte/store').Readable<RGConnectingNode>;
export declare function useViewInformation(): import('svelte/store').Readable<RGViewInformation>;
export declare function useSelection(): import('svelte/store').Readable<RGSelectionView & {
    show: boolean;
}>;
export declare function useCheckedItem(): import('svelte/store').Readable<import('..').RGCheckedItem>;
