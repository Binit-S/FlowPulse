import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionLabel } from "../components/ui/SectionLabel";

describe("SectionLabel Component", () => {
  it("renders the title correctly", () => {
    render(<SectionLabel title="Test Section Title" />);
    expect(screen.getByText("Test Section Title")).toBeDefined();
  });

  it("renders action label when provided", () => {
    render(<SectionLabel title="Food" actionLabel="View Menu" actionHref="/menu" />);
    const link = screen.getByText("View Menu");
    expect(link).toBeDefined();
    expect(link.tagName.toLowerCase()).toBe("a");
  });
});
