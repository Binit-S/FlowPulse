import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ConciergeChat from "../components/concierge/ConciergeChat";

// Mock the store
vi.mock("@/lib/store", () => ({
  useAppStore: () => ({
    densities: {
      "gate-A": "high",
      "gate-B": "low",
      "gate-C": "medium",
      "gate-D": "low",
    },
  }),
}));

// Mock the mock-data
vi.mock("@/lib/mock-data", () => ({
  MOCK_TICKET: { stand: "S3", seat: "R12-S4" },
}));

describe("ConciergeChat", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset fetch mock before each test
    global.fetch = vi.fn();
  });

  it("renders the initial greeting message", () => {
    render(<ConciergeChat onClose={mockOnClose} />);
    expect(screen.getByText(/How can I help you navigate/i)).toBeDefined();
  });

  it("has proper ARIA roles for accessibility", () => {
    render(<ConciergeChat onClose={mockOnClose} />);

    // Dialog role on the container
    expect(screen.getByRole("dialog")).toBeDefined();

    // Log role on the message area
    expect(screen.getByRole("log")).toBeDefined();

    // Input has an accessible label
    expect(screen.getByLabelText("Message Input")).toBeDefined();

    // Send button has an accessible label
    expect(screen.getByLabelText("Send Message")).toBeDefined();
  });

  it("does NOT send an empty message", () => {
    render(<ConciergeChat onClose={mockOnClose} />);
    const sendBtn = screen.getByLabelText("Send Message");
    
    // Button should be disabled when input is empty
    expect(sendBtn.hasAttribute("disabled")).toBe(true);
  });

  it("sends a user message and displays the AI response", async () => {
    // Mock a successful fetch response
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: "Head to Gate B — shortest wait right now!" }),
    });

    render(<ConciergeChat onClose={mockOnClose} />);
    const input = screen.getByLabelText("Message Input");
    const sendBtn = screen.getByLabelText("Send Message");

    // Type a question
    fireEvent.change(input, { target: { value: "Where should I enter?" } });
    expect(sendBtn.hasAttribute("disabled")).toBe(false);

    // Submit
    fireEvent.click(sendBtn);

    // User message appears immediately
    expect(screen.getByText("Where should I enter?")).toBeDefined();

    // Wait for AI response
    await waitFor(() => {
      expect(screen.getByText(/Gate B/i)).toBeDefined();
    });

    // Verify fetch was called with correct payload
    expect(global.fetch).toHaveBeenCalledWith("/api/chat", expect.objectContaining({
      method: "POST",
    }));
  });

  it("displays an error message on network failure", async () => {
    // Mock a network failure
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("Network error"));

    render(<ConciergeChat onClose={mockOnClose} />);
    const input = screen.getByLabelText("Message Input");

    fireEvent.change(input, { target: { value: "Test query" } });
    fireEvent.click(screen.getByLabelText("Send Message"));

    await waitFor(() => {
      expect(screen.getByText(/can't reach the network/i)).toBeDefined();
    });
  });

  it("displays an error message on non-ok HTTP response", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({ error: "Rate limited" }),
    });

    render(<ConciergeChat onClose={mockOnClose} />);
    const input = screen.getByLabelText("Message Input");

    fireEvent.change(input, { target: { value: "Another test" } });
    fireEvent.click(screen.getByLabelText("Send Message"));

    await waitFor(() => {
      expect(screen.getByText(/can't reach the network/i)).toBeDefined();
    });
  });

  it("calls onClose when close button is clicked", async () => {
    vi.useFakeTimers();
    render(<ConciergeChat onClose={mockOnClose} />);
    
    const closeBtn = screen.getByLabelText("Close Chat");
    fireEvent.click(closeBtn);

    // onClose is called after the animation delay
    vi.advanceTimersByTime(350);
    expect(mockOnClose).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });

  it("clears input after sending a message", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: "Sure thing!" }),
    });

    render(<ConciergeChat onClose={mockOnClose} />);
    const input = screen.getByLabelText("Message Input") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(screen.getByLabelText("Send Message"));

    // Input should be cleared immediately after send
    expect(input.value).toBe("");
  });
});
