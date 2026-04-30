
const toSafeString = (str: string) => {
    return str;
}





const Vue2GetInstance = `graphRef.value.getInstance() will be deprecated

It is recommended to use the graphInstance:
###### Method 1: ######

import { RGProvider } from 'relation-graph-vue2';

<RGProvider>
    <YourComponent>
        <RelationGraph>
        ...
        </RelationGraph>
    </YourComponent>
</RGProvider>

// YourComponent.vue file:

// ensuring the correct context is provided so that you can access the graphInstance:

import { RelationGraph, useGraphInstance } from 'relation-graph-vue2';
const graphInstance = useGraphInstance();

const graphOptions = ref<RGOptions>({ ... }); // Your RGOptions here
// Now you can use graphInstance to manipulate the graph data and call APIs. This will facilitate data manipulation and API calls.

<div>
    ...
    <RelationGraph :options="graphOptions">
    ...
    </RelationGraph>
    ...
</div>

However, you can still use the current method, but you can only obtain the <RelationGraph> component instance through:
graphRef.value.getInstance(). in your <YourComponent>;
And method graphRef.value.getInstance() will be deprecated in future versions.

More details: https://www.relation-graph.com/docs/better-integration#vue3

Set option "definitelyNoDataProviderNeeded": true to disable the data provider warning if you are sure that no data provider is needed in your case.
`;





const Vue3GetInstance = `graphRef.value.getInstance() will be deprecated

It is recommended to use the graphInstance:
###### Method 1: ######

import { RGProvider } from 'relation-graph-vue3';

<RGProvider>
    <YourComponent>
        <RelationGraph>
        ...
        </RelationGraph>
    </YourComponent>
</RGProvider>

// YourComponent.vue file:

// ensuring the correct context is provided so that you can access the graphInstance:

import { RelationGraph, useGraphInstance } from 'relation-graph-vue3';
const graphInstance = useGraphInstance();

// Now you can use graphInstance to manipulate the graph data and call APIs. This will facilitate data manipulation and API calls.

<div>
    ...
    <RelationGraph>
    ...
    </RelationGraph>
    ...
</div>

However, you can still use the current method, but you can only obtain the <RelationGraph> component instance through:
graphRef.value.getInstance(). in your <YourComponent>;
And method graphRef.value.getInstance() will be deprecated in future versions.

More details: https://www.relation-graph.com/docs/better-integration#vue3

Set option "definitelyNoDataProviderNeeded": true to disable the data provider warning if you are sure that no data provider is needed in your case.
`;







const ReactGetInstance = `graphRef.current.getInstance() will be deprecated

It is recommended to use the graphInstance:
###### Method 1: ######

import { RGProvider } from 'relation-graph-react';

<RGProvider>
    <YourComponent>
        <RelationGraph>
        ...
        </RelationGraph>
    </YourComponent>
</RGProvider>

// YourComponent.vue file:

// ensuring the correct context is provided so that you can access the graphInstance:

import { RelationGraph, useGraphInstance } from 'relation-graph-react';
const graphInstance = useGraphInstance();

// Now you can use graphInstance to manipulate the graph data and call APIs. This will facilitate data manipulation and API calls.

<div>
    ...
    <RelationGraph>
    ...
    </RelationGraph>
    ...
</div>

However, you can still use the current method, but you can only obtain the <RelationGraph> component instance through:
graphRef.current.getInstance(). in your <YourComponent>;
And method graphRef.value.getInstance() will be deprecated in future versions.

More details: https://www.relation-graph.com/docs/better-integration#vue3

Set option "definitelyNoDataProviderNeeded": true to disable the data provider warning if you are sure that no data provider is needed in your case.
`;
const setJsonData = `Please Initialize the graph using the new method:

###### Method 1: ######
// Use graphInstance to set the data.
    // Set Data Method 1:
    // Now you can use graphInstance to manipulate the graph data and call APIs.
    graphInstance.setJsonData(...); // Set your initial data，The data will be layout automatically(Use graphOptions.value.layout)

    // Set Data Method 2:
    // Or set json data by addNodes + addLines directly
    graphInstance.addNodes([{ id:'a' }, { id: 'b'}, { id: 'c'}]);
    graphInstance.addLines([{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }]);
    graphInstance.doLayout('a'); // Use graphOptions.value.layout as default layout algorithm, Use 'a' as the root node id.
    // Tips: How to make different node groups use different layouts: https://www.relation-graph.com/docs/api/layout

    // After setting data, you can call other APIs as needed
    graphInstance.moveToCenter();
    graphInstance.zoomToFit();

###### Method 2: ######
Set the initial data using the "initialData" property of the RelationGraph component.

###### Method 3: ######
Initialize using the onReady event of the RelationGraph component. then use graphInstance to set the data.

###### More Method: ######
https://www.relation-graph.com/docs.'
`;
const setJsonData4Vue2 = `Please Initialize the graph using the new method:

###### Method 1: ######
// Use graphInstance to set the data.
    const graphInstance = this.graphInstance; // this.graphInstance is obtained through inject('graphInstance').
    // Set Data Method 1:
    // Now you can use graphInstance to manipulate the graph data and call APIs.
    graphInstance.setJsonData(...); // Set your initial data，The data will be layout automatically(Use graphOptions.value.layout)

    // Set Data Method 2:
    // Or set json data by addNodes + addLines directly
    graphInstance.addNodes([{ id:'a' }, { id: 'b'}, { id: 'c'}]);
    graphInstance.addLines([{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }]);
    graphInstance.doLayout('a'); // Use graphOptions.value.layout as default layout algorithm, Use 'a' as the root node id.
    // Tips: How to make different node groups use different layouts: https://www.relation-graph.com/docs/api/layout

    // After setting data, you can call other APIs as needed
    graphInstance.moveToCenter();
    graphInstance.zoomToFit();

###### Method 2: ######
Set the initial data using the "initialData" property of the RelationGraph component.

###### Method 3: ######
Initialize using the onReady event of the RelationGraph component. then use graphInstance to set the data.

###### More Method: ######
https://www.relation-graph.com/docs.'
`;
export const RGTips = {
    Vue3GetInstance: toSafeString(Vue3GetInstance),
    ReactGetInstance: toSafeString(ReactGetInstance),
    Vue2GetInstance: toSafeString(Vue2GetInstance),
    setJsonData: toSafeString(setJsonData),
    setJsonData4Vue2: toSafeString(setJsonData4Vue2),
}

