import { PropsWithChildren } from 'react';
import React, { useEffect } from 'react';
import {devLog, relationGraphVersionInfo} from '../../../../../../relation-graph-models/utils/RGCommon';
import {RelationLinkerProps} from "../../../types-react";
import {useGraphInstance} from "../hooks/useGraphInstance";
import RelationGraphView from "./RelationGraphView";
import {createDefaultConfig} from "../../../../../../relation-graph-models/data/RGOptionsDataUtils";
import {getEventListeners} from "../../../../../../relation-graph-models/utils/RGIntergration";


const RelationLinkerUI: React.FC<PropsWithChildren<RelationLinkerProps>> = (props) => {
    const graphInstance = useGraphInstance();
    useEffect(() => {
        // 注意：
        // 根据MIT许可证的规定，允许您自由地使用、修改和分发源代码。您可以根据自己的需求对源代码进行更改。
        // 然而，您仍然需要遵守MIT许可证的其他规定，如保留版权声明和免责声明等
        // relation-graph是relation-graph的网址是它的版权声明，请勿注释掉以下版权声明信息
        relationGraphVersionInfo('React-Linker');
        graphInstance.setOptions(props.options);
        const listeners = getEventListeners(props);
        devLog('[RelationGraph]mounted:listeners:', listeners);
        graphInstance.setListeners(listeners);
        graphInstance.ready();
        graphInstance.dataUpdated();
    }, []);
    useEffect(() => {
        graphInstance.setOptions(props.options || {});
        graphInstance.dataUpdated();
    }, [props.options]);
    useEffect(() => {
        if (props.lines) {
            devLog('[RelationGraph] apply data');
            (async () => {
                graphInstance.clearGraph();
                graphInstance.addFakeLines(props.lines);
                graphInstance.dataUpdated();
            })();
        }
    }, [props.lines]);
    return <RelationGraphView { ...props} />
};

export default RelationLinkerUI;
