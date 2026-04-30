import React, {PropsWithChildren, useState} from 'react';
import { devLog } from '../../../../../../../relation-graph-models/utils/RGCommon';
import {useAutoUpdateView, useGraphInstance} from "../../hooks/useGraphInstance";
import {useGraphStore} from "../../hooks/useGraphStore";

const RGDebugView: React.FC<PropsWithChildren<{}>> = ({children}) => {
  const graphInstance = useGraphInstance();
  useAutoUpdateView();
  const {options} = useGraphStore();
  const [showSettingPanel, setShowSettingPanel] = useState(false);
  const toggleSettingPanel = () => {
    setShowSettingPanel(!showSettingPanel);
  };
  const printOptions = () => {
    graphInstance.printOptions();
  };
  const printData = () => {
    graphInstance.getGraphJsonData();
  };
  const enableDevlog = () => {
    graphInstance.enableDebugLog(!options.debug);
    devLog('debugLog:', options.debug);
    updateView();
  };
  return (
    <div>
      <div className="rg-setting-panel-button" onClick={()=>{toggleSettingPanel();}}>
        Debug
      </div>
      {
        showSettingPanel &&
        <div className="rg-setting-panel">
          <div className="c-debug-tools-row">
            <button onClick={()=>{printOptions();}}>print options in console</button>
          </div>
          <div className="c-debug-tools-row">
            <button onClick={()=>{printData();}}>print json data in console</button>
          </div>
          <div className="c-debug-tools-row">
            debug log status: {options.debug ? 'true' : 'false'}
            <button onClick={()=>{enableDevlog();}}>
              { options.debug ? 'disable' : 'enable' } debug log
            </button>
          </div>
          {children}
        </div>
      }
    </div>
  );
};

export default RGDebugView;
