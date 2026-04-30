import React from 'react';

import {RGIconsData} from "../../../../../../../relation-graph-models/utils/RGIconsData";

const RGIcons: React.FC<{iconName:string,className?:string}> = ({ iconName, className }) => {
    // @ts-ignore
    const iconInfo = RGIconsData[iconName];
    return (
        <svg className={`rg-icon ${className||''}`} viewBox="0 0 1024 1024" version="1.1"
    xmlns="http://www.w3.org/2000/svg" dangerouslySetInnerHTML={{ __html: iconInfo.data }}>
        </svg>
    );
};

export default RGIcons;
