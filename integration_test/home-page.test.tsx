import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "@/app/page";

function renderHomePage() {
  return render(<Home/>);
}

describe("Home page", () => {
  it("renders the main heading and supporting copy", () => {
    renderHomePage();

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /to get started, edit the page\.tsx file\./i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/looking for a starting point or more instructions\?/i),
    ).toBeInTheDocument();
  });

  it("renders the primary action links", () => {
    renderHomePage();

    expect(screen.getByRole("link", { name: /deploy now/i })).toHaveAttribute(
      "href",
      expect.stringContaining("vercel.com/new"),
    );

    expect(
      screen.getByRole("link", { name: /documentation/i }),
    ).toHaveAttribute("href", expect.stringContaining("nextjs.org/docs"));
  });
});
