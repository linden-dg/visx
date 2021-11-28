import React from 'react';
import { Sankey } from '@visx/sankey';

const links = [
  { source: "a", target: "c", value: 3 },
  { source: "b", target: "c", value: 2},
  { source: "b", target: "d", value: 3 },
  { source: "c", target: "e", value: 1 },
  { source: "c", target: "f", value: 4 },
  { source: "d", target: "e", value: 1.5 },
  { source: "d", target: "f", value: 1.5 },
];

// Nodes are optional
// if not supplied, they will be generated from the link source/targets & node color can be defined via a function on the `color` prop
const nodes = [
  { id:"a", color: "#851286" },
  { id:"b", color: "#5539a8" },
  { id:"c", color: "#D3436E" },
  { id:"d", color: "#1681d9" },
  { id:"e", color: "#5ed3bc" },
  { id:"f", color: "#FFC969" },
]

export type SankeyProps = {
  width: number;
  height: number;
};

export default function Example({ width, height, }: SankeyProps) {

  return width < 10 ? null : (
      <svg width={width} height={height}>
        <Sankey
          height={height}
          width={width}
          links={links}
          nodes={nodes}
          linkColor="gradient"
        />
      </svg>
  );
}
