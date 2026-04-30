import {generateNewRGInstance, RGReactiveDataProvider} from './src/hooks/RGDataProvider';
import React, {PropsWithChildren} from "react";
import {RelationGraphWithWithCustomCore} from "../types-react";

const RGProvider: React.FC<PropsWithChildren<RelationGraphWithWithCustomCore>> = (props) => {
    const graphInstance = generateNewRGInstance(props.relationGraphCore);
    return (
        <RGReactiveDataProvider graphInstance={graphInstance}>
            {props.children}
        </RGReactiveDataProvider>
    );
}
export default RGProvider;
