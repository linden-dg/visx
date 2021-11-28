import React from "react";
import cx from "classnames";
import { Group } from "@visx/group";
import { SankeyNodeMinimal, SankeyLink as ISankeyLink } from "d3-sankey";
import { LinkColor } from "../types";
import { SankeyLink } from "./SankeyLink";
import { SankeyNode } from "./SankeyNode";
import useSankey, {
  SankeyConfig,
  SankeyReturn,
} from "../useSankey";

export interface SankeyProps<Datum, NodeDatum>
  extends SankeyConfig<Datum, NodeDatum> {
  /** Method for how the links should be coloured -
   * - 'source' - by the source node's color
   * - 'target' - by the target node's color
   * - 'gradient' - a gradient from source to target node colours
   * - alternatively a hex color can be passed through to color all links the same - */
  linkColor?: LinkColor;

  /** className to apply to feature path elements.  */
  className?: string;

  /** Render function override which is passed the configured nodes, links, and path generator as input */
  children?: (provided: SankeyReturn) => React.ReactNode;
}

export function Sankey<Datum, NodeDatum>({
  linkColor,
  className,
  children,
  ...props
}: SankeyProps<Datum, NodeDatum>) {
  const { nodes, links, path, error } = useSankey(props);
  if (error) {
    return null;
  }
  if (children) return <>{children({ nodes, links, path })}</>;
  return (
    <Group className={cx("visx-sankey", className)}>
      {links.map((l: ISankeyLink<SankeyNodeMinimal<any, any>, any>, i) => (
        <SankeyLink
          key={`visx-sankey-link-${l.target.id}-${l.source.id}-${i}`}
          {...l}
          d={path(l)}
          color={linkColor}
        />
      ))}
      {nodes.map((d) => (
        <SankeyNode key={`visx-sankey-node-${d.id}`} {...d} />
      ))}
    </Group>
  );
}

export default Sankey
