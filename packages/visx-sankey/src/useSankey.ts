import { useEffect, useState } from "react";
import {
  sankey,
  sankeyCenter,
  sankeyJustify,
  sankeyLeft,
  sankeyLinkHorizontal,
  sankeyRight,
} from "d3-sankey";
import {
  Accessor,
  ColorAccessor,
  Link,
  Node,
  NodeId,
  SankeyPathGenerator,
} from "./types";

const ALIGNMENT = {
  left: sankeyLeft,
  right: sankeyRight,
  center: sankeyCenter,
  justify: sankeyJustify,
};

export interface SankeyConfig<Datum, NodeDatum> {
  /** Array of link/edge objects */
  links: Datum[];

  /** Array of node objects */
  nodes?: NodeDatum[];

  /** Height of the sankey plot */
  height: number;

  /** Width of the sankey plot */
  width: number;

  /** Accessor that returns a unique identifier for each node
   * [Ideally this should be wrapped in a callback to prevent unnessary rerenders] */
  nodeAccessor?: Accessor<NodeDatum, Node>;

  /** Accessor that returns an object with the source (id), target (id), and value for each link
   * [Ideally this should be wrapped in a callback to prevent unnessary rerenders] */
  linkAccessor?: Accessor<Datum, LinkData>;

  /** Alignment strategy for Sankey nodes */
  align?: keyof typeof ALIGNMENT;

  /** Width of the node rect */
  nodeWidth?: number;

  /** Vertical separation between adjacent nodes */
  nodePadding?: number;

  /** Returns the desired color for a node with a given key and index.
   * [Ideally this should be wrapped in a callback to prevent unnessary rerenders] */
  color?: ColorAccessor;
}

interface GraphProps {
  links: Link[];
  nodes: Node[];
}

export interface SankeyReturn extends GraphProps {
  path: SankeyPathGenerator;
  error?: unknown;
}

export default function useSankey<Datum, NodeDatum>({
  nodes: nodeData,
  links: linkData,
  height,
  width,
  nodeWidth = 16,
  nodePadding = 12,
  linkAccessor = defaultLinkAccessor,
  nodeAccessor = defaultNodeAccessor,
  align = "justify",
  color = defaultColorAccessor,
}: SankeyConfig<Datum, NodeDatum>) {
  const [sankeyState, setSankeyState] = useState<SankeyReturn>({
    nodes: [],
    links: [],
    error: undefined,
    path: sankeyLinkHorizontal() as SankeyPathGenerator,
  });

  useEffect(() => {
    if (width === 0 || height === 0) {
      console.warn(
        "[@visx/sankey/Sankey]: unable to creat d3-sankey graph.  No width or no height defined"
      );
      setSankeyState((s) => ({
        ...s,
        links: [],
        nodes: [],
        error: "No width or no height defined",
      }));
      return;
    }

    const links = linkData.map(linkAccessor);
    // .filter((d) => d.source && d.target);
    const uniqueLinkNodes = getUniqueNodesFromLinks(links, color);
    let nodes = nodeData
      ? nodeData
          .map(nodeAccessor)
          .map((d, i) => ({ ...d, color: d.color || color(d, i) }))
      : uniqueLinkNodes;
    // nodes = nodes.map((d, i) => ({ ...d, color: d.color || color(d, i) }));
    try {
      const sankeyGraph = sankey()
        .extent([
          [1, 1],
          [width, height],
        ])
        .nodeAlign(ALIGNMENT[align])
        .nodeWidth(nodeWidth)
        .nodePadding(nodePadding)
        .nodeId((node: any) => node.id || node.index);

      const graph = sankeyGraph({
        links,
        nodes,
      }) as GraphProps;

      setSankeyState((s) => ({
        ...s,
        links: graph.links,
        nodes: graph.nodes,
        error: undefined,
      }));
    } catch (e) {
      if (nodes.length < uniqueLinkNodes.length) {
        console.warn(
          "[@visx/sankey/Sankey]: unable to creat d3-sankey graph. There are fewer nodes than there are link source/targets - ",
          e
        );
      } else {
        console.warn(
          "[@visx/sankey/Sankey]: there was an issue creating the d3-sankey graph - ",
          e
        );
      }
      setSankeyState((s) => ({ ...s, links: [], nodes: [], error: e }));
    }
  }, [
    nodeData,
    linkData,
    height,
    width,
    nodeWidth,
    nodePadding,
    linkAccessor,
    nodeAccessor,
    align,
    color,
  ]);

  return sankeyState;
}

const defaultLinkAccessor = (d: any) => ({
  source: d?.source,
  target: d?.target,
  value: d?.value,
});

const defaultNodeAccessor = (d: any, i: number): Node => {
  if (typeof d === "string" || typeof d === "number") {
    return { id: d };
  } else if (typeof d === "object" && !Array.isArray(d) && d !== null) {
    const { id, color, ...rest } = d;
    return { id: id || i, color, metadata: rest };
  }
  return { id: i, metadata: d };
};
const defaultColorAccessor = () => undefined;

interface LinkData extends Omit<Link, "source" | "target"> {
  source: NodeId;
  target: NodeId;
}

const getUniqueNodesFromLinks = (
  links: LinkData[],
  color: ColorAccessor
): Node[] =>
  links
    .reduce((a, d) => [...a, d.source, d.target], [] as NodeId[])
    .filter((v, i, a) => a.indexOf(v) === i)
    .map((d, i) => ({ id: d, color: color({ id: d }, i) }));
