import React, { useEffect } from 'react';
import {useGraphInstance} from "../../hooks/useGraphInstance";
import {useGraphStore} from "../../hooks/useGraphStore";

const RGEditingReferenceLine:React.FC<{
  showText?: boolean;
  adsorption?: boolean;
}> = ({showText, adsorption}) => {
  const graphInstance = useGraphInstance();
  const {options} = useGraphStore();

  useEffect(() => {
    graphInstance.onReferenceLineMounted(adsorption);
    return () => {
      graphInstance.onReferenceLineUnMounted();
    };
  }, [options]);

  return (
    <div className="rg-editing-referline"
      style={{
        display: options.editingReferenceLine.show ? 'block':'none',
      }}
    >
      {options.editingReferenceLine.directionV && (
        <div
          className="rg-referline rg-referline-v"
          style={{
            transform: `translate(var(--rg-refer-offset), 0px) translate(${options.editingReferenceLine.v_x}px, ${options.editingReferenceLine.v_y}px)`,
            height: options.editingReferenceLine.v_height + 'px',
          }}
        >
          <div className="referline">
            {
              showText !== false && (
                    <div>{Math.round(options.editingReferenceLine.v_height)}px</div>
                )
            }
          </div>
        </div>
      )}
      {options.editingReferenceLine.directionH && (
        <div
          className="rg-referline rg-referline-h"
          style={{
            transform: `translate(0px, var(--rg-refer-offset)) translate(${options.editingReferenceLine.h_x}px, ${options.editingReferenceLine.h_y}px)`,
            width: options.editingReferenceLine.h_width + 'px',
          }}
        >
          <div className="referline">
            {
              showText !== false && (
                    <div>{Math.round(options.editingReferenceLine.h_width)}px</div>
                )
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default RGEditingReferenceLine;
