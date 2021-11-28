import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import mockConsole from 'jest-mock-console';
import { SankeyLink } from "../src";
import { LinkColor } from "../src/types";

interface Datum {
  d: string;
  value: number;
  source: { id: number; x1: number; color?: string };
  target: { id: number; x0: number; color?: string };
  color?: LinkColor;
}
const defaultProps: Datum = {
  d: "M17,50C200.5,50,200.5,50,384,50",
  value: 10,
  source: { id: 1, x1: 1, color: "#0000FF" },
  target: { id: 2, x0: 2, color: "#00ff00" },
};

describe("<SankeyLink />", () => {
  test("it should be defined", () => {
    expect(SankeyLink).toBeDefined();
  });

  test("it should render without crashing", () => {
    expect(() =>
      render(
        <svg>
          <SankeyLink {...defaultProps} />
        </svg>
      )
    ).not.toThrow();
  });

  test("it should have the .test and .visx-sankey-link classes", () => {
    const { container } = render(
      <svg>
        <SankeyLink {...defaultProps} className={"test"} />
      </svg>
    );
    const PathElement = container.querySelector("path");
    expect(PathElement).toBeInTheDocument();
    expect(PathElement).toHaveClass("visx-sankey-link");
    expect(PathElement).toHaveClass("test");
  });

  test("it should warn and render null if d is undefined ", () => {
    const restoreConsole = mockConsole();
    const { container } = render(
      <svg>
        {/* @ts-ignore*/}
        <SankeyLink {...defaultProps} d={null} />
      </svg>
    );
    const PathElement = container.querySelector("path");
    expect(PathElement).not.toBeInTheDocument();
    expect(console.warn).toHaveBeenCalledTimes(1);
    restoreConsole()
  });

  test("it should warn and render null if incorrect source/target props are passed", () => {
    const restoreConsole = mockConsole();
    const { container } = render(
      <svg>
        {/* @ts-ignore*/}
        <SankeyLink {...defaultProps} source={"test"} />
      </svg>
    );
    const PathElement = container.querySelector("path");
    expect(PathElement).not.toBeInTheDocument();
    expect(console.warn).toHaveBeenCalledTimes(1);
    restoreConsole()
  });


  test("it should take a hex color for the 'color' prop and return appropriate stroke color", () => {
    const { container } = render(
      <svg>
        <SankeyLink {...defaultProps} color={"#ff0000"} />
      </svg>
    );
    const PathElement = container.querySelector("path");
    expect(PathElement).toHaveAttribute("stroke", "#ff0000");
  });

  test("it should take a function for the 'color' prop and return appropriate stroke color", () => {
    const { container } = render(
      <svg>
        <SankeyLink {...defaultProps} color={()=>"#FF9900"} />
      </svg>
    );
    const PathElement = container.querySelector("path");
    expect(PathElement).toHaveAttribute("stroke", "#FF9900");
  });

  test("it should take 'source' for the 'color' prop and use the stroke color defined in the source object", () => {
    const { container } = render(
      <svg>
        <SankeyLink {...defaultProps} color="source" />
      </svg>
    );
    const PathElement = container.querySelector("path");
    expect(PathElement).toHaveAttribute("stroke", "#0000FF");
  });

  test("it should take 'target' for the 'color' prop and have the stroke color defined in the target object", () => {
    const { container } = render(
      <svg>
        <SankeyLink {...defaultProps} color="target" />
      </svg>
    );
    const PathElement = container.querySelector("path");
    expect(PathElement).toHaveAttribute("stroke", "#00ff00");
  });

  test("it should take 'gradient' for the 'color' prop create a gradient def", () => {
    const { container } = render(
      <svg>
        <SankeyLink {...defaultProps} color="gradient" />
      </svg>
    );
    const PathElement = container.querySelector("path");
    const GradientDefElement = container.querySelector("defs");

    expect(PathElement).toBeInTheDocument();
    expect(GradientDefElement).toBeInTheDocument();

    //extract the gradient id from the `#url(...)` string
    const pathStroke = PathElement?.getAttribute("stroke") || "";
    const pathStrokeId = pathStroke.slice(5, pathStroke.length - 1);

    //extract the actual gradient from the `defs` element
    const GradientElement = GradientDefElement && GradientDefElement.children[0]

    expect(GradientElement?.id).toEqual(pathStrokeId);
  });
});
