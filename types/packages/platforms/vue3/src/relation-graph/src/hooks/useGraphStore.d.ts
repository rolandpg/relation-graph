import { Ref } from 'vue';
import { RGCheckedItem, RGConnectingNode, RGCreatingLine, RGCreatingNode, RGEditingLine, RGEditingNodes, RGOptionsFull, RGSelectionView, RGViewInformation } from '../../../../../../types';
export declare function useGraphStore(): {
    optionsRef: Ref<RGOptionsFull>;
};
export declare function useGraphOptions(): Ref<RGOptionsFull>;
export declare function useCreatingLine(): Ref<RGCreatingLine>;
export declare function useCreatingNode(): Ref<RGCreatingNode>;
export declare function useEditingNodes(): Ref<RGEditingNodes>;
export declare function useEditingLine(): Ref<RGEditingLine>;
export declare function useConnectingNode(): Ref<RGConnectingNode>;
export declare function useViewInformation(): Ref<RGViewInformation>;
export declare function useSelection(): Ref<RGSelectionView & {
    show: boolean;
}>;
export declare function useCheckedItem(): Ref<RGCheckedItem>;
