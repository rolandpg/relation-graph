import {RelationGraphCore} from '../../../../relation-graph-models/models/RelationGraphCore';
import {getOrGenerateRGInstance} from './useRGDataProvider';
import RelationGraphWithProvider from '../core4svelte/web-components/RelationGraphWithProvider.svelte';
import type {ComponentProps} from 'svelte';
import type {RelationGraphEvents} from '../types-svelte';
import type {RGGenerateLineConfig, RGNode} from "../../../../types";

type RelationGraphProps = Omit<ComponentProps<RelationGraphWithProvider>, 'graphInstance'>;
type RelationGraphSlots = {
    default: {};
    view: {};
    canvas: {};
    'canvas-above': {};
    node: {
        node: RGNode
    };
    line: {
        lineConfig: RGGenerateLineConfig
    };
    'node-expand-button': {
        node: RGNode;
        expandHolderPosition: 'left' | 'right' | 'top' | 'bottom' | 'hide' | false;
        expandOrCollapseNode: (e: MouseEvent) => void;
    };
}

export function useRelationGraph({ relationGraphCore }: {
    relationGraphCore?: new (...args: any[]) => RelationGraphCore,
} = {}) {
    const graphInstance = getOrGenerateRGInstance(relationGraphCore);
    const RelationGraph = class RelationGraphBoundInstance extends RelationGraphWithProvider {
        declare $$prop_def: RelationGraphProps;
        declare $$events_def: RelationGraphEvents;
        declare $$slot_def: RelationGraphSlots;
        constructor(options: {
            target: HTMLElement;
            props?: RelationGraphProps;
            anchor?: HTMLElement
        }) {
            super({
                ...options,
                props: {
                    ...options?.props,
                    graphInstance
                }
            });
        }
    };
    return {
        RelationGraph,
        graphInstance
    };
}
