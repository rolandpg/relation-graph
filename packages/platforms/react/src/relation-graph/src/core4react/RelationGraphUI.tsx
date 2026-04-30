import React, {PropsWithChildren, useEffect} from 'react';
import {devLog, relationGraphVersionInfo} from '../../../../../../relation-graph-models/utils/RGCommon';
import {RelationGraphWithProps} from "../../../types-react";
import {getEventListeners} from "../../../../../../relation-graph-models/utils/RGIntergration";
import RelationGraphView from "./RelationGraphView";
import {useGraphInstance} from "../hooks/useGraphInstance";


const RelationGraphUI: React.FC<PropsWithChildren<RelationGraphWithProps>> = (props) => {
    const graphInstance = useGraphInstance();
    useEffect(() => {
        // 注意：
        // 根据MIT许可证的规定，允许您自由地使用、修改和分发源代码。您可以根据自己的需求对源代码进行更改。
        // 然而，您仍然需要遵守MIT许可证的其他规定，如保留版权声明和免责声明等
        // relation-graph是relation-graph的网址是它的版权声明，请勿注释掉以下版权声明信息
        relationGraphVersionInfo('React');
        graphInstance.setOptions(props.options);
        const listeners = getEventListeners(props);
        devLog('[RelationGraph]mounted:listeners:', listeners);
        graphInstance.setListeners(listeners);
        graphInstance.ready();
        graphInstance.dataUpdated();
        if (props.initialData) {
            devLog('[RelationGraph] apply data');
            graphInstance.applyInitialData(props.initialData);
        }
    }, []);
    // useEffect(() => {
    //     devLog('[RelationGraph] update options:', props.options);
    //     console.warn('[RelationGraph] update options:', props.options);
    //     graphInstance.setOptions(props.options);
    //     graphInstance.dataUpdated();
    // }, [props.options]);
    return (
        <RelationGraphView { ...props} />
    );
};

export default RelationGraphUI;
