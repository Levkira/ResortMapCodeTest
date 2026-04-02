import { vi, test, expect, beforeEach, afterEach, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResortMap from "./ResortMap";
import { parseGrid, chooseTile, getCabanaMap } from "../utils/asciiRenderer";

vi.mock("../utils/asciiRenderer", () => ({
  parseGrid: vi.fn(),
  chooseTile: vi.fn(),
  getCabanaMap: vi.fn(),
}));

vi.mock("./BookingModal", () => ({
  default: ({ open, cabanaId, error, status, onSubmit, setRoom, setName }) => {
    if (!open) return null;
    return (
      <div data-testid="booking-modal">
        <span data-testid="modal-id">{cabanaId}</span>

        <input
          data-testid="input-room"
          onChange={(e) => setRoom(e.target.value)}
        />
        <input
          data-testid="input-name"
          onChange={(e) => setName(e.target.value)}
        />

        <button onClick={onSubmit}>Book</button>

        {error && <div data-testid="error-msg">{error}</div>}
        {status === "success" && <div data-testid="status-msg">success</div>}
      </div>
    );
  },
}));

describe("ResortMap Component", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
    vi.mocked(parseGrid).mockReturnValue([["W"]]);
    vi.mocked(chooseTile).mockReturnValue("/tile.png");
    vi.mocked(getCabanaMap).mockReturnValue({ "0,0": "A" });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockSuccessfulFetch = (customBooked = []) => {
    globalThis.fetch.mockImplementation((url, opts) => {
      if (url === "/api")
        return Promise.resolve({ ok: true, text: () => Promise.resolve("W") });
      if (url === "/api/bookings" && !opts)
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([{ room: "101", guestName: "John" }]),
        });
      if (url === "/api/bookings/booked")
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ bookedCabanas: customBooked }),
        });
      if (url.includes("/api/bookings/A00") && opts?.method === "POST")
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });
  };

  test("clicking an available cabana opens the booking modal", async () => {
    const user = userEvent.setup();
    mockSuccessfulFetch();

    render(<ResortMap />);

    const tile = await screen.findByRole("img");
    await user.click(tile.parentElement);

    const modal = await screen.findByTestId("booking-modal");
    expect(modal).toBeDefined();
    expect(screen.getByTestId("modal-id").textContent).toBe("A00");
  });

  test("successful booking flow", async () => {
    const user = userEvent.setup();
    mockSuccessfulFetch();

    render(<ResortMap />);

    const tileImage = await screen.findByRole("img");

    await user.click(tileImage.parentElement);

    const roomInput = await screen.findByTestId("input-room");
    const nameInput = screen.getByTestId("input-name");
    const bookBtn = screen.getByRole("button", { name: /book/i });

    await user.type(roomInput, "101");
    await user.type(nameInput, "John");
    await user.click(bookBtn);
  });

  test("shows error when room/name does not match bookings", async () => {
    const user = userEvent.setup();
    globalThis.fetch.mockImplementation((url) => {
      if (url === "/api")
        return Promise.resolve({ ok: true, text: () => Promise.resolve("W") });
      if (url === "/api/bookings")
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ bookedCabanas: [] }),
      });
    });

    render(<ResortMap />);

    const tile = await screen.findByRole("img");
    await user.click(tile.parentElement);

    const roomInput = await screen.findByTestId("input-room");
    await user.type(roomInput, "999");
  });

  test("booked cabana is non-clickable and shows unavailable overlay", async () => {
    const user = userEvent.setup();
    mockSuccessfulFetch(["A00"]);

    const { container } = render(<ResortMap />);
    const tile = await screen.findByRole("img");

    await user.click(tile.parentElement);

    expect(screen.queryByTestId("booking-modal")).toBeNull();

    const overlay = container.querySelector(
      'div[style*="rgba(255, 0, 0, 0.35)"]',
    );
    expect(overlay).not.toBeNull();
  });
});
