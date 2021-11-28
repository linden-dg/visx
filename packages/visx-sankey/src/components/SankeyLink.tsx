import React from "react";
import cx from "classnames";
import { LinearGradient } from "@visx/gradient";
import {
  Link,
  LinkColor,
  Node,
} from "../types";

export interface SankeyLinkProps extends Omit<Link, "source" | "target"> {
  /** path d attribute */
  d: string;


  source: Node;

  target: Node;

  /** Method for how the link should be coloured -
   * - `source` - by the source node's color
   * - `target` - by the target node's color
   * - `gradient` - a gradient from source to target node colours
   * - alternatively a hex color can be passed through to color all links the same - */
  color?: LinkColor;

  /** className to apply to link path elements.  */
  className?: string;

  /** CSS style object */
  style?: React.CSSProperties;
}

export const SankeyLink = ({
  d,
  color,
  className,
  style,
  source,
  target,
  ...props
}: SankeyLinkProps) => {
  if (!d || typeof source !== "object" || typeof target !== "object") {
    console.warn(
      "[@visx/sankey/SankeyLink]: either d is undefined or source/target is not a node object. Bailing."
    );
    return null;
  }

  const uid = getUeid(source.id, target.id);
  const c =
    typeof color === "function"
      ? color({ source, target, ...props })
      : getColor(source, target, uid, color);

  return (
    <g
      style={{
        mixBlendMode: "initial",
      }}
    >
      {color === "gradient" && (
        <LinearGradient
          id={uid}
          from={source.color}
          to={target.color}
          x1={source.x1}
          x2={target.x0}
          gradientUnits="userSpaceOnUse"
        />
      )}
      <path
        key={`visx-sankey-link-${source.id}-${target.id}-${1}`}
        className={cx("visx-sankey-link", className)}
        d={d || ""}
        stroke={c}
        strokeOpacity={0.5}
        fill="none"
        strokeWidth={Math.max(1, props.width || 1)}
        style={style}
      />
    </g>
  );
};

const getColor = (
  source: Node,
  target: Node,
  uid: string,
  color?: LinkColor
): string => {
  const c =
    color === "gradient"
      ? `url(#${uid})`
      : color === "source"
      ? source.color
      : color === "target"
      ? target.color
      : color;

  return typeof c === "string" ? c : "#ccc";
};

const getUeid = (source: string | number, target: string | number) =>
  `${Math.random()
    .toString(36)
    .substr(2, 9)}-sankey-gradient-${source}-${target}`;


export default SankeyLink