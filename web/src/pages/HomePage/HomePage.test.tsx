import { render, registerHandler, screen } from "@redwoodjs/testing/web";

import handler from "src/mocks/handlers";

import HomePage from "./HomePage";

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe("HomePage", () => {
  beforeEach(() => {
    registerHandler(handler);
  });

  it("renders successfully", () => {
    expect(() => render(<HomePage />)).not.toThrow();
  });

  it("should display section for each day", async () => {
    render(<HomePage />);
    expect(await screen.findByTestId("SingleDaySchedule")).toBeInTheDocument();
  });
});
