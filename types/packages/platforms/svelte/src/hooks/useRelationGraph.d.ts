import { RelationGraphCore } from '../../../../relation-graph-models/models/RelationGraphCore';
import { default as RelationGraphWithProvider } from '../core4svelte/web-components/RelationGraphWithProvider.svelte';
import { ComponentProps } from 'svelte';
import { RelationGraphEvents } from '../types-svelte';
import { RGGenerateLineConfig, RGNode } from '../../../../types';
type RelationGraphProps = Omit<ComponentProps<RelationGraphWithProvider>, 'graphInstance'>;
type RelationGraphSlots = {
    default: {};
    view: {};
    canvas: {};
    'canvas-above': {};
    node: {
        node: RGNode;
    };
    line: {
        lineConfig: RGGenerateLineConfig;
    };
    'node-expand-button': {
        node: RGNode;
        expandHolderPosition: 'left' | 'right' | 'top' | 'bottom' | 'hide' | false;
        expandOrCollapseNode: (e: MouseEvent) => void;
    };
};
export declare function useRelationGraph({ relationGraphCore }?: {
    relationGraphCore?: new (...args: any[]) => RelationGraphCore;
}): {
    RelationGraph: {
        new (options: {
            target: HTMLElement;
            props?: RelationGraphProps;
            anchor?: HTMLElement;
        }): {
            [prop: string]: any;
            $$prop_def: RelationGraphProps;
            $$events_def: RelationGraphEvents;
            $$slot_def: RelationGraphSlots;
            $capture_state(): void;
            $inject_state(): void;
            $$: any;
            $$set: any;
            $destroy(): void;
            $on<K extends string>(type: K, callback: ((e: any) => void) | null | undefined): () => void;
            $set(props: Partial<any>): void;
        };
    };
    graphInstance: RelationGraphCore;
};
export {};
