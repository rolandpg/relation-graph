import React, {MutableRefObject, useEffect, useRef} from 'react';
import {RGCanvasProps} from './RGCanvas';
import { devLog } from '../../../../../../relation-graph-models/utils/RGCommon';
import {useGraphInstance} from "../hooks/useGraphInstance";
import {useGraphStore} from "../hooks/useGraphStore";

const RGCanvas: React.FC<RGCanvasProps> = (canvasProps) => {
  const graphInstance = useGraphInstance();
  const {options} = useGraphStore();
  const rgEasyCanvas$ = useRef() as MutableRefObject<HTMLCanvasElement>;

  useEffect(() => {
    devLog('[RGEasyView mounted]');
    graphInstance.setEasyViewCanvas(rgEasyCanvas$.current!);
    return () => {
        devLog('[RGEasyView UnMounted]');
    }
  }, []);

  return (
    <div className={`rg-easy-view ${options.showEasyView ? 'rg-easy-view-active' : ''}`}>
      <canvas ref={rgEasyCanvas$} />
    </div>
  );
};

export default RGCanvas;
