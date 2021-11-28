import { SankeyLink, SankeyNode } from "d3-sankey";

export type NodeId = string | number;

export interface NodeExtraProps {
  id: NodeId;
  title?: string;
  color?: string;
  metadata?: any;
}
export interface LinkExtraProps {}

export type Link = SankeyLink<NodeExtraProps, LinkExtraProps>;

export type Node = SankeyNode<NodeExtraProps, LinkExtraProps>;

export type SankeyPathGenerator = (d: Link) => string;

export type Accessor<Datum, Output> = (d: Datum, index: number) => Output;

export type ColorAccessor = (key: Node, index: number) => string | undefined;

export type LinkColor =
  | "source"
  | "target"
  | "gradient"
  | string
  | ((d: Link) => string | undefined);
