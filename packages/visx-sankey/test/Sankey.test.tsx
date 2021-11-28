import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import mockConsole from "jest-mock-console";
import { Sankey } from "../src";


const data = [{ source: "a", target: "b", value: 1 }];
const defaultProps = {
  links: data,
  width: 100,
  height: 100,
};

describe("<Sankey />", () => {
  test("it should be defined", () => {
    expect(Sankey).toBeDefined();
  });

  test("it should render without crashing", () => {
    expect(() =>
      render(
        <svg>
          <Sankey {...defaultProps} />
        </svg>
      )
    ).not.toThrow();
  });

  test("it should render a g element and nested nodes (rect) and links (paths)", () => {
    const { container } = render(
      <svg>
        <Sankey
          {...defaultProps}
          links={[
            { source: "a", target: "b", value: 1 },
            { source: "b", target: "c", value: 2 },
          ]}
        />
      </svg>
    );

    const GroupElement = container.querySelector("g");
    expect(GroupElement).toBeInTheDocument();
    const RectElements = container.querySelectorAll("rect");
    const PathElements = container.querySelectorAll("path");
    expect(RectElements).toHaveLength(3);
    expect(PathElements).toHaveLength(2);
  });

  test("it should have the .test and .visx-sankey classes", () => {
    const { container } = render(
      <svg>
        <Sankey {...defaultProps} className={"test"} />
      </svg>
    );
    const GroupElement = container.querySelector("g");
    expect(GroupElement).toBeInTheDocument();
    expect(GroupElement).toHaveClass("visx-sankey");
    expect(GroupElement).toHaveClass("test");
  });

  test("it should still render even if a link value isn't a number", () => {
    const { container } = render(
      <svg>
        <Sankey
          {...defaultProps}
          links={[
            { source: "a", target: "b", value: 1 },
            { source: "a", target: "c", value: "Not a Number!" },
            { source: "b", target: "c", value: undefined },
          ]}
        />
      </svg>
    );
    const GroupElement = container.querySelector("g");
    expect(GroupElement).toBeInTheDocument();

    const RectElements = container.querySelectorAll("rect");
    const PathElements = container.querySelectorAll("path");
    expect(RectElements).toHaveLength(3);
    expect(PathElements).toHaveLength(3);
  });

  test("it should warn and render null if a link's source or target is undefined", () => {
    const restoreConsole = mockConsole();
    const { container } = render(
      <svg>
        <Sankey
          {...defaultProps}
          links={[
            { source: "a", target: "b", value: 1 },
            { source: "a", target: undefined, value: 1 },
          ]}
        />
      </svg>
    );
    const GroupElement = container.querySelector("g");
    expect(GroupElement).not.toBeInTheDocument();
    expect(console.warn).toHaveBeenCalledTimes(1);
    restoreConsole();
  });

  test("it should warn and render null if there are fewer nodes than link source/target nodes", () => {
    const restoreConsole = mockConsole();
    const { container } = render(
      <svg>
        <Sankey
          {...defaultProps}
          links={[{ source: "a", target: "b", value: 1 }]}
          nodes={[{ id: "a" }]}
        />
      </svg>
    );

    const GroupElement = container.querySelector("g");
    expect(GroupElement).not.toBeInTheDocument();
    expect(console.warn).toHaveBeenCalledTimes(1);
    restoreConsole();
  });

  test("it should render custom node/links if passed through as children", () => {
    const { container } = render(
      <svg>
        <Sankey
          {...defaultProps}
          links={[{ source: "a", target: "b", value: 1 }]}
        >
          {({ nodes, links, path }) => (
            <g>
              {nodes.map(({ x0, y0 }, i) => (
                <rect key={i} x={x0} y={y0} className="node-test" />
              ))}
              {links.map((d, i) => (
                <path key={i} d={path(d)} className="link-test" />
              ))}
            </g>
          )}
        </Sankey>
      </svg>
    );

    const RectElements = container.querySelectorAll("rect.node-test");
    const PathElements = container.querySelectorAll("path.link-test");
    expect(RectElements).toHaveLength(2);
    expect(PathElements).toHaveLength(1);
  });
});
