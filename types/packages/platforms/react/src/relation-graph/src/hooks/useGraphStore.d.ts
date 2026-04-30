import { RGDataStore } from '../../../types-react';
import { RGCheckedItem, RGConnectingNode, RGCreatingLine, RGCreatingNode, RGEditingLine, RGEditingNodes, RGSelectionView, RGViewInformation } from '../../../../../../types';
export declare function useGraphStore(): RGDataStore;
export declare function useCreatingLine(): RGCreatingLine;
export declare function useCreatingNode(): RGCreatingNode;
export declare function useEditingNodes(): RGEditingNodes;
export declare function useEditingLine(): RGEditingLine;
export declare function useConnectingNode(): RGConnectingNode;
export declare function useViewInformation(): RGViewInformation;
export declare function useSelection(): RGSelectionView & {
    show: boolean;
};
export declare function useCheckedItem(): RGCheckedItem;
