import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import mockConsole from 'jest-mock-console';
import { SankeyNode } from "../src";

interface Datum {
  id: string;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}
const defaultProps: Datum = {
  id: "test",
  x0: 0,
  x1: 1,
  y0: 0,
  y1: 2,
};


describe("<SankeyNode />", () => {
  test("it should be defined", () => {
    expect(SankeyNode).toBeDefined();
  });

  test("it should render without crashing", () => {
    expect(() =>
      render(
        <svg>
          <SankeyNode {...defaultProps} />
        </svg>
      )
    ).not.toThrow();
  });

  test("it should render a single rect element", () => {
    const { container } = render(
      <svg>
        <SankeyNode {...defaultProps} className={"test"} />
      </svg>
    );
    const RectElement = container.querySelector("rect");
    expect(RectElement).toBeInTheDocument();
  });

  test("it should warn and render null if x0, x1, y0, or y1 is undefined or NaN", () => {
    const restoreConsole = mockConsole();
    const { container } = render(
      <svg>
        <SankeyNode {...defaultProps} x0={NaN} />
      </svg>
    );
    const RectElement = container.querySelector("rect");
    expect(RectElement).not.toBeInTheDocument();
    expect(console.warn).toHaveBeenCalledTimes(1);
    restoreConsole()
  });

  test("it should have the .test and .visx-sankey-node classes", () => {
    const { container } = render(
      <svg>
        <SankeyNode {...defaultProps} className={"test"} />
      </svg>
    );
    const RectElement = container.querySelector("rect");
    expect(RectElement).toBeInTheDocument();
    expect(RectElement).toHaveClass("visx-sankey-node");
    expect(RectElement).toHaveClass("test");
  });


});
