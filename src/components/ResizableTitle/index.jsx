import React from "react";
import { Resizable } from "react-resizable";

const MResizable = React.memo(Resizable);
const ResizableTitle = (props) => {
  const { onResize, isExpanded, width, ...restProps } = props;
  if (!width) {
    return <th {...restProps} />;
  }
  return (
    <MResizable
      width={width}
      height={0}
      onResize={onResize}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </MResizable>
  );
};

export default ResizableTitle;
