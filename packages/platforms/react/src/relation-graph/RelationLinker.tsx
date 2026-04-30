import React, {PropsWithChildren} from 'react';
import {RelationLinkerProps} from '../types-react';
import RelationLinkerUI from "./src/core4react/RelationLinkerUI";
import {getOrGenerateRGInstance, RGDataProvider} from "./src/hooks/RGDataProvider";


const RelationLinker: React.FC<PropsWithChildren<RelationLinkerProps>> = (props) => {
    const graphInstance = getOrGenerateRGInstance(props.relationGraphCore, true);
    return (
        <RGDataProvider graphInstance={graphInstance}>
            <RelationLinkerUI { ...props}>
                {props.children}
            </RelationLinkerUI>
        </RGDataProvider>
    );
};

export default RelationLinker;
