import React, {createContext} from 'react';
import type {RelationGraphInstance} from '../../../../../../../../types';
import {RGDataStore} from "../../../../../types-react";
import {createDefaultConfig} from "../../../../../../../../relation-graph-models/data/RGOptionsDataUtils";

export type RGUpdateAction = (rgInstance: RelationGraphInstance) => void;
export type RelationGraphReducer = (state: RelationGraphInstance, action: RGUpdateAction) => RelationGraphInstance;
export const relationGraphReducer: RelationGraphReducer = (state, action): RelationGraphInstance => {
    action(state);
    return state;
};
export const RelationGraphStoreContext = createContext<RelationGraphInstance | null>(null) as React.Context<RelationGraphInstance>;
export const RGUpdateContext = createContext<((v?: RelationGraphInstance) => void) | null>(null) as React.Context<((v?: RelationGraphInstance) => void)>;
export const RGUpdateSignalContext = createContext<number>(0) as React.Context<number>;
export const RGViewDataContext = createContext<RGDataStore>({
    shouldRenderLines: [],
    shouldRenderNodes: [],
    shouldRenderFakeLines: [],
    options: createDefaultConfig({})
}) as React.Context<RGDataStore>;

