import React from "react";
import cx from "classnames";
import { Node } from "../types";

export interface SankeyNodeProps extends Node {
  /** className to apply to node rect elements.  */
  className?: string;

  /** CSS style object */
  style?: React.CSSProperties;
}

export const SankeyNode = ({
  color,
  id,
  x0,
  x1,
  y0,
  y1,
  className,
  style,
}:
SankeyNodeProps) => {
  if (
    (!x0 && x0 !== 0) ||
    (!x1 && x1 !== 0) ||
    (!y0 && y0 !== 0) ||
    (!y1 && y1 !== 0)
  ) {
    console.warn(
      "[@visx/sankey/SankeyNode]: missing one of x0, x1, y0, y1. Unable to draw node."
    );
    return null;
  }
  const nodeWidth = x1 && x0 && x1 - x0 > 0 ? x1 - x0 : 0;
  const nodeHeight = y1 && y0 && y1 - y0 > 0 ? y1 - y0 : 0;

  return (
    <rect
      key={`visx-sankey-node-${id}`}
      className={cx("visx-sankey-node", className)}
      style={style}
      width={nodeWidth}
      height={nodeHeight}
      x={x0}
      y={y0}
      fill={color || "#626262"}
    />
  );
};

export default SankeyNode