import React, {PropsWithChildren, useMemo,} from 'react';
import {getOrGenerateRGInstance, RGDataProvider} from './RGDataProvider';
import RelationGraphUI from '../core4react/RelationGraphUI';
import {
    RGJsonData,
    RGOptions
} from "../../../../../../types";
import {RelationGraphCore} from "../../../../../../relation-graph-models/models/RelationGraphCore";
import {RelationGraphWithProps} from "../../../types-react";

type UseRelationGraphParams = {
    // options?: RGOptions;
    // initialData?: RGJsonData;
    relationGraphCore?: new (...args: any[]) => RelationGraphCore;
};
export function useRelationGraph(params: UseRelationGraphParams = {}) {
    const graphInstance = getOrGenerateRGInstance(params.relationGraphCore);
    const RelationGraph = useMemo(() => {
        // console.log('Creating a MemoizedRelationGraph...');
        const MemoizedRelationGraph: React.FC<PropsWithChildren<Omit<RelationGraphWithProps, 'relationGraphCore'>>> = (props) => {
            return (
                <RGDataProvider graphInstance={graphInstance}>
                    <RelationGraphUI {...props}>
                        {props.children}
                    </RelationGraphUI>
                </RGDataProvider>
            );
        };
        MemoizedRelationGraph.displayName = 'RelationGraph';
        return MemoizedRelationGraph;
    }, []);
    return {
        RelationGraph,
        graphInstance,
    };
}
