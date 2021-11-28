# @visx/sankey

<a title="@visx/chord npm downloads" href="https://www.npmjs.com/package/@visx/sankey">
  <img src="https://img.shields.io/npm/dm/@visx/sankey.svg?style=flat-square" />
</a>

Basic sankey diagram to show flows (or links) between nodes.


## Example Usage

```js
import { Sankey } from '@visx/sankey';

// An array of links between source & target nodes, with a value for the size of the link
const data = [
  { source: "a", target: "c", value: 3 },
  { source: "b", target: "c", value: 2 },
];

// Nodes arrays are optional 
// if not supplied, they will be generated from the link source/targets
const nodes = [
  { id:"a" },
  { id:"b" },
  { id:"c" }
]

// A function that tells the Sankey how to color each node
const color = (d, i) => ["#923390","#C14E83","#F79C70"][i]

const MySankey = () => (
  <svg width={400} height={300}>
    <Sankey
      width={400}
      height={300}
      links={data} 
      nodes={nodes}
      color={color}
    />
  </svg>
  
);
```

### Advanced Usage

You can also use your own components rather than the default options:
```js

const MyCustomSankey = () => (
  <svg width={400} height={300}>
    <Sankey 
      links={data} 
      width={400} 
      height={300}
    >
      {({ links, nodes, path }) => (
          <g>
            <g className="links">
              {links.map(d=>
                <path
                  d={path(d)}
                  fill="none"
                  stroke="#cccccc"
                  strokeWidth={d.width}
                />)}
            </g>
            <g className="nodes">
              {nodes.map(d=>
                <rect 
                  x={d.x0} 
                  y={d.y0}
                  width={d.x1 - d.x0}
                  height={d.y1 - d.y0}
                  fill="#626262"
                />)}
              </g>
          </g>
      )}
    </Sankey>
  </svg>
);
```

Alternatively, you can get rid of the component entirely and create your own with the `useSankey` hook:

```js

const MyVeryCustomSankey = () => {
  const width = 400;
  const height = 300;
  const {nodes, links, path, error} = useSankey({ links:data, width, height })
  return (
    <svg width={width} height={height}>
      {/* Insert Sankey code here */}
    </svg>

  );
};

```


You can also override the default accessor functions if your data isn't in the expected format

```js


// link data is not in the standard `{ source, target, value }[]` format
const data = [
  { id: "a->c", size: 3 },
  { id: "b->c", size: 2 },
];

const linkAccessor = (d) => {
  const parts = d.key.split("->")
  return { source:parts[0], target:parts[1], value: d.size }
};

const MySankey = () => (
  <svg width={400} height={300}>
    <Sankey
      width={400}
      height={300}
      links={data}
      linkAccessor={linkAccessor}
    />
  </svg>
);

```

## Installation

```
npm install --save @visx/sankey
```
