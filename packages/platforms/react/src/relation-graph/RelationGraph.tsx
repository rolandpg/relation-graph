import React, {PropsWithChildren, useEffect, useImperativeHandle} from 'react';
import {
    RelationGraphExpose
} from '../../../../types';
import {RelationGraphJsxProps} from '../types-react';
import RelationGraphUI from './src/core4react/RelationGraphUI';
import {getOrGenerateRGInstance} from "./src/hooks/RGDataProvider";
import {RGDataProvider} from "./src/hooks/RGDataProvider";
import {RGTips} from "../../../../relation-graph-models/utils/RGTips";
import {getEventListeners} from "../../../../relation-graph-models/utils/RGIntergration";


const RelationGraph: React.ForwardRefRenderFunction<RelationGraphExpose, PropsWithChildren<RelationGraphJsxProps>> = (props, ref) => {
    const graphInstance = getOrGenerateRGInstance(props.relationGraphCore);

    useImperativeHandle(ref, (): RelationGraphExpose => {
        return {
            getInstance() {
                if (!props.options?.definitelyNoDataProviderNeeded) console.warn('[relation-graph]', RGTips.ReactGetInstance);
                return graphInstance;
            },
            async setJsonData() {
                throw new Error(RGTips.setJsonData)
            }
        };
    }, []);
    useEffect(() => {
        graphInstance.updateOptions(props.options);
    }, [props.options]);
    useEffect(() => {
        graphInstance.setListeners(getEventListeners(props));
    }, [props]);
    return (
        <RGDataProvider graphInstance={graphInstance}>
            <RelationGraphUI { ...props} />
        </RGDataProvider>
    );
};

export default React.forwardRef(RelationGraph);
